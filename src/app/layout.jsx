import { Inter, Saira } from "next/font/google";
import "./globals.css";

const inter = Saira({ subsets: ["latin"], weight: '400',  });

export const metadata = {
  title: "Solar Eclipse Map",
  description: "A total solar eclipse is coming on April 8, 2024. Find out where you can see it!",
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
      <meta content="#2E4C6B" name="theme-color" />
      <meta property="og:image" content="https://raw.githubusercontent.com/jdnvn/solar-eclipse-map/main/public/preview.png" />
    </html>
  );
}
