import { useEffect, useMemo } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getDesignTokens } from "./theme";
import { Paper, Box, PaletteMode, CssBaseline, Drawer } from "@mui/material";
import { useAppDispatch, useAppSelector } from "./hooks";
import { addNamedNode, SingleInputNode } from "./components/EditorSideBar/Editor.store";
import { updateNetworkFromNodeList } from "./components/GraphView/GraphView.store";
import useMediaQuery from "@mui/material/useMediaQuery";
import "./App.scss";

// Sub-components
import Editor from "./components/EditorSideBar/EditorSideBar";
import Graph from "./components/GraphView/GraphView";
import RVector from "./components/RVector/RVector";
import Header from "./components/Header/Header";
import { calculateTrueViewportHeight, getQueryStringParams } from "./utils";
import { toggleOpenEditor } from "./AppSettings.store";

interface AppProps {}

const App: React.FC<AppProps> = () => {
   const dispatch = useAppDispatch();
   const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
   const themeMode = useAppSelector((state) => state.appSettings.currentTheme);
   const editorIsOpen = useAppSelector((state) => state.appSettings.editorIsOpen);

   // Update the theme only if the mode changes
   const themePalette = useMemo(() => {
      let palette: PaletteMode;

      if (themeMode === "auto") {
         palette = prefersDarkMode ? "dark" : "light";
      } else {
         palette = themeMode;
      }

      return createTheme(getDesignTokens(palette));
   }, [themeMode, prefersDarkMode]);

   const composeGraphFromQuery = () => {
      let queryGraphNodes: SingleInputNode[] = [];

      (getQueryStringParams().graph || "").split(";").forEach((paramNode: string) => {
         let [from, to] = paramNode.split(":");

         // If the node's name is an empty string, then we don't add it to the graph
         if (from.length === 0 || to.length === 0) return;

         let node = { name: from, children: to };
         dispatch(addNamedNode(node));
         queryGraphNodes.push(node);
      });

      if (queryGraphNodes.length > 0) dispatch(updateNetworkFromNodeList(queryGraphNodes));
   };

   useEffect(() => {
      calculateTrueViewportHeight();

      // Initial Calculation right after the viewport is resized
      window.addEventListener("resize", () => {
         calculateTrueViewportHeight();
      });

      composeGraphFromQuery();
   }, []);

   return (
      <ThemeProvider theme={themePalette}>
         <CssBaseline></CssBaseline>

         <Header></Header>

         <Drawer
            className="editor-drawer"
            // container={container}
            variant="temporary"
            open={editorIsOpen}
            onClose={() => dispatch(toggleOpenEditor())}
            ModalProps={{
               keepMounted: true, // Better open performance on mobile.
            }}
         >
            <Editor></Editor>
         </Drawer>

         <Box className="App" sx={{ display: "flex" }}>
            {/* ---------- THE SIDE BAR ---------- */}
            <Paper elevation={0} className="sidebar">
               <Editor></Editor>
            </Paper>

            {/* ---------- THE GRAPH VIEW ---------- */}
            <Paper
               variant="outlined"
               elevation={0}
               sx={{ borderRadius: 0, borderTop: 0, borderBottom: 0, borderRight: 0, flexGrow: 1 }}
               className="graph-viz"
            >
               <Graph></Graph>
            </Paper>

            {/* ---------- THE R VECTOR ---------- */}
            <Paper
               variant="outlined"
               elevation={0}
               sx={{ borderRadius: 0, borderTop: 0, borderBottom: 0, borderRight: 0 }}
               className="r-vector-wrapper"
            >
               <RVector></RVector>
            </Paper>
         </Box>
      </ThemeProvider>
   );
};

export default App;
