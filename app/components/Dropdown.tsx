
import { useState } from "react";
import { FlatList, Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import Typo from "./Typo";
import { colors } from "../theme/theme";
import { DropdownProps } from "../types/types";

const Dropdown = (props: DropdownProps) => {
    const [visible, setVisible] = useState(false);

    const handleSelect = (value: string) => {
        props.onSelect(value);
        setVisible(false);
    }

    return (
        <View style={props.style}>
            <TouchableOpacity
                style={styles.button}
                onPress={() => setVisible(true)}
            >
                <Typo style={{ color: colors.neutral400, fontSize: 12 }}>
                    {props.selected || props.placeholder}
                </Typo>
            </TouchableOpacity>

            <Modal
                visible={visible}
                transparent
                animationType="fade"
                onRequestClose={() => setVisible(false)}
            >
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPress={() => setVisible(false)}
                >
                    <View style={styles.modal}>
                        <FlatList
                            data={props.options}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.item}
                                    onPress={() => handleSelect(item)}
                                >
                                    <Typo style={{ color: colors.black }}>{item}</Typo>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        height: 30,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: colors.neutral500,
        borderRadius: 8,
        justifyContent: 'center',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    modal: {
        backgroundColor: '#fff',
        borderRadius: 8,
        maxHeight: 250,
    },
    item: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral500,
    },
});

export default Dropdown;
