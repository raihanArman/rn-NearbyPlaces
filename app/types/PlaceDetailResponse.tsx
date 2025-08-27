import { PlaceType } from "./PlaceTypes";

export interface PlaceHours {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
}

export interface PlaceDetailResponse {
    id: string;
    name: string;
    type: PlaceType;
    address: string;
    lat: number;
    lng: number;
    phone?: string;
    website?: string;
    rating?: number;
    price_level?: number;
    hours?: PlaceHours;
    image_url?: string;
    description?: string;
}