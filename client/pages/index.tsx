import { Box, Button } from '@chakra-ui/react'
import Head from 'next/head'
import { AiOutlinePlus } from 'react-icons/ai'
import DiscussionCard from '../components/general/DiscussionCard'
import Navbar from './../components/general/Navbar'

const Home = () => {
  return (
    <>
      <Head>
        <title>Discussme | Home</title>
      </Head>
      <Navbar />
      <Box py={10} px={{ base: 8, lg: 40 }}>
        <Box display='flex' justifyContent='flex-end'>
          <Button leftIcon={<AiOutlinePlus color='white' />} size='sm' colorScheme='blue' p={5} mb={10} borderRadius={0} fontWeight='normal'>Create Post</Button>
        </Box>
        <Box display='flex' flexDirection='column' gap={14}>
          <DiscussionCard />
          <DiscussionCard />
          <DiscussionCard />
          <DiscussionCard />
        </Box>
      </Box>
    </>
  )
}

export default Home