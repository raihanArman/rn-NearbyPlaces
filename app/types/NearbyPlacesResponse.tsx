export interface Place {
    id: string
    name: string
    type: string
    address: string
    lat: number
    lng: number
    distance: number
    rating: number
    price_level: number
    image_url: string
}

export interface NearbyPlacesQuery {
    lat: number
    lng: number
    radius: number
    type: string
    limit: number
}

export interface NearbyPlacesResponse {
    places: Place[]
    total: number
    query: NearbyPlacesQuery
}