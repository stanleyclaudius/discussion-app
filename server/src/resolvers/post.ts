import { Arg, Ctx, Field, FieldResolver, Int, Mutation, ObjectType, Query, Resolver, Root, UseMiddleware } from 'type-graphql'
import { User } from '../entities/User'
import { Post } from './../entities/Post'
import { Vote } from './../entities/Vote'
import { isAuth } from './../middlewares/isAuth'
import { GraphQLContext } from './../types'

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts!: Post[]

  @Field()
  hasMore!: boolean
}

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => User)
  user(
    @Root() post: Post,
    @Ctx() { userLoader }: GraphQLContext
  ) {
    return userLoader.load(post.userId)
  }

  @FieldResolver(() => Int, { nullable: true })
  async voteStatus(
    @Root() post: Post,
    @Ctx() { voteLoader, req }: GraphQLContext
  ) {
    if (!req.session.userId)
      return null
    
    const vote = await voteLoader.load({
      postId: post.id,
      userId: parseInt(req.session.userId)
    })

    return vote ? vote.value : null
  }

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

    if (cursor) {
      replacements.push(new Date(parseInt(cursor)))
    }

    const posts = await conn.query(
      `
        SELECT p.*
        FROM post p
        ${cursor ? `WHERE p."createdAt" < $2 AND p."replyTo" = -1` : 'WHERE p."replyTo" = -1'}
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

    const post = await conn.query(
      `
        SELECT p.*
        FROM post p
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

    const posts = await conn.query(
      `
        SELECT p.*
        FROM post p
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

  @Query(() => [Post])
  async searchPost(
    @Arg('keyword', () => String) keyword: string,
    @Ctx() { conn }: GraphQLContext
  ) {
    const posts = await conn.query(`
      SELECT p.*
      FROM post p
      WHERE title LIKE '%${keyword}%'
      ORDER BY p."createdAt" DESC
    `)

    return posts
  }
}