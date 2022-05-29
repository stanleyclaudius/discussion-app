import { MiddlewareFn } from 'type-graphql'
import { GraphQLContext } from './../types'

export const isAuth: MiddlewareFn<GraphQLContext> = ({ context }, next) => {
  if (!context.req.session.userId) {
    throw new Error('User is not authenticated.')
  }

  return next()
}