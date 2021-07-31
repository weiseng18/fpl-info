import {
  Container,
  Flex,
  VStack,
  Heading,
  Text,
  InputGroup,
  InputLeftAddon,
  Input,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  OrderedList,
  ListItem,
  Link,
  Image,
  Code,
} from "@chakra-ui/react"

import Router from "next/router"

import { useState } from "react"

const Index = () => {
  const [ID, setID] = useState("")
  const [invalid, setInvalid] = useState(false)
  const [error, setError] = useState("")

  const OFF_SEASON = process.env.NEXT_PUBLIC_IS_OFF_SEASON === "true"

  const hasOnlyDigits = (val) => {
    return /^[0-9]+$/.test(val)
  }

  const handleChange = (e) => {
    setInvalid(false)
    setError("")
    setID(e.target.value)
  }

  const handleKeydown = (e) => {
    if (e.keyCode == 13 || e.key == "Enter") handleSubmit()
  }

  const handleSubmit = () => {
    if (ID === "") {
      setInvalid(true)
      setError("FPL ID cannot be blank")
      return
    }
    if (!hasOnlyDigits(ID)) {
      setInvalid(true)
      setError("FPL ID should only contain numbers ")
      return
    }
    Router.push(`/user/${ID}`)
  }

  return (
    <Container h="100vh">
      <Flex h="100%" justifyContent="center" alignItems="center">
        <VStack spacing="60px">
          <Heading>Learn more about your FPL team</Heading>
          <HelpModal />
          <VStack spacing={8}>
            <InputGroup>
              <InputLeftAddon children={<Text fontWeight="600">FPL ID</Text>} />
              <Input
                isRequired
                isInvalid={invalid}
                errorBorderColor="crimson"
                onChange={handleChange}
                onKeyDown={handleKeydown}
                placeholder="Fill in your FPL ID"
              />
            </InputGroup>
            {invalid && error && <Text color="crimson">Error: {error}</Text>}
            <Button disabled={invalid || !ID.length} onClick={handleSubmit}>
              Submit
            </Button>
          </VStack>
          {OFF_SEASON && (
            <Text>
              It is currently off season for FPL. Only overall season data will
              be provided.
            </Text>
          )}
        </VStack>
      </Flex>
    </Container>
  )
}

const HelpModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Text>
        Don't know how to get your FPL ID?{" "}
        <Button onClick={onOpen} colorScheme="teal" variant="link">
          Click me
        </Button>{" "}
        to find out how!
      </Text>
      <Modal size="xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>How to obtain your FPL ID</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <OrderedList spacing={4}>
              <ListItem>
                Go to{" "}
                <Button colorScheme="teal" variant="link">
                  <Link
                    isExternal
                    href="https://fantasy.premierleague.com/my-team"
                  >
                    Pick Team
                  </Link>
                </Button>
              </ListItem>
              <ListItem>
                Click on "View Gameweek history", at the bottom right of this
                screenshot:
                <Image src="/view gameweek history.png" />
              </ListItem>
              <ListItem>
                Check the URL of your browser. It will look like
                https://fantasy.premierleague.com/entry/<Code>some number</Code>
                /history
              </ListItem>
              <ListItem>
                <Code>some number</Code> is your FPL ID! You get a new FPL ID
                every season, so your ID will likely change from previous
                seasons.
              </ListItem>
            </OrderedList>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Index
