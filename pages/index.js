import { Container, Flex, VStack, Heading, Text, InputGroup, InputLeftAddon, Input, Button } from "@chakra-ui/react"

import Router from "next/router"

import { useState } from "react"

const Index = () => {

  const [ID, setID] = useState("")

  const OFF_SEASON = process.env.NEXT_PUBLIC_IS_OFF_SEASON === "true"

  const handleChange = (e) => {
    setID(e.target.value)
  }

  const handleSubmit = () => {
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
                <Input isRequired onChange={handleChange} placeholder="Fill in your FPL ID"/>
              </InputGroup>
              <Button onClick={handleSubmit}>Submit</Button>
            </VStack>
            {OFF_SEASON && (
              <Text>It is currently off season for FPL. Only overall season data will be provided.</Text>
            )}
          </VStack>
        </Flex>
    </Container>
  )
}

export default Index