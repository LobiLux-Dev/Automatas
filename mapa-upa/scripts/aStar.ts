export type Neighbor = {
	to: number
	weight: number
	edgeId: number
}

export type CameFromEntry = {
	prev: number
	edgeId: number
}

export type PathResult = {
	vertexPath: number[]
	edgePath: number[]
}

export type AStarResult = {
	path: PathResult | null
	visitedOrder: number[]
	cameFrom: Map<number, CameFromEntry>
}

export const reconstructPath = (startId: number, goalId: number, cameFrom: Map<number, CameFromEntry>): PathResult => {
	const vertexPath: number[] = [goalId]
	const edgePath: number[] = []

	let current = goalId
	while (current !== startId) {
		const step = cameFrom.get(current)
		if (!step) break
		edgePath.unshift(step.edgeId)
		current = step.prev
		vertexPath.unshift(current)
	}

	return { vertexPath, edgePath }
}

export const aStar = (
	startId: number,
	goalId: number,
	graph: Map<number, Neighbor[]>,
	getHeuristic: (id: number) => number,
): AStarResult => {
	const openSet = new Set<number>([startId])
	const visitedOrder: number[] = []
	const cameFrom = new Map<number, CameFromEntry>()
	const gScore = new Map<number, number>([[startId, 0]])
	const fScore = new Map<number, number>([[startId, getHeuristic(startId)]])

	while (openSet.size > 0) {
		let current: number | null = null
		let currentScore = Number.POSITIVE_INFINITY
		for (const node of openSet) {
			const score = fScore.get(node) ?? Number.POSITIVE_INFINITY
			if (score < currentScore) {
				currentScore = score
				current = node
			}
		}

		if (current === null) break
		visitedOrder.push(current)
		if (current === goalId) {
			return {
				path: reconstructPath(startId, goalId, cameFrom),
				visitedOrder,
				cameFrom,
			}
		}

		openSet.delete(current)
		const neighbors = graph.get(current) ?? []
		for (const { to, weight, edgeId } of neighbors) {
			const tentativeG = (gScore.get(current) ?? Number.POSITIVE_INFINITY) + weight
			if (tentativeG < (gScore.get(to) ?? Number.POSITIVE_INFINITY)) {
				cameFrom.set(to, { prev: current, edgeId })
				gScore.set(to, tentativeG)
				fScore.set(to, tentativeG + getHeuristic(to))
				openSet.add(to)
			}
		}
	}

	return { path: null, visitedOrder, cameFrom }
}
