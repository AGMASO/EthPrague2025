import type { Metadata } from "next";
import localFont from "next/font/local";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Providers from "@/context/providers";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "BlockscoutInspector",
  description:
    "A way to get onchain realtime human readdable information using AI, thanks to MCP ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
