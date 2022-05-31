import { Box, Divider, Heading, HStack, Img, Text, useColorModeValue, VStack } from '@chakra-ui/react'
import { AiOutlineArrowUp, AiOutlineArrowDown } from 'react-icons/ai'
import { GoComment } from 'react-icons/go'
import Link from 'next/link'
import moment from 'moment'
import { Post, User, useVoteMutation } from '../../generated/graphql'

interface IProps {
  post: Post
}

const DiscussionCard = ({ post }: IProps) => {
  const [, vote] = useVoteMutation()
  const bg = useColorModeValue('white', 'gray.900')

  return (
    <HStack alignItems='self-start' boxShadow='0 0 15px rgba(0,0,0,.1)' borderRadius={8} p={7} gap={7} bgColor={bg}>
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
          <Link href={`/discussion/${post.id}`}>
            <Heading cursor='pointer' as='h3' size='md'>{post.title}</Heading>
          </Link>
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
          <HStack color='gray.500'>
            <GoComment />
            <Text fontSize='sm'>50+</Text>
          </HStack>
        </HStack>
      </Box>
    </HStack>
  )
}

export default DiscussionCard