import ".././globals.css";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex pt-16 flex-col min-h-screen bg-gray-100">
            
    <Navbar />

    <div className="flex flex-1">
        
        <aside className="w-50 bg-[#cbc8e7f0] text-white hidden md:block">
            <Sidebar />
        </aside>

        
        <main className="flex-1 p-6 bg-[#E6E6FA] shadow-lg rounded-lg m-4">
            {children}
        </main>
    </div>
    <Toaster/>
    <Footer/>
</div>
  );
}
