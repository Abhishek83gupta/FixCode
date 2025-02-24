"use client";

import { FC } from "react";
import { Icon } from "lucide-react";

interface FeatureCardProps {
  icon: Icon;
  label: string;
  desc: string;
  delay?: number;
}

const FeatureCard: FC<FeatureCardProps> = ({ icon: Icon, label, desc, delay = 0 }) => (
  <div
    className="group relative bg-gradient-to-b from-[#12121a] to-[#0a0a0f] rounded-2xl p-6 
              hover:transform hover:scale-30 transition-all duration-300 animate-fade-in
              hover:shadow-xl hover:shadow-blue-500/10"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="relative">
      <div
        className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 
                    flex items-center justify-center mb-4 ring-1 ring-gray-800/60 
                    group-hover:ring-blue-500/20 transform group-hover:rotate-6 transition-all"
      >
        <Icon className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
      </div>
      <h3 className="text-lg font-medium text-white mb-2 group-hover:text-blue-400 transition-colors">
        {label}
      </h3>
      <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
        {desc}
      </p>
    </div>
  </div>
);

export default FeatureCard;
