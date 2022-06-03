import { useState } from 'react'
import { toast } from 'react-toastify'
import { withUrqlClient } from 'next-urql'
import { Box, Button, FormControl, FormErrorMessage, FormLabel, Heading, Input, useColorModeValue } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useResetPasswordMutation } from './../../generated/graphql'
import { createUrqlClient } from './../../utils/createUrqlClient'
import Head from 'next/head'
import Navbar from './../../components/general/Navbar'

const ResetPassword = () => {
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')

  const [isPasswordInvalid, setIsPasswordInvalid] = useState('')
  const [isPasswordConfirmationInvalid, setIsPasswordConfirmationInvalid] = useState('')

  const [{fetching}, resetPassword] = useResetPasswordMutation()

  const buttonBgColor = useColorModeValue('blue', 'orange')

  const handleSubmit = async() => {
    if (!password) {
      setIsPasswordInvalid('Please provide new password.')
    } else if (password.length < 8) {
      setIsPasswordInvalid('New password should be at least 8 characters.')
    } else {
      setIsPasswordInvalid('')
    }

    if (!passwordConfirmation) {
      setIsPasswordConfirmationInvalid('Please provide new password confirmation.')
    } else if (password !== passwordConfirmation) {
      setIsPasswordConfirmationInvalid('New password confirmation should be matched.')
    } else {
      setIsPasswordConfirmationInvalid('')
    }

    if (password && password.length >= 8 && passwordConfirmation && password === passwordConfirmation) {
      const resp = await resetPassword({ newPassword: password, token: (router.query.token) as string })

      console.log(resp)

      if (!resp.data?.resetPassword) {
        toast.error('Reset password token invalid.')
      } else {
        toast.success('Password has been reset successfully.')
        router.push('/')
      }
    }
  }

  return (
    <>
      <Head>
        <title>Discussme | Reset Password</title>
      </Head>
      <Navbar />
      <Box w='100%' maxW='600px' mx='auto' mt={10} borderRadius={5} px={10}>
        <Heading fontSize='25px' textAlign='center' mb={8}>Reset Password</Heading>
        <form>
          <FormControl isInvalid={isPasswordInvalid ? true : false} isRequired mb={10}>
            <FormLabel mb={4} htmlFor='password'>New Password</FormLabel>
            <Input id='password' placeholder='New Password' type='password' value={password} onChange={e => setPassword(e.target.value)} autoComplete='off' />
            <FormErrorMessage>{isPasswordInvalid}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={isPasswordConfirmationInvalid ? true : false} isRequired mb={10}>
            <FormLabel mb={4} htmlFor='passwordConfirmation'>New Password Confirmation</FormLabel>
            <Input id='passwordConfirmation' placeholder='New Password Confirmation' type='password' value={passwordConfirmation} onChange={e => setPasswordConfirmation(e.target.value)} autoComplete='off' />
            <FormErrorMessage>{isPasswordConfirmationInvalid}</FormErrorMessage>
          </FormControl>
          <Box textAlign='center'>
            <Button isLoading={fetching} onClick={handleSubmit} colorScheme={buttonBgColor}>Submit</Button>
          </Box>
        </form>
      </Box>
    </>
  )
}

export default withUrqlClient(createUrqlClient)(ResetPassword)