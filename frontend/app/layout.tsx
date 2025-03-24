import { Header } from "@/components/layout/header";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ReduxProvider } from "@/redux/provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AcademicX - Modern Learning Platform",
  description: "A modern platform for academic course management and learning",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ReduxProvider>
          <AuthProvider>
            <Header />
            <main className="flex-1">{children}</main>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
