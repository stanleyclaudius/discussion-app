import { useState } from 'react'
import { toast } from 'react-toastify'
import { Box, Divider, Heading, HStack, Img, Text, useColorModeValue, useDisclosure, VStack } from '@chakra-ui/react'
import { AiOutlineArrowUp, AiOutlineEdit, AiOutlineArrowDown } from 'react-icons/ai'
import { FaTrash } from 'react-icons/fa'
import { Post, useCurrentLoginUserQuery, useDeletePostMutation, User, useVoteMutation } from './../../generated/graphql'
import Link from 'next/link'
import moment from 'moment'
import PostModal from './../modal/PostModal'

interface IProps {
  post: Post
}

export interface ISelectedPost {
  id: number
  title: string
  content: string
}

const DiscussionCard = ({ post }: IProps) => {
  const [selectedPost, setSelectedPost] = useState<Partial<ISelectedPost>>({})

  const boxBgColor = useColorModeValue('white', 'gray.900')

  const [, vote] = useVoteMutation()
  const [, deletePost] = useDeletePostMutation()
  const [{ data: currentLoginUserData }] = useCurrentLoginUserQuery()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleDeletePost = () => {
    deletePost({ postId: post.id })
    toast.success('Post deleted.')
  }

  const handleUpdatePost = () => {
    setSelectedPost({
      id: post.id,
      title: post.title as string,
      content: post.content
    })
    onOpen()
  }

  return (
    <>
      <HStack alignItems='self-start' boxShadow='0 0 15px rgba(0,0,0,.1)' borderRadius={8} p={7} gap={7} bgColor={boxBgColor}>
        <VStack color='gray.500'>
          <Box color={post.voteStatus === 1 ? 'green.300' : undefined} onClick={() => vote({ value: 1, postId: post.id })}>
            <AiOutlineArrowUp fontSize={23} cursor='pointer' />
          </Box>
          <Text>{post.point}</Text>
          <Box color={post.voteStatus === -1 ? 'red.500' : undefined} onClick={() => vote({ value: -1, postId: post.id })}>
            <AiOutlineArrowDown fontSize={23} cursor='pointer' />
          </Box>
        </VStack>
        <Box flex={1}>
          <Box>
            <HStack justifyContent='space-between' alignItems='center'>
              <Link href={`/discussion/${post.id}`}>
                <Heading cursor='pointer' as='h3' size='md'>{post.title}</Heading>
              </Link>
            </HStack>
            <Text my={4} color='gray.500' fontSize={14} lineHeight='6'>
              {post.content}
            </Text>
          </Box>
          <Divider />
          <HStack mt={4} justifyContent='space-between' flexDirection={{ base: 'column', lg: 'row' }} alignItems={{ base: 'self-start', lg: 'center' }}>
            <HStack gap={{ base: 3, lg: 7 }} flexDirection={{ base: 'column', lg: 'row' }} alignItems={{ base: 'self-start', lg: 'center' }}>
              <HStack>
                <Box w={10} h={10} bgColor='gray.200' borderRadius='50%' flexShrink={0}>
                  <Img src={post.user.avatar} alt={post.user.name} w='100%' h='100%' borderRadius='50%' objectFit='cover' />
                </Box>
                <HStack fontSize='sm' gap={2}>
                  <Text color='gray.400'>Posted by</Text>
                  <Text color='blue.600'>{post.user.name}</Text>
                </HStack>
              </HStack>
              <Text color='gray.400' fontSize='sm'>{moment(parseInt(post.createdAt)).fromNow()}</Text>
            </HStack>
            {
              currentLoginUserData?.currentLoginUser?.id === post.userId &&
              <HStack gap={3}>
                <Box onClick={handleUpdatePost} bgColor='orange.400' borderRadius='sm'  p={2} cursor='pointer'>
                  <AiOutlineEdit color='white' />
                </Box>
                <Box onClick={handleDeletePost} bgColor='red.500' borderRadius='sm' p={2} cursor='pointer'>
                  <FaTrash color='white' />
                </Box>
              </HStack>
            }
          </HStack>
        </Box>
      </HStack>

      <PostModal
        isOpen={isOpen}
        onClose={onClose}
        selectedPost={selectedPost as ISelectedPost}
      />
    </>
  )
}

export default DiscussionCard