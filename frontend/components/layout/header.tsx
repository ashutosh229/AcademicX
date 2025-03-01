'use client';

import Link from 'next/link';
import { GraduationCap, UserCircle, LogOut } from 'lucide-react';
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';

export function Header() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const isStudent = session?.user?.role === 'student';

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">AcademicX</span>
          </Link>
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium hover:text-primary">
              Home
            </Link>
            <Link href={isAuthenticated ? "/courses" : "/"} className="text-sm font-medium hover:text-primary">
              Courses
            </Link>
            {isStudent && (
              <Link href="/profile/edit" className="text-sm font-medium hover:text-primary">
                Edit Profile
              </Link>
            )}
            <Link href="/about" className="text-sm font-medium hover:text-primary">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-primary">
              Contact
            </Link>
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
                      <AvatarFallback>
                        <UserCircle className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {session.user?.name && <p className="font-medium">{session.user.name}</p>}
                      {session.user?.email && (
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {session.user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  {isStudent && (
                    <DropdownMenuItem asChild>
                      <Link href="/profile">View Profile</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={(event) => {
                      event.preventDefault();
                      signOut({ callbackUrl: '/' });
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="default" size="sm" asChild>
                <Link href="/">
                  <UserCircle className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </Button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}