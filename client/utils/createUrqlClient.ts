import { dedupExchange, errorExchange, fetchExchange } from "urql";
import { CurrentLoginUserDocument, CurrentLoginUserQuery, LoginMutation, LogoutMutation } from "../generated/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery,";
import { cacheExchange } from '@urql/exchange-graphcache'

export const createUrqlClient = (ssrExchange: any) => ({
  url: 'http://localhost:5000/graphql',
  fetchOptions: {
    credentials: 'include' as const,
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
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
    // errorExchange,
    ssrExchange,
    fetchExchange
  ]
})