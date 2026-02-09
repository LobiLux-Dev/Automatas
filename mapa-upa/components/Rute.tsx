'use client'

import { useMemo } from 'react'
import { useMapStore } from '@/store/useMapStore'

export const Rute = () => {
	const mapData = useMapStore(state => state.mapData)
	const aStarResult = useMapStore(state => state.aStarResult)

	const verticesById = useMemo(() => {
		const map = new Map<number, { label: string }>()
		mapData.vertices?.forEach(vertex => map.set(vertex.id, { label: vertex.label }))
		return map
	}, [mapData.vertices])

	const edgesById = useMemo(() => {
		const map = new Map<number, { weight: number }>()
		mapData.edges?.forEach(edge => map.set(edge.id, { weight: edge.weight }))
		return map
	}, [mapData.edges])

	const pathSteps = useMemo(() => {
		const path = aStarResult?.path
		if (!path || path.vertexPath.length === 0) return []
		return path.vertexPath.map((id, index) => {
			const edgeId = index === 0 ? null : (path.edgePath[index - 1] ?? null)
			const weight = edgeId !== null ? (edgesById.get(edgeId)?.weight ?? 0) : 0
			return {
				id,
				label: verticesById.get(id)?.label ?? String(id),
				edgeId,
				weight,
			}
		})
	}, [aStarResult?.path, edgesById, verticesById])

	const totalWeight = useMemo(() => {
		return pathSteps.reduce((sum, step) => sum + step.weight, 0)
	}, [pathSteps])

	if (!mapData.vertices?.length) return null

	return (
		<div className="mt-6 rounded-2xl border bg-card p-4 shadow-sm">
			<h2 className="text-sm font-medium text-muted-foreground">Ruta final</h2>
			{pathSteps.length === 0 ? (
				<p className="mt-2 text-sm text-muted-foreground">Selecciona origen y destino para calcular la ruta.</p>
			) : (
				<div className="mt-3 space-y-3">
					<div className="rounded-xl border bg-muted/30 p-3">
						<h3 className="text-xs font-semibold uppercase text-muted-foreground">Camino final</h3>
						<div className="mt-2 max-h-48 space-y-2 overflow-auto pr-1">
							{pathSteps.map((step, index) => (
								<div key={`${step.id}-${index}`} className="flex items-center justify-between text-sm">
									<span className="truncate">
										{index + 1}. {step.label}
									</span>
									<span className="font-mono text-xs text-muted-foreground">{step.weight}</span>
								</div>
							))}
						</div>
						<div className="mt-3 flex items-center justify-between border-t pt-2 text-sm">
							<span className="font-medium">Total</span>
							<span className="font-mono text-sm">{totalWeight}</span>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
