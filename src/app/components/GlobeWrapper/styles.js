import styled from 'styled-components';

export const PanelContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
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

export const PanelContent = styled.div`
  margin-top: 50px;
  width: 100%;
  padding: 0 2em 2em 2em;
  font-family: Arial, sans-serif;
  text-align: center;
  overflow: auto;
  box-sizing: border-box;
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


