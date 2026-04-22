import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/header";
import Footer from "./components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { Chakra_Petch, Days_One } from "next/font/google";

const chakraPetch = Chakra_Petch({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin"],
  variable: "--font-chakra",
});

const daysOne = Days_One({
  weight: ['400'],
  subsets: ["latin"],
  variable: "--font-days",
});


export const metadata: Metadata = {
  title: "Acer Computer Store",
  description: "Acer Computer Store",
};

import Providers from "./components/Providers";
// import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${chakraPetch.variable} ${daysOne.variable} h-full antialiased`}
    >


      <body className="min-h-full flex flex-col bg-black">
        {/* <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        /> */}
        <Providers>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
