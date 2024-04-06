import styled from 'styled-components';

export const TitleInfo = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  text-shadow: 2px 1px 2px rgb(0 0 0 / 100%);
`;

export const BackToCurrentLocationButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 100px;
  position: fixed;
  bottom: 70px;
  left: 20px;
  background-color: rgba(0, 0, 0, 0.5);;
  border: none;
  font-size: 20px;
  color: white;

  @media (min-width: 1000px) {
    bottom: 20px;
  }
`;

export const HeaderBar = styled.div`
  position: fixed;
  top: 20px;
  left: 0;
  right: 0;
  margin: auto;
  font-size: 15px;
  text-align: center;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

export const SelectedLocation = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  backdrop-filter: blur(5px);
  padding: 10px;
`;

export const GetDirectionsButton = styled(BackToCurrentLocationButton)`
  bottom: 130px;

  @media (min-width: 1000px) {
    bottom: 80px;
  }
`;

export const ClickMapTip = styled.div`
  font-size: 15px;
  text-shadow: 2px 1px 2px rgb(0 0 0 / 100%);
  text-align: center;
`;

export const FunFactContainer = styled.div`
  font-size: 12px;
  color: white;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.25);
  margin-top: 10px;
  padding: 1em;
`;
