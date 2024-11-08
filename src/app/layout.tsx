
"use client"; // Mark this component as a Client Component

import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";
import {metadata} from "@/metadata/metadata"


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  return (
    <ClerkProvider
      afterSignOutUrl="/home"
      afterMultiSessionSingleSignOutUrl="/home"
      appearance={{ variables: { colorPrimary: '#624cf5' } }}
    >
      <html lang="en">
            <head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body style={{ fontFamily: 'Poppins, sans-serif' }}>
                {children}
                {path === '/' && <Footer />}
                <Toaster />
                <script async src="https://js.stripe.com/v3/buy-button.js"></script>
            </body>
        </html>
    </ClerkProvider>
  );
}

