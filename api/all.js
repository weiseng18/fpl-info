import axios from "axios"

/**
 * API code can be hard to manage if each endpoint's method is defined in individual files.
 *
 * According to https://vercel.com/support/articles/how-can-i-use-files-in-serverless-functions
 * it seems like it is not possible to import files in a Next.js SSR page.
 *
 * As such, all methods will be defined here, and imported from here into the individual files.
 * This causes a API call to /api/all to time out.
 */

const BASE_URL = "http://fantasy.premierleague.com/api"
const USER_AGENT = "Axios 0.21.1"

axios.defaults.baseURL = BASE_URL
axios.defaults.headers.common['User-Agent'] = USER_AGENT

/**
 * GET /api/users/:userId
 *
 * Returns array of objects with the following properties
 * - season_name: name of the season
 * - total_points: total points earned within the season
 * - rank: overall rank for the season
 */
export const overallSeasonData = async (req, res) => {
  // unpack params
  const userId = req.query.userId

  // build query to FPL
  const url = `/entry/${userId}/history/`
  const query = await axios.get(url)

  // overall season data
  // [season_name, total_points, rank]
  const overallData = query.data.past

  // commas as thousands delimiter
  const rankCommas = overallData.map((one) => ({
    ...one,
    rank: one.rank.toLocaleString()
  }))
  res.send(rankCommas)
}

/**
 * GET /api/players/names
 *
 * Returns dictionary, mapping player ID to name
 */
export const playerNames = async (req, res) => {
  // build query to FPL
  const url = '/bootstrap-static/'
  const query = await axios.get(url)

  // players data stored in elements
  const players = query.data.elements

  const playerInfo = {}
  players.forEach((one) => {
    const web_name = one.web_name
    const id = one.id
    playerInfo[id] = web_name
  })
  res.send(playerInfo)
}

/**
 * GET /api/gameweeks/:gameweekId
 *
 * Returns dictionary, mapping player ID to points in that gameweek
 */
export const gameweekScores = async (req, res) => {
  // unpack params
  const gameweekId = req.query.gameweekId

  // build query to FPL
  const url = `/event/${gameweekId}/live/`
  const query = await axios.get(url)

  // players data stored in elements
  const players = query.data.elements

  const pointsInfo = {}
  players.forEach((one) => {
    const id = one.id
    const points = one.stats.total_points
    pointsInfo[id] = points
  })
  res.send(pointsInfo)
}

/**
 * GET /api/users/:userId/gameweeks/:gameweekId
 *
 * Returns array of objects, user picks for that gameweek
 * - id
 * - multiplier
 * - is_captain
 * - is_vice_captain
 */

export const userGameweekPicks = async (req, res) => {
  // unpack params
  const userId = req.query.userId
  const gameweekId = req.query.gameweekId

  // build query to FPL
  const url = `/entry/${userId}/event/${gameweekId}/picks/`
  const query = await axios.get(url)

  // picks stored in picks
  const picks = query.data.picks

  const picksInfo = picks.map((one) => ({
    id: one.element,
    multiplier: one.multiplier,
    is_captain: one.is_captain,
    is_vice_captain: one.is_vice_captain
  }))
  res.send(picksInfo)
}