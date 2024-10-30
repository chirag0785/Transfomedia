"use client";
import Link from "next/link";
import React from "react";
import { Home, Share2, Upload, ImagePlus } from "lucide-react";
import { FaHome, FaShareSquare, FaUpload, FaImage } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center justify-center">
        <label
          htmlFor="my-drawer-2"
          className="btn btn-primary drawer-button lg:hidden fixed top-4 left-4 z-50"
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
        <ul className="menu bg-gray-900 text-white min-h-full w-80 p-4 space-y-2 shadow-xl border-r border-gray-800">
          <li className="hover:bg-gray-800/80 rounded-lg transition-colors duration-200">
            <Link href="/home" className="flex items-center gap-3 px-4 py-3 w-full">
              <Home size={20} className="text-gray-400" />
              <span className="font-medium">Home</span>
            </Link>
          </li>
          <li className="hover:bg-gray-800/80 rounded-lg transition-colors duration-200">
            <Link href="/social-share" className="flex items-center gap-3 px-4 py-3 w-full">
              <Share2 size={20} className="text-gray-400" />
              <span className="font-medium">Social Share</span>
            </Link>
          </li>
          <li className="hover:bg-gray-800/80 rounded-lg transition-colors duration-200">
            <Link href="/video-upload" className="flex items-center gap-3 px-4 py-3 w-full">
              <Upload size={20} className="text-gray-400" />
              <span className="font-medium">Video Upload</span>
            </Link>
          </li>
          <li className="dropdown hover:bg-gray-800/80 rounded-lg transition-colors duration-200">
            <div
              tabIndex={0}
              role="button"
              className="flex items-center justify-between px-4 py-3 w-full cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <ImagePlus size={20} className="text-gray-400" />
                <span className="font-medium">Image Transformations</span>
              </div>
              <svg 
                className="w-4 h-4 text-gray-400 transition-transform duration-200 group-hover:rotate-180" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-gray-800 rounded-lg z-[1] w-full mt-2 p-2 space-y-1 shadow-lg border border-gray-700"
            >
              <li className="hover:bg-gray-700/80 rounded-md transition-colors duration-200">
                <Link
                  className="px-4 py-2 text-sm w-full"
                  href="/image-transformations/replace-background"
                >
                  Replace Background
                </Link>
              </li>
              <li className="hover:bg-gray-700/80 rounded-md transition-colors duration-200">
                <Link
                  className="px-4 py-2 text-sm w-full"
                  href="/image-transformations/grayscale"
                >
                  Grayscale
                </Link>
              </li>
              <li className="hover:bg-gray-700/80 rounded-md transition-colors duration-200">
                <Link
                  className="px-4 py-2 text-sm w-full"
                  href="/image-transformations/generative-restore"
                >
                  Generative Restore
                </Link>
              </li>
              <li className="hover:bg-gray-700/80 rounded-md transition-colors duration-200">
                <Link
                  className="px-4 py-2 text-sm w-full"
                  href="/image-transformations/generative-fill"
                >
                  Generative Fill
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;