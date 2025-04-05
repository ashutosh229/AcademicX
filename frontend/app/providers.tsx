"use client";
import { AuthSync } from "@/components/auth/authSync";
import { Header } from "@/components/layout/header";
import { ReduxProvider } from "@/redux/provider";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

export default function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | undefined;
}) {
  return (
    <SessionProvider session={session}>
      <ReduxProvider>
        <AuthSync />
        <Header />
        <main className="flex-1">{children}</main>
      </ReduxProvider>
    </SessionProvider>
  );
}
