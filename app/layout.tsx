import type { Metadata } from "next";
import { Bebas_Neue, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import CustomCursor from "@/components/CustomCursor";
import PageLoader from "@/components/PageLoader";
import { BikeProvider } from "@/lib/BikeContext";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Harley-Davidson — V-Rod Night",
  description: "Liquid-cooled. Street bred. Own the dark.",
  openGraph: {
    title: "Harley-Davidson V-Rod Night",
    description: "1250cc Revolution engine. Pure performance forged for asphalt.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${ibmPlexMono.variable}`}>
      <body className="bg-[#080808] text-white overflow-x-hidden cursor-none">
        <BikeProvider>
          <LenisProvider>
            <PageLoader />
            <CustomCursor />
            {children}
          </LenisProvider>
        </BikeProvider>
      </body>
    </html>
  );
}
