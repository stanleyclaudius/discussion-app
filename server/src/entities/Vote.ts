import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

@Entity()
export class Vote extends BaseEntity {
  @PrimaryColumn()
  userId!: number

  @ManyToOne(() => User, user => user.votes)
  user!: User

  @PrimaryColumn()
  postId!: number

  @ManyToOne(() => Post, post => post.votes)
  post!: Post

  @Column({ type: 'int' })
  value!: number
}