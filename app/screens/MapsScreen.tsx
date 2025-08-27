import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Alert, Platform, Text, FlatList, PermissionsAndroid } from 'react-native';
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
// Untuk Expo, gunakan `import * as Location from 'expo-location';`

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

    useEffect(() => {
        fetchCurrentLocation();
    }, []);

    useEffect(() => {
        fetchPlaces()
    }, [currentLocation, type, radius]);

    useEffect(() => {
        if (mapRef.current && currentLocation) {
            const coordinates = [
                { latitude: currentLocation.latitude, longitude: currentLocation.longitude },
                ...places.map(p => ({ latitude: p.lat, longitude: p.lng })),
            ];

            if (coordinates.length > 0) {
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
                return;
            }
        }

        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 60000,
        })
            .then(location => {
                setCurrentLocation(location);
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
                Alert.alert('Error', 'Failed to get location: ' + error.message);
            });

        console.log(`Check current location -> ${currentLocation}`);
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!currentLocation) {
        return (
            <View style={styles.container}>
                <Text>Tidak dapat menampilkan lokasi.</Text>
            </View>
        );
    }


    const openBottomSheet = () => {
        bottomSheetRef.current?.expand();
    };

    const closeBottomSheet = () => {
        bottomSheetRef.current?.close();
    };

    return (
        <View style={styles.container}>
            <MapView
                // provider={PROVIDER_GOOGLE}
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                    latitude: currentLocation?.latitude,
                    longitude: currentLocation?.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                showsUserLocation={true} // Menampilkan titik biru lokasi pengguna
                onMapReady={() => console.log('Map is ready')}
            >
                <Marker
                    coordinate={{
                        latitude: currentLocation?.latitude,
                        longitude: currentLocation?.longitude,
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
                    ) : (
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
    }
});

export default MapsScreen;
