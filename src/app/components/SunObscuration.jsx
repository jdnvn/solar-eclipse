export default function SunObscuration({ data }) {
  const sunRadius = 100;
  const moonRadius = sunRadius; // The moon and sun appear approximately the same size

  // Calculate the moon's x position based on the obscuration percentage
  const obscuration = parseFloat(data.obscuration.replace('%', ''));
  const moonX = 150 + (sunRadius * (1 - (obscuration / 100)));

  return (
    <svg width="300" height="300">
      <defs>
        <clipPath id="sunClip">
          <circle cx="150" cy="150" r={sunRadius} />
        </clipPath>
      </defs>
      <circle cx="150" cy="150" r={sunRadius} fill="yellow" />
      <circle cx={moonX} cy="150" r={moonRadius} fill="black" clipPath="url(#sunClip)" />
    </svg>
  );
}
