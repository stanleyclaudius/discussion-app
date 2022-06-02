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
  const [email, setEmail] = useState('')
  const [isEmailInvalid, setIsEmailInvalid] = useState('')

  const handleSubmit = async() => {
    
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