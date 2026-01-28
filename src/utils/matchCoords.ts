import type { BaseEdge } from "../types/edge";
import type { Vertex } from "../types/vertex";

export const matchCoords = (
  vertex: Vertex,
  edge: BaseEdge,
  position: "first" | "last" = "first",
): boolean => {
  const pos = position === "first" ? 0 : edge.coordinates.length - 1;

  return (
    vertex.coordinates.lon === edge.coordinates[pos]?.lon &&
    vertex.coordinates.lat === edge.coordinates[pos].lat
  );
};
