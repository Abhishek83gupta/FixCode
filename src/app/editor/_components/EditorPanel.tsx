"use client";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { defineMonacoThemes, LANGUAGE_CONFIG } from "../_constants";
import { Editor } from "@monaco-editor/react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  CheckCircle,
  Copy,
  RotateCcwIcon,
  ShareIcon,
  TypeIcon,
} from "lucide-react";
import { EditorPanelSkeleton } from "./EditorPanelSkeleton";
import useMounted from "@/hooks/useMounted";
import { CodeEditorState } from "@/types";
import { setEditor, setFontSize } from "@/store/slices/codeEditorSlice";
import { useSession } from "next-auth/react";
import ShareSnippetDialog from "./ShareSnippetDialog";

function EditorPanel() {
  const language = useSelector(
    (state: CodeEditorState) => state.codeEditor.language
  );
  const theme = useSelector((state: CodeEditorState) => state.codeEditor.theme);
  const fontSize = useSelector(
    (state: CodeEditorState) => state.codeEditor.fontSize
  );
  const editor = useSelector(
    (state: CodeEditorState) => state.codeEditor.editor
  );

  const dispatch = useDispatch();
  const { status } = useSession();
  const mounted = useMounted();
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const savedCode = localStorage.getItem(`editor-code-${language}`);
    const newCode = savedCode || LANGUAGE_CONFIG[language].defaultCode;
    if (editor) editor.setValue(newCode);
  }, [language, editor]);

  useEffect(() => {
    const savedFontSize = localStorage.getItem("editor-font-size");
    if (savedFontSize) dispatch(setFontSize(parseInt(savedFontSize)));
  }, [dispatch]);

  const handleRefresh = () => {
    const defaultCode = LANGUAGE_CONFIG[language].defaultCode;
    if (editor) editor.setValue(defaultCode);
    localStorage.removeItem(`editor-code-${language}`);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value) localStorage.setItem(`editor-code-${language}`, value);
  };

  const handleFontSizeChange = (newSize: number) => {
    const size = Math.min(Math.max(newSize, 12), 24);
    dispatch(setFontSize(size));
    localStorage.setItem("editor-font-size", size.toString());
  };

const handleCopyCode = async () => {
  try {
    if (!editor) {
      console.error("Editor is not initialized");
      return;
    }
    const code = editor.getValue();
    
    if (!code) {
      console.error("No code to copy");
      return;
    }
    
    // Try using clipboard API
    try {
      await navigator.clipboard.writeText(code);
    } catch (clipboardError) {
      // Fallback for browsers without clipboard API permission
      const textarea = document.createElement('textarea');
      textarea.value = code;
      textarea.style.position = 'fixed';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  } catch (error) {
    console.error("Failed to copy code:", error);
  }
};

  if (!mounted) return null;

  return (
    <div className="relative">
      <div className="relative bg-[#12121a]/90 backdrop-blur rounded-xl border border-white/[0.05] sm:p-6 p-3">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between mb-4 gap-4 sm:gap-6">
          {/* Left Section - Logo and Text */}
          <div className="flex items-center justify-center md:justify-start gap-3 flex-1">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1e1e2e] ring-1 ring-white/5">
              <Image
                src={"/" + language + ".png"}
                alt="Logo"
                width={24}
                height={24}
              />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-medium text-white">
                Code Editor
              </h2>
              <p className="text-xs text-gray-500">
                Write and execute your code
              </p>
            </div>
            {editor && (
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-400 hover:text-gray-300 bg-[#1e1e2e] 
            rounded-lg ring-1 ring-gray-800/50 hover:ring-gray-700/50 transition-all"
                >
                  {isCopied ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy
                    </>
                  )}
                </button>
              )}
          </div>

          {/* Right Section - Controls */}
          <div className="flex items-center gap-4 justify-center w-full sm:w-auto">
            {/* Font Size Slider */}
            <div className="flex items-center gap-3 px-2 py-1 sm:px-3 sm:py-2 bg-[#1e1e2e] rounded-lg ring-1 ring-white/5">
              <TypeIcon className="size-4 text-gray-400" />
              <div className="flex items-center gap-2 sm:gap-3">
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={fontSize}
                  onChange={(e) =>
                    handleFontSizeChange(parseInt(e.target.value))
                  }
                  className="w-16 sm:w-20 h-1 bg-gray-600 rounded-lg cursor-pointer"
                />
                <span className="text-sm sm:text-base font-medium text-gray-400 min-w-[2rem] text-center">
                  {fontSize}
                </span>
              </div>
            </div>

            {/* Reset Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="p-2 sm:p-2.5 bg-[#1e1e2e] hover:bg-[#2a2a3a] rounded-lg ring-1 ring-white/5 transition-colors"
              aria-label="Reset to default code"
            >
              <RotateCcwIcon className="size-4 sm:size-5 text-gray-400" />
            </motion.button>

            {/* Share Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsShareDialogOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 opacity-90 hover:opacity-100 transition-opacity"
            >
              <ShareIcon className="text-white w-5 h-5 sm:w-6 sm:h-6 md:h-7" />{" "}
              {/* Adjusted for small and medium devices */}
              <span className="text-xs sm:text-sm font-medium text-white">
                Share
              </span>
            </motion.button>
          </div>
        </div>

        {/* Editor */}
        <div className="relative group rounded-xl overflow-hidden ring-1 ring-white/[0.05]">
          <Editor
            height="600px"
            language={LANGUAGE_CONFIG[language].monacoLanguage}
            onChange={handleEditorChange}
            theme={theme}
            beforeMount={defineMonacoThemes}
            onMount={(editor) => {
              dispatch(setEditor(editor));
            }}
            options={{
              minimap: { enabled: false },
              fontSize,
              automaticLayout: true,
              scrollBeyondLastLine: false,
              padding: { top: 16, bottom: 16 },
              renderWhitespace: "selection",
              fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
              fontLigatures: true,
              cursorBlinking: "smooth",
              smoothScrolling: true,
              contextmenu: false,
              renderLineHighlight: "all",
              lineHeight: 1.6,
              letterSpacing: 0.5,
              roundedSelection: true,
              scrollbar: {
                verticalScrollbarSize: 8,
                horizontalScrollbarSize: 8,
              },
              lineNumbersMinChars: 1,
              lineDecorationsWidth: 10,   
              folding: false,
            }}
          />
          {status === "loading" && <EditorPanelSkeleton />}
        </div>
      </div>
      {isShareDialogOpen && (
        <ShareSnippetDialog onClose={() => setIsShareDialogOpen(false)} />
      )}
    </div>
  );
}

export default EditorPanel;
