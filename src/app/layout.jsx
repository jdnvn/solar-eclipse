import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Solar Eclipse Map",
  description: "A total solar eclipse is coming on April 8, 2024. Find out where you can see it!",
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
      <meta content="#000000" name="theme-color" />
    </html>
  );
}
