import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pokémon Search | ค้นหาโปเกมอนทุกตัว",
  description: "ค้นหาและดูข้อมูล Pokémon กว่า 1000 ตัว พร้อม Stats, Abilities, Evolution Chain และอื่นๆ อีกมากมาย",
  keywords: ["Pokemon", "Pokémon", "Pokedex", "โปเกมอน", "ค้นหา", "Search", "GraphQL", "PokeAPI"],
  authors: [{ name: "Bbest" }],
  creator: "Bbest",
  metadataBase: new URL("https://search-pokemon-fm-tech-six.vercel.app"),
  openGraph: {
    type: "website",
    locale: "th_TH",
    url: "https://search-pokemon-fm-tech-six.vercel.app",
    siteName: "Pokémon Search",
    title: "Pokémon Search | ค้นหาและดูข้อมูลโปเกมอนทุกตัว",
    description: "ค้นหาและดูข้อมูล Pokémon กว่า 1000 ตัว พร้อม Stats, Abilities, Evolution Chain และอื่นๆ อีกมากมาย ลองเลย!",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pokémon Search | ค้นหาและดูข้อมูลโปเกมอนทุกตัว",
    description: "ค้นหาและดูข้อมูล Pokémon กว่า 1000 ตัว พร้อม Stats, Abilities, Evolution Chain และอื่นๆ อีกมากมาย",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
