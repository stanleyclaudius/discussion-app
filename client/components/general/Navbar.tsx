import { Box, Button, Text, Heading, Input, InputGroup, InputLeftElement, useColorMode, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import { AiOutlineSearch } from 'react-icons/ai'
import { BsFillMoonFill, BsFillSunFill } from 'react-icons/bs'
import Link from 'next/link'
import AuthModal from './../modal/AuthModal'
import { useCurrentLoginUserQuery, useLogoutMutation } from '../../generated/graphql'
import { toast } from 'react-toastify'

const Navbar = () => {
  const [{data, fetching}] = useCurrentLoginUserQuery()
  const [, logout] = useLogoutMutation()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const { colorMode, toggleColorMode } = useColorMode()
  const isDark = colorMode === 'dark'

  const bg = useColorModeValue('blue', 'orange')
  const searchBg = useColorModeValue('gray.100', 'gray.700')

  const handleLogout = () => {
    logout()
    toast.success('Logout success.')
  }

  return (
    <>
      <Box display='flex' flexDirection={{ base: 'column', lg: 'row' }} justifyContent='space-between' alignItems='center' px={{ base: 10, lg: 40 }} py={5} boxShadow='0 0 15px rgba(0,0,0,.2)' gap={{ base: 8, lg: 40 }}>
        <Box display='flex' justifyContent='space-between' w={{ base: '100%', lg: 'auto' }}>
          <Box>
            <Link href='/'>
              <Heading as='h2' size='md' cursor='pointer' fontWeight='normal'>Discussme</Heading>
            </Link>
          </Box>
          {
            !fetching && !data?.currentLoginUser
            ? (
              <Box display={{ base: 'block', lg: 'none' }}>
                <Button onClick={onOpen} size='sm' colorScheme={bg} fontWeight='normal'>Login</Button>
              </Box>
            )
            : (
              <>
                <Box display={{ base: 'block', lg: 'none' }}>
                  <Text>Hi, {data?.currentLoginUser?.name}</Text>
                </Box>
                <Box display={{ base: 'block', lg: 'none' }}>
                  <Button onClick={handleLogout} size='sm' colorScheme={bg} fontWeight='normal'>Logout</Button>
                </Box>
              </>
            )
          }
        </Box>
        <Box flex={1} w='100%'>
          <InputGroup bgColor={searchBg} borderRadius={6}>
            <InputLeftElement pointerEvents='none' children={<AiOutlineSearch color='gray.300' />} />
            <Input placeholder='Search for Topics' fontSize='sm' />
          </InputGroup>
        </Box>
        <Box display={{ base: 'none', lg: 'flex' }} alignItems='center' gap={8}>
          {
            !fetching && !data?.currentLoginUser
            ? (
              <Button onClick={onOpen} size='sm' colorScheme={bg} fontWeight='normal'>Login</Button>
            )
            : (
              <>
                <Text>Hi, {data?.currentLoginUser?.name}</Text>
                <Button onClick={handleLogout} size='sm' colorScheme={bg} fontWeight='normal'>Logout</Button>
              </>
            )
          }
          <Box onClick={toggleColorMode}>
            {
              isDark
              ? <BsFillMoonFill fontSize='20px' cursor='pointer' style={{ color: '#ffb543' }} />
              : <BsFillSunFill fontSize='20px' cursor='pointer' style={{ color: '#65a9ff' }} />
            }
          </Box>
        </Box>
      </Box>

      <AuthModal
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  )
}

export default Navbar