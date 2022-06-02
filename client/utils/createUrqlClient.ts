import { dedupExchange, fetchExchange, stringifyVariables } from "urql";
import { CurrentLoginUserDocument, CurrentLoginUserQuery, DeletePostMutationVariables, GetPostRepliesDocument, GetPostRepliesQuery, LoginMutation, LogoutMutation, ReplyPostDocument, ReplyPostMutation, VoteMutationVariables } from "../generated/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery,";
import { cacheExchange, Resolver } from '@urql/exchange-graphcache'
import gql from 'graphql-tag'
import { isServer } from "./isServer";

const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;

    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter(info => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
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
  };
};

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
  let cookie = ''
  if (isServer()) {
    cookie = ctx?.req?.headers?.cookie
  }

  return {
    url: 'http://localhost:5000/graphql',
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
              const allFields = cache.inspectFields('Query');
              const fieldInfos = allFields.filter(info => info.fieldName === 'getPosts');
    
              fieldInfos.forEach(fi => {
                cache.invalidate('Query', 'getPosts', fi.arguments || {})
              })
            },
            replyPost: (_result, args, cache, info) => {
              const allFields = cache.inspectFields('Query');
              const fieldInfos = allFields.filter(info => info.fieldName === 'getPostReplies');

              fieldInfos.forEach(fi => {
                cache.invalidate('Query', 'getPostReplies', fi.arguments || {})
              })
            },
            logout: (_result, args, cache, info) => {
              const allFields = cache.inspectFields('Query');
              const fieldInfos = allFields.filter(info => info.fieldName === 'getPosts');
              const postIdFieldInfos = allFields.filter(info => info.fieldName === 'getPostById');
              const postRepliesFieldInfos = allFields.filter(info => info.fieldName === 'getPostReplies');
    
              fieldInfos.forEach(fi => {
                cache.invalidate('Query', 'getPosts', fi.arguments || {})
              })

              postIdFieldInfos.forEach(fi => {
                cache.invalidate('Query', 'getPostById', fi.arguments || {})
              })

              postRepliesFieldInfos.forEach(fi => {
                cache.invalidate('Query', 'getPostReplies', fi.arguments || {})
              })

              betterUpdateQuery<LogoutMutation, CurrentLoginUserQuery>(
                cache,
                { query: CurrentLoginUserDocument },
                _result,
                () => ({ currentLoginUser: null })
              )
            },
            login: (_result, args, cache, info) => {
              const allFields = cache.inspectFields('Query');
              const fieldInfos = allFields.filter(info => info.fieldName === 'getPosts');
              const postIdFieldInfos = allFields.filter(info => info.fieldName === 'getPostById');
              const postRepliesFieldInfos = allFields.filter(info => info.fieldName === 'getPostReplies');
    
              fieldInfos.forEach(fi => {
                cache.invalidate('Query', 'getPosts', fi.arguments || {})
              })

              postIdFieldInfos.forEach(fi => {
                cache.invalidate('Query', 'getPostById', fi.arguments || {})
              })

              postRepliesFieldInfos.forEach(fi => {
                cache.invalidate('Query', 'getPostReplies', fi.arguments || {})
              })
              
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