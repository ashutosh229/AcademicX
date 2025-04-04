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
  title: "AcademicX - Modern Learning Platform",
  description: "A modern platform for academic course management and learning",
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
