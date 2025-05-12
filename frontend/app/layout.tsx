import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Session } from "next-auth";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

type RootLayoutProps = {
  children: React.ReactNode;
  session?: Session;
};

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IIT Bhilai Student Forum - Modern Platform for Course Management",
  description:
    "A centralized hub for IIT Bhilai students to access course insights, peer reviews, and shared academic resources.",
};

export default function RootLayout({ children, session }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Toaster />
        <Providers children={children} session={session}></Providers>
      </body>
    </html>
  );
}
