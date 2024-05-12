import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    PixelRatio,
    Dimensions,
    TextInput,
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
import Toast from "react-native-toast-message";
import IComponentType from "../interfaces/IComponentType";

type Props = NativeStackScreenProps<RootStackParamList, 'EditComponent'>;

type Select = {
    label: string,
    value: string
}

const EditComponent = (props: Props) => {
    const {user, darkMode, token} = usePrimaryContext();
    const {navigation, route} = props;
    const {comp} = route.params;
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState("");
    const [image64, setImage64] = useState("");
    const [selectedSeller, setSelectedSeller] = useState({} as Select);
    const [sellers, setSellers] = useState([]);
    const [types, setTypes] = useState([]);
    const [selectedType, setSelectedType] = useState({} as Select);
    const [component, setComponent] = useState({} as IComponentType);

    useEffect(() => {
        setComponent(comp);
        setSellers([]);
        setTypes([]);
        getSellers();
        getTypes();
        setName(comp?.name);
        setDescription(comp?.description);
        setPrice(comp?.price.toString());
        setImage64(comp?.image);
    }, []);

    async function getSellers() {
        try {
            const response = await axios.get(Globals.IP_HTTP + "/api/v2/sellers", {headers: {"Authorization": "Bearer " + token}});
            response.data.forEach((seller) => {
                let item = {
                    label: seller.name,
                    value: seller.name
                }
                setSellers(prevItems => [...prevItems, item]);
            });
            setSelectedSeller({label: comp?.sellerName, value: comp?.sellerName});
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
        setSelectedType({label: comp?.type, value: comp?.type});
    }

    async function editComponent() {
        if (!isNaN(Number(price))) {
            try {
                const updateResponse = await axios.put(Globals.IP_HTTP + "/api/v2/components/" + comp?.id, {
                    name,
                    description,
                    price: Number(price),
                    sellerName: selectedSeller.value,
                    type: selectedType.value,
                    amazon_price: comp?.amazon_price,
                    ebay_price: comp?.ebay_price,
                    image,
                    image64
                }, {headers: {"Authorization": "Bearer " + token}});
                comp.name = name;
                comp.description = description;
                comp.price = Number(price);
                comp.sellerName = selectedSeller.value;
                comp.type = selectedType.value;
                comp.image = image64;

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
                        
                        alignItems: "center",
                        marginHorizontal: "10%",
                        marginBottom: "2%"
                    }}>
                        <TextInput
                            placeholder='Name'
                            defaultValue={name}
                            style={{
                                borderWidth: 2,
                                borderColor: "#ca2613",
                                
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
                            defaultValue={description}
                            style={{
                                borderWidth: 2,
                                borderColor: "#ca2613",
                                
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
                            placeholder='Price in €'
                            defaultValue={price.toString()}
                            style={{
                                borderWidth: 2,
                                borderColor: "#ca2613",
                                
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
                            //
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
                            borderWidth: 2/*, */
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
                            //
                            width: getIconSize(800),
                            borderWidth: 2,
                            marginBottom: "4%",
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
                            borderWidth: 2/*, */
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
                                }}>Select a picture for the Component</Text>
                        }
                    </TouchableOpacity>
                    <TouchableOpacity style={{...Styles.touchable}} onPress={editComponent}>
                        <Text
                            style={{
                                fontSize: getFontSize(20),
                                color: (darkMode) ? "white" : "black",
                                textAlign: 'center'
                            }}>Edit Component</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <Toast />
        </SafeAreaView>
    )
}

export default EditComponent