import edgeData from "../data/edges.json";
import vertexData from "../data/vertices.json";
import { matchCoords } from "./utils/matchCoords";
// import type { AdjacencyList } from "./types/graph";
import type { Vertex } from "./types/vertex";
import type { Edge } from "./types/edge";

// const adjacencyList: AdjacencyList = new Map();

// const addVertex = (adjacencyList: AdjacencyList, vertex: string): void => {
//   if (!adjacencyList.has(vertex)) adjacencyList.set(vertex, new Map());
// };

// const addEdge = (
//   adjacencyList: AdjacencyList,
//   from: string,
//   to: string,
//   weight: number,
// ): void => {
//   addVertex(adjacencyList, from);
//   addVertex(adjacencyList, to);

//   adjacencyList.get(from)?.set(to, weight);
//   adjacencyList.get(to)?.set(from, weight);
// };

// const neighbors = (
//   adjacencyList: AdjacencyList,
//   vertex: string,
// ): Map<string, number> => adjacencyList.get(vertex) ?? new Map();

const vertices: Vertex[] = vertexData.map((vertex, i) => ({
  id: i,
  ...vertex,
}));

const edges: Edge[] = edgeData.map((edge, i) => {
  const [from, to] = [
    vertices.find((vertex) => matchCoords(vertex, edge)),
    vertices.find((vertex) => matchCoords(vertex, edge, "last")),
  ];

  if (!from) throw new Error("Invalid edge data: 'from' vertex not found");
  if (!to) throw new Error("Invalid edge data: 'to' vertex not found");

  return {
    id: i,
    from: from,
    to: to,
    ...edge,
  };
});

// vertices.forEach(({ name }) => addVertex(adjacencyList, name));
// edges.forEach(({ from, to, weight }) =>
//   addEdge(adjacencyList, from.name, to.name, weight),
// );
