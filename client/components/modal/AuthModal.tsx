import { useState, RefObject, useRef } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  Text
} from '@chakra-ui/react'
import Login from '../auth/Login'
import Register from '../auth/Register'

interface IProps {
  isOpen: boolean
  onClose: () => void
}

const AuthModal = ({ isOpen, onClose }: IProps) => {
  const [currScreen, setCurrScreen] = useState('login')

  const initialRef = useRef() as RefObject<HTMLElement>
  const finalRef = useRef() as RefObject<HTMLElement>

  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{currScreen === 'login' ? 'Sign In' : 'Sign Up'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {
            currScreen === 'login'
            ? <Login />
            : <Register />
          }
        </ModalBody>
        <ModalFooter justifyContent='space-between'>
          <Text _hover={{ textDecoration: 'underline' }} fontSize='sm' cursor='pointer' onClick={() => setCurrScreen(currScreen === 'login' ? 'register' : 'login')}>
            {currScreen === 'login' ? 'Register' : 'Login'}
          </Text>
          <Box>
            <Button colorScheme='blue' mr={4} fontWeight='normal' fontSize='sm' >
              Submit
            </Button>
            <Button onClick={onClose} fontWeight='normal' fontSize='sm'>Cancel</Button>
          </Box>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default AuthModal