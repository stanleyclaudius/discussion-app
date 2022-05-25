import { Box, Divider, Heading, HStack, Text, useColorModeValue, VStack } from '@chakra-ui/react'
import { AiOutlineArrowUp, AiOutlineArrowDown } from 'react-icons/ai'
import { GoComment } from 'react-icons/go'
import Link from 'next/link'

const DiscussionCard = () => {
  const bg = useColorModeValue('white', 'gray.900')

  return (
    <HStack alignItems='self-start' boxShadow='0 0 15px rgba(0,0,0,.1)' borderRadius={8} p={7} gap={7} bgColor={bg}>
      <VStack color='gray.500'>
        <AiOutlineArrowUp fontSize={23} cursor='pointer' />
        <Text>16</Text>
        <AiOutlineArrowDown fontSize={23} cursor='pointer' />
      </VStack>
      <Box>
        <Box>
          <Link href={`/discussion/fdsf`}>
            <Heading cursor='pointer' as='h3' size='md'>What does the fox say?</Heading>
          </Link>
          <Text my={4} color='gray.500' fontSize={14} lineHeight='6'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis maxime architecto laborum eligendi autem quaerat doloremque obcaecati, dolore reiciendis quidem deleniti accusamus libero ullam id rem quo ipsum! Eaque ea tempora atque similique? Repellat quidem, sed repudiandae modi aperiam facere, recusandae natus dolore et fugit corporis harum accusantium voluptatem illum. Nulla tenetur qui voluptate doloremque sunt quas necessitatibus tempora suscipit assumenda praesentium voluptates eligendi recusandae, a aliquam iusto quisquam illum expedita minus aperiam delectus saepe ipsam excepturi debitis incidunt. Dolore nam voluptatibus amet suscipit quasi ratione. Reprehenderit quia nobis quisquam vero, expedita sint culpa praesentium excepturi consequuntur, quidem, minima recusandae!
          </Text>
        </Box>
        <Divider />
        <HStack mt={4} justifyContent='space-between' flexDirection={{ base: 'column', lg: 'row' }} alignItems={{ base: 'self-start', lg: 'auto' }}>
          <HStack gap={{ base: 3, lg: 7 }} flexDirection={{ base: 'column', lg: 'row' }} alignItems={{ base: 'self-start', lg: 'center' }}>
            <HStack>
              <Box w={10} h={10} bgColor='gray.200' borderRadius='50%' flexShrink={0}></Box>
              <HStack fontSize='sm' gap={2}>
                <Text color='gray.400'>Posted by</Text>
                <Text color='blue.600'>Alakash Raj Dashal</Text>
              </HStack>
            </HStack>
            <Text color='gray.400' fontSize='sm'>12hr ago</Text>
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