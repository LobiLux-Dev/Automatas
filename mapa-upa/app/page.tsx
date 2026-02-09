'use client'

import { useCallback, useState } from 'react'

import { Map } from '@/components/Map'
import { DataPanel } from '@/components/DataPanel'
import { AnimationPanel } from '@/components/AnimationPanel'
import { MapOptionsPanel } from '@/components/MapOptionsPanel'
import { Description } from '@/components/Description'

export default function Page() {
	const [visitedSteps, setVisitedSteps] = useState<
		Array<{ id: number; label: string; edgeId: number | null; weight: number }>
	>([])
	const [visitedTotal, setVisitedTotal] = useState(0)

	const handleProgressChange = useCallback(
		({
			steps,
			total,
		}: {
			steps: Array<{ id: number; label: string; edgeId: number | null; weight: number }>
			total: number
		}) => {
			setVisitedSteps(steps)
			setVisitedTotal(total)
		},
		[],
	)

	return (
		<div className="container max-w-5xl mx-auto space-y-6 px-4 py-6">
			<header className="space-y-2 text-center">
				<h1 className="text-2xl font-semibold tracking-tight">Visualizador de Rutas con A*</h1>
			</header>
			<section className="rounded-2xl border bg-card p-4 shadow-sm print-break">
				<Map onProgressChange={handleProgressChange} />
			</section>
			<section className="grid gap-6 grid-cols-2 print:grid-cols-1">
				<div className="row-span-2">
					<DataPanel />
					{visitedSteps.length > 0 && (
						<div className="rounded-xl border bg-muted/30 p-3">
							<h3 className="text-xs font-semibold uppercase text-muted-foreground">Ruta visitada</h3>
							<div className="mt-2 max-h-48 space-y-2 overflow-auto pr-1">
								{visitedSteps.map((step, index) => (
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
								<span className="font-mono text-sm">{visitedTotal}</span>
							</div>
						</div>
					)}
				</div>
				<MapOptionsPanel />
				<AnimationPanel />
			</section>
			<section>
				<Description />
			</section>
		</div>
	)
}
