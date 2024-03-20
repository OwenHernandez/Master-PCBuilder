import {
    Dimensions,
    FlatList,
    Image,
    PixelRatio,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native'
import React, {useEffect, useState} from 'react'
import {Styles} from '../themes/Styles';
import {usePrimaryContext} from '../contexts/PrimaryContext';
import {RootStackParamList} from '../navigations/StackNavigator';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import IUserType from '../interfaces/IUserType';
import HeaderScreen from "../components/HeaderScreen";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import axios from "axios";
import {Globals} from "../components/Globals";
import IComponentType from "../interfaces/IComponentType";
import Component from "../components/Component";
import RNFetchBlob from "rn-fetch-blob";

type Props = NativeStackScreenProps<RootStackParamList, 'Components List'>;

const ComponentsList = (props: Props) => {
    const {navigation, route} = props;
    const {user, darkMode, token} = usePrimaryContext();
    const components = route.params?.components;
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;
    const [componentsList, setComponentsList] = useState([{}] as IComponentType[]);
    const [componentsByName, setComponentsByName] = useState([{}] as IComponentType[]);
    const [wished, setWished] = useState(false);

    useEffect(() => {
        setComponentsList([]);
        setComponentsByName([]);
        getUserComponents();
        console.log(componentsList)
    }, [components]);

    async function getUserComponents() {
        let auxComps=[];
        try {
            const getCompsResponse = await axios.get(Globals.IP_HTTP + "/api/v2/components?userId=" + user.id, {headers: {"Authorization": "Bearer " + token}});
            const getCompsResponse = await axios.get(Globals.IP + "/api/v2/components" , {headers: {"Authorization": "Bearer " + token}});
            console.log(getCompsResponse.data);
            for (let comp of getCompsResponse.data) {
                const getImgResponse = await RNFetchBlob.fetch(
                    'GET',
                    Globals.IP_HTTP + '/api/v2/components/img/' + comp.id + '/' + comp.image,
                    {Authorization: `Bearer ${token}`}
                );
                let picture = ""
                if (getImgResponse.data !== Globals.IMG_NOT_FOUND) {
                    picture = getImgResponse.base64();
                }
                comp.image = picture;
                auxComps.push(comp);
            }
            setComponentsByName(auxComps);
            setComponentsList(auxComps);

        } catch (e) {
            console.log(e);
        }
    }

    return (
        <View style={{backgroundColor: (darkMode) ? "#242121" : "#F5F5F5"}}>
            <HeaderScreen name={"Components List"} navigation={navigation} profile={false} drawer={true}/>
            <View style={{height: "89%"}}>
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    margin: "10%",
                    alignItems: "center"
                }}>
                    <TextInput
                        placeholder='Search a component by name'
                        placeholderTextColor={"#a3a3a3"}
                        style={{
                            borderWidth: 2,
                            borderColor: "#ca2613",
                            borderRadius: 20,
                            paddingHorizontal: "5%",
                            width: "80%",
                            fontSize: getFontSize(15),
                            color: (darkMode) ? "white" : "black"
                        }}
                        onChangeText={(text) => {
                            if (text === "")
                                setComponentsByName(componentsList);
                            else
                                setComponentsByName(componentsList.filter((comp) => comp.name.toLowerCase().includes(text)));
                        }}
                    ></TextInput>
                    <FontAwesome5Icon name="search" size={getIconSize(80)}
                                      color={(darkMode) ? "white" : "black"}/>
                </View>
                <View style={{justifyContent:"center",alignItems:"center"}}>
                    <FlatList
                        data={componentsByName}
                        numColumns={2}
                        renderItem={(comp) => {
                            comp.item.wished = false;
                            user.componentsWanted?.forEach((compWished) => {
                                if (comp.item.id === compWished.id) {
                                    comp.item.wished = true;
                                }
                            });
                            return (
                                <TouchableOpacity style={{...Styles.touchable, width: getIconSize(500)}} onPress={() => navigation.navigate("ComponentScreen", { comp: comp.item, wished})}>
                                    <Component comp={comp.item} />
                                </TouchableOpacity>
                            )
                        }}
                        keyExtractor={(comp, index) => index + ""}
                    />
                </View>
            </View>
        </View>
    )
}

export default ComponentsList