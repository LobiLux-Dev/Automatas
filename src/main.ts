import { v7 as uuid } from "uuid";

import edgeData from "../data/edges.json";
import vertexData from "../data/vertices.json";
import type { Graph } from "../types/graph";
import type { Vertex } from "../types/vertex";
import type { Edge } from "../types/edge";

const adjacencyList: Graph = new Map();

const addVertex = (adjacencyList: Graph, vertex: string): void => {
  if (!adjacencyList.has(vertex)) {
    adjacencyList.set(vertex, new Map());
  }
};

const addEdge = (
  adjacencyList: Graph,
  from: string,
  to: string,
  weight: number,
): void => {
  addVertex(adjacencyList, from);
  addVertex(adjacencyList, to);

  adjacencyList.get(from)?.set(to, weight);
  adjacencyList.get(to)?.set(from, weight);
};

const neighbors = (
  adjacencyList: Graph,
  vertex: string,
): Map<string, number> => {
  return adjacencyList.get(vertex) ?? new Map();
};

const vertices: Vertex[] = vertexData.map((vertex) => ({
  uuid: uuid(),
  ...vertex,
}));

const edges: Edge[] = edgeData.map((edge) => {
  const from = vertices.find(
    ({ coordinates: [vertexX, vertexY] }) =>
      vertexX === edge.coordinates[0][0] && vertexY === edge.coordinates[0][1],
  );

  if (!from) throw new Error("Invalid edge data: 'from' vertex not found");

  const to = vertices.find(
    ({ coordinates: [vertexX, vertexY] }) =>
      vertexX === edge.coordinates[edge.coordinates.length - 1][0] &&
      vertexY === edge.coordinates[edge.coordinates.length - 1][1],
  );

  if (!to) throw new Error("Invalid edge data: 'to' vertex not found");

  const weight = edge.coordinates.reduce((acc, p, i, arr) => {
    return Math.round(
      Math.hypot(p[0] - arr[i - 1][0], p[1] - arr[i - 1][1]) * 1e5,
    );
  });

  return {
    from: from?.uuid,
    to: to?.uuid,
    weight,
    ...edge,
  };
});

vertices.forEach(({ uuid }) => addVertex(adjacencyList, uuid));
edges.forEach(({ from, to, weight }) =>
  addEdge(adjacencyList, from, to, weight),
);
