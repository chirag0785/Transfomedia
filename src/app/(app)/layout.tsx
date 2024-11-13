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
        
       
            <Sidebar />
       

        
        <main className="flex-1 md:p-6 p-1 bg-[#E6E6FA] shadow-lg rounded-lg sm:m-4 w-full">
            {children}
        </main>
    </div>
    <Toaster/>
    <Footer/>
</div>
  );
}
