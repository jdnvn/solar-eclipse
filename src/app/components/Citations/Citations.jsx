import { CitationContainer } from "./styles";

export default function Citations() {
  return (
    <CitationContainer>
      <p>
        Data from NASA (nasa.gov), US Astronomical Department (aa.usno.navy.mil) and OpenStreetMap (openstreetmap.org)
      </p>
      <p style={{ textDecoration: "underline" }}>
        <a href="https://github.com/jdnvn/solar-eclipse-map" target="_blank">Github repo</a>
      </p>
    </CitationContainer>
  );
}
