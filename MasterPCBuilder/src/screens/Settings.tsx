import { StyleSheet, Text, TouchableOpacity, View, Alert, Image, Switch, PixelRatio, Dimensions } from 'react-native';
import React, {useState} from 'react'
import { Styles } from '../themes/Styles';
import Icon from 'react-native-vector-icons/Octicons';
import { RootStackParamList } from '../navigations/StackNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { usePrimaryContext } from '../contexts/PrimaryContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerActions } from '@react-navigation/native';
import * as ImagePicker from 'react-native-image-picker';
import {ImagePickerResponse} from "react-native-image-picker";
import RNFetchBlob from "rn-fetch-blob";
import axios from "axios";
import {Globals} from "../components/Globals";

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const Settings = (props: Props) => {
    const { user, setUser, darkMode, setDarkMode, token } = usePrimaryContext();
    const { navigation, route } = props;
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;
    function openGallery(){
        ImagePicker.launchImageLibrary({mediaType:'photo'}, async (response: ImagePickerResponse) => {
            if (response.didCancel) {
                console.log('The user has cancelled the image picker');
            } else if (response.errorMessage) {
                console.log('Error while trying to open gallery:', response.errorMessage);
            } else {
                const imageFile = await RNFetchBlob.fs.readFile(response.assets[0].uri, 'base64');
                try {
                    const responseAxios = await axios.put(Globals.IP + "/api/v2/users/" + user.id,
                        {picture: response.assets[0].fileName, pictureBase64: imageFile, password: ""},
                        {headers: {'Authorization': "Bearer " + token}}
                    );
                    setUser({...user, picture: response.assets[0].uri});
                } catch (error) {
                    console.log("Error while trying to change the picture: ", error);
                }

            }
        });
    }

    async function changeDarkMode() {
        setDarkMode(!darkMode);
        if (darkMode) {
            await AsyncStorage.setItem("darkMode", "false");
        } else {
            await AsyncStorage.setItem("darkMode", "true");
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: (darkMode) ? "#242121" : "#F5F5F5" }}>
            <View style={Styles.headerView}>
                <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                    <Image
                        source={{
                            uri: user.picture
                        }}
                        style={{ ...Styles.imageStyle, borderColor: (darkMode) ? "white" : "black", borderWidth: 1, width: getIconSize(110), height: getIconSize(110) }}
                    />
                </TouchableOpacity>
                <Text style={{ ...Styles.headerText, color: (darkMode) ? "white" : "black", fontSize: getFontSize(20) }}>{route.name}</Text>
                <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
                    <Icon name='three-bars' size={getIconSize(90)} color={(darkMode) ? "white" : "black"}></Icon>
                </TouchableOpacity>
            </View>
            <View style={{ ...Styles.touchable, justifyContent: "center", flexDirection: "row", marginTop: "10%" }}>
                <Text style={{ fontSize: getFontSize(18), color: (darkMode) ? "white" : "black" }}>Change the mode to {darkMode ? "light" : "dark"}   </Text>
                <Switch
                    onValueChange={changeDarkMode}
                    thumbColor={darkMode ? "#ca2613" : "#444242"}
                    trackColor={{ true: "#CCCCCC", false: "#CCCCCC" }}
                    value={darkMode}
                />
            </View>
            {/*
            <TouchableOpacity style={{ ...Styles.touchable }} onPress={() => Alert.alert("Cambiaria el modo")}>
                <Text style={{ fontSize: 20, textAlign: 'center', color: (darkMode) ? "white" : "black" }}>Change Mode to Dark/Light</Text>
            </TouchableOpacity>
            */}
            <TouchableOpacity style={{ ...Styles.touchable }} onPress={() => Alert.alert("Te enviaria un email para cambiar la password")}>
                <Text style={{ fontSize: getFontSize(20), textAlign: 'center', color: (darkMode) ? "white" : "black" }}>Change Password</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ ...Styles.touchable }} onPress={openGallery}>
                <Text style={{ fontSize: getFontSize(20), textAlign: 'center', color: (darkMode) ? "white" : "black" }}>Change Profile Picture</Text>
            </TouchableOpacity>
        </View >
    )
}

export default Settings