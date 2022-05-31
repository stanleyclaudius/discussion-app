import { Field, Int, ObjectType } from 'type-graphql'
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Post } from './Post'
import { Vote } from './Vote'

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number

  @Field(() => String)
  @Column()
  name!: string

  @Field(() => String)
  @Column({ unique: true })
  email!: string

  @Column()
  password!: string

  @Field(() => String)
  @Column({ default: 'https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png' })
  avatar!: string

  @OneToMany(() => Post, post => post.user)
  posts!: Post[]

  @OneToMany(() => Vote, vote => vote.user)
  votes!: Vote[]

  @Field(() => String)
  @CreateDateColumn()
  createdAt!: Date

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt!: Date
}