import { useEffect, useState } from "react";
import Countdown from './Countdown';

export default function Times({ data }) {
  const [timeToEclipseInMs, setTimeToEclipseInMs] = useState(null);

  const calculateTimeToEclipseInMs = () => {
    const currentTime = new Date();
    const beginTime = new Date(`2024-04-08T${data.local_data[0].time}Z`);
    const timeToEclipseInMs = beginTime - currentTime;
    setTimeToEclipseInMs(timeToEclipseInMs);
  };

  useEffect(() => {
    calculateTimeToEclipseInMs();
  }, []);

  return (
    <>
      {timeToEclipseInMs && <Countdown timeToEclipse={timeToEclipseInMs}/>}
      <br/>
      {data.local_data.map((timeData) => {
        return (
          <p style={{ marginBottom: '10px' }} key={timeData.time}>{timeData.phenomenon} at<br />{new Date(`2024-04-08T${timeData.time}Z`).toLocaleTimeString()}</p>
        );
      })}
    </>
  );
}
