import inquirer from "inquirer";

import edgeData from "../data/edges.json";
import vertexData from "../data/vertices.json";
import type { AdjacencyList } from "./types/graph";
import type { Vertex } from "./types/vertex";
import type { Edge } from "./types/edge";

const addVertex = (adjacencyList: AdjacencyList, vertex: string): void => {
  if (!adjacencyList.has(vertex)) adjacencyList.set(vertex, new Map());
};

const addEdge = (
  adjacencyList: AdjacencyList,
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
  adjacencyList: AdjacencyList,
  vertex: string,
): Map<string, number> => adjacencyList.get(vertex) ?? new Map();

const dijkstra = (adjacencyList: AdjacencyList, from: string, to: string) => {
  const dist = new Map<string, number>();
  const prev = new Map<string, string | null>();
  const visited = new Set<string>();

  const queue: { node: string; dist: number }[] = [];

  dist.set(from, 0);
  prev.set(from, null);
  queue.push({ node: from, dist: 0 });

  while (queue.length > 0) {
    queue.sort((a, b) => a.dist - b.dist);
    const { node } = queue.shift()!;

    if (visited.has(node)) continue;
    visited.add(node);

    if (node === to) break;

    const neighbors_ = neighbors(adjacencyList, node);
    if (!neighbors_) continue;

    for (const [neighbor, weight] of neighbors_) {
      if (visited.has(neighbor)) continue;

      const alt = dist.get(node)! + weight;
      if (alt < (dist.get(neighbor) ?? Infinity)) {
        dist.set(neighbor, alt);
        prev.set(neighbor, node);
        queue.push({ node: neighbor, dist: alt });
      }
    }
  }

  // reconstruir camino
  const path: string[] = [];
  let curr: string | null = to;

  while (curr) {
    path.unshift(curr);
    curr = prev.get(curr) ?? null;
  }

  return {
    distance: dist.get(to) ?? Infinity,
    path,
  };
};

const main = async () => {
  const adjacencyList: AdjacencyList = new Map();

  const edges: Edge[] = edgeData;
  const vertices: Vertex[] = vertexData;

  vertices.forEach(({ name }) => addVertex(adjacencyList, name));
  edges.forEach(({ from, to, weight }) =>
    addEdge(adjacencyList, from.name, to.name, weight),
  );

  const fromPrompt = await inquirer.prompt([
    {
      type: "rawlist",
      name: "option",
      message: "Selecciona",
      choices: vertices
        .filter(({ label }) => !(label.split("")[0] === "I"))
        .map(({ label }) => label),
    },
  ]);

  const from = vertices.find(({ label }) => label === fromPrompt.option);

  if (!from) throw new Error("From vertex not found");

  const toPrompt = await inquirer.prompt([
    {
      type: "rawlist",
      name: "option",
      message: "Selecciona",
      choices: vertices
        .filter(
          ({ label }) => !(label.split("")[0] === "I" || label === from.label),
        )
        .map(({ label }) => label),
    },
  ]);

  const to = vertices.find(({ label }) => label === toPrompt.option);

  if (!to) throw new Error("To vertex not found");

  const shortestPath = dijkstra(adjacencyList, from.name, to.name);
  const parsedPath = shortestPath.path.map((vertexName) =>
    vertices.find(({ name }) => name === vertexName),
  );

  console.log({
    path: parsedPath,
    distance: shortestPath.distance,
  });
};

void main();
