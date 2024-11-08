"use client"
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link';
import React from 'react'

const Navbar = () => {
    const { user } = useUser();

    return (
        <div className="fixed top-0 z-50 w-full border-b border-gray-800 bg-[#0F282B]/90 backdrop-blur-lg supports-[backdrop-filter]:bg-[#0F172A]/70">
            <div className="navbar px-4 md:px-6 max-w-7xl mx-auto h-16 flex items-center justify-between">
                {/* Logo */}
                <Link 
                    href={'/home'} 
                    className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent hover:from-indigo-300 hover:to-cyan-300 transition-colors duration-300"
                >
                    Transformify
                </Link>
                
                {/* User Info & Authentication */}
                <div className="flex items-center gap-4">
                    <SignedIn>
                        <div className="flex items-center gap-4">
                            {/* Display User Email */}
                            <span className="text-sm text-gray-400 hidden md:block hover:text-gray-300 transition-colors duration-200">
                                {user?.emailAddresses[0].emailAddress}
                            </span>
                            {/* User Avatar Button */}
                            <div className="relative inline-block">
                                <UserButton 
                                    appearance={{
                                        elements: {
                                            avatarBox: "w-9 h-9 rounded-full ring-2 ring-indigo-500/20 hover:ring-indigo-500/40 transition-all duration-200"
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </SignedIn>

                    <SignedOut>
                        {/* Sign-In Button */}
                        <SignInButton>
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.15)] hover:shadow-[0_0_25px_rgba(79,70,229,0.25)] transition-all duration-300">
                                Sign In
                            </button>
                        </SignInButton>
                    </SignedOut>
                </div>
            </div>
        </div>
    );
}

export default Navbar;