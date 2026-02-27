"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setAuthModalOpen, setUser } from "@/store/authSlice";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff } from "lucide-react"; // Importing icons for the password toggle
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";

export default function AuthModal() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.auth.isAuthModalOpen);
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);


  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setPassword("");
      setName("");
      setShowPassword(false);
      setAuthError(null);
    }
  }, [isOpen]);

  const supabase = getSupabaseBrowserClient();

  const handleAuth = async (e: React.FormEvent, mode: "signin" | "signup") => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: { full_name: name }
          }
        });
        
        if (error) throw error;
    
        if (data.user && data.user.identities && data.user.identities.length === 0) {
          throw new Error("This email is already registered. Please sign in instead.");
        }
        
        if (data.user) {
          alert("Check your email for the confirmation link!");
          dispatch(setAuthModalOpen(false));
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        
        if (data.user) {
          dispatch(setUser(data.user));
          dispatch(setAuthModalOpen(false));
        }
      }
    } catch (error: any) {
      // This will now catch both Supabase errors and our custom "already registered" error
      setAuthError(error.message);
    } finally {
      setLoading(false);
    }
  };

  
  if (user) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => dispatch(setAuthModalOpen(open))}>
        <DialogContent className="sm:max-w-[400px] p-8 bg-white border-0 shadow-2xl rounded-3xl text-center">
          <div className="sr-only">
            <DialogTitle>Already Logged In</DialogTitle>
            <DialogDescription>You are already authenticated.</DialogDescription>
          </div>
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">You are already logged in</h2>
          <p className="text-sm text-gray-500 mb-6">
            You are currently signed in as <span className="font-semibold text-gray-800">{user.email}</span>.
          </p>
          <button 
            onClick={() => dispatch(setAuthModalOpen(false))}
            className="w-full text-white bg-[#8B5CF6] hover:bg-[#7C3AED] font-medium rounded-xl text-sm px-5 py-3 transition-all"
          >
            Close Window
          </button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => dispatch(setAuthModalOpen(open))}>
      <DialogContent className="sm:max-w-[480px] p-0 bg-white border-0 shadow-2xl rounded-3xl overflow-hidden [&>button]:right-6 [&>button]:top-6">
        
        <div className="sr-only">
          <DialogTitle>Authentication</DialogTitle>
          <DialogDescription>Sign in or create an account</DialogDescription>
        </div>

        <Tabs defaultValue="signup" className="w-full">
          <div className="p-8 md:p-10 pb-0">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-2">
                  Credentials
                </p>
                <TabsContent value="signup" className="mt-0">
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Create an account</h2>
                </TabsContent>
                <TabsContent value="signin" className="mt-0">
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Sign in to account</h2>
                </TabsContent>
              </div>

              <TabsList className="bg-gray-100 p-1 rounded-full h-auto">
                <TabsTrigger value="signup" className="rounded-full px-4 py-1.5 text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-500">
                  Sign up
                </TabsTrigger>
                <TabsTrigger value="signin" className="rounded-full px-4 py-1.5 text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-500">
                  Sign in
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <div className="px-8 md:px-10 pb-10">
            {authError && (
              <div className="mb-5 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
                {authError}
              </div>
            )}

            {/* SIGN UP FORM */}
            <TabsContent value="signup" className="mt-0 space-y-5">
              <form onSubmit={(e) => handleAuth(e, "signup")} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text" required value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-[#8B5CF6] outline-none p-3.5 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-[#8B5CF6] outline-none p-3.5 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"} 
                      required value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-[#8B5CF6] outline-none p-3.5 pr-12 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full text-white bg-[#8B5CF6] hover:bg-[#7C3AED] font-medium rounded-xl text-sm px-5 py-4 mt-4 transition-all disabled:opacity-70">
                  {loading ? "Processing..." : "Create account"}
                </button>
              </form>
            </TabsContent>

            {/* SIGN IN FORM */}
            <TabsContent value="signin" className="mt-0 space-y-5">
              <form onSubmit={(e) => handleAuth(e, "signin")} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-[#8B5CF6] outline-none p-3.5 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"} 
                      required value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="Your password"
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-[#8B5CF6] outline-none p-3.5 pr-12 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full text-white bg-[#8B5CF6] hover:bg-[#7C3AED] font-medium rounded-xl text-sm px-5 py-4 mt-4 transition-all disabled:opacity-70">
                  {loading ? "Processing..." : "Sign in"}
                </button>
              </form>
            </TabsContent>

          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}