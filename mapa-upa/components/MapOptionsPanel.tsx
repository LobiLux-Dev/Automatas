'use client'

import { useMapStore } from '@/store/useMapStore'
import { Field, FieldDescription, FieldLabel } from './ui/field'
import { Input } from './ui/input'

export const MapOptionsPanel = () => {
	const setZoomLevel = useMapStore(state => state.setZoomLevel)
	const zoomLevel = useMapStore(state => state.zoomLevel)

	const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = Number(e.target.value)
		if (value >= 1 && value <= 18) {
			setZoomLevel(value)
		}
	}

	return (
		<div className="rounded-2xl border bg-card p-4 shadow-sm print:hidden">
			<h2 className="text-sm font-medium text-muted-foreground">Opciones del Mapa</h2>
			<div className="mt-3 space-y-4">
				<Field>
					<FieldLabel>Zoom</FieldLabel>
					<Input type="number" min={1} max={18} step={1} value={zoomLevel} onChange={handleZoomChange} />
					<FieldDescription>Zoom del mapa</FieldDescription>
				</Field>
			</div>
		</div>
	)
}
