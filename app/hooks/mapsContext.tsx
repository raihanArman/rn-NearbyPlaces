import { createContext, ReactNode, useContext, useState } from "react"
import { MapsContextProps } from "../types/types"
import { Place } from "../types/NearbyPlacesResponse"
import { getNearbyPlaces, getPlaceDetail } from "../services/maps_remote_service"
import { PlaceDetailResponse } from "../types/PlaceDetailresponse"

export const MapsContext = createContext<MapsContextProps>({
    places: [],
    place: null,
    loadPlaces: async () => { },
    loadPlaceDetail: async () => { },
})

export const MapsProvider = ({ children }: { children: ReactNode }) => {
    const [places, setPlaces] = useState<Place[]>([])
    const [place, setPlace] = useState<PlaceDetailResponse | null>(null)


    const loadPlaces = async ({ lat, lng, radius, type, limit }: { lat: string, lng: string, radius: string, type: string, limit: string }) => {

        console.log("loadPlaces Fetching remote places...")
        try {
            console.log("Fetching remote places...")
            const remoteResponse = await getNearbyPlaces(lat, lng, radius, type, limit)
            console.log("Remote response:", remoteResponse)
            if (remoteResponse.places.length > 0) {
                const result = remoteResponse.places
                setPlaces(result)
            }
        } catch (error) {
            console.error("Failed to fetch remote places:", error)
        }
    }

    const loadPlaceDetail = async (placeId: string) => {
        console.log("loadPlaceDetail Fetching remote place detail...")
        try {
            console.log("Fetching remote place detail...")
            const remoteResponse = await getPlaceDetail(placeId)
            console.log("Remote response:", remoteResponse)
            if (remoteResponse) {
                const result = remoteResponse
                setPlace(result)
            }
        } catch (error) {
            console.error("Failed to fetch remote place detail:", error)
        }
    }


    return (
        <MapsContext.Provider value={{
            places,
            place,
            loadPlaces,
            loadPlaceDetail,
        }}>
            {children}
        </MapsContext.Provider>
    )
}

export const useMaps = () => useContext(MapsContext)