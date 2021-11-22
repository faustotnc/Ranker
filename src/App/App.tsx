import "./App.scss";
import Editor from "./components/Editor/Editor";
import Graph from "./components/GraphView/GraphView";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { darkTheme, lightTheme } from "../theme";
import { Paper, AppBar, Toolbar, Typography, Box, IconButton } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import RVector from "./components/RVector/RVector";
import { useEffect } from "react";
import { useAppDispatch } from "./hooks";
import { addNamedNode, SingleInputNode } from "./components/Editor/Editor.store";
import { updateNetworkFromNodeList } from "./components/GraphView/GraphView.store";

const getQueryStringParams = () => {
   let raw = window.location.search;
   let qs = /^[?#]/.test(raw) ? raw.slice(1) : raw;

   let params: { [key: string]: any } = {};
   qs.split("&").forEach((param) => {
      let [key, value] = param.split("=");
      params[key] = value ? decodeURIComponent(value.replace(/\+/g, " ")) : "";
   });

   return params;
};

interface AppProps {}

const App: React.FC<AppProps> = () => {
   const theme = createTheme(lightTheme);
   const dispatch = useAppDispatch();

   useEffect(() => {
      let queryGraphNodes: SingleInputNode[] = [];

      (getQueryStringParams().graph || "").split(";").forEach((paramNode: string) => {
         let [from, to] = paramNode.split(":");

         // If the node's name is an empty string, then we don't add it to the graph
         if (from.length == 0 || to.length == 0) return;

         let node = { name: from, children: to };
         dispatch(addNamedNode(node));
         queryGraphNodes.push(node);
      });

      if (queryGraphNodes.length > 0) dispatch(updateNetworkFromNodeList(queryGraphNodes));
   }, []);

   return (
      <ThemeProvider theme={theme}>
         <AppBar position="fixed" elevation={0} color="transparent" className="appBar">
            <Paper
               variant="outlined"
               elevation={0}
               sx={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0 }}
               className="graph-viz"
            >
               <Toolbar variant="dense">
                  {/* <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                     <MenuIcon />
                  </IconButton> */}
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                     Ranker
                  </Typography>

                  <IconButton>
                     <SettingsIcon />
                  </IconButton>
               </Toolbar>
            </Paper>
         </AppBar>

         <Box className="App">
            {/* ---------- THE SIDE BAR ---------- */}
            <Paper elevation={0} className="sidebar">
               <Editor></Editor>
            </Paper>

            {/* ---------- THE GRAPH VIEW ---------- */}
            <Paper
               variant="outlined"
               elevation={0}
               sx={{ borderRadius: 0, borderTop: 0, borderBottom: 0, borderRight: 0 }}
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
