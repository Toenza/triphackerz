export interface TimeMapRequest {
    arrival_searches: ArrivalSearches;
}

export interface ArrivalSearches {
    one_to_many: OneToMany[];
}

export interface OneToMany {
    id: string;
    travel_time: number;
    coords: Coords;
    transportation: Transportation;
    arrival_time_period: string;
    level_of_detail: LevelOfDetail;
    no_holes?: boolean;
    polygons_filter?: PolygonsFilter;
    snapping?: Snapping;
    render_mode?: string;
}

export interface Coords {
    lat: number;
    lng: number;
}

export interface LevelOfDetail {
    scale_type: string;
    level: string;
}

export interface PolygonsFilter {
    limit: number;
}

export interface Snapping {
    penalty: string;
    accept_roads: string;
}

export interface Transportation {
    type: string;
}
