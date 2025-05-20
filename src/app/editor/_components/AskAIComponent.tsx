import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy } from "lucide-react";
import OutputPanel from "./OutputPanel";
import axios from "axios";

const AskAIComponent = ({ errorMessage }: { errorMessage: string }) => {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [parsedResponse, setParsedResponse] = useState<Array<{ type: 'text' | 'code', content: string, language?: string }>>([]);
  const [hasError, setHasError] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    setHasError(!!errorMessage);
  }, [errorMessage]);

  const cleanMarkdown = (text: string) => {
    // Remove Markdown headers (###) and emphasis markers (***)
    return text
      .replace(/#{1,6}\s/g, '')  // Remove headers
      .replace(/\*{3}(.*?)\*{3}/g, '$1')  // Remove bold-italic markers
      .replace(/\*{2}(.*?)\*{2}/g, '$1')  // Remove bold markers
      .replace(/\*(.*?)\*/g, '$1');  // Remove italic markers
  };

const handleAskAI = async () => {
  setLoading(true);
  setResponse("");
  try {
    // Call the Next.js API route using axios
    const apiResponse = await axios.post('/api/ask-ai', {
      errorMessage
    });
    const { data }= apiResponse.data;
    
    // Clean the response before setting it
    setResponse(cleanMarkdown(data));
  } catch (error) {
    console.error('Error asking AI:', error);
    setResponse("Sorry, there was an error getting the AI's response.");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (errorMessage && hasError) {
      handleAskAI();
    }
  }, [errorMessage, hasError]);

  const parseResponse = () => {
    const parts = response.split(/(```[\s\S]*?```)/);
    const parsed = parts.map(part => {
      if (part.startsWith('```')) {
        const match = part.match(/```(\w*)\n([\s\S]*?)```/);
        if (match) {
          return {
            type: 'code' as const,
            language: match[1] || 'plaintext',
            content: match[2].trim()
          };
        }
        return {
          type: 'code' as const,
          language: 'plaintext',
          content: part.replace(/```\n?/, '').replace(/```$/, '').trim()
        };
      }
      return {
        type: 'text' as const,
        content: part.trim()
      };
    });
    return parsed.filter(part => part.content);
  };

  const animateParsedResponse = async () => {
    const parsed = parseResponse();
    for (let i = 0; i < parsed.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setParsedResponse(prev => [...prev, parsed[i]]);
    }
  };

  useEffect(() => {
    if (!response) return;
    setParsedResponse([]);
    animateParsedResponse();
  }, [response]);

  const handleCopyCode = (index: number, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!hasError) {
    return <OutputPanel />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-[#181825] rounded-xl p-4 ring-1 ring-gray-800/50 shadow-lg h-[680px] flex flex-col"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <motion.span
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-sm font-medium text-gray-300 bg-gray-700/50 px-3 py-1 rounded-full"
          >
            Ask AI for Help
          </motion.span>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        {loading && (
          <div className="flex-1 flex justify-center items-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"
            />
          </div>
        )}

        <div className="flex-1 overflow-y-auto custom-scrollbar mt-4 min-h-0">
          <AnimatePresence>
            {parsedResponse.map((part, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-4"
              >
                {part.type === 'text' ? (
                  <div className="text-gray-300 whitespace-pre-wrap">{part.content}</div>
                ) : (
                  <div className="relative group">
                    <div className="absolute top-0 right-0 bg-gray-700/90 text-xs text-gray-300 px-2 py-1 rounded-tr-md rounded-bl-md">
                      {part.language}
                    </div>
                    <pre className="bg-[#1e1e2e] text-sm text-gray-300 p-4 rounded-md overflow-x-auto mt-6">
                      <code>{part.content}</code>
                    </pre>
                    <button
                      onClick={() => handleCopyCode(index, part.content)}
                      className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-200 bg-gray-800/50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {copiedIndex === index ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #2c2c3a;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4a4a5e;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #5a5a6e;
        }
      `}</style>
    </motion.div>
  );
};

export default AskAIComponent;