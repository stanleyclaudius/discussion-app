import { DataSourceOptions } from 'typeorm'
import { Post } from './../entities/Post'
import { User } from './../entities/User'
import { Vote } from './../entities/Vote'

export const dataSourceObj = (isProd: boolean) => {
  let obj: Partial<DataSourceOptions> = {}

  if (isProd) {
    obj = {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      logging: true,
      migrations: ['dist/migrations/*.js'],
      entities: ['dist/entities/*.js']
    }
  } else {
    obj = {
      type: 'postgres',
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      logging: true,
      synchronize: true,
      entities: [Post, User, Vote]
    }
  }

  return obj as DataSourceOptions
}