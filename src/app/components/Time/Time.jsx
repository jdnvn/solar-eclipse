import { TimeData, TimeTitle, TimeContainer } from "./styles";

const Time = ({ title, time }) => {
  return (
    <TimeContainer>
      <TimeTitle>{title}</TimeTitle>
      <TimeData>{time}</TimeData>
    </TimeContainer>
  )
};

export default Time;
