import { configureStore } from "@reduxjs/toolkit";
import codeEditorSlice from "./slices/codeEditorSlice"; 
import snippetSlice from "./slices/snippetSlice"; 

const store = configureStore({
  reducer: {
    codeEditor: codeEditorSlice,
    snippets: snippetSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore actions and state containing the `editor` object
        ignoredActions: ['codeEditor/setEditor'], 
        ignoredPaths: ['codeEditor.editor'],
      },
    }),
});

export default store;





























// import { configureStore } from "@reduxjs/toolkit";
// import codeEditorReducer from "./slices/codeEditorSlice";
// import snippetSlice from "./slices/snippetSlice";

// // configureStore with serializabilityCheck set to false for the `editor` field
// const store = configureStore({
//   reducer: {
//     codeEditor: codeEditorReducer,
//     snippets: snippetSlice,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         // Ignore actions and state containing the editor object
//         ignoredActions: ['codeEditor/setEditor'],
//         ignoredPaths: ['codeEditor.editor'],
//       },
//     }),
// });

// export default store;