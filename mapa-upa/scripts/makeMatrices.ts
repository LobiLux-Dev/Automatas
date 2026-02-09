import { MapData } from '@/store/useMapStore'
import { Edge } from '@/types/edge'
import { Vertex } from '@/types/vertex'

export const createIncidenceMatrix = ({ edges, vertices }: MapData) => {
	if (!edges || !vertices) return []

	const incidenceMatrix: number[][] = Array.from({ length: vertices.length }, () => Array(edges.length).fill(0))

	edges.forEach(({ from, to }, i) => {
		incidenceMatrix[from.id]![i] = 1
		incidenceMatrix[to.id]![i] = 1
	})

	return incidenceMatrix
}

export const transformIncidenceMatrixToCSV = (incidenceMatrix: number[][], vertices: Vertex[], edges: Edge[]) =>
	`,${edges.map(({ name }) => name).join(',')}\n` +
	incidenceMatrix.map((row, i) => `${vertices.find(({ id }) => id === i)!.name},${row.join(',')}`).join('\n')

export const createAdjacencyMatrix = ({ edges, vertices }: MapData) => {
	if (!edges || !vertices) return []

	const adjacencyMatrix: number[][] = Array.from({ length: vertices.length }, () => Array(vertices.length).fill(0))

	edges.forEach(({ from, to, weight }) => {
		adjacencyMatrix[from.id]![to.id] = weight
		adjacencyMatrix[to.id]![from.id] = weight
	})

	return adjacencyMatrix
}

export const transformAdjacencyMatrixToCSV = (adjacencyMatrix: number[][], vertices: Vertex[]) =>
	`,${vertices.map(({ name }) => name).join(',')}\n` +
	adjacencyMatrix.map((row, i) => `${vertices.find(({ id }) => id === i)!.name},${row.join(',')}`).join('\n')
