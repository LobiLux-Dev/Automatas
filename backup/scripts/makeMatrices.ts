import edgeData from "../data/edges.json";
import vertexData from "../data/vertices.json";
import type { Edge } from "../src/types/edge";
import type { Vertex } from "../src/types/vertex";

const createIncidenceMatrix = (edges: Edge[], vertices: Vertex[]) => {
  const incidenceMatrix: number[][] = Array.from(
    { length: vertices.length },
    () => Array(edges.length).fill(0),
  );

  edges.forEach(({ from, to }, i) => {
    incidenceMatrix[from.id]![i] = 1;
    incidenceMatrix[to.id]![i] = 1;
  });

  return incidenceMatrix;
};

const transformIncidenceMatrixToCSV = (
  incidenceMatrix: number[][],
  vertices: Vertex[],
  edges: Edge[],
) =>
  `,${edges.map(({ name }) => name).join(",")}\n` +
  incidenceMatrix
    .map(
      (row, i) =>
        `${vertices.find(({ id }) => id === i)!.name},${row.join(",")}`,
    )
    .join("\n");

const createAdjacencyMatrix = (edges: Edge[], vertices: Vertex[]) => {
  const adjacencyMatrix: number[][] = Array.from(
    { length: vertices.length },
    () => Array(vertices.length).fill(0),
  );

  edges.forEach(({ from, to, weight }) => {
    adjacencyMatrix[from.id]![to.id] = weight;
    adjacencyMatrix[to.id]![from.id] = weight;
  });

  return adjacencyMatrix;
};

const transformAdjacencyMatrixToCSV = (
  adjacencyMatrix: number[][],
  vertices: Vertex[],
) =>
  `,${vertices.map(({ name }) => name).join(",")}\n` +
  adjacencyMatrix
    .map(
      (row, i) =>
        `${vertices.find(({ id }) => id === i)!.name},${row.join(",")}`,
    )
    .join("\n");

const run = async () => {
  const edges: Edge[] = edgeData;
  const vertices: Vertex[] = vertexData;

  const incidenceMatrix = createIncidenceMatrix(edges, vertices);
  const incidenceMatrixCSV = transformIncidenceMatrixToCSV(
    incidenceMatrix,
    vertices,
    edges,
  );

  const adjacencyMatrix = createAdjacencyMatrix(edges, vertices);
  const adjacencyMatrixCSV = transformAdjacencyMatrixToCSV(
    adjacencyMatrix,
    vertices,
  );

  await Bun.write("./data/incidenceMatrix.csv", incidenceMatrixCSV);
  await Bun.write("./data/adjacencyMatrix.csv", adjacencyMatrixCSV);
};

void run();
