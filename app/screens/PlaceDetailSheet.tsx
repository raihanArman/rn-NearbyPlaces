
import { colors } from "../theme/theme";
import { PlaceDetailSheetProps, PlaceDetailSheetRef } from "../types/types";
import { useEffect, useRef, useState } from "react";
import { Alert, Linking, Platform, View } from "react-native";
import { Image, SafeAreaView, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { forwardRef, useImperativeHandle } from "react";
import BottomSheet, { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Typo from "../components/Typo";
import { useMaps } from "../hooks/mapsContext";
import RNImage from "../components/Image";


const PlaceDetailSheet = forwardRef<PlaceDetailSheetRef, PlaceDetailSheetProps>(
    ({ placeId, onClose }, ref) => {
        const { place, loadPlaceDetail } = useMaps();
        const bottomSheetRef = useRef<BottomSheetModal>(null);
        const [isLoading, setIsLoading] = useState(true);

        useEffect(() => {
            handleLoadPlaceDetail();
        }, []);

        const handleLoadPlaceDetail = async () => {
            if (!placeId || placeId === "") return;
            console.log("Place ID: ", placeId)
            setIsLoading(true)
            await loadPlaceDetail(placeId)
            setIsLoading(false)
        }

        useImperativeHandle(ref, () => ({
            expand: () => bottomSheetRef.current?.expand(),
            close: () => bottomSheetRef.current?.close(),
        }));

        const header = () => {
            return (

                <View style={styles.header}>
                    <Typo size={20} fontWeight={'600'} style={{ color: colors.text }}>{place?.name}</Typo>
                    <TouchableOpacity onPress={onClose}>
                        <Typo size={16} fontWeight={'600'} style={{ color: colors.primary }}>Close</Typo>
                    </TouchableOpacity>
                </View>
            )
        }

        const image = () => {
            return (
                <View style={[styles.image, { marginBottom: 16 }]}>
                    <RNImage
                        uri={place?.image_url}
                        style={{ height: 200, width: '100%' }}
                    />
                </View>
            )
        }

        const description = () => {
            return (
                <View style={styles.description}>
                    <Typo size={16} fontWeight={'700'} style={{ color: colors.black, fontSize: 14 }}>Description</Typo>
                    <Typo size={16} fontWeight={'600'} style={{ color: colors.black, fontSize: 14 }}>{place?.description}</Typo>
                    <Typo size={16} fontWeight={'500'} style={{ color: colors.neutral600, fontSize: 14 }}>{`Address: ${place?.address}`}</Typo>
                    <Typo size={16} fontWeight={'500'} style={{ color: colors.neutral600, fontSize: 14 }}>{`Phone Number: ${place?.phone}`}</Typo>
                    <Typo size={16} fontWeight={'500'} style={{ color: colors.neutral600, fontSize: 14 }}>{`Website: ${place?.website}`}</Typo>
                    <Typo size={16} fontWeight={'500'} style={{ color: colors.neutral600, fontSize: 14 }}>{`Rating: ${place?.rating}`}</Typo>
                </View>
            )
        }

        const hours = () => {
            return (
                <View style={[styles.hours, { marginTop: 16 }]}>
                    <Typo size={16} fontWeight={'700'} style={{ color: colors.black, fontSize: 14 }}>Hours</Typo>
                    <Typo size={16} fontWeight={'500'} style={{ color: colors.neutral600, fontSize: 14 }}>{`Monday: ${place?.hours?.monday}`}</Typo>
                    <Typo size={16} fontWeight={'500'} style={{ color: colors.neutral600, fontSize: 14 }}>{`Tuesday: ${place?.hours?.tuesday}`}</Typo>
                    <Typo size={16} fontWeight={'500'} style={{ color: colors.neutral600, fontSize: 14 }}>{`Wednesday: ${place?.hours?.wednesday}`}</Typo>
                    <Typo size={16} fontWeight={'500'} style={{ color: colors.neutral600, fontSize: 14 }}>{`Thursday: ${place?.hours?.thursday}`}</Typo>
                    <Typo size={16} fontWeight={'500'} style={{ color: colors.neutral600, fontSize: 14 }}>{`Friday: ${place?.hours?.friday}`}</Typo>
                    <Typo size={16} fontWeight={'500'} style={{ color: colors.neutral600 }}>{`Saturday: ${place?.hours?.saturday}`}</Typo>
                    <Typo size={16} fontWeight={'500'} style={{ color: colors.neutral600 }}>{`Sunday: ${place?.hours?.sunday}`}</Typo>
                </View>
            )
        }

        const openGoogleMaps = (lat: number | undefined, lng: number | undefined) => {
            if (!lat || !lng) return;
            const url = Platform.select({
                ios: `maps://app?daddr=${lat},${lng}`,
                android: `google.navigation:q=${lat},${lng}`,
            });
            if (url) {
                Linking.openURL(url).catch(err => {
                    Alert.alert('Error', 'Failed to open map: ' + err.message);
                });
            }
        };

        const linkMaps = () => {
            return (
                <View style={[styles.linkMaps]}>
                    <TouchableOpacity style={styles.linkMapsText} onPress={() => openGoogleMaps(place?.lat, place?.lng)}>
                        <Typo size={16} fontWeight={'600'} style={styles.linkMapsText}>Open in Maps</Typo>
                    </TouchableOpacity>
                </View>
            )
        }

        const content = () => {
            return (
                <View>
                    {header()}
                    {image()}
                    {description()}
                    {hours()}

                    {linkMaps()}
                </View>
            )
        }

        return (
            <BottomSheet
                index={-1}
                ref={bottomSheetRef}
                snapPoints={['25%', '50%', '75%']}
                backdropComponent={(props) => (
                    <BottomSheetBackdrop
                        {...props}
                        appearsOnIndex={0}
                        disappearsOnIndex={-1}
                        pressBehavior="close"
                    />
                )}
            >
                <BottomSheetScrollView>
                    <View style={styles.container}>
                        {isLoading ? (
                            <View style={styles.loading}>
                                <Typo size={20} fontWeight={'600'} style={{ color: colors.text }}>Loading...</Typo>
                            </View>
                        ) : place ? (
                            <View>
                                {content()}
                            </View>
                        ) : <View style={styles.emptyContainer}>
                            <Typo size={20} fontWeight={'600'}>No feeds found</Typo>
                        </View>}
                    </View>
                </BottomSheetScrollView>
            </BottomSheet >
        );
    }
);


export default PlaceDetailSheet;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: colors.white,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 16,
    },
    close: {
        color: colors.primary,
        fontWeight: '600',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.neutral200,
    },
    name: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.black,
    },
    date: {
        fontSize: 12,
        color: colors.neutral500,
    },
    separator: {
        height: 1,
        backgroundColor: colors.neutral200,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 100
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 12,
    },
    description: {
        gap: 8,
    },
    hours: {
        marginVertical: 16,
        gap: 8,
    },
    linkMaps: {
        marginBottom: 30,
        marginTop: 16,
    },
    linkMapsText: {
        color: colors.white,
        fontWeight: '600',
        fontSize: 16,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: colors.red,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
});