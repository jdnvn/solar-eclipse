import styled from 'styled-components';

export const PanelContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  bottom: 20px;
  left: auto;
  width: 20%;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
  backdrop-filter: blur(5px);

  @media (max-width: 1000px) {
    display: none;
  }
`;

export const PanelContent = styled.div`
  margin-top: 50px;
  width: 100%;
  padding: 0 2em 2em 2em;
  text-align: center;
  overflow: auto;
  box-sizing: border-box;
  color: white;
`;
