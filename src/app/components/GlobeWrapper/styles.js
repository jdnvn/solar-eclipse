import styled from 'styled-components';
import { FaSearch, FaTimes } from "react-icons/fa";

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

export const SearchBarContainer = styled.div`
  position: relative;
  width: 500px;
  border: none;
  border-radius: 20px;
  background-color: rgba(0, 0, 0, 0.5);

  @media (max-width: 1000px) {
    width: 90%;
  }
`;

export const SearchBar = styled.input`
  padding: 10px 40px 10px 20px;
  margin-left: 10px;
  width: 100%;
  color: #fff;
  font-size: 16px;
  outline: none;
  background-color: transparent;
  border: none;
  touch-action: manipulation;

  &::placeholder {
    color: #bababa;
    text-align: center;
  }
`;

export const SearchIcon = styled(FaSearch)`
  position: absolute;
  top: 50%;
  left: 10px; /* Adjusted left position */
  transform: translateY(-50%);
  color: #fff;
  cursor: pointer;
  z-index: 2; /* Ensure the icon is above the input */
`;

export const ClearButton = styled(FaTimes)`
  position: absolute;
  top: 50%;
  right: 10px; /* Adjusted right position */
  transform: translateY(-50%);
  color: #fff;
  cursor: pointer;
  z-index: 2; /* Ensure the button is above the input */
`;

export const SelectedLocation = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  backdrop-filter: blur(5px);
  padding: 10px;
  color: white;
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
  color: white;
`;

export const FunFactContainer = styled.div`
  font-size: 12px;
  color: white;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.25);
  margin-top: 10px;
  padding: 1em;
`;
