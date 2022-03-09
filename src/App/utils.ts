import { AdjacencyList } from "../PageRank";
import { SingleInputNode } from "./components/EditorSideBar/Editor.store";

/** An object containing strings as keys, and numbers as values. */
export type StringNumberPairs = { [key: string]: number };

/** Computes the true viewport height of the website. */
export const calculateTrueVH = () => {
   const vh = document.documentElement.clientHeight * 0.01;
   document.body.style.setProperty("--vh", `${vh}px`);
};

/**
 * Computes the URL query params.
 * @returns An object containing the query params.
 */
export const getQueryStringParams = () => {
   const raw = window.location.search;
   const qs = /^[?#]/.test(raw) ? raw.slice(1) : raw;

   const params: { [key: string]: unknown } = {};
   qs.split("&").forEach((param) => {
      const [key, value] = param.split("=");
      params[key] = value ? decodeURIComponent(value.replace(/\+/g, " ")) : "";
   });

   return params;
};

/**
 * Tries to get a cookie by name.
 * source: https://www.w3schools.com/js/js_cookies.asp
 * @param cname The cookie's name.
 * @returns The cookie's value.
 */
export const getCookie = (cname: string) => {
   const name = cname + "=";
   const decodedCookie = decodeURIComponent(document.cookie);
   const ca = decodedCookie.split(";");

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

/**
 * Constructs an adjacency matrix from a list of input nodes.
 * @param stringNodes The list of input nodes.
 * @returns An adjacency matrix.
 */
export const generateAdjListFromInputs = (stringNodes: SingleInputNode[]) => {
   const nodeList: AdjacencyList<string> = [];
   const parents: StringNumberPairs = {};

   stringNodes.forEach((node) => {
      if (node.name.length === 0) return;
      const children: string[] = [];

      (node.children || "").split(",").forEach((n) => {
         const child = n.trim();
         if (child.length > 0) children.push(child);
      });

      const parentNames = Object.keys(parents);

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
