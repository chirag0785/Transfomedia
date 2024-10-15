"use client"
import Link from 'next/link'
import React from 'react'

const Sidebar = () => {
    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col items-center justify-center">
                <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">
                    Open drawer
                </label>
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                    <li><Link href="/home">Home</Link></li>
                    <li><Link href="/social-share">Social Share</Link></li>
                    <li><Link href="/video-upload">Video Upload</Link></li>
                </ul>
            </div>
        </div>
    )
}

export default Sidebar