import { Box, Divider, Heading, HStack, Img, Text, useColorModeValue, VStack } from '@chakra-ui/react'
import { AiOutlineArrowUp, AiOutlineArrowDown } from 'react-icons/ai'
import { GoComment } from 'react-icons/go'
import Link from 'next/link'
import moment from 'moment'
import { User } from '../../generated/graphql'

interface IProps {
  title: string
  content: string
  createdAt: string
  user: User
}

const DiscussionCard = ({ title, content, createdAt, user }: IProps) => {
  const bg = useColorModeValue('white', 'gray.900')

  return (
    <HStack alignItems='self-start' boxShadow='0 0 15px rgba(0,0,0,.1)' borderRadius={8} p={7} gap={7} bgColor={bg}>
      <VStack color='gray.500'>
        <AiOutlineArrowUp fontSize={23} cursor='pointer' />
        <Text>16</Text>
        <AiOutlineArrowDown fontSize={23} cursor='pointer' />
      </VStack>
      <Box flex={1}>
        <Box>
          <Link href={`/discussion/fdsf`}>
            <Heading cursor='pointer' as='h3' size='md'>{title}</Heading>
          </Link>
          <Text my={4} color='gray.500' fontSize={14} lineHeight='6'>
            {content}
          </Text>
        </Box>
        <Divider />
        <HStack mt={4} justifyContent='space-between' flexDirection={{ base: 'column', lg: 'row' }} alignItems={{ base: 'self-start', lg: 'center' }}>
          <HStack gap={{ base: 3, lg: 7 }} flexDirection={{ base: 'column', lg: 'row' }} alignItems={{ base: 'self-start', lg: 'center' }}>
            <HStack>
              <Box w={10} h={10} bgColor='gray.200' borderRadius='50%' flexShrink={0}>
                <Img src={user.avatar} alt={user.name} w='100%' h='100%' borderRadius='50%' objectFit='cover' />
              </Box>
              <HStack fontSize='sm' gap={2}>
                <Text color='gray.400'>Posted by</Text>
                <Text color='blue.600'>{user.name}</Text>
              </HStack>
            </HStack>
            <Text color='gray.400' fontSize='sm'>{moment(parseInt(createdAt)).fromNow()}</Text>
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