import React from "react";
import { PlaceType } from "../types/PlaceTypes";
import { PlaceTypeDropdownProps } from "../types/types";
import Dropdown from "./Dropdown";

export const PlaceTypeDropdown = ({ value, onChange }: PlaceTypeDropdownProps) => {
    const optionsMap: Record<PlaceType, string> = {
        [PlaceType.Restaurant]: "Restaurant",
        [PlaceType.Cafe]: "Cafe",
        [PlaceType.GasStation]: "Gas Station",
        [PlaceType.Bank]: "Bank",
        [PlaceType.Pharmacy]: "Pharmacy",
        [PlaceType.Lodging]: "Lodging",
        [PlaceType.Park]: "Park",
        [PlaceType.Gym]: "Gym",
        [PlaceType.Hospital]: "Hospital",
        [PlaceType.ShoppingMall]: "Shopping Mall",
    };

    return (
        <Dropdown
            style={{ width: 180 }}
            options={Object.values(optionsMap)}
            selected={optionsMap[value]}
            onSelect={(val: string) => {
                const key = (Object.keys(optionsMap) as PlaceType[]).find(
                    (k) => optionsMap[k] === val
                );
                if (key) onChange(key);
            }}
            placeholder="Select type"
        />
    );
};