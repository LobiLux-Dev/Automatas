import { GeometryType, type AllowedGeneric, type Feature, type GeoJSON } from '@/types/geojson'
import type { BaseEdge, Edge } from '@/types/edge'
import type { Vertex } from '@/types/vertex'

const earthsRadius = 6371000 // meters

const toRad = (deg: number) => (deg * Math.PI) / 180

const haversine = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
	const dLat = toRad(lat2 - lat1)
	const dLon = toRad(lon2 - lon1)

	const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2

	return 2 * earthsRadius * Math.asin(Math.sqrt(a))
}

const filter = <T extends AllowedGeneric>(feature: Feature<T>[], geometryType: GeometryType): Feature<T>[] =>
	feature.filter(({ geometry: { type } }) => type === geometryType)

export const matchCoords = (vertex: Vertex, edge: BaseEdge, position: 'first' | 'last' = 'first'): boolean => {
	const pos = position === 'first' ? 0 : edge.coordinates.length - 1

	return vertex.coordinates.lon === edge.coordinates[pos]?.lon && vertex.coordinates.lat === edge.coordinates[pos].lat
}

export const parseGeoJsonToJson = ({ features: data }: GeoJSON) => {
	const vertices: Vertex[] = filter<number>(data, GeometryType.Point).map(
		(
			{
				properties: { name },
				geometry: {
					coordinates: [lon, lat],
				},
			},
			i,
		) => ({
			id: i,
			name: `V${i + 1}`,
			label: name,
			coordinates: { lat: lat!, lon: lon! },
		}),
	)

	const edges: Edge[] = filter<number[]>(data, GeometryType.LineString)
		.map(({ properties: { name }, geometry: { coordinates } }, i) => ({
			id: i,
			name: `E${i + 1}`,
			label: name,
			coordinates: coordinates.map(([lon, lat]) => ({
				lat: lat!,
				lon: lon!,
			})),
			weight: Math.round(
				coordinates.reduce(([lon1, lat1], [lon2, lat2]) => [haversine(lat1!, lon1!, lat2!, lon2!)]).reduce(v => v),
			),
		}))
		.map(edge => {
			const [from, to] = [
				vertices.find(vertex => matchCoords(vertex, edge)),
				vertices.find(vertex => matchCoords(vertex, edge, 'last')),
			]

			if (!(from && to)) console.log(edge)

			if (!from) throw new Error("Invalid edge data: 'from' vertex not found")
			if (!to) throw new Error("Invalid edge data: 'to' vertex not found")

			return {
				...edge,
				from,
				to,
			}
		})

	return { vertices, edges }
}
