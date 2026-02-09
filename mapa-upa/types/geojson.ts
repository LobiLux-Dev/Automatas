export type AllowedGeneric = number[] | number

export interface GeoJSON {
	type: string
	features: Feature[]
}

export interface Feature<T extends AllowedGeneric = never> {
	type: FeatureType
	geometry: Geometry<T>
	properties: Properties
}

export interface Geometry<T extends AllowedGeneric> {
	type: GeometryType
	coordinates: Array<T>
}

export enum GeometryType {
	LineString = 'LineString',
	Point = 'Point',
}

export interface Properties {
	name: string
	tessellate?: boolean
}

export enum FeatureType {
	Feature = 'Feature',
}
