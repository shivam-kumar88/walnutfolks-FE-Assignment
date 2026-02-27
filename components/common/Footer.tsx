import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#0a0a0a] py-12 md:py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2">
          {/* Logo Graphic */}
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Approximated Logo Graphic matching the header */}
            <circle cx="12" cy="12" r="2.5" fill="#ffffff" />
            <circle cx="6" cy="12" r="1.5" fill="#ffffff" opacity="0.6" />
            <circle cx="18" cy="12" r="1.5" fill="#ffffff" opacity="0.6" />
            <circle cx="12" cy="6" r="1.5" fill="#ffffff" opacity="0.8" />
            <circle cx="12" cy="18" r="1.5" fill="#ffffff" opacity="0.8" />
            {/* Corner dots to mimic the diamond shape in your screenshot */}
            <circle cx="8" cy="8" r="1" fill="#ffffff" opacity="0.5" />
            <circle cx="16" cy="8" r="1" fill="#ffffff" opacity="0.5" />
            <circle cx="8" cy="16" r="1" fill="#ffffff" opacity="0.5" />
            <circle cx="16" cy="16" r="1" fill="#ffffff" opacity="0.5" />
          </svg>
          
          {/* Text Logo */}
          <span className="text-2xl tracking-tight text-white">
            <span className="font-light">walnut</span>
            <span className="font-bold">folks</span>
          </span>
        </Link>

        {/* Links Section */}
        <div className="flex items-center gap-8">
          <Link 
            href="/contact" 
            className="text-gray-300 hover:text-white text-base font-medium transition-colors"
          >
            Contact
          </Link>
          <Link 
            href="https://linkedin.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-300 hover:text-white text-base font-medium transition-colors"
          >
            LinkedIn
          </Link>
        </div>

      </div>
    </footer>
  );
}