'use client'

import { createIncidenceMatrix } from '@/scripts/makeMatrices'
import { useMapStore } from '@/store/useMapStore'
import { Table, TableBody, TableCell, TableHeader, TableRow } from './ui/table'

export const IncidenceMatrix = () => {
	const mapData = useMapStore(state => state.mapData)
	const tableData = createIncidenceMatrix(mapData)

	return (
		<div className="rounded-2xl border bg-card p-4 shadow-sm">
			<h2 className="text-xl text-center font-medium text-muted-foreground">Matriz de Adyacencia</h2>
			<Table className="mt-3">
				<TableHeader>
					<TableRow>
						<TableCell />
						{mapData.edges?.map(({ name }, index) => (
							<TableCell key={index} className="p-2 text-center border font-medium">
								{name}
							</TableCell>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{tableData.map((row, rowIndex) => (
						<TableRow key={rowIndex}>
							<TableCell className="p-2 text-center border font-medium">{mapData.vertices?.[rowIndex].name}</TableCell>
							{row.map((cell, cellIndex) => (
								<TableCell key={cellIndex} className="p-2 text-center border">
									{cell}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}
