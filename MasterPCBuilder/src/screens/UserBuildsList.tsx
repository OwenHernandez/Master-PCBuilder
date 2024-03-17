import {Alert, Dimensions, FlatList, Image, PixelRatio, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import React, {useEffect, useState} from 'react'
import {RootStackParamList} from '../navigations/StackNavigator';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import IComponentType from '../interfaces/IComponentType';
import IBuildType from '../interfaces/IBuildType';
import Component from '../components/Component';
import {Styles} from '../themes/Styles';
import Icon from 'react-native-vector-icons/Octicons';
import {usePrimaryContext} from '../contexts/PrimaryContext';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import {Globals} from '../components/Globals';
import HeaderScreen from "../components/HeaderScreen";

type Props = NativeStackScreenProps<RootStackParamList, 'UserBuildsList'>;

const UserBuildsList = (props: Props) => {
    const {user, darkMode, token} = usePrimaryContext();
    const {navigation, route} = props;
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;
    const [buildsList, setBuildsList] = useState([{}] as IBuildType[]);

    useEffect(() => {
        getUserBuilds();
    }, []);

    async function getUserBuilds() {
        try {
            const response = await axios.get(Globals.IP + "/api/v2/builds", {headers: {"Authorization": "Bearer " + token}});
            setBuildsList(response.data);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <View>
            <HeaderScreen name={"Your Builds"} navigation={navigation} profile={false} drawer={false}/>
            <View style={{height: "90%"}}>
                <FlatList
                    data={buildsList}
                    renderItem={(build) => {
                        return (
                            <TouchableOpacity style={Styles.touchable} onPress={() => {
                                console.log(buildsList);
                                console.log(build.item);
                                navigation.navigate("Builder", {
                                        build: build.item,
                                        builds: buildsList
                                    }
                                )
                            }}>
                                <View>
                                    <View style={{alignItems: "flex-start"}}>
                                        <Text style={{
                                            fontSize: getFontSize(30),
                                            color: (darkMode) ? "white" : "black",
                                            marginHorizontal: "10%"
                                        }}>{build.item.name}</Text>
                                        <Text style={{
                                            fontSize: getFontSize(20),
                                            color: (darkMode) ? "white" : "black",
                                            marginHorizontal: "10%",
                                            marginBottom: "5%"
                                        }}>{build.item.totalPrice}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                    keyExtractor={(comp, index) => index + ""}
                />
            </View>
        </View>
    )
}

export default UserBuildsList