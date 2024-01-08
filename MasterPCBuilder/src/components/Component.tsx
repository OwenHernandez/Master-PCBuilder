import { Dimensions, Image, PixelRatio, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import IComponentType from '../interfaces/IComponentType'
import { usePrimaryContext } from '../contexts/PrimaryContext';

type Props = {
    comp: IComponentType;
}

const Component = (props: Props) => {
    const { comp } = props;
    const { darkMode } = usePrimaryContext();
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;

    return (
        <View style={{ flex: 1, flexDirection: 'row' }}>
            <Image
                source={{
                    uri: comp.compImage
                }}
                style={{ margin: "2%", width: getIconSize(300), height: getIconSize(300) }}
            />
            <View style={{ maxWidth: "65%" }}>
                <Text style={{ fontSize: 20, color: (darkMode) ? "white" : "black", marginRight: "10%" }}>{comp.name}</Text>
                <Text style={{ fontSize: 20, color: (darkMode) ? "white" : "black" }}>Pricing Nowadays: {comp.price}</Text>
                <Text style={{ fontSize: 15, color: (darkMode) ? "white" : "black" }}>Description: {"\n"}{comp.description}</Text>
                <Text style={{ fontSize: 15, color: (darkMode) ? "white" : "black" }}>Site Viewed: {"\n"}{comp.site}</Text>
            </View>
        </View>
    )
}

export default Component

const styles = StyleSheet.create({})