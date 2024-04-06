import axios from 'axios';

export default async function handler(req, res) {
  const { latitude, longitude } = req.query;

  // because I'm lazy, pick a constant time
  const unixTime = new Date("2024-04-08T17:30Z").getTime() / 1000;
  try {
    const response = await axios.get(`https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${latitude}&lon=${longitude}&dt=${unixTime}&appid=${process.env.OPENWEATHER_API_KEY}`);
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching data' });
  }
};
