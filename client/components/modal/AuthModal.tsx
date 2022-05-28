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
        {
          currScreen === 'login'
          ? <Login currScreen={currScreen} setCurrScreen={setCurrScreen} onClose={onClose} />
          : <Register currScreen={currScreen} setCurrScreen={setCurrScreen} onClose={onClose} />
        }
      </ModalContent>
    </Modal>
  )
}

export default AuthModal