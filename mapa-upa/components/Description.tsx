'use client'

import { useMapStore } from '@/store/useMapStore'
import { AdjacencyMatrix } from './AdjacencyMatrix'
import { IncidenceMatrix } from './IncidenceMatrix'

export const Description = () => {
	const mapData = useMapStore(state => state.mapData)

	return (
		<div className="grid gap-6 grid-cols-1">
			<section className="rounded-2xl border bg-card p-5 shadow-sm">
				<header className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<p className="text-xs uppercase tracking-widest text-muted-foreground">Resumen del grafo</p>
						<h2 className="text-2xl font-semibold">Descripción formal de UPA</h2>
					</div>
					<p className="text-sm text-muted-foreground">Relaciones, vértices y aristas en notación de conjuntos.</p>
				</header>
				<div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
					<pre className="rounded-2xl border bg-muted/30 p-4 text-sm leading-6 whitespace-pre-wrap">
						{mapData.edges?.map(({ from, to, name }) => (
							<>
								<strong>{name}</strong> = {'{'} {from.name}, {to.name} {'}'}
								<br />
							</>
						))}
					</pre>
					<div className="grid gap-4">
						<pre className="rounded-2xl border bg-muted/30 p-4 text-sm leading-6 whitespace-pre-wrap">
							<strong>UPA(V)</strong> = {'{'} {mapData.vertices?.map(({ name }) => name).join(', ')} {'}'}
						</pre>
						<pre className="rounded-2xl border bg-muted/30 p-4 text-sm leading-6 whitespace-pre-wrap">
							<strong>UPA(E)</strong> = {'{'} {mapData.edges?.map(({ name }) => name).join(', ')} {'}'}
						</pre>
						<pre className="rounded-2xl border bg-muted/30 p-4 text-sm leading-6 whitespace-pre-wrap">
							<h3 className="text-lg font-semibold text-center">Vertices y etiquetas</h3>
							<br />
							{mapData.vertices?.map(({ name, label }) => (
								<>
									<strong>{name}</strong> ({label})
									<br />
								</>
							))}
						</pre>
					</div>
				</div>
				<p className="mt-4 text-xs text-muted-foreground">
					La notacion UPA(V) y UPA(E) resume el conjunto de vertices y aristas del mapa.
				</p>
			</section>
			<AdjacencyMatrix />
			<IncidenceMatrix />
		</div>
	)
}
