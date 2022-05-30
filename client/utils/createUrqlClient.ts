import { dedupExchange, fetchExchange, stringifyVariables } from "urql";
import { CurrentLoginUserDocument, CurrentLoginUserQuery, LoginMutation, LogoutMutation } from "../generated/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery,";
import { cacheExchange, Resolver } from '@urql/exchange-graphcache'

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

export const createUrqlClient = (ssrExchange: any) => ({
  url: 'http://localhost:5000/graphql',
  fetchOptions: {
    credentials: 'include' as const,
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
          createPost: (_result, args, cache, info) => {
            const allFields = cache.inspectFields('Query');
            const fieldInfos = allFields.filter(info => info.fieldName === 'getPosts');
  
            fieldInfos.forEach(fi => {
              cache.invalidate('Query', 'getPosts', fi.arguments || {})
            })
          },
          logout: (_result, args, cache, info) => {
            betterUpdateQuery<LogoutMutation, CurrentLoginUserQuery>(
              cache,
              { query: CurrentLoginUserDocument },
              _result,
              () => ({ currentLoginUser: null })
            )
          },
          login: (_result, args, cache, info) => {
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
})