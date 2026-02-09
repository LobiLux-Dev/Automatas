import { AdjacencyMatrix } from './AdjacencyMatrix'
import { IncidenceMatrix } from './IncidenceMatrix'

export const Description = () => {
	return (
		<div className="grid gap-6 grid-cols-1">
			<AdjacencyMatrix />
			<IncidenceMatrix />
		</div>
	)
}
