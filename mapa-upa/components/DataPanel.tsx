'use client'

import { useMemo } from 'react'

import { Field, FieldDescription, FieldLabel } from './ui/field'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select'
import { useMapStore } from '@/store/useMapStore'

export const DataPanel = () => {
	const mapData = useMapStore(state => state.mapData)
	const startId = useMapStore(state => state.startId)
	const goalId = useMapStore(state => state.goalId)
	const onStartChange = useMapStore(state => state.setStartId)
	const onGoalChange = useMapStore(state => state.setGoalId)

	const selectableVertices = useMemo(() => {
		return mapData.vertices?.filter(({ label }) => label[0] !== 'I') ?? []
	}, [mapData.vertices])

	const startValue = startId !== null ? String(startId) : undefined
	const goalValue = goalId !== null ? String(goalId) : undefined

	const goalOptions = useMemo(() => {
		return selectableVertices.filter(vertex => (startId === null ? true : vertex.id !== startId))
	}, [selectableVertices, startId])

	if (!mapData.vertices?.length) return null

	return (
		<div className="rounded-2xl border bg-card p-4 shadow-sm print-break">
			<h2 className="text-sm font-medium text-muted-foreground">Datos</h2>
			<div className="mt-3 space-y-4">
				<div className="mx-auto w-96 space-y-4">
					<Field>
						<FieldLabel>Origen</FieldLabel>
						<Select
							value={startValue}
							onValueChange={value => onStartChange(Number.isNaN(Number(value)) ? null : Number(value))}
						>
							<SelectTrigger className="w-full max-w-80">
								<SelectValue placeholder="Selecciona un origen" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectLabel>Vertices</SelectLabel>
									{selectableVertices.map(vertex => (
										<SelectItem key={vertex.id} value={String(vertex.id)}>
											{vertex.label}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
						<FieldDescription>Selecciona el vértice de inicio.</FieldDescription>
					</Field>

					<Field>
						<FieldLabel>Destino</FieldLabel>
						<Select
							value={goalValue}
							onValueChange={value => onGoalChange(Number.isNaN(Number(value)) ? null : Number(value))}
						>
							<SelectTrigger className="w-full max-w-80">
								<SelectValue placeholder="Selecciona un destino" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectLabel>Vertices</SelectLabel>
									{goalOptions.map(vertex => (
										<SelectItem key={vertex.id} value={String(vertex.id)}>
											{vertex.label}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
						<FieldDescription>Selecciona el vértice de destino.</FieldDescription>
					</Field>
				</div>
			</div>
		</div>
	)
}
