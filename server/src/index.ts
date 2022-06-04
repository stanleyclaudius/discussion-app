import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
import Redis from 'ioredis'
import connectRedis from 'connect-redis'
import session from 'express-session'
import dotenv from 'dotenv'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { DataSource } from 'typeorm'
import { __prod__ } from './constant'
import { UserResolver } from './resolvers/user'
import { PostResolver } from './resolvers/post'
import { createUserLoader } from './utils/createUserLoader'
import { createVoteLoader } from './utils/createVoteLoader'
import { dataSourceObj } from './utils/dataSourceObj'

declare module 'express-session' {
  export interface SessionData {
    userId: string
  }
}

dotenv.config()

const main = async() => {
  const conn = await new DataSource(dataSourceObj(__prod__))

  conn.initialize()

  const app = express()

  const RedisStore = connectRedis(session)
  const redisClient = new Redis({
    host: process.env.REDIS_HOSTNAME,
    port: parseInt(process.env.REDIS_PORT!),
    password: process.env.REDIS_PASSWORD
  })

  app.set('trust proxy', 1)

  app.use(cors({
    origin: `${process.env.CLIENT_URL}`,
    credentials: true
  }))

  app.use(
    session({
      name: `${process.env.COOKIE_NAME}`,
      store: new RedisStore({
        client: redisClient,
        disableTouch: true
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        secure: __prod__,
        domain: __prod__ ? '.vercel.app' : undefined,
        sameSite: 'lax'
      },
      secret: `${process.env.SESSION_SECRET}`,
      resave: false,
      saveUninitialized: false
    })
  )

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, PostResolver],
      validate: false
    }),
    context: ({ req, res }) => ({ req, res, conn, redis: redisClient, userLoader: createUserLoader(), voteLoader: createVoteLoader() })
  })

  await apolloServer.start()
  apolloServer.applyMiddleware({ app, cors: false })

  app.listen(process.env.PORT, () => console.log(`Server is running on PORT ${process.env.PORT}.`))
}

main().catch(err => {
  console.log(err)
})