import { FlatList, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import React from 'react'
import * as Icons from 'phosphor-react-native'

import { type Icon, type IconProps } from 'phosphor-react-native'
import { colors } from '../theme/theme'
import { PlaceType, placeTypeConfig, PlaceTypeLabel } from '../types/PlaceTypes'
import Typo from './Typo'

const PlaceChipList = ({ style, onPress, selected }: { style?: ViewStyle, onPress: (type: PlaceType) => void, selected?: PlaceType }) => {
    const data = Object.values(PlaceType);

    return (
        <FlatList
            style={style}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={data}
            keyExtractor={(item) => item}
            renderItem={({ item }) => {
                const { icon: Icon, color } = placeTypeConfig[item as PlaceType];
                return (
                    <TouchableOpacity
                        onPress={() => onPress(item as PlaceType)}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                            borderRadius: 20,
                            backgroundColor: selected === item ? color : colors.neutral400,
                            marginRight: 8,
                            height: 40,
                        }}
                    >
                        <Typo style={{ color: colors.white }}>{PlaceTypeLabel[item]}</Typo>
                    </TouchableOpacity>
                );
            }}
        />
    );
};

export default PlaceChipList;