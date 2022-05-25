import { FormControl, FormLabel, Input } from '@chakra-ui/react'

const Login = () => {
  return (
    <form>
      <FormControl isRequired mb={6}>
        <FormLabel htmlFor='email'>Email</FormLabel>
        <Input id='email' placeholder='Email' />
      </FormControl>
      <FormControl isRequired>
        <FormLabel htmlFor='password'>Password</FormLabel>
        <Input type='password' id='password' placeholder='Password' />
      </FormControl>
    </form>
  )
}

export default Login