"use client"
import Link from 'next/link';
import { Linkedin, Mail, Heart } from 'lucide-react';
import { FaGithub, FaTwitter } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="w-full bg-[#0F172A] border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                            Transformify
                        </h2>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Transform your images with AI-powered tools. Create stunning visuals with our advanced image processing technology.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                                <FaGithub className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                                <FaTwitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                                <Linkedin className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                                <Mail className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/home"
                                    className="text-gray-400 hover:text-white text-sm transition-colors duration-200 hover:translate-x-1 transform inline-block"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/about"
                                    className="text-gray-400 hover:text-white text-sm transition-colors duration-200 hover:translate-x-1 transform inline-block"
                                >
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/usage-and-pricing"
                                    className="text-gray-400 hover:text-white text-sm transition-colors duration-200 hover:translate-x-1 transform inline-block"
                                >
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/contact"
                                    className="text-gray-400 hover:text-white text-sm transition-colors duration-200 hover:translate-x-1 transform inline-block"
                                >
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Features */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
                            Features
                        </h3>
                        <ul className="space-y-2">
                            {[
                                'Background Removal',
                                'Image Enhancement',
                                'Smart Cropping',
                                'Color Correction',
                                'Batch Processing'
                            ].map((feature) => (
                                <li key={feature}>
                                    <Link
                                        href="#"
                                        className="text-gray-400 hover:text-white text-sm transition-colors duration-200 hover:translate-x-1 transform inline-block"
                                    >
                                        {feature}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="text-gray-400 text-sm">
                            © {new Date().getFullYear()} Transformify. All rights reserved.
                        </div>
                        <div className="flex items-center space-x-6 text-sm text-gray-400">
                            <Link href="#" className="hover:text-white transition-colors duration-200">
                                Privacy Policy
                            </Link>
                            <Link href="#" className="hover:text-white transition-colors duration-200">
                                Terms of Service
                            </Link>
                            <div className="flex items-center space-x-1">
                                <span>Made with</span>
                                <Heart className="h-4 w-4 text-red-500 inline-block" />
                                <span>by Transformify</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;