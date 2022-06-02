import { Box, Divider, HStack, Img, Text, VStack } from '@chakra-ui/react'
import { AiOutlineArrowDown, AiOutlineArrowUp } from 'react-icons/ai'
import { FaTrash } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { Post, useCurrentLoginUserQuery, useDeletePostMutation, useVoteMutation } from '../../generated/graphql'
import { formattedDate } from '../../utils/formatter'

interface IProps {
  post: Post
  loginUserId?: number
}

const CommentCard = ({ post, loginUserId }: IProps) => {
  const [, vote] = useVoteMutation()
  const [, deletePost] = useDeletePostMutation()
  // const [{data}] = useCurrentLoginUserQuery()
  
  const handleDeletePost = () => {
    deletePost({ postId: post.id })
    toast.success('Comment deleted.')
  }

  return (
    <Box mb={10}>
      <Box mb={10}>
        <HStack justifyContent='space-between' mb={9}>
          <HStack gap={3}>
            <Box w={10} h={10} bgColor='gray.200' borderRadius='50%' flexShrink={0}>
              <Img src={post.user.avatar} alt={post.user.name} w='100%' h='100%' borderRadius='50%' objectFit='cover' />
            </Box>
            <HStack fontSize='sm' gap={2}>
              <Text color='gray.400'>Posted by</Text>
              <Text color='blue.600'>{post.user.name}</Text>
            </HStack>
            <Text mt={4} color='gray.400' fontSize='sm' mb={8}>{formattedDate(post.createdAt)}</Text>
          </HStack>
          {
            loginUserId === post.userId &&
            <Box onClick={handleDeletePost} bgColor='red.500' borderRadius='sm' p={2} cursor='pointer'>
              <FaTrash color='white' />
            </Box>
          }
        </HStack>
        <HStack alignItems='self-start' gap={7}>
          <VStack color='gray.500'>
            <Box color={post.voteStatus === 1 ? 'green.300' : undefined} onClick={() => vote({ value: 1, postId: post.id })}>
              <AiOutlineArrowUp fontSize={23} cursor='pointer' />
            </Box>
            <Text>{post.point}</Text>
            <Box color={post.voteStatus === -1 ? 'red.500' : undefined} onClick={() => vote({ value: -1, postId: post.id })}>
              <AiOutlineArrowDown fontSize={23} cursor='pointer' />
            </Box>
          </VStack>
          <Box>
            <Text color='gray.500' fontSize={14} lineHeight='6'>
              {post.content}
            </Text>
          </Box>
        </HStack>
      </Box>
      <Divider />
    </Box>
  )
}

export default CommentCard