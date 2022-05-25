import { Box } from '@chakra-ui/react'
import Head from 'next/head'
import DiscussionCard from '../components/general/DiscussionCard'
import Navbar from './../components/general/Navbar'

const Home = () => {
  return (
    <>
      <Head>
        <title>Discussme | Home</title>
      </Head>
      <Navbar />
      <Box display='flex' flexDirection='column' gap={14} py={10} px={{ base: 8, lg: 40 }} bgColor='gray.50'>
        <DiscussionCard />
        <DiscussionCard />
        <DiscussionCard />
        <DiscussionCard />
      </Box>
    </>
  )
}

export default Home