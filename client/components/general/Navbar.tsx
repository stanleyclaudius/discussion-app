import { Box, Button, Heading, HStack, Input, InputGroup, InputLeftElement, useDisclosure } from '@chakra-ui/react'
import { AiOutlineSearch } from 'react-icons/ai'
import AuthModal from './../modal/AuthModal'


const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Box display='flex' flexDirection={{ base: 'column', lg: 'row' }} justifyContent='space-between' alignItems='center' px={{ base: 10, lg: 32 }} py={5} boxShadow='0 0 15px rgba(0,0,0,.1)' gap={{ base: 8, lg: 40 }}>
        <Box display='flex' justifyContent='space-between' w={{ base: '100%', lg: 'auto' }}>
          <Box>
            <Heading as='h2' size= 'md' fontWeight='normal'>Discussme</Heading>
          </Box>
          <Box display={{ base: 'block', lg: 'none' }}>
            <Button onClick={onOpen} size='sm' colorScheme='blue' fontWeight='normal'>Login</Button>
          </Box>
        </Box>
        <Box flex={1} w='100%'>
          <InputGroup bgColor='gray.100' borderRadius={6}>
            <InputLeftElement pointerEvents='none' children={<AiOutlineSearch color='gray.300' />} />
            <Input placeholder='Search for Topics' fontSize='sm' />
          </InputGroup>
        </Box>
        <Box display={{ base: 'none', lg: 'block' }}>
          <Button onClick={onOpen} size='sm' colorScheme='blue' fontWeight='normal'>Login</Button>
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