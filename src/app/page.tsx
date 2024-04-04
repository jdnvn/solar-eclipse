import Image from "next/image";
import styles from "./page.module.css";
import GlobeComponent from './components/GlobeComponent';

export default function Home() {
  return (
    <main>
      <GlobeComponent />
    </main>
  );
}
