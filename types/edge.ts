import type { Vertex } from "./vertex";

export type Edge = {
  name: string;
  from: string;
  to: string;
  weight: number;
  coordinates: number[][];
};
