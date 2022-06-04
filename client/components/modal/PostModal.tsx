import { useState, useEffect, RefObject, useRef } from 'react'
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
  Textarea,
  FormErrorMessage,
  useColorModeValue
} from '@chakra-ui/react'
import { useCreatePostMutation, useUpdatePostMutation } from '../../generated/graphql'
import { InputChange } from '../../utils/interface'
import { toast } from 'react-toastify'
import { ISelectedPost } from '../general/DiscussionCard'

interface IProps {
  isOpen: boolean
  onClose: () => void,
  selectedPost?: ISelectedPost
}

const PostModal = ({ isOpen, onClose, selectedPost }: IProps) => {
  const [{ fetching: createFetching }, createPost] = useCreatePostMutation()
  const [{ fetching: updateFetching }, updatePost] = useUpdatePostMutation()

  const initialRef = useRef() as RefObject<HTMLElement>
  const finalRef = useRef() as RefObject<HTMLElement>

  const bg = useColorModeValue('blue', 'orange')

  const [postData, setPostData] = useState({
    title: '',
    content: ''
  })

  const [isTitleInvalid, setIsTitleInvalid] = useState('')
  const [isContentInvalid, setIsContentInvalid] = useState('')

  const handleChange = (e: InputChange) => {
    const { name, value } = e.target
    setPostData({ ...postData, [name]: value })
  }

  const handleSubmit = async() => {
    if (!postData.title) {
      setIsTitleInvalid('Please provide post title.')
    } else {
      setIsTitleInvalid('')
    }

    if (!postData.content) {
      setIsContentInvalid('Please provide post content.')
    } else {
      setIsContentInvalid('')
    }

    if (postData.title && postData.content) {
      if (selectedPost) {
        updatePost({
          postId: selectedPost.id,
          title: postData.title,
          content: postData.content
        })
        toast.success(`Post has been updated successfully.`)
      } else {
        createPost(postData)
        toast.success(`Post with title ${postData.title} has been created successfully.`)
      }
      setPostData({
        title: '',
        content: ''
      })
      onClose()
    } else {
      return
    }
  }

  useEffect(() => {
    if (selectedPost && Object.keys(selectedPost).length > 0) {
      setPostData({
        title: selectedPost.title,
        content: selectedPost.content
      })
    }

    return () => {
      setPostData({
        title: '',
        content: ''
      })
    }
  }, [selectedPost])

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
            <FormControl isInvalid={isTitleInvalid ? true : false} isRequired mb={6}>
              <FormLabel htmlFor='title'>Title</FormLabel>
              <Input id='title' placeholder='Title' name='title' value={postData.title} onChange={handleChange} />
              <FormErrorMessage>{isTitleInvalid}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={isContentInvalid ? true : false} isRequired>
              <FormLabel htmlFor='content'>Content</FormLabel>
              <Textarea id='content' placeholder='Content' name='content' value={postData.content} onChange={handleChange} />
              <FormErrorMessage>{isContentInvalid}</FormErrorMessage>
            </FormControl>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button isLoading={createFetching || updateFetching} onClick={handleSubmit} colorScheme={bg} mr={4} fontWeight='normal' fontSize='sm'>
            Save
          </Button>
          <Button onClick={onClose} fontWeight='normal' fontSize='sm'>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default PostModal