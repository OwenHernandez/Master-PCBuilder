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
import React, {useEffect, useState} from 'react'
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
import {LineChart} from "react-native-chart-kit";

type Props = NativeStackScreenProps<RootStackParamList, 'ComponentScreen'>;

const ComponentScreen = (props: Props) => {
    const {navigation, route} = props;
    const comp = route.params?.comp;
    const {darkMode, user, token, setUser} = usePrimaryContext();
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;
    const [viewGraphic, setViewGraphic] = useState<boolean>(false)

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
    async function getDataComponent() {

    }
    async function editComponent() {
        navigation.navigate("EditComponent", {comp: comp});
    }
    const data = {
        labels: ["January", "February", "March", "April", "May", "June"],
        datasets: [
            {
                data: [20, 45, 28, 80, 99, 43],
                color: (opacity = 1) => `rgba(255,255,255, ${opacity})`, // optional
                strokeWidth: 2 // optional
            }
        ]
    };
    return (
        <SafeAreaView style={{flex: 1}}>
            <HeaderScreen name={"Component"} navigation={navigation} profile={false}
                          drawer={false}/>
            <ScrollView style={{flex: 1,}}>
                <View style={{flex: 1, margin: "5%",justifyContent:"center",alignItems:"center"}}>
                    <Image
                        source={{
                            uri: "data:image/jpeg;base64," + comp?.image
                        }}
                        style={{margin: "2%", width: getIconSize(500), height: getIconSize(500), borderRadius: 10, alignSelf: "center"}}
                    />
                    <View style={{flexDirection:"row",}}>
                        <Text style={{
                            fontSize: getFontSize(30),
                            color: (darkMode) ? "white" : "black",
                            textAlign: "center"
                        }}>{comp?.name}</Text>
                        <View style={{justifyContent:"center",alignItems:"center",marginHorizontal:20 }}>
                            <TouchableOpacity onPress={()=>{
                                setViewGraphic(!viewGraphic)
                            }}>
                                <Material name={"trending-up"} color={"white"} size={getIconSize(70)}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {
                        viewGraphic?<LineChart
                            data={data}
                            width={Dimensions.get('window').width / 1.1}
                            height={220}
                            chartConfig={{
                                backgroundGradientFrom: "#242121",
                                color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                                strokeWidth: 2, // optional, default 3
                                barPercentage: 0.5,
                                useShadowColorFromDataset: false // optional
                            }}
                        />:<></>
                    }
                    <View style={{flex: 1, width: getIconSize(1000), justifyContent: "flex-end"}}>
                        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                            <Text style={{
                                fontSize: getFontSize(20),
                                color: (darkMode) ? "white" : "black"
                            }}><Material name={"keyboard-arrow-right"} size={getIconSize(40)}/>Amazon Price:</Text>
                            <Text style={{
                                fontSize: getFontSize(20),
                                color: (darkMode) ? "white" : "black"
                            }}>{comp?.amazon_price>0?comp?.amazon_price+"€":"Not Available"}</Text>
                        </View>
                        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                            <Text style={{
                                fontSize: getFontSize(20),
                                color: (darkMode) ? "white" : "black"
                            }}><Material name={"keyboard-arrow-right"} size={getIconSize(40)}/>Ebay Price:</Text>
                            <Text style={{
                                fontSize: getFontSize(20),
                                color: (darkMode) ? "white" : "black"
                            }}>{comp?.ebay_price>0?comp?.ebay_price+"€":"Not Available"}</Text>
                        </View>
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