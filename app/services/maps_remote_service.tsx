import { NearbyPlacesResponse } from "../types/NearbyPlacesResponse";
import { PlaceDetailResponse } from "../types/PlaceDetailresponse";
import { axiosInstance } from "./axios_instance";

export const getNearbyPlaces = async (lat: string, lng: string, radius: string, type: string, limit: string): Promise<NearbyPlacesResponse> => {
    try {
        const response = await axiosInstance.get("/api/places/nearby", {
            params: {
                lat: lat,
                lng: lng,
                radius: radius,
                type: type,
                limit: limit
            }
        })
        return response.data;
    } catch (error: any) {

        console.log("got error: ", error)
        const msg = error?.response?.data?.error || "Get Nearby Places Failed"

        throw new Error(msg)
    }
}

export const getPlaceDetail = async (placeId: string): Promise<PlaceDetailResponse> => {
    try {
        const response = await axiosInstance.get("/api/places/" + placeId)
        return response.data;
    } catch (error: any) {

        console.log("got error: id ->  ", placeId)
        const msg = error?.response?.data?.error || "Get Place Detail Failed"

        throw new Error(msg)
    }
}