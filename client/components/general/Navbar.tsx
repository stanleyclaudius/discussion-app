import { useState, useEffect } from 'react'
import { Box, Button, Text, Heading, Input, InputGroup, InputLeftElement, useColorMode, useColorModeValue, useDisclosure, HStack, Img } from '@chakra-ui/react'
import { AiOutlineSearch } from 'react-icons/ai'
import { BsFillMoonFill, BsFillSunFill } from 'react-icons/bs'
import Link from 'next/link'
import AuthModal from './../modal/AuthModal'
import { Post, SearchPostQuery, useCurrentLoginUserQuery, useLogoutMutation, useSearchPostQuery } from '../../generated/graphql'
import { toast } from 'react-toastify'
import { formattedDate } from '../../utils/formatter'
import { useRouter } from 'next/router'

const Navbar = () => {
  const [keyword, setKeyword] = useState('')
  const [searchResult, setSearchResult] = useState([])

  const [{ data, fetching }] = useCurrentLoginUserQuery()
  const [{ data: searchData }] = useSearchPostQuery({ variables: { keyword } })
  const [, logout] = useLogoutMutation()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const { colorMode, toggleColorMode } = useColorMode()
  const isDark = colorMode === 'dark'
  
  const router = useRouter()

  const bg = useColorModeValue('blue', 'orange')
  const searchBg = useColorModeValue('gray.100', 'gray.700')
  const searchResultBg = useColorModeValue('white', 'gray.700')

  const handleLogout = () => {
    logout()
    toast.success('Logout success.')
  }

  const handleClickSearchResult = (id: string) => {
    router.push(`/discussion/${id}`)
    setKeyword('')
  }

  useEffect(() => {
    if (keyword.length > 3) {
      // @ts-ignore
      setSearchResult(searchData?.searchPost)
    }

    return () => setSearchResult([])
  }, [keyword])

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
        <Box flex={1} w='100%' position='relative'>
          <InputGroup bgColor={searchBg} borderRadius={6}>
            <InputLeftElement pointerEvents='none' children={<AiOutlineSearch color='gray.300' />} />
            <Input placeholder='Search for Topics' fontSize='sm' value={keyword} onChange={e => setKeyword(e.target.value)} />
          </InputGroup>
          {
            searchResult.length > 0 &&
            <Box position='absolute' top='100%' mt={4} boxShadow='0 0 5px rgba(0,0,0,.3)' w='full' bg={searchResultBg} borderRadius={6} px={5} pt={5} zIndex={999}>
              {
                searchResult.map((item: any) => (
                  <Box mb={8} pb={5} borderBottom='1px solid #ccc'>
                    <Box onClick={() => handleClickSearchResult(item.id)}>
                      <Heading size='md' cursor='pointer' w='fit-content'>{item.title}</Heading>
                    </Box>
                    <HStack alignItems='center' justifyContent='space-between'>
                      <HStack fontSize='sm' gap={2} mt={3}>
                        <Text color='gray.400'>Posted by</Text>
                        <Text color='blue.600'>{item.user.name}</Text>
                      </HStack>
                      <Text fontSize={14}>{formattedDate(item.createdAt)}</Text>
                    </HStack>
                  </Box>
                ))
              }
            </Box>
          }

          {
            (searchResult.length === 0 && keyword.length > 3) &&
            <Box position='absolute' top='100%' mt={4} boxShadow='0 0 5px rgba(0,0,0,.3)' w='full' bg={searchResultBg} borderRadius={6} p={5} zIndex={999}>
              <Text color='red.400' fontWeight='medium' textAlign='center'>Post with keyword "{keyword}" not found</Text>
            </Box>
          }
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