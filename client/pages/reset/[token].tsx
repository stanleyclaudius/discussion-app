import { useState } from 'react'
import { Box, Button, FormControl, FormErrorMessage, FormLabel, Heading, Input, useColorModeValue } from "@chakra-ui/react"
import Head from "next/head"
import Navbar from "../../components/general/Navbar"

const ResetPassword = () => {
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')

  const [isPasswordInvalid, setIsPasswordInvalid] = useState('')
  const [isPasswordConfirmationInvalid, setIsPasswordConfirmationInvalid] = useState('')

  const bg = useColorModeValue('blue', 'orange')

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
            <Button colorScheme={bg}>Submit</Button>
          </Box>
        </form>
      </Box>
    </>
  )
}

export default ResetPassword