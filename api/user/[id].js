import axios from "axios"

module.exports = async (req, res) => {
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