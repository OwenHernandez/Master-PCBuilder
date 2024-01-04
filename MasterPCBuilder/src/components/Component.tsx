import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import IComponentType from '../interfaces/IComponentType'
import { usePrimaryContext } from '../contexts/PrimaryContext';

type Props = {
    comp: IComponentType;
}

const Component = (props: Props) => {
    const { comp } = props;
    const { darkMode } = usePrimaryContext();
    return (
        <View style={{ flex: 1, flexDirection: 'row' }}>
            <Image
                source={{
                    uri: comp.compImage,
                    width: 150,
                    height: 150
                }}
                style={{ margin: "5%" }}
            />
            <View style={{ maxWidth: "56%" }}>
                <Text style={{ fontSize: 20, color: (darkMode) ? "white" : "black", marginRight: "10%" }}>Name: {comp.name}</Text>
                <Text style={{ fontSize: 20, color: (darkMode) ? "white" : "black" }}>Pricing Nowadays: {comp.price}</Text>
                <Text style={{ fontSize: 15, color: (darkMode) ? "white" : "black" }}>Description: {"\n"}{comp.description}</Text>
                <Text style={{ fontSize: 15, color: (darkMode) ? "white" : "black" }}>Site Viewed: {"\n"}{comp.site}</Text>
            </View>
        </View>
    )
}

export default Component

const styles = StyleSheet.create({})