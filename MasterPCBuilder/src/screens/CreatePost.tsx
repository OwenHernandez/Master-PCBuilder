import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    PixelRatio,
    Dimensions,
    TextInput,
    Alert,
    ScrollView
} from 'react-native'
import React, {useEffect, useState} from 'react'
import {usePrimaryContext} from '../contexts/PrimaryContext';
import {Styles} from '../themes/Styles';
import {RootStackParamList} from '../navigations/StackNavigator';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import HeaderScreen from "../components/HeaderScreen";
import DropdownComponent from "react-native-element-dropdown/lib/typescript/components/Dropdown";
import {Dropdown} from "react-native-element-dropdown";
import {Globals} from "../components/Globals";
import axios from "axios";
import * as ImagePicker from "react-native-image-picker";
import {ImagePickerResponse} from "react-native-image-picker";
import RNFetchBlob from "rn-fetch-blob";

type Props = NativeStackScreenProps<RootStackParamList, 'CreatePost'>;

const CreatePost = (props: Props) => {
    const {user, darkMode, token} = usePrimaryContext();
    const {navigation, route} = props;
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [image64, setImage64] = useState("");
    const [selectedValue, setSelectedValue] = useState({});
    const [showContent, setShowContent] = useState(false);
    const [items, setItems] = useState([]);

    const toggleContent = () => {
        setShowContent(!showContent);
    };

    useEffect(() => {
        setItems([]);
        getBuilds();
    }, []);

    async function getBuilds() {
        try {
            const response = await axios.get(Globals.IP + "/api/v2/builds", {headers: {"Authorization": "Bearer " + token}});
            response.data.forEach((build) => {
                let item = {
                    label: build.name,
                    value: build.id + ""
                }
                setItems(prevItems => [...prevItems, item]);
            });
        } catch (e) {
            console.log(e);
        }
    }

    async function createPost() {
        try {
            const response = await axios.post(Globals.IP + "/api/v2/posts", {
                title,
                description,
                buildId: Number(selectedValue),
                image,
                image64
            }, {headers: {"Authorization": "Bearer " + token}});
            navigation.navigate("Posts", {posts: []});
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
                    const responseAxios = await axios.put(Globals.IP + "/api/v2/users/" + user.id,
                        {picture: response.assets[0].fileName, pictureBase64: imageFile, password: ""},
                        {headers: {'Authorization': "Bearer " + token}}
                    );
                    setImage(responseAxios.data.picture);
                    setImage64(imageFile);
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
                        borderRadius: 20,
                        alignItems: "center",
                        marginHorizontal: "10%",
                        marginBottom: "2%"
                    }}>
                        <TextInput
                            placeholder='Title'
                            style={{
                                borderWidth: 2,
                                borderColor: "#ca2613",
                                borderRadius: 20,
                                paddingHorizontal: "5%",
                                marginBottom: "20%",
                                width: getIconSize(800),
                                fontSize: getFontSize(20),
                                color: (darkMode) ? "white" : "black",
                                textAlign: 'center'
                            }}
                            placeholderTextColor={"#a3a3a3"}
                            onChangeText={(text) => setTitle(text)}
                        ></TextInput>
                        <TextInput
                            placeholder='Description'
                            style={{
                                borderWidth: 2,
                                borderColor: "#ca2613",
                                borderRadius: 20,
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
                    <Dropdown
                        data={items}
                        labelField={"label"}
                        valueField={"value"}
                        value={selectedValue}
                        onChange={(newValue) => setSelectedValue(newValue.value)}
                        style={{
                            height: getIconSize(130),
                            backgroundColor: (darkMode) ? "#242121" : "#F5F5F5",
                            borderColor: "#ca2613",
                            //borderRadius: 20,
                            width: getIconSize(800),
                            borderWidth: 2,
                            marginBottom: "8%",
                        }}
                        placeholderStyle={{
                            fontSize: getFontSize(20),
                            color: (darkMode) ? "white" : "black",
                            textAlign: 'center'
                        }}
                        iconStyle={{
                            tintColor: '#ca2613',
                            width: getIconSize(100),
                            height: getIconSize(100)
                        }}
                        containerStyle={{
                            backgroundColor: (darkMode) ? "#242121" : "#F5F5F5",
                            borderColor: "#ca2613",
                            borderWidth: 2/*, borderRadius: 20*/
                        }}
                        itemTextStyle={{
                            fontSize: getFontSize(20),
                            color: (darkMode) ? "white" : "black",
                            textAlign: 'center'
                        }}
                        activeColor={"#ca2613"}
                        selectedTextStyle={{
                            fontSize: getFontSize(20),
                            color: (darkMode) ? "white" : "black",
                            textAlign: 'center'
                        }}
                    />
                    <TouchableOpacity style={{...Styles.touchable}} onPress={openGallery}>
                        <Text style={{
                            fontSize: getFontSize(20),
                            textAlign: 'center',
                            color: (darkMode) ? "white" : "black"
                        }}>Select a picture for the post</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{...Styles.touchable}} onPress={createPost}>
                        <Text
                            style={{
                                fontSize: getFontSize(20),
                                color: (darkMode) ? "white" : "black",
                                textAlign: 'center'
                            }}>Create
                            Post</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default CreatePost