"use client";

import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { DumbbellIcon, UserIcon, ZapIcon } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <header className="fixed top-0 left-0 z-50 bg-background/60 backdrop-blur-md border-b border-border py-3 w-full">
      <div className="container mx-auto flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <div className="p-1 max-sm:pl-2 bg-primary/10 rounded shrink-0">
            <ZapIcon className="w-4 h-4 text-primary max-sm:w-5 max-sm:h-5" />
          </div>
          <span className="text-xl font-bold font-mono max-sm:hidden">
            FT<span className="text-primary">Assitant</span>.ai
          </span>
        </Link>

        {/* NAVIGATION */}
        <nav className="flex items-center gap-5 max-sm:pr-2">
          {isSignedIn ? (
            <>
              <Link
                href="/generate-program"
                className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors"
              >
                <DumbbellIcon size={16} className="sm:inline-block hidden" />
                <span>Generate</span>
              </Link>

              <Link
                href="/profile"
                className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors"
              >
                <UserIcon size={16} className="sm:inline-block hidden" />
                <span>My Program</span>
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <SignInButton>
                <Button
                  variant={"outline"}
                  className="border-primary/50 text-primary hover:text-white hover:bg-primary/10"
                >
                  Sign In
                </Button>
              </SignInButton>

              <SignUpButton>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Sign Up
                </Button>
              </SignUpButton>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
