import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
import Redis from 'ioredis'
import connectRedis from 'connect-redis'
import session from 'express-session'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { DataSource } from 'typeorm'
import { COOKIE_NAME, __prod__ } from './constant'
import { User } from './entities/User'
import { Post } from './entities/Post'
import { UserResolver } from './resolvers/user'
import { PostResolver } from './resolvers/post'
import { Vote } from './entities/Vote'

declare module 'express-session' {
  export interface SessionData {
    userId: string
  }
}

const main = async() => {
  const conn = await new DataSource({
    type: 'postgres',
    database: 'discussme',
    username: 'postgres',
    password: 'root',
    logging: true,
    synchronize: true,
    entities: [User, Post, Vote]
  })

  conn.initialize()

  const app = express()

  const RedisStore = connectRedis(session)
  const redisClient = new Redis()

  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }))

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redisClient,
        disableTouch: true
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        secure: __prod__,
        sameSite: 'lax'
      },
      secret: 'XQvnheUkLbeBqvhCjvLQsdPYP7vT9yGCL4bExbcmN5p',
      resave: false,
      saveUninitialized: false
    })
  )

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, PostResolver],
      validate: false
    }),
    context: ({ req, res }) => ({ req, res, conn, redis: redisClient })
  })

  await apolloServer.start()
  apolloServer.applyMiddleware({ app, cors: false })

  app.listen(5000, () => console.log(`Server is running on PORT 5000.`))
}

main().catch(err => {
  console.log(err)
})