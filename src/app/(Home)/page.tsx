"use client";

import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import ParticlesWaveBackground from "./_components/ParticlesWaveBackground";
import NavigationHeader from "@/components/NavigationHeader";
import { motion } from "framer-motion";
import { FEATURES } from "./_constants/feature";
import FeatureCard from "./_components/FeatureCard";
import CodeEditor from "./_components/CodeEditor";
import TestimonialSlider from "./_components/TestimonialSlider";
import { Rocket } from "lucide-react";


const Home: FC = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative flex-1"
    >
      {/* Background container */}
      <div className="absolute inset-0">
        <ParticlesWaveBackground containerId="landing-background" />
      </div>

      <NavigationHeader />

      <main className="relative pt-32 pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-24"
          >
            <div className="relative inline-block">
              <div className="absolute -inset-px bg-gradient-to-r from-blue-500 to-purple-500 blur-xl opacity-10" />
              <motion.h1
                className="relative text-5xl md:text-6xl lg:text-7xl font-semibold bg-gradient-to-r
                           from-gray-100 to-gray-300 text-transparent bg-clip-text mb-8"
                animate={{ opacity: [0, 1] }}
                transition={{ duration: 1 }}
              >
                Code Smarter with
                <br />
                AI-Powered Intelligence
              </motion.h1>
            </div>

            <motion.p
              className="text-xl text-gray-400 max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Experience the future of coding with real-time AI assistance,
              instant error detection, and seamless code sharing capabilities
            </motion.p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={() => router.push("/editor")}
              className="px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium 
              transition-all duration-300 hover:transform hover:scale-105 
              hover:shadow-lg hover:shadow-blue-500/50"
            >
              Try Editor Now
            </motion.button>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24"
          >
            {FEATURES.map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <FeatureCard {...feature} delay={index * 100} />
              </motion.div>
            ))}
          </motion.div>

          {/* Code Editor Demo */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-24"
          >
            <h2 className="text-3xl font-semibold text-white text-center mb-12">
              Editor
            </h2>
            <div className="max-w-4xl mx-auto">
              <CodeEditor />
            </div>
          </motion.div>

          {/* Testimonials */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-24"
          >
            <h2 className="text-3xl font-semibold text-white text-center mb-12">
              What Developers Say
            </h2>
            <TestimonialSlider />
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl font-semibold text-white mb-6">
              Ready to Code Smarter?
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={() => router.push("/editor")}
              className="px-8 py-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 
                       text-white font-medium hover:opacity-90 transition-all duration-300 
                       hover:transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20"
            >
              <span className="flex items-center gap-2 justify-center">
                Start Coding Now
                <Rocket className="w-5 h-5 animate-bounce" />
              </span>
            </motion.button>
          </motion.div>
        </div>
      </main>
    </motion.div>
  );
};

export default Home;