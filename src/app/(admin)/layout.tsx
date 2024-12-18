import type { Metadata } from "next";
import '.././globals.css';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import {metadata} from "@/metadata/metadata"


export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex pt-16 flex-col min-h-screen bg-gray-100">
            <Navbar />
            {children}
        </div>
    );
}
