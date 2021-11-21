import * as React from "react";
import "./Editor.scss";
import GraphNodes from "./GraphNodes/GraphNodes";

interface EditorProps {}

interface EditorState {}

class Editor extends React.Component<EditorProps, EditorState> {
   render() {
      return (
         <div className="graph-editor">
            <div className="nodes-editor">
               <GraphNodes></GraphNodes>
            </div>
         </div>
      );
   }
}

export default Editor;
