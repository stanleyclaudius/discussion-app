import { DataSourceOptions } from 'typeorm'

export const dataSourceObj = (isProd: boolean) => {
  let obj: Partial<DataSourceOptions> = {}

  if (isProd) {
    obj = {
      type: 'postgres',
      url: 'postgres://ndkcuqutilrygl:8a6d9e49f804f82c2808608af08f286ae7442746d8ffda5aa2be46dadfdd74c9@ec2-54-164-40-66.compute-1.amazonaws.com:5432/dekp5mefddotro',
      logging: true,
      migrations: ['dist/migrations/*.js'],
      entities: ['dist/entities/*.js']
    }
  } else {
    obj = {
      type: 'postgres',
      database: 'testmigration',
      username: 'postgres',
      password: 'root',
      logging: true,
      synchronize: true,
      migrations: ['dist/migrations/*.js'],
      entities: ['dist/entities/*.js']
    }
  }

  return obj as DataSourceOptions
}