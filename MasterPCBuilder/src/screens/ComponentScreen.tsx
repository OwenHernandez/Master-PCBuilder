import {
    Alert,
    Dimensions,
    Image, ImageBackground, Modal,
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
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import {BlurView} from "@react-native-community/blur";
import FontAwesome from "react-native-vector-icons/FontAwesome";

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
    const [meses, setMeses] = useState<Array<string>>([]);
    const [precios, setPrecios] = useState<Array<number>>([]);
    const [preciosAmazon, setPreciosAmazon] = useState<Array<number>>([]);
    const [preciosEbay, setPreciosEbay] = useState<Array<number>>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [modalVisible, setModalVisible] = useState(false)
    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };
    const toggleModal = () => {
        setModalVisible(!modalVisible);
    }
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
            const responseComponents=await axios.get(Globals.IP_HTTP + "/api/v2/components", {headers: {"Authorization": "Bearer " + token}});
            navigation.navigate("Components List",{components:responseComponents.data});
        } catch (err) {
            console.log(err);
        }
    }
    async function getDataComponent() {

    }
    async function editComponent() {
        navigation.navigate("EditComponent", {comp: comp});
    }

    useEffect(() => {
        let auxMeses = [];
        let auxPrecios = [];
        let auxPreciosAmazon = [];
        let auxPreciosEbay = [];
        let i = 0;
        comp.priceHistory.map((comp) => {
            let date = new Date(comp.date);
            let month = date.toLocaleString('default', {day:"numeric",month: 'numeric'})
            console.log(month)
            auxMeses.push(month);
            auxPrecios.push(comp.price);
            auxPreciosAmazon.push(comp.amazonPrice);
            auxPreciosEbay.push(comp.ebayPrice);
            i++;
        });
        setMeses(auxMeses);
        setPrecios(auxPrecios);
        setPreciosAmazon(auxPreciosAmazon);
        setPreciosEbay(auxPreciosEbay);
        console.log(precios)
        console.log(preciosAmazon)
        console.log(preciosEbay)
    }, []);

    const data = {
        labels: meses,
        datasets: [
            {
                data: precios,
                color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
                strokeWidth: 2 // optional
            },
            {
                data: preciosAmazon,
                color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`, // optional
                strokeWidth: 2 // optional
            },
            {
                data: preciosEbay,
                color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // optional
                strokeWidth: 2 // optional
            }
        ]
    };
    return (
        <SafeAreaView style={{flex: 1}}>
            <HeaderScreen name={"Component"} navigation={navigation} profile={false}
                          drawer={false}/>
            <ScrollView style={{flex: 1,}} contentContainerStyle={{flexGrow:1}}>
                <ImageBackground

                    source={{
                        uri: "data:image/jpeg;base64," + comp?.image
                    }}
                    style={{flex:1, width: "100%", height: "100%", borderRadius: 10, alignSelf: "center"}}
                    imageStyle={{opacity: 0.3}}
                >

                   <View style={{flex:1,margin:"5%", justifyContent:"flex-start",alignItems:"flex-end"}}>
                       <TouchableOpacity
                           onPress={() => {
                               console.log("wepa")
                               toggleModal()
                           }}
                       >
                            <FontAwesome5 name={"ellipsis-v"} size={getIconSize(50)}/>
                       </TouchableOpacity>
                   </View>
                    <View style={{flex: 1, margin: "5%",justifyContent:"flex-start",alignItems:"flex-start"}}>
                            {

                                (viewGraphic)?<LineChart
                                    data={data}
                                    width={Dimensions.get('window').width / 1.1}
                                    height={220}
                                    chartConfig={{
                                        backgroundGradientFrom: "#1E2923",
                                        backgroundGradientTo: "#08130D",
                                        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                                        strokeWidth: 2, // optional, default 3
                                        barPercentage: 0.5,
                                        useShadowColorFromDataset: false // optional
                                    }}
                                    bezier
                                />:<></>
                            }
                            <View style={{flex: 1, width: getIconSize(1000), justifyContent: "flex-end"}}>
                                <View style={{flexDirection:"row",}}>

                                        <Text style={{
                                            fontSize: getFontSize(30),
                                            color: (darkMode) ? "white" : "black",
                                            textAlign: "center"
                                        }}>{comp?.name}</Text>
                                    {
                                        (precios.length>0 && preciosAmazon.length>0 && preciosEbay.length>0)?
                                            <View style={{justifyContent:"center",alignItems:"center",marginHorizontal:20 }}>
                                                <TouchableOpacity onPress={()=>{
                                                    setViewGraphic(!viewGraphic)
                                                }}>
                                                    <Material name={"trending-up"} color={"white"} size={getIconSize(70)}/>
                                                </TouchableOpacity>
                                            </View>:<></>
                                    }

                                </View>
                                <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                                    <TouchableOpacity onPress={toggleOpen}
                                                      style={{
                                                          alignItems: "center",
                                                          justifyContent: "center",
                                                          flexDirection: "row"
                                                      }}
                                    >
                                        <Text style={{
                                            fontSize: getFontSize(20),
                                            color: (darkMode) ? "white" : "black"
                                        }}>
                                            {(isOpen) ?
                                                <Material name={"keyboard-arrow-down"} size={getIconSize(40)} />
                                                :
                                                <Material name={"keyboard-arrow-right"} size={getIconSize(40)} />
                                            }
                                            {"Price"}
                                        </Text>
                                    </TouchableOpacity>
                                    <Text style={{
                                        fontSize: getFontSize(20),
                                        color: (darkMode) ? "white" : "black"
                                    }}>{comp?.price}€</Text>

                                </View>
                                {isOpen && (
                                    <View style={{marginLeft:"5%"}}>
                                        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                                            <Text style={{
                                                fontSize: getFontSize(15),
                                                color: (darkMode) ? "white" : "black"
                                            }}><Material name={"keyboard-arrow-right"} size={getIconSize(40)}/>Amazon Price:</Text>
                                            <Text style={{
                                                fontSize: getFontSize(15),
                                                color: (darkMode) ? "white" : "black"
                                            }}>{comp?.amazon_price>0?comp?.amazon_price+"€":"Not Available"}</Text>
                                        </View>
                                        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                                            <Text style={{
                                                fontSize: getFontSize(15),
                                                color: (darkMode) ? "white" : "black"
                                            }}><Material name={"keyboard-arrow-right"} size={getIconSize(40)}/>Ebay Price:</Text>
                                            <Text style={{
                                                fontSize: getFontSize(15),
                                                color: (darkMode) ? "white" : "black"
                                            }}>{comp?.ebay_price>0?comp?.ebay_price+"€":"Not Available"}</Text>
                                        </View>
                                    </View>
                                )}
                                <View style={{flexDirection: "row", justifyContent: "space-between",marginLeft:"3%"}}>
                                    <Text style={{
                                        fontSize: getFontSize(20),
                                        color: (darkMode) ? "white" : "black"
                                    }}>Sold by:</Text>
                                    <Text style={{
                                        fontSize: getFontSize(20),
                                        color: (darkMode) ? "white" : "black"
                                    }}>{comp?.sellerName}</Text>
                                </View>
                                <View style={{flexDirection: "row", justifyContent: "space-between",marginLeft:"3%"}}>
                                    <Text style={{
                                        fontSize: getFontSize(20),
                                        color: (darkMode) ? "white" : "black"
                                    }}>Created by:</Text>
                                    <Text style={{
                                        fontSize: getFontSize(20),
                                        color: (darkMode) ? "white" : "black"
                                    }}>{comp?.userNick}</Text>
                                </View>
                                <View style={{marginLeft:"3%"}}>
                                    <Text style={{
                                        fontSize: getFontSize(20),
                                        color: (darkMode) ? "white" : "black"
                                    }}>Description:</Text>
                                    <Text style={{
                                        fontSize: getFontSize(15),
                                        color: (darkMode) ? "white" : "black",
                                        margin: "2%"
                                    }}>{comp?.description}</Text>
                                </View>

                            </View>
                        </View>
                    <Modal
                        style={{height:"70%"}}
                        animationType="slide"
                        transparent={true}

                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(!modalVisible)}
                    >
                        <View style={{...Styles.modalContainer,flex:1,backgroundColor: (darkMode) ? "#242121" : "#F5F5F5"}}>
                            <View style={{
                                flexDirection: "row",
                                justifyContent: "flex-end",
                                backgroundColor: (darkMode) ? "#242121" : "#F5F5F5"
                            }}>
                                <TouchableOpacity

                                    onPress={() => setModalVisible(!modalVisible)}>
                                    <FontAwesome5 style={{marginTop: "10%", margin: "2%"}} name='times'
                                              size={getIconSize(80)}
                                              color={(darkMode) ? "white" : "black"}></FontAwesome5>
                                </TouchableOpacity>
                            </View>
                            <View style={{
                                justifyContent: "center",
                                backgroundColor: (darkMode) ? "#242121" : "#F5F5F5"
                            }}>
                                {
                                    (comp?.wished) ?
                                        <TouchableOpacity
                                            style={{...Styles.touchable, alignItems: 'center', marginBottom: "3%"}}
                                            onPress={()=>{
                                            toggleModal()
                                            addRemoveWishList}}>
                                            <Text style={{color: (darkMode) ? "white" : "black"}}>Remove From Wish List</Text>
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity
                                            style={{...Styles.touchable, alignItems: 'center', marginBottom: "3%"}}
                                            onPress={()=>{
                                                toggleModal()
                                                addRemoveWishList}}>
                                            <Text style={{color: (darkMode) ? "white" : "black"}}>Add to Wish List</Text>
                                        </TouchableOpacity>
                                }
                                {(comp.userNick === user.nick)?<View>
                                    <TouchableOpacity style={{...Styles.touchable, alignItems: 'center', marginVertical: "3%"}}
                                                      onPress={()=>{
                                                          toggleModal()
                                                          editComponent}}>
                                        <Text style={{color: (darkMode) ? "white" : "black"}}>Edit Component</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{...Styles.touchable, alignItems: 'center', marginVertical: "3%"}}
                                                      onPress={()=>{
                                                          toggleModal()
                                                          deleteComponent()}}>
                                        <Text style={{color: (darkMode) ? "white" : "black"}}>Delete Component</Text>
                                    </TouchableOpacity>
                                    </View>:<></>}

                            </View>
                        </View>
                    </Modal>
                </ImageBackground>

            </ScrollView>
        </SafeAreaView>
    )
}

export default ComponentScreen