import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Alert, Platform, Text, FlatList, PermissionsAndroid, Button, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import GetLocation, { Location } from 'react-native-get-location';
import { useMaps } from '../hooks/mapsContext';
import { PlaceType } from '../types/PlaceTypes';
import PlaceItem from '../components/PlaceItem';
import { PlaceTypeDropdown } from '../components/PlaceTypeDropdown';
import { RadiusDropdown } from '../components/RadiusDropdown';
import Typo from '../components/Typo';
import PlaceDetailSheet from './PlaceDetailSheet';
import { PlaceDetailSheetRef } from '../types/types';
import PlaceChipList from '../components/PlaceTypeChip';
import * as Icons from "phosphor-react-native";
import { colors } from '../theme/theme';

const MapsScreen = () => {
    const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
    const [loading, setLoading] = useState(true);
    const mapRef = useRef<MapView>(null);
    const { loadPlaces, places } = useMaps();
    const bottomSheetRef = useRef<PlaceDetailSheetRef>(null);
    const [type, setType] = useState<PlaceType>(PlaceType.Restaurant);
    const [radius, setRadius] = useState(5);
    const [placeId, setPlaceId] = useState<string>("");
    const [loadingPlaces, setLoadingPlaces] = useState(true);
    const [zoomLevel, setZoomLevel] = useState(0.03);

    useEffect(() => {
        fetchCurrentLocation();
    }, []);

    useEffect(() => {
        if (currentLocation) {
            fetchPlaces();
        }
    }, [currentLocation, type, radius]);

    useEffect(() => {
        if (mapRef.current && currentLocation) {
            const coordinates = [
                { latitude: currentLocation.latitude, longitude: currentLocation.longitude },
                ...places.map(p => ({ latitude: p.lat, longitude: p.lng, })),
            ];

            if (coordinates.length > 1) {
                mapRef.current.fitToCoordinates(coordinates, {
                    edgePadding: { top: 100, right: 100, bottom: 300, left: 100 },
                    animated: true,
                });
            }
        }
    }, [currentLocation, places]);


    const fetchPlaces = async () => {
        if (currentLocation) {
            setLoadingPlaces(true)
            await loadPlaces({
                lat: currentLocation.latitude.toString(),
                lng: currentLocation.longitude.toString(),
                radius: radius.toString(),
                type: type,
                limit: "10"
            });

            console.log("Places:", places);
            setLoadingPlaces(false)
        }
    }

    const fetchCurrentLocation = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: "Location Permission",
                    message: "This app needs access to your location.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );

            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                Alert.alert('Permission Denied', 'Location permission is required.');
                setLoading(false);
                return;
            }
        }

        try {
            const location = await GetLocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 60000,
            });

            setCurrentLocation(location);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            Alert.alert('Error', 'Failed to get location: ' + error);
        }
    };

    const openBottomSheet = () => {
        bottomSheetRef.current?.expand();
    };

    const closeBottomSheet = () => {
        bottomSheetRef.current?.close();
    };

    const zoomIn = () => {
        if (mapRef.current && currentLocation) {
            const newDelta = zoomLevel / 2;
            mapRef.current.animateToRegion({
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                latitudeDelta: newDelta,
                longitudeDelta: newDelta,
            }, 200);
            setZoomLevel(newDelta);
        }
    };

    const zoomOut = () => {
        if (mapRef.current && currentLocation) {
            const newDelta = zoomLevel * 2;
            mapRef.current.animateToRegion({
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                latitudeDelta: newDelta,
                longitudeDelta: newDelta,
            }, 200);
            setZoomLevel(newDelta);
        }
    };


    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!currentLocation && !loading) {
        return (
            <View style={styles.container}>
                <Text style={{ marginBottom: 16, fontSize: 16 }}>
                    Can't getting current Location.
                </Text>
                <Button
                    title="Try again"
                    onPress={fetchCurrentLocation}
                />
            </View>
        );
    }


    return (
        <View style={styles.container}>
            <MapView
                // provider={PROVIDER_GOOGLE}
                ref={mapRef}
                style={styles.map}
                region={
                    currentLocation ? {
                        latitude: currentLocation.latitude,
                        longitude: currentLocation.longitude,
                        latitudeDelta: zoomLevel,
                        longitudeDelta: zoomLevel,
                    } : undefined
                }
                showsUserLocation={true}
                onMapReady={() => console.log('Map is ready')}
                zoomControlEnabled
            >
                <Marker
                    coordinate={{
                        latitude: currentLocation!.latitude,
                        longitude: currentLocation!.longitude,
                    }}
                    title="Your Location"
                    description="You are here"
                    pinColor="red" // default merah
                />
                {places.map((place) => (
                    <Marker
                        key={place.id}
                        coordinate={{
                            latitude: place.lat,
                            longitude: place.lng,
                        }}
                        title={place.name}
                        description={place.address}
                        pinColor="blue" // 
                    />
                ))}
            </MapView>
            <View style={styles.zoomControls}>
                <TouchableOpacity onPress={zoomIn} style={styles.zoomButton}>
                    <Icons.Plus color={colors.black} size={24} />
                </TouchableOpacity>
                <TouchableOpacity onPress={zoomOut} style={styles.zoomButton}>
                    <Icons.Minus color={colors.black} size={24} />
                </TouchableOpacity>
            </View>
            <View style={styles.placesList}>
                <View style={styles.header}>
                    <Typo
                        size={24}
                        fontWeight="700"
                        style={{ padding: 24, flex: 1 }}
                    >
                        Nearby Places
                    </Typo>
                    <Typo
                        size={14}
                        fontWeight="500"
                        style={{ paddingRight: 16 }}
                    >
                        Radius
                    </Typo>
                    <RadiusDropdown value={radius} onChange={setRadius} />
                </View>

                <PlaceChipList
                    style={{ paddingLeft: 12 }}
                    onPress={setType}
                    selected={type}
                />

                <View style={{ height: 180 }}>
                    {loadingPlaces ? (
                        <View style={styles.loadingContainer}>
                            <Typo size={20} fontWeight="600">Loading...</Typo>
                        </View>
                    ) : places.length > 0 ? (
                        <FlatList
                            contentContainerStyle={{ paddingLeft: 12, paddingBottom: 24, }}
                            data={places}
                            renderItem={({ item }) => (
                                <PlaceItem
                                    uri={item.image_url}
                                    name={item.name}
                                    distance={item.distance}
                                    onPress={() => {
                                        setPlaceId(item.id)
                                        openBottomSheet()
                                    }}
                                />
                            )}
                            keyExtractor={(item) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        />
                    ) : (
                        <View style={styles.notFound}>
                            <Typo style={{ textAlign: "center" }} >Places not found</Typo>
                        </View>
                    )}
                </View>
            </View>

            <PlaceDetailSheet
                key={placeId}
                ref={bottomSheetRef}
                placeId={placeId}
                onClose={closeBottomSheet}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    placesList: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: 300
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    zoomControls: {
        position: 'absolute',
        right: 16,
        bottom: 320,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    zoomButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 4,
        marginBottom: 16
    },
    zoomText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    notFound: {
        alignContent: "center",
        justifyContent: "center",
        flex: 1
    }
});

export default MapsScreen;
