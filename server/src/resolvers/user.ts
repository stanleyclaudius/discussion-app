import { Arg, Ctx, Field, Mutation, ObjectType, Resolver } from 'type-graphql'
import { GraphQLContext } from '../types';
import { User } from './../entities/User';
import argon2 from 'argon2'
import { validateEmail } from '../utils/validator';

@ObjectType()
class FieldError {
  @Field(() => String)
  field!: string

  @Field(() => String)
  message!: string
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => User, { nullable: true })
  user?: User
}

@Resolver(User)
export class UserResolver {
  @Mutation(() => UserResponse)
  async register(
    @Arg('name', () => String) name: string,
    @Arg('email', () => String) email: string,
    @Arg('password', () => String) password: string,
    @Ctx() { req, conn }: GraphQLContext
  ) {
    let errors = []

    if (!name) {
      errors.push({
        field: 'Name',
        message: 'Please provide name to register.'
      })
    }

    if (!email) {
      errors.push({
        field: 'Email',
        message: 'Please provide email address to register.'
      })
    } else if (!validateEmail(email)) {
      errors.push({
        field: 'Email',
        message: 'Please provide valid email address to register.'
      })
    }

    if (!password) {
      errors.push({
        field: 'Password',
        message: 'Please provide password to register.'
      })
    } else if (password.length < 8) {
      errors.push({
        field: 'Password',
        message: 'Password should be at least 8 characters.'
      })
    }

    if (errors.length > 0)
      return { errors }

    const hashedPassword = await argon2.hash(password)

    let user

    try {
      const result = await conn.createQueryBuilder()
              .insert()
              .into(User)
              .values({
                name,
                email,
                password: hashedPassword
              })
              .returning('*')
              .execute()

      user = result.raw[0]
    } catch (err: any) {
      return {
        errors: [
          {
            field: 'Email',
            message: 'Email has been used to register before.'
          }
        ]
      }
    }

    return { user }
  }
}