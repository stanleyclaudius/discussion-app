import { Box, Divider, Heading, HStack, VStack, Text, Button, useDisclosure, useColorModeValue, Img } from '@chakra-ui/react'
import { AiOutlineArrowUp, AiOutlineArrowDown, AiOutlinePlus } from 'react-icons/ai'
import { useCurrentLoginUserQuery, useGetPostByIdQuery, useGetPostRepliesQuery, useVoteMutation } from '../../generated/graphql'
import { useRouter } from 'next/router'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from './../../utils/createUrqlClient'
import { formattedDate } from './../../utils/formatter'
import Head from 'next/head'
import Navbar from './../../components/general/Navbar'
import CommentCard from './../../components/general/CommentCard'
import CommentModal from './../../components/modal/CommentModal'

const DiscussionDetail = () => {
  const router = useRouter()

  const parsedId = typeof router.query.id === 'string' ? parseInt(router.query.id) : -1

  const { isOpen, onOpen, onClose } = useDisclosure()
  
  const [{ data: postData }] = useGetPostByIdQuery({
    pause: parsedId === -1,
    variables: {
      id: parsedId
    }
  })

  const [{ data: repliesData }] = useGetPostRepliesQuery({
    pause: parsedId === -1,
    variables: {
      postId: parsedId
    }
  })

  const [{ data: currentLoginUserData }] = useCurrentLoginUserQuery()

  const [, vote] = useVoteMutation()

  const buttonBgColor = useColorModeValue('blue', 'orange')
  const txtColor = useColorModeValue('white', 'black')

  return (
    <>
      <Head>
        <title>Discussme | {postData?.getPostById?.title}</title>
      </Head>
      <Navbar showSearchLogin={true} />
      <Box py={14} px={{ base: 8, lg: 40 }}>
        <HStack justifyContent='space-between' mb={9}>
          <HStack gap={3}>
            <Box w={10} h={10} bgColor='gray.200' borderRadius='50%' flexShrink={0}>
              <Img src={postData?.getPostById?.user.avatar} alt={postData?.getPostById?.user.name} w='100%' h='100%' borderRadius='50%' objectFit='cover' />
            </Box>
            <HStack fontSize='sm' gap={2}>
              <Text color='gray.400'>Posted by</Text>
              <Text color='blue.600'>{postData?.getPostById?.user.name}</Text>
            </HStack>
          </HStack>
          <Text mt={4} color='gray.400' fontSize='sm' mb={8}>{formattedDate(postData?.getPostById?.createdAt!)}</ Text>
        </HStack>
        <HStack alignItems='self-start' gap={7}>
          <VStack color='gray.500'>
            <Box color={postData?.getPostById?.voteStatus === 1 ? 'green.300' : undefined} onClick={() => vote({ value: 1, postId: parsedId })}>
              <AiOutlineArrowUp fontSize={23} cursor='pointer' />
            </Box>
            <Text>{postData?.getPostById?.point}</Text>
            <Box color={postData?.getPostById?.voteStatus === -1 ? 'red.500' : undefined} onClick={() => vote({ value: -1, postId: parsedId })}>
              <AiOutlineArrowDown fontSize={23} cursor='pointer' />
            </Box>
          </VStack>
          <Box>
            <Heading as='h3' size='md'>{postData?.getPostById?.title}</Heading>
            <Text my={4} color='gray.500' fontSize={14} lineHeight='6'>
              {postData?.getPostById?.content}
            </Text>
          </Box>
        </HStack>
        <Divider mt={6} />
        <Box mt={10}>
          <HStack mb={10} flexDirection={{ base: 'column', lg: 'row' }} alignItems={{ base: 'start', lg: 'center' }} justifyContent='space-between'>
            <Heading as='h3' size='md' mb={{ base: 5, lg: 0 }}>Comments ({repliesData?.getPostReplies.length})</Heading>
            {
              currentLoginUserData?.currentLoginUser &&
              <Button onClick={onOpen} leftIcon={<AiOutlinePlus color={txtColor} />} size='sm' colorScheme={buttonBgColor} p={5} borderRadius={0} fontWeight='normal'>Post Comment</Button>
            }
          </HStack>
          {
            repliesData?.getPostReplies.map(item => (
              <CommentCard key={item.id} post={item} loginUserId={currentLoginUserData?.currentLoginUser?.id} />
            ))
          }
        </Box>
      </Box>

      <CommentModal
        isOpen={isOpen}
        onClose={onClose}
        postId={parsedId}
      />
    </>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(DiscussionDetail)