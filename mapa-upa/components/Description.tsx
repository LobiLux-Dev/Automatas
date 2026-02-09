'use client'

import { useMemo } from 'react'
import { useMapStore } from '@/store/useMapStore'
import { dijkstra, type WeightedNeighbor } from '@/scripts/dijkstra'
import { AdjacencyMatrix } from './AdjacencyMatrix'
import { IncidenceMatrix } from './IncidenceMatrix'

const computeDiameter = (
	vertices: Array<{ id: number }>,
	edges: Array<{ from: { id: number }; to: { id: number }; weight: number }>,
) => {
	if (vertices.length === 0) {
		return 0
	}

	const adjacency = new Map<number, WeightedNeighbor[]>()
	vertices.forEach(vertex => adjacency.set(vertex.id, []))
	for (const edge of edges) {
		const fromId = edge.from.id
		const toId = edge.to.id
		adjacency.get(fromId)?.push({ to: toId, weight: edge.weight })
		adjacency.get(toId)?.push({ to: fromId, weight: edge.weight })
	}

	let diameter = 0
	for (const vertex of vertices) {
		const distances = dijkstra(vertex.id, adjacency)

		for (const value of distances.values()) {
			if (value === Number.POSITIVE_INFINITY) return null
			if (value > diameter) diameter = value
		}
	}

	return diameter
}

export const Description = () => {
	const mapData = useMapStore(state => state.mapData)
	const vertices = useMemo(() => mapData.vertices ?? [], [mapData.vertices])
	const edges = useMemo(() => mapData.edges ?? [], [mapData.edges])
	const diameter = useMemo(() => computeDiameter(vertices, edges), [vertices, edges])

	return (
		<div className="grid gap-6 grid-cols-1">
			<section className="rounded-3xl border bg-linear-to-br from-muted/30 via-card to-muted/10 p-6 shadow-sm">
				<header className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
					<div>
						<p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Mapa UPA</p>
						<h2 className="text-3xl font-semibold">Lectura formal del grafo</h2>
						<p className="mt-2 max-w-xl text-sm text-muted-foreground">
							Organizamos el mapa como un grafo dirigido donde cada arista conecta dos vertices.
						</p>
					</div>
					<div className="grid w-full grid-cols-2 gap-3 sm:max-w-65 md:grid-cols-3">
						<div className="rounded-2xl border bg-background/80 p-3 text-center">
							<p className="text-xs uppercase tracking-widest text-muted-foreground">Vertices</p>
							<p className="text-2xl font-semibold">{vertices.length}</p>
						</div>
						<div className="rounded-2xl border bg-background/80 p-3 text-center">
							<p className="text-xs uppercase tracking-widest text-muted-foreground">Aristas</p>
							<p className="text-2xl font-semibold">{edges.length}</p>
						</div>
						<div className="rounded-2xl border bg-background/80 p-3 text-center">
							<p className="text-xs uppercase tracking-widest text-muted-foreground">Diametro</p>
							<p className="text-2xl font-semibold">{diameter === null ? 'No conexo' : diameter}</p>
						</div>
					</div>
				</header>
				<div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
					<section className="rounded-2xl border bg-background/70 p-4">
						<h3 className="text-sm uppercase tracking-widest text-muted-foreground">Relaciones</h3>
						<p className="mt-1 text-sm text-muted-foreground">Cada arista se expresa como un par ordenado.</p>
						<div className="mt-4 space-y-2 text-sm font-mono">
							{edges.map(({ from, to, name, id }) => (
								<div key={id}>
									<strong>{name}</strong> = {'{'} {from.name}, {to.name} {'}'}
								</div>
							))}
						</div>
					</section>
					<div className="grid gap-4">
						<section className="rounded-2xl border bg-background/70 p-4">
							<h3 className="text-sm uppercase tracking-widest text-muted-foreground">Conjunto de vertices</h3>
							<p className="mt-2 text-sm font-mono">
								<strong>UPA(V)</strong> = {'{'} {vertices.map(({ name }) => name).join(', ')} {'}'}
							</p>
						</section>
						<section className="rounded-2xl border bg-background/70 p-4">
							<h3 className="text-sm uppercase tracking-widest text-muted-foreground">Conjunto de aristas</h3>
							<p className="mt-2 text-sm font-mono">
								<strong>UPA(E)</strong> = {'{'} {edges.map(({ name }) => name).join(', ')} {'}'}
							</p>
						</section>
						<section className="rounded-2xl border bg-background/70 p-4">
							<h3 className="text-sm uppercase tracking-widest text-muted-foreground">Vertices y etiquetas</h3>
							<div className="mt-3 space-y-2 text-sm">
								{vertices.map(({ name, label, id }) => (
									<div key={id}>
										<strong>{name}</strong> ({label})
									</div>
								))}
							</div>
						</section>
						<section className="rounded-2xl border bg-background/70 p-4">
							<h3 className="text-sm uppercase tracking-widest text-muted-foreground">Grados por vertice</h3>
							<div className="mt-3 space-y-2 text-sm font-mono">
								{vertices.map(({ id, name }) => (
									<div key={id}>
										<strong>grd({name})</strong> ={' '}
										{edges.filter(edge => edge.from.id === id || edge.to.id === id).length}
									</div>
								))}
							</div>
						</section>
					</div>
				</div>
				<p className="mt-5 text-xs text-muted-foreground">
					UPA(V) y UPA(E) resumen los conjuntos fundamentales, mientras que las relaciones definen el trazado.
				</p>
			</section>
			<AdjacencyMatrix />
			<IncidenceMatrix />
		</div>
	)
}
