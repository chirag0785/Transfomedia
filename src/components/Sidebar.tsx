"use client";
import Link from "next/link";
import React, { useEffect, useState,useLayoutEffect } from "react";
import { Coins, Home, Share2, Upload, ImagePlus, Sliders, Filter } from "lucide-react";

const Sidebar = () => {
  
  const [isOpen, setIsOpen] = useState(true);
  useLayoutEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    setIsOpen(window.innerWidth >= 768);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      {/* Button to open sidebar */}
      <button
        onClick={toggleSidebar}
        type="button"
        hidden={isOpen}
        className="absolute top-20 left-4 z-10 p-2 w-10 h-10 text-sm text-black-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        id="default-sidebar"
        className={`fixed top-${window.innerWidth >= 768 ? "0" : "20"} left-0 z-20 lg:w-50 sm:w-1/3 text-black ${isOpen ? "block" : "hidden"} md:relative`  }
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <ul className="menu bg-gradient-to-b from-purple-100 to-blue-50 text-gray-800 min-h-full w-80 p-4 space-y-2 shadow-xl border-r border-gray-200">
            {/* Sidebar Links */}
            <li className="hover:bg-gradient-to-r from-purple-500 to-blue-500 hover:text-white rounded-lg transition-all duration-300">
              <Link href="/home" className="flex items-center gap-3 px-4 py-3 w-full">
                <Home size={20} className="text-indigo-600" />
                <span className="font-medium">Home</span>
              </Link>
            </li>
            <li className="hover:bg-gradient-to-r from-purple-500 to-blue-500 hover:text-white rounded-lg transition-all duration-300">
              <Link href="/social-share" className="flex items-center gap-3 px-4 py-3 w-full">
                <Share2 size={20} className="text-blue-500" />
                <span className="font-medium">Social Share</span>
              </Link>
            </li>
            <li className="hover:bg-gradient-to-r from-purple-500 to-blue-500 hover:text-white rounded-lg transition-all duration-300">
              <Link href="/video-upload" className="flex items-center gap-3 px-4 py-3 w-full">
                <Upload size={20} className="text-emerald-500" />
                <span className="font-medium">Video Upload</span>
              </Link>
            </li>
            <li className="hover:bg-gradient-to-r from-purple-500 to-blue-500 hover:text-white rounded-lg transition-all duration-300">
              <Link href="/image-transformations/replace-background" className="flex items-center gap-3 px-4 py-3 w-full">
                <ImagePlus size={20} className="text-pink-500" />
                <span className="font-medium">Replace Background</span>
              </Link>
            </li>
            <li className="hover:bg-gradient-to-r from-purple-500 to-blue-500 hover:text-white rounded-lg transition-all duration-300">
              <Link href="/image-transformations/generative-restore" className="flex items-center gap-3 px-4 py-3 w-full">
                <Sliders size={20} className="text-orange-500" />
                <span className="font-medium">Generative Restore</span>
              </Link>
            </li>
            <li className="hover:bg-gradient-to-r from-purple-500 to-blue-500 hover:text-white rounded-lg transition-all duration-300">
              <Link href="/image-transformations/generative-fill" className="flex items-center gap-3 px-4 py-3 w-full">
                <Filter size={20} className="text-teal-500" />
                <span className="font-medium">Generative Fill</span>
              </Link>
            </li>
            <li className="hover:bg-gradient-to-r from-purple-500 to-blue-500 hover:text-white rounded-lg transition-all duration-300">
              <Link href="/usage-and-pricing" className="flex items-center gap-3 px-4 py-3 w-full">
                <Coins size={20} className="text-yellow-500" />
                <span className="font-medium">Buy Credits</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Button to close the sidebar */}
        <button
          onClick={toggleSidebar}
          hidden={window.innerWidth >= 768}
          className={`absolute top-0 left-4 z-10 p-2 bg-red-500 text-white rounded-lg`}
        >
          X
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
