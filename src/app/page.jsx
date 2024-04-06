import GlobeWrapper from './components/GlobeWrapper/GlobeWrapper';
import { AI_FACTS } from './constants';

export default function Home() {
  function selectRandomElements(array, n) {
    if (n > array.length) {
      console.error("Error: n is greater than the length of the array");
      return null;
    }

    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array.slice(0, n);
  }

  const numberOfFacts = 4;
  const randomFacts = selectRandomElements(AI_FACTS, numberOfFacts);

  return (
    <main>
      <GlobeWrapper randomFacts={randomFacts}/>
    </main>
  );
}
