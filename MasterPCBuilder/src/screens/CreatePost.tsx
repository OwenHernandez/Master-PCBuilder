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
            const response = await axios.get(Globals.IP_HTTP + "/api/v2/builds", {headers: {"Authorization": "Bearer " + token}});
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
            const response = await axios.post(Globals.IP_HTTP + "/api/v2/posts", {
                title,
                description,
                buildId: Number(selectedValue),
                image,
                image64
            }, {headers: {"Authorization": "Bearer " + token}});
            setTitle("");
            setDescription("");
            setSelectedValue({});
            setImage("");
            setImage64("");
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
                    setImage(response.assets[0].fileName);
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
            <ScrollView contentContainerStyle={{flexGrow:1}}>
                <View style={{flex: 1,justifyContent:"center"}}>
                    <View style={{
                        margin:"5%",
                    }}>
                        <TextInput
                            placeholder='Title'
                            style={{
                                borderWidth: 2,
                                borderColor: "#ca2613",
                                paddingHorizontal: "5%",
                                width:"100%",
                                fontSize: getFontSize(20),
                                color: (darkMode) ? "white" : "black",
                                textAlign: 'center'
                            }}
                            numberOfLines={5}
                            multiline={true}
                            maxLength={50}
                            placeholderTextColor={"#a3a3a3"}
                            onChangeText={(text) => setTitle(text)}
                        ></TextInput>
                    </View>
                    <View style={{
                        flex:2,
                        margin:"5%",
                        flexDirection:"row",
                    }}>
                        <View style={{flex:1, marginRight:"5%",flexDirection:"column"}}>
                            <Dropdown
                                data={items}
                                labelField={"label"}
                                valueField={"value"}
                                value={selectedValue}
                                onChange={(newValue) => setSelectedValue(newValue.value)}
                                style={{
                                    height: "50%", // Aumenta la altura del contenedor del Dropdown
                                    borderColor: "#ca2613",
                                    width: "100%",
                                    borderWidth: 2,
                                    marginBottom: "8%",
                                }}
                                placeholderStyle={{
                                    fontSize: getFontSize(20),
                                    color: (darkMode) ? "white" : "black",
                                    textAlign: 'center',
                                    lineHeight: getFontSize(20), // Ajusta la altura de la línea del texto
                                }}
                                iconStyle={{
                                    tintColor: '#ca2613',
                                    width: getIconSize(100),
                                    height: getIconSize(100)
                                }}
                                containerStyle={{
                                    backgroundColor: (darkMode) ? "#242121" : "#F5F5F5",
                                    borderColor: "#ca2613",
                                    borderWidth: 2,
                                    height: "50%"
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
                            <TouchableOpacity style={{borderWidth: 2,borderColor: "#ca2613",height:"47.5%",justifyContent:"center", alignItems: "center"}} onPress={openGallery}>
                                {
                                    (image64 !== "") ?
                                        <Image
                                            source={{
                                                uri: "data:image/jpeg;base64," + image64,
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
                                        }}>Select a picture for the Post</Text>
                                }
                            </TouchableOpacity>
                        </View>
                        <View style={{flex:1.5}}>
                            <TextInput
                                placeholder='Description'
                                maxLength={100}
                                style={{
                                    justifyContent:"flex-start",
                                    alignItems:"flex-start",
                                    borderWidth: 2,
                                    borderColor: "#ca2613",
                                    paddingHorizontal: "5%",
                                    width: "100%",
                                    height:"100%",
                                    fontSize: getFontSize(15),
                                    color: (darkMode) ? "white" : "black",
                                }}
                                placeholderTextColor={"#a3a3a3"}
                                numberOfLines={5}
                                multiline={true}
                                onChangeText={(text) => setDescription(text)}
                            ></TextInput>
                        </View>
                    </View>

                    <TouchableOpacity style={{...Styles.touchable,borderRadius:0}} onPress={createPost}>
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