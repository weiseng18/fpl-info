import { VStack, Table, Thead, Tbody, Tr, Th, Td, TableCaption, Container } from "@chakra-ui/react"

import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import axios from "axios"

import * as _ from "lodash"

const User = () => {
  const router = useRouter()
  const { id } = router.query

  const OFF_SEASON = process.env.NEXT_PUBLIC_IS_OFF_SEASON === "true"

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

    // overall season data
    if (id)
      getUserHistory(id)

    // these data are only available during the saeason
    if (!OFF_SEASON) {
      getPlayerNames()
      getGameweekPoints()

      // if ID param is provided
      if (id)
        getGameweekPicks(id)
    }

  }, [id])

  /**
   * Returns a string of the following format:
   * [Player name] ([Points scored])
   * @param {*} playerId player's ID (0-indexed)
   * @param {*} weekId week number (0-indexed)
   */
  const getNameAndPoints = (playerId, weekId) => {
    return playerNames[playerId] + " (" + playerPoints[weekId][playerId] + ")"
  }

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
        {!OFF_SEASON && (
          <Table variant="striped">
            <TableCaption>Captain performances for user {id}</TableCaption>
            <Thead>
              <Tr>
                <Th>Gameweek</Th>
                <Th>Chosen Captain</Th>
                <Th>Your best performer<br/>(excludes bench)</Th>
              </Tr>
            </Thead>
            <Tbody>
              {picks.map((weekPicks, weekId) => {
                // check which pick was captain
                const captain = _.filter(weekPicks, (one) => one.is_captain)[0]
                // calculate your best performer
                const bestPerformer = _.maxBy(weekPicks, (one) => playerPoints[weekId][one.id])
                return (
                  <Tr>
                    <Td>{weekId + 1}</Td>
                    <Td>{getNameAndPoints(captain.id, weekId)}</Td>
                    <Td>{getNameAndPoints(bestPerformer.id, weekId)}</Td>
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        )}
      </VStack>
    </Container>
  )
}

export default User