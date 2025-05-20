"use client";

import { Blocks, Code2, Menu, X } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import LanguageSelector from "./LanguageSelector";
import RunButton from "./RunButton";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import HeaderProfileBtn from "./HeaderProfileBtn";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

function Header() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative z-50">
      <div className="flex items-center justify-between bg-[#0a0a0f]/80 backdrop-blur-xl p-4 sm:p-6 sm:mb-4 rounded-lg">
        <div className="flex items-center gap-4 sm:gap-8 w-full sm:w-auto">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3 group relative"
          >
            {/* Logo hover effect */}
            <div
              className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 
                group-hover:opacity-100 transition-all duration-500 blur-xl"
            />
            {/* Logo */}
            <div
              className="relative bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] p-1 sm:p-2 rounded-xl ring-1
              ring-white/10 group-hover:ring-white/20 transition-all"
            >
              <Blocks className="w-5 sm:w-6 h-5 sm:h-6 text-blue-400 transform -rotate-6 group-hover:rotate-0 transition-transform duration-500" />
            </div>
            <div className="flex flex-col">
              <span className="block text-sm sm:text-lg font-semibold bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 text-transparent bg-clip-text">
                FixCode AI
              </span>
              <span className="block text-xs sm:text-sm text-blue-400/60 font-medium">
                Interactive Code Editor
              </span>
            </div>
          </Link>

          {/* Snippets Link (Desktop View) */}
          <div className="hidden sm:block">
            <Link
              href="/snippets"
              className="relative group flex items-center gap-2 px-4 py-1.5 rounded-lg text-gray-300 bg-gray-800/50 
                hover:bg-blue-500/10 border border-gray-800 hover:border-blue-500/50 transition-all duration-300 shadow-lg overflow-hidden"
            >
              Snippets
              <Code2 className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Theme Selector (Desktop) */}
          <div className="hidden sm:block">
            <ThemeSelector />
          </div>

          {/* Language Selector (Desktop) */}
          <div className="hidden sm:block">
            <LanguageSelector />
          </div>

          {/* Desktop View: Show RunButton if logged in */}
          {session?.user && (
            <div className="hidden sm:block">
              <RunButton />
            </div>
          )}

          {/* Profile Button (Desktop) */}
          <div className="hidden sm:block">
            <HeaderProfileBtn />
          </div>

          {/* Mobile View (Main Header: RunButton and ProfileButton) */}
          {session?.user && (
            <div className="sm:hidden flex items-center gap-2 mt-2 w-full">
              {/* Adjust alignment for smaller screens */}
              <div className="w-full flex justify-between gap-2">
                <RunButton />
                <HeaderProfileBtn />
              </div>
            </div>
          )}

          {/* Mobile View */}
          <div className="sm:hidden flex items-center gap-3">
            {/* Login Button (Mobile) */}
            {!session?.user && (
              <Button
                onClick={() => signIn()}
                className="text-sm font-medium relative z-10 group-hover:text-white 
               hover:bg-blue-500/10 border border-gray-800 hover:border-blue-500/50 transition-all duration-300 shadow-lg overflow-hidden bg-gradient-to-r from-blue-500/10 
                to-purple-500/10"
              >
                Login
              </Button>
            )}

            {/* Menu Toggle with Animated Icon */}
           <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-400 hover:text-white p-2 rounded-lg sm:hidden relative z-50"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-red-500" />
              ) : (
                <Menu className="w-6 h-6 text-blue-500" />
              )}
            </button>

            {/* Mobile Dropdown Menu */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -10,
                    scale: 0.98,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    y: -10,
                    scale: 0.98,
                  }}
                  transition={{
                    type: "ease",
                    duration: 0.2,
                  }}
                  className="absolute top-16 right-4 bg-[#1e1e2e] p-4 rounded-lg shadow-2xl z-50 w-64 border border-blue-900/30"
                >
                  <div className="flex flex-col space-y-4">
                    {/* Theme Selector Section */}
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <h3 className="text-sm font-semibold text-blue-300 mb-2">
                        Theme
                      </h3>
                      <div className="w-full">
                        <ThemeSelector />
                      </div>
                    </div>

                    {/* Language Selector Section */}
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <h3 className="text-sm font-semibold text-blue-300 mb-2">
                        Language
                      </h3>
                      <div className="w-full">
                        <LanguageSelector />
                      </div>
                    </div>

                    {/* Snippets Link */}
                    <Link
                      href="/snippets"
                      className="flex items-center justify-between px-4 py-2 rounded-lg 
          text-gray-300 bg-gray-800/50 hover:bg-blue-500/10 
          border border-gray-800 hover:border-blue-500/50 
          transition-all duration-300 shadow-lg"
                    >
                      <span>Snippets</span>
                      <Code2 className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;