/**
 * POI Types
 */
export type POICategory = 'landmark' | 'museum' | 'park' | 'restaurant' | 'viewpoint' | 'church';
export interface POI {
    id: string;
    name: string;
    description: string;
    coordinates: [number, number];
    category: POICategory;
    imageUrl?: string;
    thumbnailUrl?: string;
    estimatedTime?: number;
    openingHours?: string;
    closedDays?: string;
    website?: string;
    address?: string;
    ticketPrice?: string;
    tags?: string[];
}
export interface POICity {
    id: string;
    name: string;
    pois: POI[];
}
export interface CategoryInfo {
    id: POICategory;
    name: string;
    icon: string;
    color: string;
}
export interface CityInfo {
    id: string;
    name: string;
    poiCount: number;
}
export interface POIListResponse {
    city: string;
    count: number;
    pois: POI[];
}
export interface POIDetailResponse {
    poi: POI;
}
export interface CategoriesResponse {
    categories: CategoryInfo[];
}
export interface CitiesResponse {
    cities: CityInfo[];
}
export interface SearchResponse {
    city: string;
    query: string;
    count: number;
    pois: POI[];
}
export interface ErrorResponse {
    error: string;
    code: string;
}
//# sourceMappingURL=poi.types.d.ts.map