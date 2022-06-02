import { useState } from 'react'
import { Box, Button, Text, FormControl, FormErrorMessage, FormLabel, Input, ModalBody, ModalFooter } from '@chakra-ui/react'
import { InputChange } from '../../utils/interface'
import { useLoginMutation } from '../../generated/graphql'
import { toast } from 'react-toastify'

interface IProps {
  currScreen: string
  setCurrScreen: React.Dispatch<React.SetStateAction<string>>
  onClose: () => void
}

const Login = ({ currScreen, setCurrScreen, onClose }: IProps) => {
  const [, login] = useLoginMutation()
  const [userData, setUserData] = useState({
    email: '',
    password: ''
  })
  const [isEmailInvalid, setIsEmailInvalid] = useState('')
  const [isPasswordInvalid, setIsPasswordInvalid] = useState('')

  const handleChange = (e: InputChange) => {
    const { name, value } = e.target
    setUserData({ ...userData, [name]: value })
  }

  const handleSubmit = async() => {
    const resp = await login(userData)
    if (resp.data?.login.errors) {
      const errField = resp.data.login.errors.map(item => item.field)

      if (!('Email' in errField)) setIsEmailInvalid('')

      if (!('Password' in errField)) setIsPasswordInvalid('')

      resp.data.login.errors.forEach(item => {
        if (item.field === 'Email') {
          setIsEmailInvalid(item.message)
        }

        if (item.field === 'Password') {
          setIsPasswordInvalid(item.message)
        }
      })
    } else if (resp.data?.login.user) {
      toast.success(`Authenticated as ${resp.data.login.user.name}`)
      onClose()
    }
  }

  return (
    <>
      <ModalBody pb={6}>
        <form>
          <FormControl isInvalid={isEmailInvalid ? true : false} isRequired mb={6}>
            <FormLabel htmlFor='email'>Email</FormLabel>
            <Input id='email' placeholder='Email' name='email' value={userData.email} onChange={handleChange} autoComplete='off' />
            <FormErrorMessage>{isEmailInvalid}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={isPasswordInvalid ? true : false} isRequired>
            <FormLabel htmlFor='password'>Password</FormLabel>
            <Input type='password' id='password' placeholder='Password' name='password' value={userData.password} onChange={handleChange} autoComplete='off' />
            <FormErrorMessage>{isPasswordInvalid}</FormErrorMessage>
            <Text _hover={{ textDecoration: 'underline' }} onClick={() => setCurrScreen('forget')} fontSize={14} mt={2} cursor='pointer' w='fit-content'>Forget password?</Text>
          </FormControl>
        </form>
      </ModalBody>
      <ModalFooter justifyContent='space-between'>
        <Text _hover={{ textDecoration: 'underline' }} fontSize='sm' cursor='pointer' onClick={() => setCurrScreen(currScreen === 'login' ? 'register' : 'login')}>
          {currScreen === 'login' ? 'Register' : 'Login'}
        </Text>
        <Box>
          <Button onClick={handleSubmit} colorScheme='blue' mr={4} fontWeight='normal' fontSize='sm' >
            Submit
          </Button>
          <Button onClick={onClose} fontWeight='normal' fontSize='sm'>Cancel</Button>
        </Box>
      </ModalFooter>
    </>
  )
}
 
export default Login