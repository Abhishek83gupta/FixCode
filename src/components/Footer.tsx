import { Blocks, Github, Twitter, Linkedin, Mail } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  const socialLinks = [
    { icon: Github, href: "https://github.com/Abhishek83gupta", label: "GitHub" },
    { icon: Twitter, href: "https://x.com/unkown_abhi_31?t=YRQjk3mS4urV2kJHJWm4cQ&s=08", label: "Twitter" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/abhishek-gupta-83a410295/", label: "LinkedIn" },
    { icon: Mail, href: "mailto:abhishekgupta3104@gmail.com", label: "Email" } 
];

  return (
    <footer className="relative border-t border-gray-800/50">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col gap-8">
          {/* Mobile Layout (Centered) */}
          <div className="flex flex-col items-center text-center sm:hidden">
            {/* Brand Section */}
            <div className="mb-6">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="p-1.5 bg-blue-500/10 rounded-lg">
                  <Blocks size={20} className="text-blue-400" />
                </div>
                <span className="font-medium text-gray-200">FixCode AI</span>
              </div>
              <p className="text-gray-400 text-sm max-w-sm">
                Built for developers, by developers.
                <br />
                Empowering better code every day.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 mb-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 
                           rounded-lg transition-all duration-300"
                  aria-label={label}
                >
                  <Icon size={20} />
                </Link>
              ))}
            </div>

            {/* Copyright */}
            <div className="text-gray-400 text-sm space-y-1">
              <p>© {new Date().getFullYear()} FixCode AI</p>
              <p>All Rights Reserved</p>
            </div>
          </div>

          {/* Desktop/Tablet Layout */}
          <div className="hidden sm:flex sm:flex-row justify-between items-center">
            {/* Left Side - Brand Section */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-1.5 bg-blue-500/10 rounded-lg">
                  <Blocks size={20} className="text-blue-400" />
                </div>
                <span className="font-medium text-gray-200">FixCode AI</span>
              </div>
              <p className="text-gray-400 text-sm max-w-sm">
                Built for developers, by developers.
                <span className="hidden md:inline"> Empowering better code every day.</span>
              </p>
            </div>

            {/* Right Side - Social Links and Copyright */}
            <div className="flex items-center gap-6">
              {/* Social Links */}
              <div className="flex items-center gap-3">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <Link
                    key={label}
                    href={href}
                    className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 
                             rounded-lg transition-all duration-300"
                    aria-label={label}
                  >
                    <Icon size={18} />
                  </Link>
                ))}
              </div>
              
              {/* Divider */}
              <div className="h-6 w-px bg-gray-800/50" />

              {/* Copyright */}
              <div className="text-gray-400 text-sm">
                <p className="whitespace-nowrap">
                  © {new Date().getFullYear()} FixCode AI.
                  <span className="ml-1">All Rights Reserved</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;