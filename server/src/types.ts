import { Request, Response } from 'express'
import { Redis } from 'ioredis'
import { DataSource } from 'typeorm'

export type GraphQLContext = {
  req: Request
  res: Response
  redis: Redis
  conn: DataSource
}