import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver } from 'type-graphql'
import { GraphQLContext } from './../types'
import { User } from './../entities/User'
import { validateEmail } from './../utils/validator'
import { COOKIE_NAME } from './../constant'
import { v4 } from 'uuid'
import sendEmail from './../utils/sendMail'
import argon2 from 'argon2'

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
    @Arg('passwordConfirmation', () => String) passwordConfirmation: string,
    @Ctx() { conn }: GraphQLContext
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

    if (!passwordConfirmation) {
      errors.push({
        field: 'Password Confirmation',
        message: 'Please provide password confirmation.'
      })
    } else if (password !== passwordConfirmation) {
      errors.push({
        field: 'Password Confirmation',
        message: 'Password confirmation should be matched.'
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

  @Mutation(() => UserResponse)
  async login(
    @Arg('email',  () => String) email: string,
    @Arg('password', () => String) password: string,
    @Ctx() { req }: GraphQLContext
  ) {
    let errors = []

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
    }

    if (errors.length > 0)
      return { errors }

    const user = await User.findOne({ where: { email } })
    if (!user) {
      return {
        errors: [
          {
            field: 'Email',
            message: 'Email is not registered at system.'
          }
        ]
      }
    }

    const isPwMatch = await argon2.verify(user.password, password)
    if (!isPwMatch) {
      return {
        errors: [
          {
            field: 'Password',
            message: 'Incorrect password.'
          }
        ]
      }
    }

    (req.session as any).userId = user.id

    return { user }
  }

  @Query(() => User, { nullable: true })
  async currentLoginUser(
    @Ctx() { req }: GraphQLContext
  ) {
    if (!req.session.userId) {
      return null
    }

    return User.findOne({ where: { id: parseInt(req.session.userId) } })
  }

  @Mutation(() => Boolean)
  logout(
    @Ctx() { req, res }: GraphQLContext
  ) {
    return new Promise(resolve => req.session.destroy(err => {
      if (err) {
        res.clearCookie(COOKIE_NAME)
        console.log(err)
        resolve(false)
        return
      }

      resolve(true)
    }))
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg('email', () => String) email: string,
    @Ctx() { redis }: GraphQLContext
  ) {
    const user = await User.findOne({ where: { email } })
    if (!user)
      return false

    const token = v4()

    await redis.set(
      `forgetDiscussme_${token}`,
      user.id,
      'EX',
      1000 * 60 * 60 * 24
    )

    const url = `http://localhost:3000/reset/${token}`

    await sendEmail(email, 'Forgot Password', url)

    return true
  }

  @Mutation(() => Boolean)
  async resetPassword(
    @Arg('newPassword', () => String) newPassword: string,
    @Arg('token', () => String) token: string,
    @Ctx() { redis }: GraphQLContext
  ) {
    const key = `forgetDiscussme_${token}`
    const userId = await redis.get(key)
    if (!userId)
      return false

    const user = await User.findOne({ where: { id: parseInt(userId) } })
    if (!user)
      return false

    await User.update(
      { id: parseInt(userId) },
      { password: await argon2.hash(newPassword) }
    )
    
    await redis.del(key)

    return true
  }
}