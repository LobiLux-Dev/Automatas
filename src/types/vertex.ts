import type { Coordinates } from "./coordinates";

export type Vertex = {
  id: number;
  name: string;
  parent?: string;
  coordinates: Coordinates;
};
