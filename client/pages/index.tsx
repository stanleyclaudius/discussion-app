import { Box, Button, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import { AiOutlinePlus } from 'react-icons/ai'
import Head from 'next/head'
import DiscussionCard from './../components/general/DiscussionCard'
import Navbar from './../components/general/Navbar'
import PostModal from '../components/modal/PostModal'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { useCurrentLoginUserQuery, useGetPostsQuery } from '../generated/graphql'

const Home = () => {
  const [{ data, fetching }] = useCurrentLoginUserQuery()
  const [{ data: postsData, fetching: postsFetching }] = useGetPostsQuery()

  const bg = useColorModeValue('blue', 'orange')
  const txt = useColorModeValue('white', 'black')

  const { isOpen, onOpen, onClose } = useDisclosure()

  if (!postsFetching && !postsData) {
    return <div>Query Failed.</div>
  }
  
  return (
    <>
      <Head>
        <title>Discussme | Home</title>
      </Head>
      <Navbar />
      <Box py={10} px={{ base: 8, lg: 40 }}>
        {
          (!fetching && data?.currentLoginUser) &&
          <Box display='flex' justifyContent='flex-end'>
            <Button onClick={onOpen} leftIcon={<AiOutlinePlus color={txt} />} size='sm' colorScheme={bg} p={5} mb={10} borderRadius={0} fontWeight='normal'>Create Post</Button>
          </Box>
        }
        <Box display='flex' flexDirection='column' gap={14}>
          {
            postsData?.getPosts.map(item => (
              <DiscussionCard
                key={item.id}
                title={item.title}
                content={item.content}
                createdAt={item.createdAt}
                user={item.user}
              />
            ))
          }
        </Box>
      </Box>

      <PostModal
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  )
}

export default withUrqlClient(createUrqlClient)(Home)