import { TextProps, TextStyle, ViewStyle } from "react-native";
import { Place } from "./NearbyPlacesResponse";
import { PlaceType } from "./PlaceTypes";
import { PlaceDetailResponse } from "./PlaceDetailresponse";

export type MapsContextProps = {
    places: Place[];
    place: PlaceDetailResponse | null;
    loadPlaces: ({ lat, lng, radius, type, limit }: { lat: string, lng: string, radius: string, type: string, limit: string }) => Promise<void>;
    loadPlaceDetail: (placeId: string) => Promise<void>;
}

export type TypoProps = {
    size?: number;
    color?: string;
    fontWeight?: TextStyle["fontWeight"];
    children: any | null;
    style?: TextStyle;
    textProps?: TextProps;
};

export interface PlaceTypeDropdownProps {
    value: PlaceType;
    onChange: (value: PlaceType) => void;
}

export interface RadiusDropdownProps {
    value: number;
    onChange: (value: number) => void;
}

export type DropdownProps = {
    options: string[];
    selected: string;
    onSelect: (value: string) => void;
    placeholder?: string;
    style?: ViewStyle;
};

export interface PlaceDetailSheetProps {
    placeId: string;
    onClose?: () => void;
}

export interface PlaceDetailSheetRef {
    expand: () => void;
    close: () => void;
}
