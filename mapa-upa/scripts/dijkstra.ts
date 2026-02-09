export type WeightedNeighbor = {
	to: number
	weight: number
}

export const dijkstra = (startId: number, adjacency: Map<number, WeightedNeighbor[]>) => {
	const distances = new Map<number, number>()
	const visited = new Set<number>()

	for (const nodeId of adjacency.keys()) {
		distances.set(nodeId, Number.POSITIVE_INFINITY)
	}
	if (!distances.has(startId)) {
		distances.set(startId, Number.POSITIVE_INFINITY)
		return distances
	}

	distances.set(startId, 0)

	while (visited.size < distances.size) {
		let current: number | null = null
		let best = Number.POSITIVE_INFINITY
		for (const [nodeId, dist] of distances.entries()) {
			if (!visited.has(nodeId) && dist < best) {
				best = dist
				current = nodeId
			}
		}

		if (current === null || best === Number.POSITIVE_INFINITY) break
		visited.add(current)
		for (const neighbor of adjacency.get(current) ?? []) {
			const nextDistance = best + neighbor.weight
			if (nextDistance < (distances.get(neighbor.to) ?? Number.POSITIVE_INFINITY)) {
				distances.set(neighbor.to, nextDistance)
			}
		}
	}

	return distances
}
