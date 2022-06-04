import { RefObject, useRef, useState } from 'react'
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
  Textarea,
  FormErrorMessage,
  useColorModeValue
} from '@chakra-ui/react'
import { useReplyPostMutation } from '../../generated/graphql'
import { toast } from 'react-toastify'

interface IProps {
  isOpen: boolean
  onClose: () => void,
  postId: number
}

const CommentModal = ({ isOpen, onClose, postId }: IProps) => {
  const [content, setContent] = useState('')
  const [isInvalidContent, setIsInvalidContent] = useState('')

  const initialRef = useRef() as RefObject<HTMLElement>
  const finalRef = useRef() as RefObject<HTMLElement>

  const [{ fetching }, replyPost] = useReplyPostMutation()

  const bg = useColorModeValue('blue', 'orange')

  const handleSubmit = async() => {
    if (!content) {
      setIsInvalidContent('Comment can\'t be blank.')
      return
    }

    replyPost({ content, postId })
    toast.success('Comment posted.')
    onClose()
  }

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
          <FormControl isInvalid={isInvalidContent ? true : false} isRequired mb={6}>
            <FormLabel htmlFor='email'>Comment</FormLabel>
            <Textarea id='comment' placeholder='Comment' size='sm' value={content} onChange={e => setContent(e.target.value)} />
            <FormErrorMessage>{isInvalidContent}</FormErrorMessage>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button isLoading={fetching} onClick={handleSubmit} colorScheme={bg} mr={4} fontWeight='normal' fontSize='sm'>
            Save
          </Button>
          <Button onClick={onClose} fontWeight='normal' fontSize='sm'>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default CommentModal