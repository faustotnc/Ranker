import * as React from "react";
import "./NodeInputs.scss";
import { Box, IconButton, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export interface SingleInputNode {
   name: string;
   children: string;
}

interface NodeInputsProps {
   inputs: SingleInputNode[];
}

const NodeInputs: React.FC<NodeInputsProps> = (props: NodeInputsProps) => {
   let elements = props.inputs.map((number, idx) => (
      <Box className="node" key={idx} sx={{ display: "grid", gridTemplateColumns: "34px 1fr 4fr", gap: 1 }}>
         <IconButton aria-label="delete" size="small" className="delete-button">
            <DeleteIcon />
         </IconButton>
         <TextField id="outlined-basic" size="small" placeholder="ID" variant="filled" />
         <TextField id="outlined-basic" size="small" placeholder="Children" variant="outlined" />
      </Box>
   ));

   return <div>{elements}</div>;
};

export default NodeInputs;
