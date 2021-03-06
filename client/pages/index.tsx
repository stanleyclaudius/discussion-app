import { useState } from 'react'
import { withUrqlClient } from 'next-urql'
import { Box, Button, Flex, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import { AiOutlinePlus } from 'react-icons/ai'
import { createUrqlClient } from './../utils/createUrqlClient'
import { useCurrentLoginUserQuery, useGetPostsQuery } from './../generated/graphql'
import Head from 'next/head'
import DiscussionCard from './../components/general/DiscussionCard'
import Navbar from './../components/general/Navbar'
import PostModal from './../components/modal/PostModal'

const Home = () => {
  const [variables, setVariables] = useState({ limit: 15, cursor: null as null | string })

  const [{ data: currentLoginUserData, fetching: currentLoginUserFetching }] = useCurrentLoginUserQuery()
  const [{ data: postsData, fetching: postsFetching }] = useGetPostsQuery({ variables })

  const buttonBgColor = useColorModeValue('blue', 'orange')
  const txtColor = useColorModeValue('white', 'black')

  const { isOpen, onOpen, onClose } = useDisclosure()

  if (!postsFetching && !postsData) {
    return <div>Query Failed.</div>
  }
  
  return (
    <>
      <Head>
        <title>Discussme | Home</title>
      </Head>
      <Navbar showSearchLogin={true} />
      <Box py={10} px={{ base: 8, lg: 40 }}>
        {
          (!currentLoginUserFetching && currentLoginUserData?.currentLoginUser) &&
          <Box display='flex' justifyContent='flex-end'>
            <Button onClick={onOpen} leftIcon={<AiOutlinePlus color={txtColor} />} size='sm' colorScheme={buttonBgColor} p={5} mb={10} borderRadius={0} fontWeight='normal'>Create Post</Button>
          </Box>
        }
        <Box display='flex' flexDirection='column' gap={14}>
          {
            postsData?.getPosts.posts.map(item => (
              <DiscussionCard
                key={item.id}
                post={item}
              />
            ))
          }
        </Box>
        
        {
          postsData?.getPosts.hasMore &&
          <Flex>
            <Button onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: postsData.getPosts.posts[postsData.getPosts.posts.length - 1].createdAt
              })
            }} isLoading={currentLoginUserFetching} m='auto' my={8}>Load more</Button>
          </Flex>
        }
      </Box>

      <PostModal
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Home)