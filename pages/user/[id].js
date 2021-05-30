import { VStack, Table, Thead, Tbody, Tr, Th, Td, TableCaption, Container } from "@chakra-ui/react"

import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import axios from "axios"

const User = () => {
  const router = useRouter()
  const { id } = router.query

  const [seasonsData, setSeasonsData] = useState([])
  const [playerNames, setPlayerNames] = useState([])
  const [playerPoints, setPlayerPoints] = useState([])
  const [picks, setPicks] = useState([])

  useEffect(() => {
    /**
     * Helper functions
     */
    const getUserHistory = async (id) => {
      const res = await axios.get(`/api/users/${id}`)
      setSeasonsData(res.data)
    }
    const getPlayerNames = async () => {
      const res = await axios.get('/api/players/names')
      setPlayerNames(res.data)
    }
    const getGameweekPoints = async () => {
      let allGameweekPoints = []
      for (let i=1; i<=38; i++) {
        const res = await axios.get(`/api/gameweeks/${i}`)
        const points = res.data
        allGameweekPoints.push(points)
      }
      setPlayerPoints(allGameweekPoints)
    }
    const getGameweekPicks = async (id) => {
      let allGameweekPicks = []
      for (let i=1; i<=38; i++) {
        const res = await axios.get(`/api/users/${id}/gameweeks/${i}`)
        const picks = res.data
        allGameweekPicks.push(picks)
      }
      setPicks(allGameweekPicks)
    }

    /**
     * Get data
     */
    getPlayerNames()
    getGameweekPoints()

    // if ID param is provided
    if (id) {
      getUserHistory(id)
      getGameweekPicks(id)
    }

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