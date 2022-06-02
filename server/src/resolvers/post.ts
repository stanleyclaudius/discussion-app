import { Arg, Ctx, Field, Int, Mutation, ObjectType, Query, Resolver, UseMiddleware } from 'type-graphql'
import { Post } from '../entities/Post'
import { Vote } from '../entities/Vote'
import { isAuth } from '../middlewares/isAuth'
import { GraphQLContext } from '../types'

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts!: Post[]

  @Field()
  hasMore!: boolean
}

@Resolver(Post)
export class PostResolver {
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg('postId', () => Int) postId: number,
    @Arg('value', () => Int) value: number,
    @Ctx() { req, conn }:  GraphQLContext
  ) {
    const isPositive = value !== -1
    const realValue = isPositive ? 1 : -1
    const userId = (req.session as any).userId

    const findVote = await Vote.findOne({ where: { postId, userId } })
    const findPost = await Post.findOne({ where: { id: postId } })

    if (findVote && findVote.value !== realValue) {
      await conn.transaction(async(tm) => {
        await tm.query(
          `
            UPDATE vote
            SET VALUE = $1
            WHERE "postId" = $2 AND "userId" = $3
          `
        , [realValue, postId, userId])
        
        await tm.query(
          `
            UPDATE post
            SET point = point + $1
            WHERE id = $2
          `
        , [(((findPost?.point === 1 && !isPositive) || (findPost?.point === -1 && isPositive)) ? 2 * realValue : realValue), postId])
      })
    } else if (!findVote) {
      await conn.transaction(async(tm) => {
        await tm.query(
          `
            INSERT INTO vote("userId", "postId", value)
            VALUES($1, $2, $3)
          `
        , [userId, postId, realValue])

        await tm.query(
          `
            UPDATE post
            SET point = point + $1
            WHERE id = $2
          `
        , [(((findPost?.point === 1 && !isPositive) || (findPost?.point === -1 && isPositive)) ? 2 * realValue : realValue), postId])
      })
    }

    return true
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg('title') title: string,
    @Arg('content') content: string,
    @Ctx() { req, conn }: GraphQLContext
  ) {
    const result = await conn.createQueryBuilder()
              .insert()
              .into(Post)
              .values({
                title,
                content,
                userId: (req.session as any).userId
              })
              .returning('*')
              .execute()
              
    const post = result.raw[0]
    return post
  }

  @Query(() => PaginatedPosts)
  async getPosts(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string,
    @Ctx() { req, conn }: GraphQLContext
  ) {
    const realLimit = Math.min(50, limit)
    const realLimitPlusOne = realLimit + 1

    const replacements: any[] = [realLimitPlusOne]

    if (req.session.userId) {
      replacements.push(req.session.userId)
    }

    let cursorIdx = 3
    if (cursor) {
      replacements.push(new Date(parseInt(cursor)))
      cursorIdx = replacements.length
    }
    
    const posts = await conn.query(
      `
        SELECT p.*,
        json_build_object('id', u.id, 'name', u.name, 'avatar', u.avatar, 'email', u.email, 'createdAt', u."createdAt", 'updatedAt', u."updatedAt") user,
        ${req.session.userId ? '(SELECT value FROM vote WHERE "userId" = $2 AND "postId" = p.id) "voteStatus"' : 'null as "voteStatus"'}
        FROM post p INNER JOIN public.user u
        ON u.id = p."userId"
        ${cursor ? `WHERE p."createdAt" < $${cursorIdx} AND p."replyTo" = -1` : 'WHERE p."replyTo" = -1'}
        ORDER BY p."createdAt" DESC
        LIMIT $1
      `
    , replacements)

    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === realLimitPlusOne
    }
  }

  @Query(() => Post, { nullable: true })
  async getPostById(
    @Arg('id', () => Int) id: number,
    @Ctx() { req, conn }: GraphQLContext
  ) {
    const replacements: any[] = [id]

    if (req.session.userId) {
      replacements.push(req.session.userId)
    }

    const post = await conn.query(
      `
        SELECT p.*,
        json_build_object('id', u.id, 'name', u.name, 'avatar', u.avatar, 'email', u.email, 'createdAt', u."createdAt", 'updatedAt', u."updatedAt") user,
        ${req.session.userId ? '(SELECT value FROM vote WHERE "userId" = $2 AND "postId" = p.id) "voteStatus"' : 'null as "voteStatus"'}
        FROM post p INNER JOIN public.user u
        ON u.id = p."userId"
        WHERE p.id = $1
      `
    , replacements)

    return post[0]
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async replyPost(
    @Arg('content', () => String) content: string,
    @Arg('postId', () => Int) postId: number,
    @Ctx() { req, conn }: GraphQLContext
  ) {
    const result = await conn.createQueryBuilder()
              .insert()
              .into(Post)
              .values({
                content,
                replyTo: postId,
                userId: (req.session as any).userId
              })
              .returning('*')
              .execute()
      
      const post = result.raw[0]

      return post
  }

  @Query(() => [Post])
  async getPostReplies(
    @Arg('postId', () => Int) postId: number,
    @Ctx() { req, conn }: GraphQLContext
  ) {
    const replacements: any[] = [postId]

    if (req.session.userId) {
      replacements.push(req.session.userId)
    }

    const posts = await conn.query(
      `
        SELECT p.*,
        json_build_object('id', u.id, 'name', u.name, 'avatar', u.avatar, 'email', u.email, 'createdAt', u."createdAt", 'updatedAt', u."updatedAt") user,
        ${req.session.userId ? '(SELECT value FROM vote WHERE "userId" = $2 AND "postId" = p.id) "voteStatus"' : 'null as "voteStatus"'}
        FROM post p INNER JOIN public.user u
        ON u.id = p."userId"
        WHERE "replyTo" = $1
        ORDER BY p."createdAt" DESC
      `
    , replacements)

    return posts
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePost(
    @Arg('postId', () => Int) postId: number,
    @Ctx() { req }: GraphQLContext
  ) {
    await Post.delete({ id: postId, userId: (req.session as any).userId })
    return true
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async updatePost(
    @Arg('postId', () => Int) postId: number,
    @Arg('title', () => String) title: string,
    @Arg('content', () => String) content: string,
    @Ctx() { req, conn }: GraphQLContext
  ) {
    const result = await conn.createQueryBuilder()
              .update(Post)
              .set({ title, content })
              .where('id = :id AND "userId" = :userId', { id: postId, userId: req.session.userId })
              .returning('*')
              .execute()

    return result.raw[0]
  }
}