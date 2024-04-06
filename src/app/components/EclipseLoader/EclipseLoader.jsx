import React from 'react';
import { Loader, Container } from './styles';

const EclipseLoader = () => (
  <Container>
    <h2 style={{ textAlign: 'center', color: "white" }}>Total Solar Eclipse</h2>
    <h4 style={{ margin: '5px 0 1em 0', textAlign: 'center', color: "#bababa" }}>April 8, 2024</h4>
    <Loader />
  </Container>
);

export default EclipseLoader;
