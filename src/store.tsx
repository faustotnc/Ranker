import { configureStore } from "@reduxjs/toolkit";
import appSettingsReducer from "./App/AppSettings.store";
import editorReducer from "./App/components/EditorSideBar/Editor.store";
import graphViewReducer from "./App/components/GraphView/GraphView.store";

export const store = configureStore({
   reducer: {
      editor: editorReducer,
      graphView: graphViewReducer,
      appSettings: appSettingsReducer,
   },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
