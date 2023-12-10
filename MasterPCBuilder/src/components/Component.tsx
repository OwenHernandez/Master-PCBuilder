import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import IComponentType from '../interfaces/IComponentType'

type Props = {
    comp: IComponentType;
}

const Component = (props: Props) => {
    const { comp } = props;
    return (
        <View>
            <Image
                source={{
                    uri: comp.compImage
                }}
            />
            <Text>{comp.name}</Text>
            <Text>{comp.description}</Text>
        </View>
    )
}

export default Component

const styles = StyleSheet.create({})