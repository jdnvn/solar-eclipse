import { useEffect, useState } from "react";
import Countdown from './Countdown';
import Time from "./Time/Time";

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
  }, [data]);

  return (
    <>
      {data.duration_of_totality && <Time key="duration_of_totality" time={data.duration_of_totality} title="Duration of Totality" />}
      {data.local_data.map((timeData) => {
        let localTime = new Date(`2024-04-08T${timeData.time}Z`).toLocaleTimeString();
        return (
          <Time key={timeData.time} time={localTime} title={timeData.phenomenon}  />
        );
      })}
    </>
  );
}
