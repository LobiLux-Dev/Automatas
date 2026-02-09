'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'

import 'leaflet/dist/leaflet.css'

import { aStar, reconstructPath, type Neighbor } from '@/scripts/aStar'
import type { Vertex } from '@/types/vertex'
import { useMapStore } from '@/store/useMapStore'
import { useAnimationStore } from '@/store/useAnimationStore'

const MapContainer = dynamic(async () => (await import('react-leaflet')).MapContainer, { ssr: false })
const TileLayer = dynamic(async () => (await import('react-leaflet')).TileLayer, { ssr: false })
const CircleMarker = dynamic(async () => (await import('react-leaflet')).CircleMarker, { ssr: false })
const Polyline = dynamic(async () => (await import('react-leaflet')).Polyline, { ssr: false })
const Tooltip = dynamic(async () => (await import('react-leaflet')).Tooltip, { ssr: false })

interface Props {
	onProgressChange?: (data: {
		steps: Array<{ id: number; label: string; edgeId: number | null; weight: number }>
		total: number
	}) => void
}

const earthsRadius = 6371000

const toRad = (deg: number) => (deg * Math.PI) / 180

const haversine = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
	const dLat = toRad(lat2 - lat1)
	const dLon = toRad(lon2 - lon1)

	const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2

	return 2 * earthsRadius * Math.asin(Math.sqrt(a))
}

