import React from "react";
import "./GraphNodes.scss";
import { Button } from "@mui/material";
import { addNode } from "../Editor.store";
import { Box, IconButton, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { removeNode, updateNode } from "../Editor.store";
import { useAppDispatch, useAppSelector } from "../../../hooks";

interface NodeDetailsProps {}

const NodeDetails: React.FC<NodeDetailsProps> = () => {
   const dispatch = useAppDispatch();
   const nodeList = useAppSelector((state) => state.editor.nodes);

   const handleChangeNodeName = (event: React.BaseSyntheticEvent, idx: number, prevChildren: string) => {
      dispatch(
         updateNode({
            id: idx,
            name: event.target.value,
            children: prevChildren,
         })
      );
   };

   const handleChangeNodeChildren = (event: React.BaseSyntheticEvent, idx: number, prevName: string) => {
      dispatch(
         updateNode({
            id: idx,
            name: prevName,
            children: event.target.value,
         })
      );
   };

   const nodeInputs = nodeList.map((node, idx) => (
      <Box className="node" key={idx} sx={{ display: "grid", gridTemplateColumns: "34px 1.5fr 4fr", gap: 1 }}>
         <IconButton
            aria-label="delete"
            size="small"
            className="delete-button"
            onClick={() => dispatch(removeNode(idx))}
            color="primary"
         >
            <DeleteIcon />
         </IconButton>

         <TextField
            id="node-id"
            size="small"
            placeholder="Name"
            variant="filled"
            onChange={(e) => handleChangeNodeName(e, idx, node.children)}
            value={node.name}
         />

         <TextField
            id="node-children"
            size="small"
            placeholder="Children"
            variant="outlined"
            onChange={(e) => handleChangeNodeChildren(e, idx, node.name)}
            value={node.children}
         />
      </Box>
   ));

   return (
      <Box className="node-list">
         <div>{nodeInputs}</div>

         <Button
            size="small"
            variant="contained"
            disableElevation
            className="rounded add-node"
            onClick={() => dispatch(addNode())}
         >
            Add Node
         </Button>
      </Box>
   );
};

export default NodeDetails;
