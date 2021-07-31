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

export default Index
