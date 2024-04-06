import axios from 'axios';

export default async function handler(req, res) {
  const { address } = req.query;

  try {
    const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?proximity=ip&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`);
    res.status(200).json(response.data);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error fetching data' });
  }
}
