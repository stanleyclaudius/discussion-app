import { useState } from 'react'
import { toast } from 'react-toastify'
import { Box, Button, Text, FormControl, FormErrorMessage, FormLabel, Input, ModalBody, ModalFooter, useColorModeValue } from '@chakra-ui/react'
import { useForgotPasswordMutation } from './../../generated/graphql'

interface IProps {
  setCurrScreen: React.Dispatch<React.SetStateAction<string>>
  onClose: () => void
}

const ForgetPassword = ({ setCurrScreen, onClose }: IProps) => {
  const [email, setEmail] = useState('')
  const [isEmailInvalid, setIsEmailInvalid] = useState('')

  const [{ fetching }, forgotPassword] = useForgotPasswordMutation()

  const buttonBgColor = useColorModeValue('blue', 'orange')

  const handleSubmit = async() => {
    if (!email) {
      setIsEmailInvalid('Please provide your email address.')
    } else {
      setIsEmailInvalid('')
    }

    if (!isEmailInvalid) {
      const resp = await forgotPassword({ email })

      if (!resp.data?.forgotPassword) {
        toast.error('Email not registered in system.')
      } else {
        toast.success(`Reset password email has been sent to ${email}`)
        onClose()
      }
    }
  }

  return (
    <>
      <ModalBody pb={6}>
        <form>
          <FormControl isInvalid={isEmailInvalid ? true : false} isRequired>
            <FormLabel htmlFor='email'>Email</FormLabel>
            <Input id='email' placeholder='Email' name='email' value={email} onChange={e => setEmail(e.target.value)} autoComplete='off' />
            <FormErrorMessage>{isEmailInvalid}</FormErrorMessage>
          </FormControl>
        </form>
      </ModalBody>
      <ModalFooter justifyContent='space-between'>
        <Text _hover={{ textDecoration: 'underline' }} fontSize='sm' cursor='pointer' onClick={() => setCurrScreen('login')}>
          Login
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
 
export default ForgetPassword