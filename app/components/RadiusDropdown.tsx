import { RadiusDropdownProps } from "../types/types";
import Dropdown from "./Dropdown";

export const RadiusDropdown = ({ value, onChange }: RadiusDropdownProps) => {
    const radiusOptions = Array.from({ length: 10 }, (_, i) => i + 1); // 1..10 km

    return (
        <Dropdown
            style={{ width: 45, height: 30, marginRight: 24 }}
            options={radiusOptions.map((r) => r.toString())}
            selected={value.toString()}
            onSelect={(val) => onChange(Number(val))}
            placeholder="Radius"
        />
    );
};