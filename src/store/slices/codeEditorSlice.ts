"use client";

import { LANGUAGE_CONFIG } from "@/app/editor/_constants";
import { CodeEditorState } from "@/types";
import { createSlice, Dispatch } from "@reduxjs/toolkit";

const getInitialState = () => {
  if (typeof window === "undefined") {
    return {
      language: "javascript",
      fontSize: 16,
      theme: "vs-dark",
      output: "",
      isRunning: false,
      error: null,
      editor: null,
      executionResult: null,
    };
  }

  const savedLanguage = localStorage.getItem("editor-language") || "javascript";
  const savedTheme = localStorage.getItem("editor-theme") || "vs-dark";
  const savedFontSize = localStorage.getItem("editor-font-size") || 16;

  return {
    language: savedLanguage,
    theme: savedTheme,
    fontSize: Number(savedFontSize),
    output: "",
    isRunning: false,
    error: null,
    editor: null,
    executionResult: "",
  };
};

const codeEditorSlice = createSlice({
  name: "codeEditor",
  initialState: getInitialState(),
  reducers: {
    setEditor: (state, action) => {
      const editor = action.payload;
      const savedCode = localStorage.getItem(`editor-code-${state.language}`);
      if (savedCode) {
        editor.setValue(savedCode);
      }
      state.editor = editor;
    },
    setTheme(state, action) {
      localStorage.setItem("editor-theme", action.payload);
      state.theme = action.payload;
    },
    setFontSize(state, action) {
      localStorage.setItem("editor-font-size", action.payload.toString());
      state.fontSize = action.payload;
    },
    setLanguage(state, action) {
      const currentCode = state.editor?.getValue();
      if (currentCode) {
        localStorage.setItem(`editor-code-${state.language}`, currentCode);
      }
      localStorage.setItem("editor-language", action.payload);
      state.language = action.payload;
      state.output = "";
      state.error = null;
    },
    setOutput(state, action) {
      state.output = action.payload;
    },
    setIsRunning(state, action) {
      state.isRunning = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setExecutionResult(state, action) {
      state.executionResult = action.payload;
    },
  },
});

export const {
  setEditor,
  setTheme,
  setFontSize,
  setLanguage,
  setOutput,
  setIsRunning,
  setError,
  setExecutionResult,
} = codeEditorSlice.actions;

export default codeEditorSlice.reducer;

// Async function to run the code
export const runCode = () => async (dispatch: Dispatch, getState: () => CodeEditorState) => {
  const state = getState().codeEditor;
  const { language, editor } = state;
  const code = editor?.getValue() || "";

  if (!code) {
    dispatch(setError("Please enter some code"));
    return;
  }

  dispatch(setIsRunning(true));
  dispatch(setError(null));
  dispatch(setOutput(""));

  try {
    const runtime = LANGUAGE_CONFIG[language].pistonRuntime;
    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: runtime.language,
        version: runtime.version,
        files: [{ content: code }],
      }),
    });

    const data = await response.json();

    if (data.message) {
      dispatch(setError(data.message));
      const executionResult = { code, output: "", error: data.message };
      dispatch(setExecutionResult(executionResult));
      return executionResult;  // Return result immediately
    }

    if (data.compile && data.compile.code !== 0) {
      const error = data.compile.stderr || data.compile.output;
      dispatch(setError(error));
      const executionResult = { code, output: "", error };
      dispatch(setExecutionResult(executionResult));
      return executionResult;  // Return result immediately
    }

    if (data.run && data.run.code !== 0) {
      const error = data.run.stderr || data.run.output;
      dispatch(setError(error));
      const executionResult = { code, output: "", error };
      dispatch(setExecutionResult(executionResult));
      return executionResult;  // Return result immediately
    }

    const output = data.run.output;
    const executionResult = { code, output: output.trim(), error: null };
    dispatch(setOutput(output.trim()));
    dispatch(setExecutionResult(executionResult));
    return executionResult;  // Return result immediately
  } catch (error) {
    dispatch(setError("Error running code"));
    const executionResult = { code, output: "", error: "Error running code" };
    dispatch(setExecutionResult(executionResult));
    return executionResult;  // Return result immediately
  } finally {
    dispatch(setIsRunning(false));
  }
};