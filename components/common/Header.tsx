"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setAuthModalOpen, setUser } from "@/store/authSlice";
import { Zap } from "lucide-react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const dispatch = useDispatch();
  
  const supabase = getSupabaseBrowserClient();


  const user = useSelector((state: RootState) => state.auth.user);


  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signup");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      dispatch(setUser(session?.user ?? null));
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setUser(session?.user ?? null));
    });

    return () => subscription.unsubscribe();
  }, [dispatch, supabase.auth]);


  


  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const displayName = user?.user_metadata?.full_name 
    || user?.email?.split('@')[0] 
    || "User";

  return (
    <>
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out border-b border-transparent ${
        isScrolled
          ? "bg-[#0a0714]/10 backdrop-blur-md  py-3 shadow-lg"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 z-50">
            <Zap size={28} className="text-[#8B5CF6]" />
          <span className="text-xl font-medium tracking-tight text-white">WalnutFolks</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="#problem" className="text-gray-300 hover:text-white transition-colors">Problem</Link>
          <Link href="#capabilities" className="text-gray-300 hover:text-white transition-colors">Capabilities</Link>
          <Link href="#research" className="text-gray-300 hover:text-white transition-colors">Research</Link>
          <Link href="#faq" className="text-gray-300 hover:text-white transition-colors">FAQ</Link>
        </nav>

        {/* Header CTA & Mobile Toggle */}
        <div className="flex items-center gap-4">
        {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                <div className="w-8 h-8 rounded-full bg-[#8B5CF6] flex items-center justify-center font-bold">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <span>{displayName}</span>
              </div>
              <button onClick={handleLogout} className="text-xs text-gray-400 hover:text-white underline">
                Log out
              </button>
            </div>
          ) : (
            <button 
              onClick={() => dispatch(setAuthModalOpen(true))}
              className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-[0_0_15px_rgba(139,92,246,0.3)]"
            >
              Sign up / Log in
            </button>
          )}
          
          <button 
            className="md:hidden p-2 text-gray-300 hover:text-white z-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#0a0714]/95 backdrop-blur-xl border-b border-white/10 py-4 px-6 flex flex-col gap-4 md:hidden shadow-xl">
          <Link href="#problem" className="text-gray-300 hover:text-white transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>Problem</Link>
          <Link href="#capabilities" className="text-gray-300 hover:text-white transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>Capabilities</Link>
          <Link href="#research" className="text-gray-300 hover:text-white transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>Research</Link>
          <Link href="#faq" className="text-gray-300 hover:text-white transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>FAQ</Link>
          <button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-5 py-3 rounded-full text-sm font-medium transition-all mt-2 w-full">
            Book a Demo
          </button>
        </div>
      )}
    </header>


{isAuthModalOpen && !user && (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 transition-colors rounded-full hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        <div className="p-8 md:p-10">
          
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-2">
                Credentials
              </p>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                {authMode === "signup" ? "Create an account" : "Sign in to account"}
              </h2>
            </div>

            <div className="flex bg-gray-100 p-1 rounded-full border border-gray-200">
              <button
                type="button"
                onClick={() => setAuthMode("signup")}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
                  authMode === "signup" 
                    ? "bg-white text-gray-900 shadow-sm" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Sign up
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("signin")}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
                  authMode === "signin" 
                    ? "bg-white text-gray-900 shadow-sm" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Sign in
              </button>
            </div>
          </div>

          

        </div>
      </div>
    </div>
  )}
</>

  );
}