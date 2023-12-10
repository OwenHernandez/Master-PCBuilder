import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RootStackParamList } from '../navigations/StackNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import IComponentType from '../interfaces/IComponentType';
import IBuildType from '../interfaces/IBuildType';
import Component from '../components/Component';

type Props = NativeStackScreenProps<RootStackParamList, 'UserBuildsList'>;

const UserBuildsList = (props: Props) => {
    const { navigation } = props;
    const [buildsList, setBuildsList] = useState([{}] as IBuildType[]);
    useEffect(() => {
        //Aqui se llamaria a la base de datos para conseguir sus builds
    }, []);

    return (
        <View>
            <FlatList
                data={buildsList}
                renderItem={(build) => {
                    return (
                        <FlatList
                            data={build.item.components}
                            renderItem={(comp) => {
                                return (
                                    <Component comp={comp.item} />
                                )
                            }}
                        />
                    )
                }}
                keyExtractor={(comp, index) => index + ""}
            />
        </View>
    )
}

export default UserBuildsList

const styles = StyleSheet.create({})