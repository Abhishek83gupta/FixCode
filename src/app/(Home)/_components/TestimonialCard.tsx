"use client";

import { FC } from "react";

interface TestimonialCardProps {
  author: string;
  role: string;
  content: string;
  delay?: number;
}

const TestimonialCard: FC<TestimonialCardProps> = ({ author, role, content, delay = 0 }) => (
  <div
    className="bg-[#12121a] rounded-xl p-6 border border-gray-800 hover:border-blue-500/20 
              transition-all duration-300 hover:transform hover:scale-30 hover:shadow-xl 
              hover:shadow-blue-500/10 animate-fade-in"
    style={{ animationDelay: `${delay}ms` }}
  >
    <p className="text-gray-300 mb-4">{content}</p>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 animate-pulse" />
      <div>
        <h4 className="text-white font-medium">{author}</h4>
        <p className="text-gray-400 text-sm">{role}</p>
      </div>
    </div>
  </div>
);

export default TestimonialCard;