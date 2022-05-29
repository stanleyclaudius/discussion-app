import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from 'type-graphql'
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
}