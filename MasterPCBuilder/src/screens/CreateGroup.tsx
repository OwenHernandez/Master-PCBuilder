import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    PixelRatio,
    Dimensions,
    TextInput,
    Alert,
    ScrollView, Image
} from 'react-native'
import React, {useEffect, useState} from 'react'
import {usePrimaryContext} from '../contexts/PrimaryContext';
import {Styles} from '../themes/Styles';
import {RootStackParamList} from '../navigations/StackNavigator';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import HeaderScreen from "../components/HeaderScreen";
import {Globals} from "../components/Globals";
import axios from "axios";
import * as ImagePicker from "react-native-image-picker";
import {ImagePickerResponse} from "react-native-image-picker";
import RNFetchBlob from "rn-fetch-blob";

type Props = NativeStackScreenProps<RootStackParamList, 'CreatePost'>;

const CreateGroup = (props: Props) => {
    const {user, darkMode, token} = usePrimaryContext();
    const {navigation, route} = props;
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [picture, setPicture] = useState("");
    const [pictureBase64, setPictureBase64] = useState("");

    async function createGroup() {
        try {
            const response = await axios.post(Globals.IP_HTTP + "/api/v2/groups", {
                name,
                description,
                picture,
                pictureBase64
            }, {headers: {"Authorization": "Bearer " + token}});
            navigation.navigate("Group List", {groups: []});
            setName("");
            setDescription("");
            setPicture("");
            setPictureBase64("");
        } catch (e) {
            console.log(e);
        }
    }

    function openGallery() {
        ImagePicker.launchImageLibrary({mediaType: 'photo'}, async (response: ImagePickerResponse) => {
            if (response.didCancel) {
                console.log('The user has cancelled the image picker');
            } else if (response.errorMessage) {
                console.log('Error while trying to open gallery:', response.errorMessage);
            } else {
                const imageFile = await RNFetchBlob.fs.readFile(response.assets[0].uri, 'base64');
                try {
                    setPicture(response.assets[0].fileName);
                    setPictureBase64(imageFile);
                } catch (error) {
                    console.log("Error while trying to change the picture: ", error);
                }

            }
        });
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: (darkMode) ? "#242121" : "#F5F5F5"}}>
            <HeaderScreen name={route.name} navigation={navigation} profile={false} drawer={true}/>
            <ScrollView>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <View style={{
                        padding: "10%",
                        
                        alignItems: "center",
                        marginHorizontal: "10%",
                        marginBottom: "2%"
                    }}>
                        <TextInput
                            placeholder='Name'
                            style={{
                                borderWidth: 2,
                                borderColor: "#ca2613",
                                
                                paddingHorizontal: "5%",
                                marginBottom: "20%",
                                width: getIconSize(800),
                                fontSize: getFontSize(20),
                                color: (darkMode) ? "white" : "black",
                                textAlign: 'center'
                            }}
                            placeholderTextColor={"#a3a3a3"}
                            onChangeText={(text) => setName(text)}
                        ></TextInput>
                        <TextInput
                            placeholder='Description'
                            style={{
                                borderWidth: 2,
                                borderColor: "#ca2613",
                                
                                paddingHorizontal: "5%",
                                width: getIconSize(800),
                                fontSize: getFontSize(15),
                                color: (darkMode) ? "white" : "black",
                                textAlign: 'center'
                            }}
                            placeholderTextColor={"#a3a3a3"}
                            numberOfLines={3}
                            multiline={true}
                            onChangeText={(text) => setDescription(text)}
                        ></TextInput>
                    </View>
                    <TouchableOpacity style={{...Styles.touchable}} onPress={openGallery}>
                        {
                            (pictureBase64 !== "") ?
                                <Image
                                    source={{
                                        uri: "data:image/jpeg;base64," + pictureBase64,
                                        width: getIconSize(300),
                                        height: getIconSize(300)
                                    }}
                                    style={{ ...Styles.imageStyle, borderColor: (darkMode) ? "white" : "black", borderWidth: 1, borderRadius: 10 }}
                                />
                                :
                                <Text style={{
                                    fontSize: getFontSize(20),
                                    textAlign: 'center',
                                    color: (darkMode) ? "white" : "black"
                                }}>Select a picture for the group</Text>
                        }
                    </TouchableOpacity>
                    <TouchableOpacity style={{...Styles.touchable}} onPress={createGroup}>
                        <Text
                            style={{
                                fontSize: getFontSize(20),
                                color: (darkMode) ? "white" : "black",
                                textAlign: 'center'
                            }}>Create
                            Group</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default CreateGroup