"use client";

import { Blocks, Code2, Sparkles } from "lucide-react";
import Link from "next/link";
import HeaderProfileBtn from "@/app/editor/_components/HeaderProfileBtn";
import { useSession } from "next-auth/react";

function NavigationHeader() {
  const { data:session } = useSession()
  return (
    <div className="sticky top-0 z-50 w-full border-b border-gray-800/50 bg-gray-950/80 backdrop-blur-xl backdrop-saturate-150">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-8 w-full sm:w-auto">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group relative">
              {/* Logo hover effect */}
              <div
                className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 
              group-hover:opacity-100 transition-all duration-500 blur-xl"
              />

              {/* Logo */}
              <div className="relative bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] p-1 sm:p-2 rounded-xl ring-1 ring-white/10 group-hover:ring-white/20 transition-all">
                <Blocks className="w-5 sm:w-6 h-5 sm:h-6 text-blue-400 transform -rotate-6 group-hover:rotate-0 transition-transform duration-500" />
              </div>

              <div className="relative">
                <span
                  className="block text-sm sm:text-lg font-semibold bg-gradient-to-r
                 from-blue-400 via-blue-300 to-purple-400 text-transparent bg-clip-text"
                >
                 FixCode AI
                </span>
                <span className="block text-xs sm:text-sm text-blue-400/60 font-medium">
                  Interactive Code Editor
                </span>
              </div>
            </Link>

            {/* Snippets Link */}
            {session?.user && (
               <Link
               href="/snippets"
               className="relative group flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg text-gray-300 bg-gray-800/50 hover:bg-blue-500/10 
               border border-gray-800 hover:border-blue-500/50 transition-all duration-300 shadow-lg overflow-hidden"
             >
               <div
                 className="absolute inset-0 bg-gradient-to-r from-blue-500/10 
               to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
               />
               <Code2 className="w-4 sm:w-5 h-4 sm:h-5 relative z-10 group-hover:rotate-3 transition-transform" />
               <span className="text-xs sm:text-sm font-medium relative z-10 group-hover:text-white transition-colors">
                 Snippets
               </span>
             </Link>
            )}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Profile Button */}
            <HeaderProfileBtn />

          </div>
        </div>
      </div>
    </div>
  );
}

export default NavigationHeader;