import { useState } from 'react'
import { toast } from 'react-toastify'
import { Box, Button, Text, FormControl, FormLabel, Input, ModalBody, ModalFooter, FormErrorMessage, useColorModeValue } from '@chakra-ui/react'
import { useRegisterMutation } from './../../generated/graphql'
import { InputChange } from './../../utils/interface'

interface IProps {
  currScreen: string
  setCurrScreen: React.Dispatch<React.SetStateAction<string>>
  onClose: () => void
}

const Register = ({ currScreen, setCurrScreen, onClose }: IProps) => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirmation: ''
  })
  const [isNameInvalid, setIsNameInvalid] = useState('')
  const [isEmailInvalid, setIsEmailInvalid] = useState('')
  const [isPasswordInvalid, setIsPasswordInvalid] = useState('')
  const [isPasswordConfirmationInvalid, setIsPasswordConfirmationInvalid] = useState('')

  const [{ fetching }, register] = useRegisterMutation()

  const buttonBgColor = useColorModeValue('blue', 'orange')

  const handleChange = (e: InputChange) => {
    const { name, value } = e.target
    setUserData({ ...userData, [name]: value })
  }

  const handleSubmit = async() => {
    const resp = await register({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      passwordConfirmation: userData.passwordConfirmation
    })

    if (resp.data?.register.errors) {
      const errField = resp.data.register.errors.map(item => item.field)

      if (!('Name' in errField)) setIsNameInvalid('')
      if (!('Email' in errField)) setIsEmailInvalid('')
      if (!('Password' in errField)) setIsPasswordInvalid('')
      if (!('Password Confirmation' in errField)) setIsPasswordConfirmationInvalid('')

      resp.data.register.errors.forEach(item => {
        if (item.field === 'Name') {
          setIsNameInvalid(item.message)
        }

        if (item.field === 'Email') {
          setIsEmailInvalid(item.message)
        }

        if (item.field === 'Password') {
          setIsPasswordInvalid(item.message)
        }

        if (item.field === 'Password Confirmation') {
          setIsPasswordConfirmationInvalid(item.message)
        }
      })
    } else if (resp.data?.register.user) {
      toast.success('Register success.')
      onClose()
    }
  }

  return (
    <>
      <ModalBody>
        <form>
          <FormControl isInvalid={isNameInvalid ? true : false} isRequired mb={6}>
            <FormLabel htmlFor='name'>Name</FormLabel>
            <Input id='name' placeholder='Name' name='name' value={userData.name} onChange={handleChange} autoComplete='off' />
            <FormErrorMessage>{isNameInvalid}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={isEmailInvalid ? true : false} isRequired mb={6}>
            <FormLabel htmlFor='email'>Email</FormLabel>
            <Input id='email' placeholder='Email' name='email' value={userData.email} onChange={handleChange} autoComplete='off' />
            <FormErrorMessage>{isEmailInvalid}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={isPasswordInvalid ? true : false} isRequired mb={6}>
            <FormLabel htmlFor='password'>Password</FormLabel>
            <Input type='password' id='password' placeholder='Password' name='password' value={userData.password} onChange={handleChange} />
            <FormErrorMessage>{isPasswordInvalid}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={isPasswordConfirmationInvalid ? true : false} isRequired>
            <FormLabel htmlFor='passwordConfirmation'>Password Confirmation</FormLabel>
            <Input type='password' id='passwordConfirmation' placeholder='Password Confirmation' name='passwordConfirmation' value={userData.passwordConfirmation} onChange={handleChange} />
            <FormErrorMessage>{isPasswordConfirmationInvalid}</FormErrorMessage>
          </FormControl>
        </form>
      </ModalBody>
      <ModalFooter justifyContent='space-between'>
        <Text _hover={{ textDecoration: 'underline' }} fontSize='sm' cursor='pointer' onClick={() => setCurrScreen(currScreen === 'login' ? 'register' : 'login')}>
          {currScreen === 'login' ? 'Register' : 'Login'}
        </Text>
        <Box>
          <Button isLoading={fetching} onClick={handleSubmit} colorScheme={buttonBgColor} mr={4} fontWeight='normal' fontSize='sm' >
            Submit
          </Button>
          <Button onClick={onClose} fontWeight='normal' fontSize='sm'>Cancel</Button>
        </Box>
      </ModalFooter>
    </>
  )
}

export default Register