import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Snippet {
  id: string;
  title: string;
  language: string;
  userName: string;
  createdAt: string; 
}

interface SnippetState {
  snippets: Snippet[];
}

const initialState: SnippetState = {
  snippets: [],
};

const snippetSlice = createSlice({
  name: "snippets",
  initialState,
  reducers: {
    addSnippet: (state, action: PayloadAction<Snippet[]>) => {
      state.snippets = action.payload;
    },
    
    removeSnippet: (state, action: PayloadAction<string>) => {
      state.snippets = state.snippets.filter(
        (snippet) => snippet.id !== action.payload
      );
    },
  },
});

export const { addSnippet, removeSnippet } = snippetSlice.actions;
export default snippetSlice.reducer;