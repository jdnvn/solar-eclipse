import styled from 'styled-components';

export const PanelContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 2em;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: Arial, sans-serif;
  z-index: 1;

  @media (min-width: 1000px) {
    top: 20px;
    right: 20px;
    bottom: 20px;
    left: auto;
    width: 20%;
    border-radius: 10px;
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

export const PanelContent = styled.div`
  text-align: center;
`;
