import { useEffect, useState } from "react";

export default function Countdown({ timeToEclipse }) {
  const [time, setTime] = useState(timeToEclipse);

  useEffect(() => {
    setTime(timeToEclipse)
    const interval = setInterval(() => {
      setTime((prevTime) => prevTime - 1000);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeToEclipse]);

  useEffect(() => {
    setTime(timeToEclipse);
  }, [timeToEclipse])

  const getFormattedTime = (time) => {
    let total_seconds = parseInt(Math.floor(time / 1000));
    let total_minutes = parseInt(Math.floor(total_seconds / 60));
    let total_hours = parseInt(Math.floor(total_minutes / 60));
    let days = parseInt(Math.floor(total_hours / 24));

    let seconds = parseInt(total_seconds % 60);
    let minutes = parseInt(total_minutes % 60);
    let hours = parseInt(total_hours % 24);

    return `${days > 0 ? `${days} days ` : ''}${hours > 0 ? `${hours} hours ` : ''}${minutes > 0 ? `${minutes} minutes and ` : ''}${seconds} seconds until eclipse begins!`
  };

  return (
    <p style={{ textAlign: 'center' }}>{getFormattedTime(time)}</p>
  );
}
