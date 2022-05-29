import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { Post } from '../entities/Post'
import { isAuth } from '../middlewares/isAuth'
import { GraphQLContext } from '../types'

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

  @Query(() => [Post])
  async getPosts(
    @Ctx() { conn }: GraphQLContext
  ) {
    const posts = await conn.query(
      `
        SELECT p.*,
        json_build_object('id', u.id, 'name', u.name, 'avatar', u.avatar, 'email', u.email, 'createdAt', u."createdAt", 'updatedAt', u."updatedAt") user
        FROM post p INNER JOIN public.user u
        ON u.id = p."userId"
        ORDER BY p."createdAt" DESC
      `
    )

    return posts
  }
}