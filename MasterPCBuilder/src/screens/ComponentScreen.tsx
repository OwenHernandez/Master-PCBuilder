import {
    Alert,
    Dimensions,
    Image,
    PixelRatio,
    SafeAreaView, ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import React, {useEffect} from 'react'
import IComponentType from '../interfaces/IComponentType'
import {usePrimaryContext} from '../contexts/PrimaryContext';
import {Styles} from '../themes/Styles';
import axios from "axios";
import RNFetchBlob from "rn-fetch-blob";
import {Globals} from "../components/Globals";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../navigations/StackNavigator";
import HeaderScreen from "../components/HeaderScreen";
import Material from "react-native-vector-icons/MaterialIcons";

type Props = NativeStackScreenProps<RootStackParamList, 'ComponentScreen'>;

const ComponentScreen = (props: Props) => {
    const {navigation, route} = props;
    const comp = route.params?.comp;
    const {darkMode, user, token, setUser} = usePrimaryContext();
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;

    async function addRemoveWishList() {
        try {
            const response = await axios.put(
                Globals.IP_HTTP + "/api/v2/users/" + user.id + "/wishlist/" + comp?.id,
                null,
                {headers: {Authorization: "Bearer " + token}}
            );
            setUser({...response.data, picture: user.picture, friends: [...user.friends]});
        } catch (err) {
            console.log(err);
        }
    }

    async function deleteComponent() {
        try {
            const response = await axios.delete(
                Globals.IP_HTTP + "/api/v2/components/" + comp?.id,
                {headers: {Authorization: "Bearer " + token}}
            );
            navigation.navigate("Components List");
        } catch (err) {
            console.log(err);
        }
    }

    async function editComponent() {
        navigation.navigate("EditComponent", {comp: comp});
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <HeaderScreen name={"Component"} navigation={navigation} profile={false}
                          drawer={false}/>
            <ScrollView style={{flex: 1}}>
                <View style={{flex: 1, margin: "5%"}}>
                    <Image
                        source={{
                            uri: "data:image/jpeg;base64," + comp?.image
                        }}
                        style={{margin: "2%", width: getIconSize(500), height: getIconSize(500), borderRadius: 10, alignSelf: "center"}}
                    />
                    <Text style={{
                        fontSize: getFontSize(30),
                        color: (darkMode) ? "white" : "black",
                        textAlign: "center"
                    }}>{comp?.name}</Text>

                    <View style={{flex: 1, width: getIconSize(1000), justifyContent: "flex-end"}}>
                        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                            <Text style={{
                                fontSize: getFontSize(20),
                                color: (darkMode) ? "white" : "black"
                            }}><Material name={"keyboard-arrow-right"} size={getIconSize(40)}/>Price:</Text>
                            <Text style={{
                                fontSize: getFontSize(20),
                                color: (darkMode) ? "white" : "black"
                            }}>{comp?.price}€</Text>
                        </View>
                        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                            <Text style={{
                                fontSize: getFontSize(20),
                                color: (darkMode) ? "white" : "black"
                            }}><Material name={"keyboard-arrow-right"} size={getIconSize(40)}/>Sold by:</Text>
                            <Text style={{
                                fontSize: getFontSize(20),
                                color: (darkMode) ? "white" : "black"
                            }}>{comp?.sellerName}</Text>
                        </View>
                        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                            <Text style={{
                                fontSize: getFontSize(20),
                                color: (darkMode) ? "white" : "black"
                            }}><Material name={"keyboard-arrow-right"} size={getIconSize(40)}/>Created by:</Text>
                            <Text style={{
                                fontSize: getFontSize(20),
                                color: (darkMode) ? "white" : "black"
                            }}>{comp?.userNick}</Text>
                        </View>
                        <View style={{}}>
                            <Text style={{
                                fontSize: getFontSize(20),
                                color: (darkMode) ? "white" : "black"
                            }}><Material name={"keyboard-arrow-right"} size={getIconSize(40)}/>Description:</Text>
                            <Text style={{
                                fontSize: getFontSize(15),
                                color: (darkMode) ? "white" : "black",
                                margin: "2%"
                            }}>{comp?.description}</Text>
                        </View>
                        {
                            (comp?.wished) ?
                                <TouchableOpacity
                                    style={{...Styles.touchable, alignItems: 'center', marginBottom: "3%"}}
                                    onPress={addRemoveWishList}>
                                    <Text style={{color: (darkMode) ? "white" : "black"}}>Remove From Wish List</Text>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity
                                    style={{...Styles.touchable, alignItems: 'center', marginBottom: "3%"}}
                                    onPress={addRemoveWishList}>
                                    <Text style={{color: (darkMode) ? "white" : "black"}}>Add to Wish List</Text>
                                </TouchableOpacity>
                        }
                        <TouchableOpacity style={{...Styles.touchable, alignItems: 'center', marginVertical: "3%"}}
                                          onPress={editComponent}>
                            <Text style={{color: (darkMode) ? "white" : "black"}}>Edit Component</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{...Styles.touchable, alignItems: 'center', marginVertical: "3%"}}
                                          onPress={deleteComponent}>
                            <Text style={{color: (darkMode) ? "white" : "black"}}>Delete Component</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ComponentScreen