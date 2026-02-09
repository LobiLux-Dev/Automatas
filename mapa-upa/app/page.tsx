import { Map } from '@/components/Map'
import { DataPanel } from '@/components/DataPanel'
import { AnimationPanel } from '@/components/AnimationPanel'
import { MapOptionsPanel } from '@/components/MapOptionsPanel'
import { Description } from '@/components/Description'
import { Rute } from '@/components/Rute'

export default function Page() {
	return (
		<div className="container max-w-5xl mx-auto space-y-6 px-4 py-6">
			<header className="space-y-2 text-center">
				<h1 className="text-2xl font-semibold tracking-tight">Visualizador de Rutas con A*</h1>
			</header>
			<section className="rounded-2xl border bg-card p-4 shadow-sm print-break">
				<Map />
			</section>
			<section className="grid gap-6 grid-cols-1 md:grid-cols-2 print:grid-cols-1">
				<div className="row-span-2">
					<DataPanel />
					<Rute />
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
