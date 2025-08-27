
import * as Icons from "phosphor-react-native";
import { colors } from "../theme/theme";

export enum PlaceType {
    Restaurant = "restaurant",
    Cafe = "cafe",
    GasStation = "gas_station",
    Bank = "bank",
    Pharmacy = "pharmacy",
    Lodging = "lodging",
    Park = "park",
    Gym = "gym",
    Hospital = "hospital",
    ShoppingMall = "shopping_mall",
}

export const PlaceTypeLabel: Record<PlaceType, string> = {
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

export const getPlaceLabel = (type: PlaceType): string => PlaceTypeLabel[type];


export const placeTypeConfig: Record<
    PlaceType,
    { icon: React.ElementType; color: string }
> = {
    [PlaceType.Restaurant]: {
        icon: Icons.ForkKnifeIcon,
        color: colors.red,
    },
    [PlaceType.Cafe]: {
        icon: Icons.CoffeeIcon,
        color: colors.primary,
    },
    [PlaceType.GasStation]: {
        icon: Icons.GasPumpIcon,
        color: colors.yellow,
    },
    [PlaceType.Bank]: {
        icon: Icons.BankIcon,
        color: colors.green,
    },
    [PlaceType.Pharmacy]: {
        icon: Icons.FirstAidIcon,
        color: colors.rose,
    },
    [PlaceType.Lodging]: {
        icon: Icons.BedIcon,
        color: colors.primaryDark,
    },
    [PlaceType.Park]: {
        icon: Icons.TreeIcon,
        color: colors.green,
    },
    [PlaceType.Gym]: {
        icon: Icons.BasketballIcon,
        color: colors.primary,
    },
    [PlaceType.Hospital]: {
        icon: Icons.HospitalIcon,
        color: colors.rose,
    },
    [PlaceType.ShoppingMall]: {
        icon: Icons.ShoppingBagIcon,
        color: colors.primary,
    },
};
