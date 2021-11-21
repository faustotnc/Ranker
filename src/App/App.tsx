import "./App.scss";
import Editor from "./components/Editor/Editor";
import Graph from "./components/GraphView/GraphView";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { darkTheme, lightTheme } from "../theme";
import { Paper, AppBar, Toolbar, Typography, Box } from "@mui/material";

interface AppProps {}

const App: React.FC<AppProps> = () => {
   const theme = createTheme(darkTheme);

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
                  {/* <Button color="inherit">Login</Button> */}
               </Toolbar>
            </Paper>
         </AppBar>

         <Box className="App">
            {/* ---------- THE SIDE BAR ---------- */}
            <Paper elevation={0} className="sidebar">
               <Editor></Editor>
            </Paper>

            {/* ---------- THE GRAB VIEW ---------- */}
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
               className="r-vector"
            ></Paper>
         </Box>
      </ThemeProvider>
   );
};

export default App;
