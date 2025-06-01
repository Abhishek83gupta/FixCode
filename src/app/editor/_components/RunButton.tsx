"use client";

import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Loader2, Play } from "lucide-react";
import { CodeEditorState } from "@/types";
import { runCode, setExecutionResult, setIsRunning, setOutput } from "@/store/slices/codeEditorSlice";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from 'sonner'

function RunButton() {
  const isRunning = useSelector((state: CodeEditorState) => state.codeEditor.isRunning);
  const language = useSelector((state: CodeEditorState) => state.codeEditor.language);
  const dispatch = useDispatch();
  const { data: session } = useSession();

  const handleRun = async () => {
     if (!session?.user) {
      toast.error("Unauthorized! Please login to run code.");
      return;
    }

    const executionResult = await dispatch(runCode() as any);  // runCode returns execution result
    handleExecutionResult(executionResult);
  };

  const handleExecutionResult = async (executionResult : any) => {
    if (!executionResult) return;


    if (session?.user) {
      try {
        // Send execution result to your backend API
        await axios.post("/api/codeExecution", {
          language,
          code: executionResult.code,
          output: executionResult.output || "",
          error: executionResult.error || undefined,
        });

        // Update execution result in the store
        dispatch(setExecutionResult(executionResult));
      } catch (error) {
        console.error("Failed to save execution result:", error);
      }
    }
  };

  return (
        <motion.button
          onClick={handleRun}
          disabled={isRunning}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="group relative inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-5 sm:py-2 py-2 text-sm sm:text-base rounded-md sm:rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 shadow-md transition-all duration-300 disabled:cursor-not-allowed"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-md sm:rounded-lg opacity-100 transition-opacity group-hover:opacity-90" />
          <div className="relative flex items-center gap-2 sm:gap-3">
            {isRunning ? (
              <>
                <Loader2 className="w-4 sm:w-5 h-4 sm:h-5 animate-spin text-white/80" />
                <span className="text-white/90 font-medium">Run...</span>
              </>
            ) : (
              <>
                <Play className="w-4 sm:w-5 h-4 sm:h-5 text-white/90 transition-transform group-hover:scale-110" />
                <span className="text-white/90 font-medium group-hover:text-white">Run</span>
              </>
            )}
          </div>
        </motion.button>
      );
    }

export default RunButton;