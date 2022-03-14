import katex from "katex";
import * as React from "react";
import "./KatexEq.scss";

interface KatexEqProps {}

const KatexEq: React.FC<KatexEqProps> = ({ children }) => {
   const eq = katex.renderToString(children?.toString() || "", { throwOnError: false });
   return <span className="eq" dangerouslySetInnerHTML={{ __html: eq }} />;
};

export default React.memo(KatexEq);
