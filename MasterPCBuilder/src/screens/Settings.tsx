import {
    Text,
    TouchableOpacity,
    View,
    Switch,
    PixelRatio,
    Dimensions,
    Modal,
    StyleSheet, TextInput
} from 'react-native';
import React, {useState} from 'react'
import {Styles} from '../themes/Styles';
import {RootStackParamList} from '../navigations/StackNavigator';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {usePrimaryContext} from '../contexts/PrimaryContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'react-native-image-picker';
import {ImagePickerResponse} from "react-native-image-picker";
import RNFetchBlob from "rn-fetch-blob";
import axios from "axios";
import {Globals} from "../components/Globals";
import HeaderScreen from "../components/HeaderScreen";
import Material from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const Settings = (props: Props) => {
    const {user, setUser, darkMode, setDarkMode, token} = usePrimaryContext();
    const {navigation, route} = props;
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;
    const [modalVisible, setModalVisible] = useState(false);
    const [newPassword, setNewPassword] = useState("");

    /**
     * Function to open the image gallery and allow the user to select a photo.
     *
     * This function does the following:
     * 1. Calls the `launchImageLibrary` function from the `ImagePicker` module with the `mediaType` option set to 'photo'.
     * 2. If the user cancels the image picker, it logs a message.
     * 3. If there is an error while trying to open the gallery, it logs the error message.
     * 4. If the user selects a photo, it reads the file as a base64 string.
     * 5. Sends a PUT request to the server to update the user's profile picture.
     * 6. The request body contains the filename of the selected photo, the base64 string of the photo, and an empty password field.
     * 7. The request headers contain the authorization token.
     * 8. If the request is successful, it updates the `user` state with the new profile picture.
     *
     * @function
     * @throws Will log any error that occurs during the execution of the function.
     */
    function openGallery() {
        ImagePicker.launchImageLibrary({mediaType: 'photo'}, async (response: ImagePickerResponse) => {
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

    /**
     * Asynchronous function to change the user's password.
     *
     * This function does the following:
     * 1. Toggles the `modalVisible` state.
     * 2. Sends a PUT request to the server to update the user's password.
     * 3. The request body contains an empty `picture` and `pictureBase64` fields, and the new password.
     * 4. The request headers contain the authorization token.
     * 5. If the request is successful, it updates the `user` state without changing its other properties.
     *
     * @async
     * @function
     * @throws Will log any error that occurs during the execution of the function.
     */
    async function changePassword() {
        setModalVisible(!modalVisible);
        try {
            await axios.put(Globals.IP_HTTP + "/api/v2/users/" + user.id,
                {picture: "", pictureBase64: "", password: newPassword},
                {headers: {'Authorization': "Bearer " + token}}
            );
            setUser({...user});
        } catch (error) {
            console.log("Error while trying to change the password: ", error);
        }
    }

    /**
     * Asynchronous function to change the application's theme mode.
     *
     * This function does the following:
     * 1. Toggles the `darkMode` state.
     * 2. If the `darkMode` state is true, it stores the string "false" in the local storage under the key "darkMode".
     * 3. If the `darkMode` state is false, it stores the string "true" in the local storage under the key "darkMode".
     *
     * @async
     * @function
     * @throws Will throw an error if there is an issue with AsyncStorage.
     */
    async function changeDarkMode() {
        setDarkMode(!darkMode);
        if (darkMode) {
            await AsyncStorage.setItem("darkMode", "false");
        } else {
            await AsyncStorage.setItem("darkMode", "true");
        }
    }

    return (
        <View style={{flex: 1, backgroundColor: (darkMode) ? "#242121" : "#F5F5F5"}}>
            <HeaderScreen name={route.name} navigation={navigation} profile={false} drawer={true}/>
            <View style={{...Styles.touchable, justifyContent: "center", flexDirection: "row", marginTop: "10%"}}>
                <Text style={{fontSize: getFontSize(18), color: (darkMode) ? "white" : "black"}}>Change the mode
                    to {darkMode ? "light" : "dark"}   </Text>
                <Switch
                    onValueChange={changeDarkMode}
                    thumbColor={darkMode ? "#ca2613" : "#444242"}
                    trackColor={{true: "#CCCCCC", false: "#CCCCCC"}}
                    value={darkMode}
                />
            </View>
            <TouchableOpacity style={{...Styles.touchable}} onPress={() => setModalVisible(true)}>
                <Text style={{fontSize: getFontSize(20), textAlign: 'center', color: (darkMode) ? "white" : "black"}}>Change
                    Password</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{...Styles.touchable}} onPress={openGallery}>
                <Text style={{fontSize: getFontSize(20), textAlign: 'center', color: (darkMode) ? "white" : "black"}}>Change
                    Profile Picture</Text>
            </TouchableOpacity>
            <View style={{justifyContent: "flex-end", alignItems: "flex-end", height: "50%"}}>
                <TouchableOpacity
                    style={{
                        ...Styles.touchable,
                        justifyContent: "center",
                        alignItems: "center",
                        margin: "5%",
                        borderRadius: 100,
                        padding: "4%",
                        paddingHorizontal: "5%"
                    }}
                    onPress={() => navigation.navigate("AdminChat")}
                >
                    <FontAwesome6Icon name={"question"} size={getIconSize(60)}
                                      color={(darkMode) ? "white" : "black"}></FontAwesome6Icon>
                </TouchableOpacity>
            </View>
            <Modal
                style={{flex: 1}}
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(!modalVisible)}
            >
                <View style={{...styles.modalContainer}}>
                    <View style={{...styles.modalContent, backgroundColor: (darkMode) ? "#242121" : "#F5F5F5"}}>
                        <View style={{flexDirection: "row", justifyContent: "space-between", margin: "5%"}}>
                            <Text style={{
                                fontSize: getFontSize(20),
                                color: (darkMode) ? "white" : "black",
                                marginHorizontal: "5%"
                            }}>Write the new password</Text>
                            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                                <Material name='close-box' size={getIconSize(80)}
                                          color={(darkMode) ? "white" : "black"}></Material>
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            placeholder='New password'
                            secureTextEntry={true}
                            placeholderTextColor={"#a3a3a3"}
                            style={{
                                borderWidth: 2,
                                borderColor: "#ca2613",
                                
                                paddingHorizontal: "5%",
                                marginHorizontal: "5%",
                                fontSize: getFontSize(15),
                                color: (darkMode) ? "white" : "black"
                            }}
                            onChangeText={(text) => setNewPassword(text)}
                        ></TextInput>
                        <TouchableOpacity
                            style={{
                                ...Styles.touchable,
                                margin: "5%",
                                padding: "5%",
                                
                            }}
                            onPress={changePassword}
                        >
                            <Text style={{
                                fontSize: getFontSize(20),
                                color: (darkMode) ? "white" : "black",
                                textAlign: "center"
                            }}>Change password</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default Settings

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: "rgba(0, 0, 0, 0.5)"
    },
    modalContent: {
        marginTop: "50%",
        width: "90%",
        borderColor: "#ca2613",
        borderWidth: 2
    }
});