import { Request, Response } from 'express'
import { Redis } from 'ioredis'
import { DataSource } from 'typeorm'
import { createUserLoader } from './utils/createUserLoader'
import { createVoteLoader } from './utils/createVoteLoader'

export type GraphQLContext = {
  req: Request
  res: Response
  redis: Redis
  conn: DataSource
  userLoader: ReturnType<typeof createUserLoader>
  voteLoader: ReturnType<typeof createVoteLoader>
}