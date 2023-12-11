import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import IComponentType from '../interfaces/IComponentType'

type Props = {
    comp: IComponentType;
}

const Component = (props: Props) => {
    const { comp } = props;
    return (
        <View style={{ flex: 1, flexDirection: 'row' }}>
            <Image
                source={{
                    uri: comp.compImage,
                    width: 150,
                    height: 150
                }}
            />
            <View style={{ maxWidth: "60%" }}>
                <Text style={{ fontSize: 20 }}>Name: {comp.name}</Text>
                <Text style={{ fontSize: 20 }}>Pricing Nowadays: {comp.price}</Text>
                <Text style={{ fontSize: 15 }}>Description: {"\n"}{comp.description}</Text>
            </View>
        </View>
    )
}

export default Component

const styles = StyleSheet.create({})