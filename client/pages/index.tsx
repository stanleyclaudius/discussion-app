import { Box, Button, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import { AiOutlinePlus } from 'react-icons/ai'
import Head from 'next/head'
import DiscussionCard from './../components/general/DiscussionCard'
import Navbar from './../components/general/Navbar'
import PostModal from '../components/modal/PostModal'

const Home = () => {
  const bg = useColorModeValue('blue', 'orange')

  const txt = useColorModeValue('white', 'black')

  const { isOpen, onOpen, onClose } = useDisclosure()
  
  return (
    <>
      <Head>
        <title>Discussme | Home</title>
      </Head>
      <Navbar />
      <Box py={10} px={{ base: 8, lg: 40 }}>
        <Box display='flex' justifyContent='flex-end'>
          <Button onClick={onOpen} leftIcon={<AiOutlinePlus color={txt} />} size='sm' colorScheme={bg} p={5} mb={10} borderRadius={0} fontWeight='normal'>Create Post</Button>
        </Box>
        <Box display='flex' flexDirection='column' gap={14}>
          <DiscussionCard />
          <DiscussionCard />
          <DiscussionCard />
          <DiscussionCard />
        </Box>
      </Box>

      <PostModal
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  )
}

export default Home