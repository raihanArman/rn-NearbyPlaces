import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Typo from './Typo'
import { colors } from '../theme/theme'
import RNImage from './Image'
import LinearGradient from 'react-native-linear-gradient';
// import { CachedImage } from '@georstat/react-native-image-cache';

const PlaceItem = ({ uri, name, distance, onPress }: { uri: string, name: string, distance: number, onPress: () => void }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <RNImage
                uri={uri}
                style={{ width: "100%", height: 120, borderRadius: 12 }}
            />
            {/* Gradient Overlay */}
            <LinearGradient
                colors={['rgba(0,0,0,0.8)', 'transparent']}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
                style={styles.gradient}
            />

            <View style={styles.info}>
                <Typo size={18} color={colors.white} fontWeight="700" children={name} />
                <Typo size={14} color={colors.neutral200} fontWeight="500" children={distance + " km"} />
            </View>
        </TouchableOpacity>
    )
}

export default PlaceItem;

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
        height: 120,
        overflow: Platform.OS === "android" ? "visible" : "visible",
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 70,
        borderEndEndRadius: 12,
        borderEndStartRadius: 12,
    },
    info: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        justifyContent: "flex-end",
    }
});
