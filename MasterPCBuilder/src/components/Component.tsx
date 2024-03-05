import { Alert, Dimensions, Image, PixelRatio, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import IComponentType from '../interfaces/IComponentType'
import { usePrimaryContext } from '../contexts/PrimaryContext';
import { Styles } from '../themes/Styles';

type Props = {
    comp: IComponentType;
    wished: boolean;
}

const Component = (props: Props) => {
    const { comp, wished } = props;
    const { darkMode } = usePrimaryContext();
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;

    return (
        <View style={{ flex: 1, flexDirection: 'row' }}>
            <Image
                source={{
                    uri: comp?.image
                }}
                style={{ margin: "2%", width: getIconSize(300), height: getIconSize(300) }}
            />
            <View style={{ maxWidth: "65%" }}>
                <Text style={{ fontSize: 20, color: (darkMode) ? "white" : "black", marginRight: "10%" }}>{comp?.name}</Text>
                <Text style={{ fontSize: 20, color: (darkMode) ? "white" : "black" }}>{comp?.price}€</Text>
                <Text style={{ fontSize: 15, color: (darkMode) ? "white" : "black" }}>Description: {"\n"}{comp?.description}</Text>
                <Text style={{ fontSize: 15, color: (darkMode) ? "white" : "black" }}>Sold by:{"\n"}{comp?.sellerName}</Text>
                <Text style={{ fontSize: 15, color: (darkMode) ? "white" : "black" }}>Created by:{"\n"}{comp?.userNick}</Text>
                {
                    (wished) ?
                        <TouchableOpacity style={{ ...Styles.touchable, alignItems: 'center' }} onPress={() => Alert.alert("Quitaria de favorito")}>
                            <Text style={{ color: (darkMode) ? "white" : "black" }}>Remove From Wish List</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity style={{ ...Styles.touchable, alignItems: 'center' }} onPress={() => Alert.alert("Quitaria de favorito")}>
                            <Text style={{ color: (darkMode) ? "white" : "black" }}>Remove From Wish List</Text>
                        </TouchableOpacity>
                }
            </View>
        </View>
    )
}

export default Component

const styles = StyleSheet.create({})