import { configureStore } from "@reduxjs/toolkit";
import editorReducer from "./components/Editor/Editor.store";
import graphViewReducer from "./components/GraphView/GraphView.store";

export const store = configureStore({
   reducer: {
      editor: editorReducer,
      graphView: graphViewReducer,
   },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
