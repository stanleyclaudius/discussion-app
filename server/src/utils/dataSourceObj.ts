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
      entities: [User, Post, Vote]
    }
  } else {
    obj = {
      type: 'postgres',
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      logging: true,
      synchronize: true,
      entities: [User, Post, Vote]
    }  
  }

  return obj as DataSourceOptions
}