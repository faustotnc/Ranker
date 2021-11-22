import * as React from "react";
import "./NodeInputs.scss";
import { Box, IconButton, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { removeNode, updateNode } from "../Editor.store";
import { useAppDispatch, useAppSelector } from "../../../hooks";

interface NodeInputsProps {}

const NodeInputs: React.FC<NodeInputsProps> = (props: NodeInputsProps) => {
   const nodeList = useAppSelector((state) => state.editor.nodes);
   const dispatch = useAppDispatch();

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

   console.log(nodeList)

   let elements = nodeList.map((node, idx) => (
      <Box className="node" key={idx} sx={{ display: "grid", gridTemplateColumns: "34px 1.5fr 4fr", gap: 1 }}>
         <IconButton
            aria-label="delete"
            size="small"
            className="delete-button"
            onClick={() => dispatch(removeNode(idx))}
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

   return <>{elements}</>;
};

export default NodeInputs;
