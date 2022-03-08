import { AdjacencyList } from "../PageRank";
import { SingleInputNode } from "./components/EditorSideBar/Editor.store";

export type StringNumberPairs = { [key: string]: number };

export const calculateTrueViewportHeight = () => {
   // First we get the viewport height and we multiply it by 1% to get a value for one vh unit
   const vh = document.documentElement.clientHeight * 0.01;
   // Then we set the value in the --vh custom property to the root of the document
   document.body.style.setProperty("--vh", `${vh}px`);
};

export const getQueryStringParams = () => {
   let raw = window.location.search;
   let qs = /^[?#]/.test(raw) ? raw.slice(1) : raw;

   let params: { [key: string]: any } = {};
   qs.split("&").forEach((param) => {
      let [key, value] = param.split("=");
      params[key] = value ? decodeURIComponent(value.replace(/\+/g, " ")) : "";
   });

   return params;
};

// source: https://www.w3schools.com/js/js_cookies.asp
export const getCookie = (cname: string) => {
   let name = cname + "=";
   let decodedCookie = decodeURIComponent(document.cookie);
   let ca = decodedCookie.split(";");

   for (let i = 0; i < ca.length; i++) {
      let c = ca[i];

      while (c.charAt(0) === " ") {
         c = c.substring(1);
      }

      if (c.indexOf(name) === 0) {
         return c.substring(name.length, c.length);
      }
   }

   return "";
};

export const generateAdjListFromInput = (stringNodes: SingleInputNode[]) => {
   let nodeList: AdjacencyList<string> = [];

   let parents: StringNumberPairs = {};
   stringNodes.forEach((node) => {
      if (node.name.length === 0) return;
      let children: string[] = [];

      (node.children || "").split(",").forEach((n) => {
         let child = n.trim();
         if (child.length > 0) children.push(child);
      });

      let parentNames = Object.keys(parents);

      if (!parentNames.includes(node.name)) {
         parents[node.name] =
            nodeList.push({
               from: node.name,
               to: children,
            }) - 1;
      } else {
         nodeList[parents[node.name]].to = [...nodeList[parents[node.name]].to, ...children];
      }
   });

   return nodeList;
};
