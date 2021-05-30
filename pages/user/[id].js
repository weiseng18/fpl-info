import { VStack, Table, Thead, Tbody, Tr, Th, Td, TableCaption, Container } from "@chakra-ui/react"

import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import axios from "axios"

const User = () => {
  const router = useRouter()
  const { id } = router.query

  const [seasonsData, setSeasonsData] = useState([])

  useEffect(() => {
    const getUserHistory = async (id) => {
      const res = await axios.get(`/api/users/${id}`)
      setSeasonsData(res.data)
    }
    // if ID param is provided
    if (id)
      getUserHistory(id)
  }, [id])

  return (
    <Container>
      <VStack my="10" justifyContent="center">
        <Table variant="striped">
          <TableCaption>FPL overall performance for user {id}</TableCaption>
          <Thead>
            <Tr>
              <Th>Season</Th>
              <Th>Total Points</Th>
              <Th>Overall Rank</Th>
            </Tr>
          </Thead>
          <Tbody>
            {seasonsData.map((one) => (
              <Tr>
                <Td>{one.season_name}</Td>
                <Td>{one.total_points}</Td>
                <Td>{one.rank}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </VStack>
    </Container>
  )
}

export default User