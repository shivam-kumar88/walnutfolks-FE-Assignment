
import AnalyticsDashboard from "@/components/dashboard/AnalyticsDashboard";
import Link from "next/link";

export default function SuperBrynLandingPage() {
  
  return (
    <div className=" font-sans bg-[#0a0714] text-white selection:bg-[#8352FD] selection:text-white">
      
      <main className="relative min-h-[90vh] pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-linear-to-r from-[#140e2c] via-[#413c97] to-[#0A0714]">
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center flex flex-col items-center">
          <div className="text-[#38E8C6] text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-6 md:mb-8">
            Walnutfolks call Analytics charts
          </div>

          <h1 className="text-4xl md:text-4xl lg:text-6xl font-bold tracking-tight text-white mb-6 md:mb-8 leading-[1.1]">
            The web page would show  
             <span className="text-[#9D76F6] italic font-serif"> call analytics charts </span> for voice agents.
          </h1>

          <p className="text-base md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            SuperBryn is the evaluation and observability platform that helps you understand why your voice agents fail—and how to fix them.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button className="w-full cursor-pointer sm:w-auto bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-8 py-3.5 rounded-full font-medium transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
              Analyse Charts
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
              </svg>
            </button>
            
          </div>
        </div>
      </main>
      <div className=" py-12 md:py-16 bg-linear-to-br from-from-[#140e2c] to-[#413c97]">

          <AnalyticsDashboard/>
        </div>
    </div>
  );
}