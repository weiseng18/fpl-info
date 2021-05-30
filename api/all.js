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

/**
 * GET /api/user/id
 *
 * Returns array of objects with the following properties
 * - season_name: name of the season
 * - total_points: total points earned within the season
 * - rank: overall rank for the season
 */
export const overallSeasonData = async (req, res) => {
  // unpack params
  const id = req.query.id

  // build query to FPL
  const url = `http://fantasy.premierleague.com/api/entry/${id}/history/`
  const options = {
    headers: { 'User-Agent':'Axios 0.21.1' }
  }
  const query = await axios.get(url, options)

  // overall season data
  // [season_name, total_points, rank]
  const overallData = query.data.past
  res.send(overallData)
}