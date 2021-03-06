import { Field, Int, ObjectType } from 'type-graphql'
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { User } from './User'
import { Vote } from './Vote'

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  title!: string | null
  
  @Field(() => String)
  @Column()
  content!: string

  @Field(() => Int, { nullable: true })
  voteStatus!: number | null

  @Field(() => Int)
  @Column()
  userId!: number

  @Field(() => User)
  @ManyToOne(() => User, user => user.posts)
  user!: User

  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  point!: number

  @OneToMany(() => Vote, vote => vote.post)
  votes!: Vote[]

  @Field(() => Int)
  @Column({ type: 'int', default: -1 })
  replyTo!: number | null

  @Field(() => String)
  @CreateDateColumn()
  createdAt!: Date

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt!: Date
}