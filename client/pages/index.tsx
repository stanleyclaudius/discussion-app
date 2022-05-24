import { Box } from '@chakra-ui/react'
import DiscussionCard from '../components/general/DiscussionCard'
import Navbar from './../components/general/Navbar'

const Home = () => {
  return (
    <>
      <Navbar />
      <Box py={10} px={{ base: 8, lg: 32 }} bgColor='gray.50'>
        <DiscussionCard />
      </Box>
    </>
  )
}

export default Home