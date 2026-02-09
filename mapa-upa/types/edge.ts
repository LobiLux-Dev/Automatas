import type { Coordinates } from './coordinates'
import type { Vertex } from './vertex'

export type BaseEdge = {
	id: number
	name: string
	weight: number
	coordinates: Coordinates[]
}

export type Edge = BaseEdge & {
	from: Vertex
	to: Vertex
}
