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
  Input,
  Textarea
} from '@chakra-ui/react'

interface IProps {
  isOpen: boolean
  onClose: () => void
}

const PostModal = ({ isOpen, onClose }: IProps) => {
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
        <ModalHeader>Create Post</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <form>
            <FormControl isRequired mb={6}>
              <FormLabel htmlFor='title'>Title</FormLabel>
              <Input id='title' placeholder='Title' />
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor='content'>Content</FormLabel>
              <Textarea id='content' placeholder='Content' />
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

export default PostModal