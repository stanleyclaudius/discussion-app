import { FormControl, FormLabel, Input } from '@chakra-ui/react'

const Register = () => {
  return (
    <form>
      <FormControl isRequired mb={6}>
        <FormLabel htmlFor='name'>Name</FormLabel>
        <Input id='name' placeholder='Name' />
      </FormControl>
      <FormControl isRequired mb={6}>
        <FormLabel htmlFor='email'>Email</FormLabel>
        <Input id='email' placeholder='Email' />
      </FormControl>
      <FormControl isRequired mb={6}>
        <FormLabel htmlFor='password'>Password</FormLabel>
        <Input type='password' id='password' placeholder='Password' />
      </FormControl>
      <FormControl isRequired>
        <FormLabel htmlFor='passwordConfirmation'>Password Confirmation</FormLabel>
        <Input type='password' id='passwordConfirmation' placeholder='Password Confirmation' />
      </FormControl>
    </form>
  )
}

export default Register