import { dedupExchange, fetchExchange, stringifyVariables } from 'urql'
import {
  CurrentLoginUserDocument,
  CurrentLoginUserQuery,
  DeletePostMutationVariables,
  LoginMutation,
  LogoutMutation,
  VoteMutationVariables
} from '../generated/graphql'
import { Cache, cacheExchange, Resolver } from '@urql/exchange-graphcache'
import { betterUpdateQuery } from './betterUpdateQuery'
import { isServer } from './isServer'
import gql from 'graphql-tag'

const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info

    const allFields = cache.inspectFields(entityKey)
    const fieldInfos = allFields.filter(info => info.fieldName === fieldName)
    const size = fieldInfos.length
    if (size === 0) {
      return undefined
    }

    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`
    const isItInTheCache = cache.resolve(cache.resolve(entityKey, fieldKey) as string, 'posts')

    info.partial = !isItInTheCache
    let hasMore = true

    let results: string[] = []
    fieldInfos.forEach(fi => {
      const key = cache.resolve(entityKey, fi.fieldKey) as string
      const data = cache.resolve(key, 'posts') as string[]
      const _hasMore = cache.resolve(key, 'hasMore')
      if (!_hasMore) {
        hasMore = _hasMore as boolean
      }
      results.push(...data)
    })

    return {
      __typename: 'PaginatedPosts',
      hasMore,
      posts: results
    }
  }
}

const invalidateCache = (cache: Cache, data: string) => {
  const allFields = cache.inspectFields('Query')
  const fieldInfos = allFields.filter(info => info.fieldName === data)
    
  fieldInfos.forEach(fi => {
    cache.invalidate('Query', data, fi.arguments || {})
  })
}

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
  let cookie = ''
  if (isServer()) {
    cookie = ctx?.req?.headers?.cookie
  }

  return {
    url: 'https://discussme-server.herokuapp.com/graphql',
    fetchOptions: {
      credentials: 'include' as const,
      headers: cookie ? { cookie } : undefined
    },
    exchanges: [
      dedupExchange,
      cacheExchange({
        keys: {
          PaginatedPosts: () => null
        },
        resolvers: {
          Query: {
            getPosts: cursorPagination()
          }
        },
        updates: {
          Mutation: {
            deletePost: (_result, args, cache, info) => {
              cache.invalidate({
                __typename: 'Post',
                id: (args as DeletePostMutationVariables).postId
              })
            },
            vote: (_result, args, cache, info) => {
              const { postId, value } = args as VoteMutationVariables
              const data = cache.readFragment(
                gql`
                  fragment _ on Post {
                    id
                    point
                    voteStatus
                  }
                `
              , { id: postId } as any)

              if (data) {
                if (data.voteStatus === value) {
                  return
                }

                const newPoint = (data.point as number) + (data.voteStatus ? ((data.point === 1 && value === -1) || (data.point === -1 && value === 1)) ? 2 : 1 : ((data.point === 1 && value === -1) || (data.point === -1 && value === 1)) ? 2 : 1) * value
                cache.writeFragment(
                  gql`
                    fragment __ on Post {
                      point
                      voteStatus
                    }
                  `
                , { id: postId, point: newPoint, voteStatus: value } as any)
              }
            },
            createPost: (_result, args, cache, info) => {
              invalidateCache(cache, 'getPosts')
            },
            replyPost: (_result, args, cache, info) => {
              invalidateCache(cache, 'getPostReplies')
            },
            logout: (_result, args, cache, info) => {
              invalidateCache(cache, 'getPosts')
              invalidateCache(cache, 'getPostById')
              invalidateCache(cache, 'getPostReplies')

              betterUpdateQuery<LogoutMutation, CurrentLoginUserQuery>(
                cache,
                { query: CurrentLoginUserDocument },
                _result,
                () => ({ currentLoginUser: null })
              )
            },
            login: (_result, args, cache, info) => {
              invalidateCache(cache, 'getPosts')
              invalidateCache(cache, 'getPostById')
              invalidateCache(cache, 'getPostReplies')
              
              betterUpdateQuery<LoginMutation, CurrentLoginUserQuery>(
                cache,
                { query: CurrentLoginUserDocument },
                _result,
                (result, query) => {
                  if (result.login.errors) {
                    return query
                  } else {
                    return {
                      currentLoginUser: result.login.user
                    }
                  }
                }
              )
            }
          }
        }
      }),
      ssrExchange,
      fetchExchange
    ]
  }
}