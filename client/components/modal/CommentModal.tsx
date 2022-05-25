import { RefObject, useRef } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Textarea
} from '@chakra-ui/react'

interface IProps {
  isOpen: boolean
  onClose: () => void
}

const CommentModal = ({ isOpen, onClose }: IProps) => {
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
        <ModalHeader>Post Comment</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <form>
            <FormControl isRequired mb={6}>
              <FormLabel htmlFor='email'>Comment</FormLabel>
              <Textarea id='comment' placeholder='Comment' size='sm' />
            </FormControl>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='blue' mr={4} fontWeight='normal' fontSize='sm'>
            Save
          </Button>
          <Button onClick={onClose} fontWeight='normal' fontSize='sm'>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default CommentModal