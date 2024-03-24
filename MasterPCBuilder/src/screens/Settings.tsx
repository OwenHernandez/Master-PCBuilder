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
import HeaderScreen from "../components/HeaderScreen";
import {FAB} from "react-native-elements";
import IUserType from "../interfaces/IUserType";

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const Settings = (props: Props) => {
    const { user, setUser, darkMode, setDarkMode, token } = usePrimaryContext();
    const { navigation, route } = props;
    const admin: IUserType = {
        id: 26,
        nick: "Admin",
        email: "",
        picture: "",
        friends: [],
        componentsWanted: []
    };
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
                    const responseAxios = await axios.put(Globals.IP_HTTP + "/api/v2/users/" + user.id,
                        {picture: response.assets[0].fileName, pictureBase64: imageFile, password: ""},
                        {headers: {'Authorization': "Bearer " + token}}
                    );
                    setUser({...user, picture: imageFile});
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
            <HeaderScreen name={route.name} navigation={navigation} profile={false} drawer={true}/>
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
            <FAB
                title="?"
                placement="right"
                titleStyle={{ fontSize: 20, color: (darkMode) ? "white" : "black" }}
                color={(darkMode) ? "#242121" : "#F5F5F5"}
                style={{ borderColor: "#ca2613", borderWidth: 2 }}
                onPress={() => navigation.navigate("AdminChat")}
            />
        </View >
    )
}

export default Settings