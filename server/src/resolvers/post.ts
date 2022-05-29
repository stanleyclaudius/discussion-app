import { Arg, Ctx, Field, Int, Mutation, ObjectType, Query, Resolver, UseMiddleware } from 'type-graphql'
import { Post } from '../entities/Post'
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
    @Ctx() { conn }: GraphQLContext
  ) {
    const realLimit = Math.min(50, limit)
    const realLimitPlusOne = realLimit + 1

    const replacements: any[] = [realLimitPlusOne]

    if (cursor) {
      replacements.push(new Date(parseInt(cursor)))
    }
    
    const posts = await conn.query(
      `
        SELECT p.*,
        json_build_object('id', u.id, 'name', u.name, 'avatar', u.avatar, 'email', u.email, 'createdAt', u."createdAt", 'updatedAt', u."updatedAt") user
        FROM post p INNER JOIN public.user u
        ON u.id = p."userId"
        ${cursor ? `WHERE p."createdAt" < $2` : ''}
        ORDER BY p."createdAt" DESC
        LIMIT $1
      `
    , replacements)

    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === realLimitPlusOne
    }
  }
}