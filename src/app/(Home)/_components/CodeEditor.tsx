"use client";

import React, { useState, useEffect } from "react";
import { Copy, Save, Rocket } from "lucide-react";

interface CodeEditorProps {}

const CodeEditor: React.FC<CodeEditorProps> = () => {
  const [code, setCode] = useState<string>(`// Welcome to our AI-powered editor!
// Try this example or write your own code

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Calculate first 5 Fibonacci numbers
for (let i = 0; i < 5; i++) {
  console.log(\`Fibonacci(\${i}) = \${fibonacci(i)}\`);
}`);
  const [output, setOutput] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [executionTime, setExecutionTime] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState<number>(0); // Used to trigger reset

  const runCode = () => {
    let outputChunks: string[] = [];
    let currentIndex = 0;

    setIsTyping(true); // Start the typing animation

    const timer = setTimeout(() => {
      try {
        const startTime = performance.now();
        const safeEval = new Function(
          "console",
          `
          let output = [];
          ${code}
          return output;
        `
        );

        const fakeConsole = {
          log: (...args: any[]) => outputChunks.push(args.join(" ")),
        };

        // Clear previous output and start collecting new output
        let output: string[] = [];
        safeEval(fakeConsole);
        const endTime = performance.now();
        setExecutionTime((endTime - startTime).toFixed(2));

        // Function to update output in chunks at 3-second intervals
        const interval = setInterval(() => {
          if (currentIndex < outputChunks.length) {
            output.push(outputChunks[currentIndex]);
            setOutput(output.map((line) => `→ ${line}`).join("\n"));
            currentIndex++;
          } else {
            clearInterval(interval);
            setOutput(
              (prevOutput) =>
                prevOutput +
                `\n\n✨ Code executed in ${(endTime - startTime).toFixed(2)}ms`
            );
            setIsTyping(false);
            setTimeout(() => {
              setOutput(""); // Clear output after a few seconds
              setResetKey((prevKey) => prevKey + 1); // Trigger reset by changing key
            }, 3000); // Wait for a few seconds before resetting
          }
        }, 3000); // Output updates every 3 seconds
      } catch (error: any) {
        setOutput(`❌ ${error.message}`);
        setIsTyping(false);
      }
    }, 1000); // Delay before starting the execution (to simulate typing)

    return () => clearTimeout(timer);
  };

  useEffect(() => {
    runCode(); // Start running the code whenever the component mounts or the code is updated
  }, [code, resetKey]); // Run when the code or reset key change

  return (
    <div className="relative rounded-xl overflow-hidden bg-[#1a1a2e] border border-gray-800 transform transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10">
      <div className="flex items-center justify-between px-4 py-2 bg-[#12121a] border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse delay-75" />
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse delay-150" />
        </div>
      </div>
      <div className="flex flex-col md:flex-row">
        <div className="flex-1 p-4">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-64 bg-transparent text-gray-300 font-mono text-sm resize-none focus:outline-none"
            spellCheck="false"
          />
        </div>
        <div className="flex-1 p-4 border-t md:border-l border-gray-800 bg-[#12121a]/50">
          <div className="relative">
            {isTyping && (
              <div className="absolute -left-4 top-0 w-2 h-2 bg-blue-500 rounded-full animate-ping" />
            )}
            <pre className="text-green-400 font-mono text-sm">{output}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
