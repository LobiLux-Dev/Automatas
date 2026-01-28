import type { Coordinates } from "./coordinates";
import type { Vertex } from "./vertex";

export type BaseEdge = {
  name: string;
  weight: number;
  coordinates: Coordinates[];
};

export type Edge = BaseEdge & {
  id: number;
  from: Vertex;
  to: Vertex;
};
