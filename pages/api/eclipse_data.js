import axios from 'axios';

export default async function handler(req, res) {
  console.log(`REQUEST RECEIVED: ${req}`)
  const { latitude, longitude } = req.query;

  try {
    const response = await axios.get(`https://aa.usno.navy.mil/api/eclipses/solar/date?date=2024-4-8&coords=${latitude},${longitude}&height=0`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data' });
  }
}
