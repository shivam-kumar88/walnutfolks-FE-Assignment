import React from "react";
import Link from "next/link";
import { Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#0a0a0a] py-12 md:py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2">
            <Zap size={28} className="text-[#8B5CF6]" />
          
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