export const Map = ({ onProgressChange }: Props) => {
	const mapData = useMapStore(state => state.mapData)
	const zoomLevel = useMapStore(state => state.zoomLevel)
	const startId = useMapStore(state => state.startId)
	const goalId = useMapStore(state => state.goalId)
	const onSelectStart = useMapStore(state => state.setStartId)
	const onSelectGoal = useMapStore(state => state.setGoalId)

	const animationToken = useAnimationStore(state => state.animationToken)
	const animationDelaySec = useAnimationStore(state => state.animationDelaySec)

	const [internalStartId, setInternalStartId] = useState<number | null>(null)
	const [internalGoalId, setInternalGoalId] = useState<number | null>(null)
	const [visitedIndex, setVisitedIndex] = useState(0)

	const isStartControlled = typeof startId !== 'undefined'
	const isGoalControlled = typeof goalId !== 'undefined'

	const effectiveStartId = isStartControlled ? (startId ?? null) : internalStartId
	const effectiveGoalId = isGoalControlled ? (goalId ?? null) : internalGoalId

	const setStartId = isStartControlled ? (onSelectStart ?? (() => {})) : setInternalStartId
	const setGoalId = isGoalControlled ? (onSelectGoal ?? (() => {})) : setInternalGoalId

	const verticesById = useMemo(() => {
		const map = new globalThis.Map<number, Vertex>()
		mapData.vertices?.forEach(vertex => map.set(vertex.id, vertex))
		return map
	}, [mapData.vertices])

	const edgesById = useMemo(() => {
		const map = new globalThis.Map<number, { weight: number }>()
		mapData.edges?.forEach(edge => map.set(edge.id, { weight: edge.weight }))
		return map
	}, [mapData.edges])

	const graph = useMemo(() => {
		const g = new globalThis.Map<number, Neighbor[]>()
		mapData.edges?.forEach(edge => {
			const fromId = edge.from.id
			const toId = edge.to.id
			const fromList = g.get(fromId) ?? []
			fromList.push({ to: toId, weight: edge.weight, edgeId: edge.id })
			g.set(fromId, fromList)
			const toList = g.get(toId) ?? []
			toList.push({ to: fromId, weight: edge.weight, edgeId: edge.id })
			g.set(toId, toList)
		})
		return g
	}, [mapData.edges])

	const searchResult = useMemo(() => {
		if (effectiveStartId === null || effectiveGoalId === null) return null
		const start = verticesById.get(effectiveStartId)
		const goal = verticesById.get(effectiveGoalId)
		if (!start || !goal) return null

		const heuristic = (id: number) => {
			const v = verticesById.get(id)
			if (!v) return 0
			return haversine(v.coordinates.lat, v.coordinates.lon, goal.coordinates.lat, goal.coordinates.lon)
		}

		return aStar(effectiveStartId, effectiveGoalId, graph, heuristic)
	}, [effectiveStartId, effectiveGoalId, graph, verticesById])

	const path = searchResult?.path ?? null
	const visitedOrder = searchResult?.visitedOrder ?? []
	const cameFrom = searchResult?.cameFrom ?? null

	useEffect(() => {
		setVisitedIndex(0)
		if (!visitedOrder.length) return
		const interval = setInterval(() => {
			setVisitedIndex(current => {
				const next = current + 1
				if (next >= visitedOrder.length) {
					clearInterval(interval)
					return visitedOrder.length
				}
				return next
			})
		}, animationDelaySec * 1000)
		return () => clearInterval(interval)
	}, [effectiveStartId, effectiveGoalId, visitedOrder, animationDelaySec, animationToken])

	const pathVertexSet = useMemo(() => new Set(path?.vertexPath ?? []), [path])
	const pathEdgeSet = useMemo(() => new Set(path?.edgePath ?? []), [path])
	const visitedSet = useMemo(() => new Set(visitedOrder.slice(0, visitedIndex)), [visitedOrder, visitedIndex])
	const currentVisitedId = visitedIndex > 0 ? visitedOrder[Math.min(visitedIndex - 1, visitedOrder.length - 1)] : null
	const isAnimationComplete = visitedOrder.length > 0 && visitedIndex >= visitedOrder.length
	const finalPathVertexSet = useMemo(
		() => (isAnimationComplete ? pathVertexSet : new Set<number>()),
		[isAnimationComplete, pathVertexSet],
	)
	const finalPathEdgeSet = useMemo(
		() => (isAnimationComplete ? pathEdgeSet : new Set<number>()),
		[isAnimationComplete, pathEdgeSet],
	)
	const partialPath = useMemo(() => {
		if (effectiveStartId === null || currentVisitedId === null || !cameFrom) return null
		if (currentVisitedId === effectiveStartId) return { vertexPath: [effectiveStartId], edgePath: [] }
		if (!cameFrom.has(currentVisitedId)) return null
		return reconstructPath(effectiveStartId, currentVisitedId, cameFrom)
	}, [cameFrom, currentVisitedId, effectiveStartId])
	const partialPathVertexSet = useMemo(() => new Set(partialPath?.vertexPath ?? []), [partialPath])
	const partialPathEdgeSet = useMemo(() => new Set(partialPath?.edgePath ?? []), [partialPath])
	const visitedEdgeSet = useMemo(() => {
		const set = new Set<number>()
		if (!cameFrom) return set
		for (const node of visitedOrder.slice(0, visitedIndex)) {
			const step = cameFrom.get(node)
			if (step) set.add(step.edgeId)
		}
		return set
	}, [cameFrom, visitedOrder, visitedIndex])

	const visitedSteps = useMemo(() => {
		return visitedOrder.map(id => {
			const vertex = verticesById.get(id)
			const step = cameFrom?.get(id) ?? null
			const weight = step ? (edgesById.get(step.edgeId)?.weight ?? 0) : 0
			return {
				id,
				label: vertex?.label ?? String(id),
				edgeId: step?.edgeId ?? null,
				weight,
			}
		})
	}, [visitedOrder, verticesById, cameFrom, edgesById])

	const lastProgressRef = useRef<{ count: number; total: number; lastId: number | null } | null>(null)

	useEffect(() => {
		if (!onProgressChange) return
		const steps = visitedSteps.slice(0, visitedIndex)
		const total = steps.reduce((sum, step) => sum + step.weight, 0)
		const lastId = steps.length > 0 ? steps[steps.length - 1].id : null
		const nextProgress = { count: steps.length, total, lastId }
		const prev = lastProgressRef.current
		if (
			prev &&
			prev.count === nextProgress.count &&
			prev.total === nextProgress.total &&
			prev.lastId === nextProgress.lastId
		) {
			return
		}
		lastProgressRef.current = nextProgress
		onProgressChange({ steps, total })
	}, [visitedSteps, visitedIndex, onProgressChange])

	const handleVertexClick = (id: number) => {
		if (effectiveStartId === null) {
			setStartId(id)
			return
		}
		if (effectiveGoalId === null) {
			setGoalId(id)
			return
		}
		setStartId(id)
		setGoalId(null)
	}

	const mapKey = `map-${effectiveStartId ?? 'none'}-${effectiveGoalId ?? 'none'}-${path?.vertexPath?.length ?? 0}-${path?.edgePath?.length ?? 0}-${animationToken}-${zoomLevel}`

	return (
		<MapContainer
			key={mapKey}
			center={{ lat: 21.806299, lng: -102.296295 }}
			zoom={zoomLevel}
			className="h-[28rem] w-full max-w-4xl mx-auto rounded-xl border bg-card shadow-sm print-full print-map z-0"
		>
			<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
			{mapData.edges?.map(({ id, coordinates, name }) => (
				<Polyline
					key={`${id}-${visitedIndex}`}
					positions={coordinates.map(({ lat, lon }) => [lat, lon])}
					color={
						finalPathEdgeSet.has(id)
							? '#f97316'
							: partialPathEdgeSet.has(id)
								? '#38bdf8'
								: visitedEdgeSet.has(id)
									? '#a855f7'
									: '#111827'
					}
					weight={finalPathEdgeSet.has(id) ? 5 : partialPathEdgeSet.has(id) ? 4 : visitedEdgeSet.has(id) ? 3 : 2}
				>
					<Tooltip>{name}</Tooltip>
				</Polyline>
			))}
			{mapData.vertices?.map(({ id, coordinates, label }) => (
				<CircleMarker
					key={`${id}-${visitedIndex}`}
					center={{ lat: coordinates.lat, lng: coordinates.lon }}
					radius={6}
					color={
						id === effectiveStartId
							? '#16a34a'
							: id === effectiveGoalId
								? '#dc2626'
								: finalPathVertexSet.has(id)
									? '#f59e0b'
									: currentVisitedId === id
										? '#0ea5e9'
										: partialPathVertexSet.has(id)
											? '#38bdf8'
											: visitedSet.has(id)
												? '#a855f7'
												: '#2563eb'
					}
					fillColor={
						id === effectiveStartId
							? '#16a34a'
							: id === effectiveGoalId
								? '#dc2626'
								: finalPathVertexSet.has(id)
									? '#f59e0b'
									: currentVisitedId === id
										? '#0ea5e9'
										: partialPathVertexSet.has(id)
											? '#38bdf8'
											: visitedSet.has(id)
												? '#a855f7'
												: '#2563eb'
					}
					fillOpacity={0.9}
					eventHandlers={{
						click: () => handleVertexClick(id),
					}}
				>
					<Tooltip>{label}</Tooltip>
				</CircleMarker>
			))}
		</MapContainer>
	)
}
