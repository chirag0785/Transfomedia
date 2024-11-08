"use client";
import Link from "next/link";
import React from "react";
import { Coins, Home, Share2, Upload } from "lucide-react";
import { ImagePlus, Image as ImageIcon, Sliders, Filter } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center justify-center">
        <label
          htmlFor="my-drawer-2"
          className="btn bg-purple-600 hover:bg-purple-700 text-white drawer-button lg:hidden fixed top-4 left-4 z-50"
        >
          Open drawer
        </label>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-gradient-to-b from-purple-100 to-blue-50 text-gray-800 min-h-full w-80 p-4 space-y-2 shadow-xl border-r border-gray-200">
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
    </div>
  );
};

export default Sidebar;