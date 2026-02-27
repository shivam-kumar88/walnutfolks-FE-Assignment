import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

import StoreProvider from "@/store/StoreProvider";
import AuthModal from "@/components/modals/AuthModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "walnutfolks-fe-asign",
  description: "walnutfolks Frontend assignment for in next js with tailwind css along with superbase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      

      <body className={`${inter.className} bg-[#0a0714] text-white antialiased selection:bg-[#8352FD] selection:text-white flex flex-col min-h-screen`}>
        <StoreProvider>
        <Header />
        
        {/* 'flex-grow' ensures this main area expands to push the footer down if the page is short */}
        <main className="grow">
          {children}
        </main>

        <AuthModal />
        
        <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
