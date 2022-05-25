import { Box, Divider, Heading, HStack, VStack, Text, Button, useDisclosure, useColorModeValue } from '@chakra-ui/react'
import { AiOutlineArrowUp, AiOutlineArrowDown, AiOutlinePlus } from 'react-icons/ai'
import Head from 'next/head'
import Navbar from './../../components/general/Navbar'
import CommentCard from '../../components/general/CommentCard'
import CommentModal from '../../components/modal/CommentModal'

const DiscussionDetail = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Head>
        <title>Discussme | What Does The Fox Say?</title>
      </Head>
      <Navbar />
      <Box py={14} px={{ base: 8, lg: 40 }}>
        <HStack justifyContent='space-between' mb={9}>
          <HStack gap={3}>
            <Box w={10} h={10} bgColor='gray.200' borderRadius='50%' flexShrink={0}></Box>
            <HStack fontSize='sm' gap={2}>
              <Text color='gray.400'>Posted by</Text>
              <Text color='blue.600'>Alakash Raj Dashal</Text>
            </HStack>
          </HStack>
          <Text mt={4} color='gray.400' fontSize='sm' mb={8}>2022 May 21</Text>
        </HStack>
        <HStack alignItems='self-start' gap={7}>
          <VStack color='gray.500'>
            <AiOutlineArrowUp fontSize={23} cursor='pointer' />
            <Text>16</Text>
            <AiOutlineArrowDown fontSize={23} cursor='pointer' />
          </VStack>
          <Box>
            <Heading as='h3' size='md'>What does the fox say?</Heading>
            <Text my={4} color='gray.500' fontSize={14} lineHeight='6'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis maxime architecto laborum eligendi autem quaerat doloremque obcaecati, dolore reiciendis quidem deleniti accusamus libero ullam id rem quo ipsum! Eaque ea tempora atque similique? Repellat quidem, sed repudiandae modi aperiam facere, recusandae natus dolore et fugit corporis harum accusantium voluptatem illum. Nulla tenetur qui voluptate doloremque sunt quas necessitatibus tempora suscipit assumenda praesentium voluptates eligendi recusandae, a aliquam iusto quisquam illum expedita minus aperiam delectus saepe ipsam excepturi debitis incidunt. Dolore nam voluptatibus amet suscipit quasi ratione. Reprehenderit quia nobis quisquam vero, expedita sint culpa praesentium excepturi consequuntur, quidem, minima recusandae!
            </Text>
          </Box>
        </HStack>
        <Divider mt={6} />
        <Box mt={10}>
          <HStack mb={10} flexDirection={{ base: 'column', lg: 'row' }} alignItems={{ base: 'start', lg: 'center' }} justifyContent='space-between'>
            <Heading as='h3' size='md' mb={{ base: 5, lg: 0 }}>Comments (50)</Heading>
            <Button onClick={onOpen} leftIcon={<AiOutlinePlus color='white' />} size='sm' colorScheme='blue' p={5} borderRadius={0} fontWeight='normal'>Post Comment</Button>
          </HStack>
          <CommentCard />
          <CommentCard />
          <CommentCard />
        </Box>
      </Box>

      <CommentModal
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  )
}

export default DiscussionDetail