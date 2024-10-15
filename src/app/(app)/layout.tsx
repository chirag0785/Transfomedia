import type { Metadata } from "next";
import '.././globals.css';
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function HomeLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-screen bg-gray-100">

            <div className="w-1/4 bg-gray-800 text-white p-6">
                <Sidebar />
            </div>

            <div className="flex-1 p-6">
                {children}
            </div>
        </div>


    );
}