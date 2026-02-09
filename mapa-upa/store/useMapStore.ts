import { create } from 'zustand'

import { Edge } from '@/types/edge'
import { Vertex } from '@/types/vertex'
import { kml } from '@tmcw/togeojson'
import { GeoJSON } from '@/types/geojson'
import { parseGeoJsonToJson } from '@/scripts/transformGeoJson'
import { AStarResult } from '@/scripts/aStar'

interface MapState {
	aStarResult: AStarResult | null
	mapData: MapData
	zoomLevel: number
	startId: number | null
	goalId: number | null
	setAStarResult: (result: AStarResult | null) => void
	setZoomLevel: (level: number) => void
	setStartId: (id: number | null) => void
	setGoalId: (id: number | null) => void

	loadKml: () => Promise<void>
}

export interface MapData {
	vertices: Vertex[] | null
	edges: Edge[] | null
}

export const useMapStore = create<MapState>(set => ({
	aStarResult: null,
	mapData: {
		edges: null,
		vertices: null,
	},
	zoomLevel: 17,
	startId: null,
	goalId: null,
	setAStarResult: result => set({ aStarResult: result }),
	setZoomLevel: level => set({ zoomLevel: level }),
	setStartId: id => set({ startId: id }),
	setGoalId: id => set({ goalId: id }),

	loadKml: async () => {
		const res = await fetch('map.kml')
		const text = await res.text()
		const parser = new DOMParser()
		const xmlDoc = parser.parseFromString(text, 'application/xml')

		const geoJson = kml(xmlDoc) as GeoJSON

		console.log('GeoJSON cargado:', parseGeoJsonToJson(geoJson))

		set({ mapData: parseGeoJsonToJson(geoJson) })
	},
}))
