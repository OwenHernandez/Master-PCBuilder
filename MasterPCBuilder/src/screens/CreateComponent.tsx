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
import Toast from "react-native-toast-message";

type Props = NativeStackScreenProps<RootStackParamList, 'CreateComponent'>;

const CreateComponent = (props: Props) => {
    const {user, darkMode, token} = usePrimaryContext();
    const {navigation, route} = props;
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState("");
    const [image64, setImage64] = useState("");
    const [selectedSeller, setSelectedSeller] = useState({});
    const [sellers, setSellers] = useState([]);
    const [types, setTypes] = useState([]);
    const [selectedType, setSelectedType] = useState({});

    useEffect(() => {
        setSellers([]);
        setTypes([]);
        getSellers();
        getTypes();
    }, []);

    async function getSellers() {
        try {
            const response = await axios.get(Globals.IP + "/api/v2/sellers", {headers: {"Authorization": "Bearer " + token}});
            response.data.forEach((seller) => {
                let item = {
                    label: seller.name,
                    value: seller.name
                }
                setSellers(prevItems => [...prevItems, item]);
            });
        } catch (e) {
            console.log(e);
        }
    }

    function getTypes() {
        setTypes([
            {label: "CPU", value: "CPU"},
            {label: "GPU", value: "GPU"},
            {label: "Motherboard", value: "Motherboard"},
            {label: "RAM", value: "RAM"},
            {label: "Storage", value: "Storage"},
            {label: "Case", value: "Case"},
            {label: "Case", value: "Case"},
            {label: "Cooling", value: "Cooling"},
            {label: "PSU", value: "PSU"},
            {label: "TV", value: "TV"},
            {label: "Keyboard", value: "Keyboard"},
            {label: "Mouse", value: "Mouse"},
            {label: "Headphones", value: "Headphones"},
            {label: "Speakers", value: "Speakers"},
            {label: "Microphone", value: "Microphone"}
        ]);
    }

    async function createComponent() {
        if (!isNaN(Number(price))) {
            try {
                const response = await axios.post(Globals.IP + "/api/v2/components", {
                    name,
                    description,
                    price: Number(price),
                    sellerName: selectedSeller,
                    type: selectedType,
                    image,
                    image64
                }, {headers: {"Authorization": "Bearer " + token}});
                setName("");
                setDescription("");
                setPrice("");
                setImage("");
                setImage64("");
                navigation.navigate("Components List", {components: []});
            } catch (e) {
                console.log(e);
            }
        } else {
            Toast.show({
                type: "error",
                position: "bottom",
                text1: "Price must be a number",
                text1Style: {fontSize: getFontSize(15)},
                visibilityTime: 3000
            });
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
            <ScrollView>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <View style={{
                        padding: "5%",
                        borderRadius: 20,
                        alignItems: "center",
                        marginHorizontal: "10%",
                        marginBottom: "2%"
                    }}>
                        <TextInput
                            placeholder='Name'
                            value={name}
                            style={{
                                borderWidth: 2,
                                borderColor: "#ca2613",
                                borderRadius: 20,
                                paddingHorizontal: "5%",
                                marginBottom: "10%",
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
                            value={description}
                            style={{
                                borderWidth: 2,
                                borderColor: "#ca2613",
                                borderRadius: 20,
                                paddingHorizontal: "5%",
                                marginBottom: "10%",
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
                        <TextInput
                            placeholder='Price'
                            value={price}
                            style={{
                                borderWidth: 2,
                                borderColor: "#ca2613",
                                borderRadius: 20,
                                paddingHorizontal: "5%",
                                width: getIconSize(800),
                                fontSize: getFontSize(20),
                                color: (darkMode) ? "white" : "black",
                                textAlign: 'center'
                            }}
                            keyboardType={"numeric"}
                            placeholderTextColor={"#a3a3a3"}
                            onChangeText={(text) => setPrice(text)}
                        ></TextInput>
                    </View>
                    <Dropdown
                        data={sellers}
                        labelField={"label"}
                        valueField={"value"}
                        value={selectedSeller}
                        placeholder={"Select a seller"}
                        onChange={(newValue) => setSelectedSeller(newValue.value)}
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

                    <Dropdown
                        data={types}
                        labelField={"label"}
                        valueField={"value"}
                        value={selectedType}
                        placeholder={"Select a type"}
                        onChange={(newValue) => setSelectedType(newValue.value)}
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
                        }}>{(image === "") ? "Select a picture for the component" : image}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{...Styles.touchable}} onPress={createComponent}>
                        <Text
                            style={{
                                fontSize: getFontSize(20),
                                color: (darkMode) ? "white" : "black",
                                textAlign: 'center'
                            }}>Create
                            Component</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <Toast />
        </SafeAreaView>
    )
}

export default CreateComponent