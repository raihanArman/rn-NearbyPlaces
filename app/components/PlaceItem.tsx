import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Typo from './Typo'
import { colors } from '../theme/theme'
import RNImage from './Image'
// import { CachedImage } from '@georstat/react-native-image-cache';

const PlaceItem = ({ uri, name, distance, onPress }: { uri: string, name: string, distance: number, onPress: () => void }) => {
    console.log(uri);
    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <RNImage
                uri={uri}
                style={{ width: "100%", height: 120 }}
            />
            <View style={styles.info}>
                <Typo size={20} color={colors.black} fontWeight="700" children={name} />
                <Typo size={14} color={colors.neutral600} fontWeight="500" children={distance + " km"} />
            </View>
        </TouchableOpacity>
    )
}

export default PlaceItem

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        backgroundColor: colors.white,
        margin: 12,

        // iOS shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,

        // Android shadow
        elevation: 6,
        width: 180,
        height: 110,
        // overflow untuk Android supaya shadow tetap terlihat
        overflow: Platform.OS === "android" ? "visible" : "visible",
    },
    info: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        gap: 8,
        alignContent: "flex-end",
        justifyContent: "flex-end",
    }
})