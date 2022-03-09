import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getDesignTokens } from "./theme";
import { Paper, Box, PaletteMode, Drawer, CssBaseline } from "@mui/material";
import { useAppDispatch, useAppSelector } from "./hooks";
import {
   addNamedNode,
   MatrixFormula,
   setIterSpeed,
   setMaxIter,
   SingleInputNode,
} from "./components/EditorSideBar/Editor.store";
import { setGraphSettingsData } from "./components/GraphView/GraphView.store";
import useMediaQuery from "@mui/material/useMediaQuery";
import "./App.scss";

// Sub-components
import Editor from "./components/EditorSideBar/EditorSideBar";
import Graph from "./components/GraphView/GraphView";
import RVector from "./components/RVector/RVector";
import Header from "./components/Header/Header";
import { calculateTrueViewportHeight, generateAdjListFromInput, getQueryStringParams } from "./utils";
import { toggleOpenEditor } from "./AppSettings.store";

interface AppProps {}

const App: React.FC<AppProps> = () => {
   const dispatch = useAppDispatch();
   const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
   const themeMode = useAppSelector((state) => state.appSettings.currentTheme);
   const editorIsOpen = useAppSelector((state) => state.appSettings.editorIsOpen);

   // Update the theme only if the mode changes
   const themePalette = React.useMemo(() => {
      let palette: PaletteMode;

      if (themeMode === "auto") {
         palette = prefersDarkMode ? "dark" : "light";
      } else {
         palette = themeMode;
      }

      return createTheme(getDesignTokens(palette));
   }, [themeMode, prefersDarkMode]);

   // Composes a graph from the query params if they exist
   // Graph query params follow this format: "?graph=a:a,b;b:c,d"
   // This instructs ranker to form a graph as follows: [a->a, a->b, b->c, b->d]
   const composeGraphFromQuery = () => {
      const queryGraphNodes: SingleInputNode[] = [];

      ((getQueryStringParams().graph as string) || "").split(";").forEach((paramNode: string) => {
         const [from, to] = paramNode.split(":");

         // If the node's name is an empty string, then we don't add it to the graph
         if (from.length === 0 || to.length === 0) return;

         const node = { name: from, children: to };
         dispatch(addNamedNode(node));
         queryGraphNodes.push(node);
      });

      const adjList = generateAdjListFromInput(queryGraphNodes);
      // TODO: MatrixFormula, iterSpeed, and maxIter also need to be extracted from query string
      dispatch(setMaxIter(50));
      dispatch(setIterSpeed(1));
      if (queryGraphNodes.length > 0)
         dispatch(
            setGraphSettingsData({
               graph: adjList,
               matrixFormula: MatrixFormula.Simple,
               iterSpeed: 1,
               maxIter: 50,
            })
         );
   };

   React.useEffect(() => {
      calculateTrueViewportHeight();

      // Initial calculation right after the viewport is resized
      window.addEventListener("resize", () => calculateTrueViewportHeight());

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
