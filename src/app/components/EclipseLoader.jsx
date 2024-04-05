import React from 'react';
import styled, { keyframes } from 'styled-components';

const eclipse = keyframes`
  0% { left: -100px; }
  100% { left: 100px; }
`;

const Loader = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #fff;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    width: 100px;
    height: 100px;
    background: #000;
    border-radius: 50%;
    left: -100px;
    animation: ${eclipse} 4s linear infinite;
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  overflow: hidden;
`;

const EclipseLoader = () => (
  <Container>
    <Loader />
  </Container>
);

export default EclipseLoader;
