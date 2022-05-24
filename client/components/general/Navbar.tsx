import { Box, Button, Heading, HStack, Input, InputGroup, InputLeftElement, useDisclosure } from '@chakra-ui/react'
import { AiOutlineSearch } from 'react-icons/ai'
import AuthModal from './../modal/AuthModal'


const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <HStack justifyContent='space-between' px={32} py={5} boxShadow='0 0 15px rgba(0,0,0,.1)' gap={40}>
        <Box>
          <Heading as='h2' size='md' fontWeight='normal'>Discussme</Heading>
        </Box>
        <Box flex={1}>
          <InputGroup bgColor='gray.100' borderRadius={6}>
            <InputLeftElement pointerEvents='none' children={<AiOutlineSearch color='gray.300' />} />
            <Input placeholder='Search for Topics' fontSize='sm' />
          </InputGroup>
        </Box>
        <Box>
          <Button onClick={onOpen} size='sm' colorScheme='blue' fontWeight='normal'>Login</Button>
        </Box>
      </HStack>

      <AuthModal
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  )
}

export default Navbar