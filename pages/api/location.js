import axios from 'axios';

export default async function handler(req, res) {
  const { latitude, longitude } = req.query;

  try {
    const response = await axios.get(`http://nominatim.openstreetmap.org/reverse?format=json&zoom=18&addressdetails=1&lat=${latitude}&lon=${longitude}`);
    res.status(200).json(response.data);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error fetching data' });
  }
}
