import { Box, CssBaseline, Divider, Drawer, PaletteMode, Paper, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as React from "react";
import "./App.scss";
import { toggleOpenEditor } from "./AppSettings.store";
import {
   addNamedNode,
   GraphSettingsData,
   MatrixFormula,
   setChangesHaveExecuted,
   setIterSpeed,
   setMatrixFormula,
   setMaxIter,
   SingleInputNode,
} from "./components/EditorSideBar/Editor.store";
import Editor from "./components/EditorSideBar/EditorSideBar";
import Graph from "./components/GraphView/GraphView";
import { selectGraphSettingsData, setGraphSettingsData } from "./components/GraphView/GraphView.store";
import InfoContent from "./components/Header/About/InfoContent";
import Header from "./components/Header/Header";
import RVector from "./components/RVector/RVector";
import { useAppDispatch, useAppSelector } from "./hooks";
import { getDesignTokens } from "./theme";
import { calculateTrueVH, generateAdjListFromInputs, getQueryStringParams } from "./utils";

interface AppProps {}

const App: React.FC<AppProps> = () => {
   const dispatch = useAppDispatch();
   const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
   const themeMode = useAppSelector((state) => state.appSettings.currentTheme);
   const editorIsOpen = useAppSelector((state) => state.appSettings.editorIsOpen);
   const graphData = useAppSelector(selectGraphSettingsData);

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

   React.useEffect(() => {
      // Initial calculation right after the viewport is resized
      calculateTrueVH();
      window.addEventListener("resize", () => calculateTrueVH());

      // Composes a graph from the query params if they exist
      // Graph query params follow this format: "?graph=a:a,b;b:c,d"
      // This instructs ranker to form a graph as follows: [a->a, a->b, b->c, b->d]
      const queryParams = getQueryStringParams();
      const queryGraphParam = (queryParams.graph as string) || "";
      const queryGraphNodes: SingleInputNode[] = [];
      queryGraphParam.split(";").forEach((paramNode: string) => {
         const [from, to] = paramNode.split(":");

         // If the node's name is an empty string, then we don't add it to the graph
         if (from.length === 0 || !to || to.length === 0) return;

         const node = { name: from, children: to };
         dispatch(addNamedNode(node));
         queryGraphNodes.push(node);
      });

      const queryMFParam = (queryParams.mf as string) || "";
      const queryMIParam = Number((queryParams.mi as string) || "");
      const queryISParam = Number((queryParams.is as string) || "");

      const graphData: GraphSettingsData = {
         graph: generateAdjListFromInputs(queryGraphNodes),
         matrixFormula: /^(0|1|2){1}$/g.test(queryMFParam) ? Number(queryMFParam) : MatrixFormula.Simple,
         maxIter: !!queryMIParam && queryMIParam >= 10 && queryMIParam <= 100 ? queryMIParam : 50,
         iterSpeed: !!queryISParam && queryISParam >= 0.1 && queryISParam <= 3 ? queryISParam : 1,
      };

      dispatch(setMatrixFormula(graphData.matrixFormula));
      dispatch(setMaxIter(graphData.maxIter));
      dispatch(setIterSpeed(graphData.iterSpeed));
      dispatch(setGraphSettingsData(graphData));
      dispatch(setChangesHaveExecuted());
   }, [dispatch]);

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
               {graphData.graph.length > 0 ? (
                  <Graph></Graph>
               ) : (
                  <Box sx={{ display: "flex", justifyContent: "center", overflowY: "auto", height: "100%" }}>
                     <Box sx={{ width: "90%", height: "fit-content", maxWidth: "700px", py: "64px" }}>
                        <Typography variant="h4">Create a graph from the &quot;Editor&quot; menu.</Typography>
                        <Typography variant="body1">
                           On mobile devices, the editor menu can be accessed by tapping the menu icon at the top-left
                           corner of the screen.
                        </Typography>
                        <br />
                        <Divider></Divider>
                        <br />
                        <InfoContent></InfoContent>
                     </Box>
                  </Box>
               )}
            </Paper>
            {/* ---------- THE R VECTOR ---------- */}
            {graphData.graph.length > 0 ? (
               <Paper
                  variant="outlined"
                  elevation={0}
                  sx={{ borderRadius: 0, borderTop: 0, borderBottom: 0, borderRight: 0 }}
                  className="r-vector-wrapper"
               >
                  <RVector></RVector>
               </Paper>
            ) : (
               ""
            )}
         </Box>
      </ThemeProvider>
   );
};

export default App;
