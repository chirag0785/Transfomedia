
"use client"; // Mark this component as a Client Component

import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";
import {metadata} from "@/metadata/metadata"
const IBMPlex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex',
});



export default function RootLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  return (
    <ClerkProvider
      afterSignOutUrl="/home"
      afterMultiSessionSingleSignOutUrl="/home"
      appearance={{ variables: { colorPrimary: '#624cf5' } }}
    >
      <html lang="en">
        <body className={cn("font-IBMPlex antialiased", IBMPlex.variable)}>
          {path === '/' && <Navbar />}
          {children}
          {path === '/' && <Footer />}
          <Toaster />
        </body>
        <script async src="https://js.stripe.com/v3/buy-button.js"></script>
      </html>
    </ClerkProvider>
  );
}

