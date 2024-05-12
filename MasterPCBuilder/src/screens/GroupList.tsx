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
import HeaderScreen from "../components/HeaderScreen";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import axios from "axios";
import {Globals} from "../components/Globals";
import IGroupChatType from "../interfaces/IGroupChatType";
import RNFetchBlob from "rn-fetch-blob";
import {FAB} from "react-native-elements";

type Props = NativeStackScreenProps<RootStackParamList, 'Group List'>;

const GroupList = (props: Props) => {
    const {navigation, route} = props;
    const {user, darkMode, token} = usePrimaryContext();
    const groups = route.params?.groups;
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;
    const [groupList, setGroupList] = useState([{}] as IGroupChatType[]);
    const [groupsByName, setGroupsByName] = useState([{}] as IGroupChatType[]);

    useEffect(() => {
        setGroupsByName([]);
        setGroupList([]);
        getGroups();
    }, [groups, user]);

    async function getGroups() {
        try {
            const response = await axios.get(Globals.IP_HTTP + "/api/v2/groups?userId=" + user.id, {headers: {Authorization: "Bearer " + token}});
            let picture = "";
            for (const group of response.data) {
                const groupPicResponse = await RNFetchBlob.fetch(
                    'GET',
                    Globals.IP_HTTP + '/api/v2/groups/img/' + group.id + '/' + group.picture,
                    {Authorization: `Bearer ${token}`}
                );
                picture = ""
                if (groupPicResponse.data !== Globals.IMG_NOT_FOUND) {
                    picture = groupPicResponse.base64();
                }
                group.picture = picture;
                for (const member of group.users) {
                    const userPicResponse = await RNFetchBlob.fetch(
                        'GET',
                        Globals.IP_HTTP + '/api/v2/users/img/' + member.id + '/' + member.picture,
                        {Authorization: `Bearer ${token}`}
                    );
                    picture = ""
                    if (userPicResponse.data !== Globals.IMG_NOT_FOUND) {
                        picture = userPicResponse.base64();
                    }
                    member.picture = picture;
                }
                const adminPicResponse = await RNFetchBlob.fetch(
                    'GET',
                    Globals.IP_HTTP + '/api/v2/users/img/' + group.admin.id + '/' + group.admin.picture,
                    {Authorization: `Bearer ${token}`}
                );
                picture = ""
                if (adminPicResponse.data !== Globals.IMG_NOT_FOUND) {
                    picture = adminPicResponse.base64();
                }
                group.admin.picture = picture;
                setGroupList(prevGroups => [...prevGroups, group]);
                setGroupsByName(prevGroups => [...prevGroups, group]);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <View style={{backgroundColor: (darkMode) ? "#242121" : "#F5F5F5"}}>
            <HeaderScreen name={"Groups"} navigation={navigation} profile={false} drawer={true}/>
            <View style={{height: "90%"}}>
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    margin: "5%",
                    alignItems: "center"
                }}>
                    <View style={{flex:7}}>
                        <TextInput
                            placeholder='Search a friend by name'
                            placeholderTextColor={"#a3a3a3"}
                            style={{
                                borderWidth: 2,
                                borderColor: "#ca2613",

                                paddingHorizontal: "5%",
                                width: "100%",
                                fontSize: getFontSize(15),
                                color: (darkMode) ? "white" : "black"
                            }}
                            onChangeText={(text) => {
                                if (text === "")
                                    setGroupsByName(groupList);
                                else
                                    setGroupsByName(groupList.filter((group) => group.name.toLowerCase().includes(text.toLowerCase())))
                            }}
                        ></TextInput>
                    </View>
                    <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                        <FontAwesome5Icon name="search" size={getIconSize(80)}
                                          color={(darkMode) ? "white" : "black"}/>
                    </View>
                </View>
                <FlatList
                    data={groupsByName}
                    renderItem={(group) => {
                        return (
                            <TouchableOpacity onPress={() => navigation.navigate("GroupChat", {group: group.item})}
                                              style={{
                                                  ...Styles.touchable,
                                                  flexDirection: "row",
                                                  alignItems: "center",
                                                  margin: "5%"
                                              }}>
                                <TouchableOpacity onPress={() => navigation.navigate("GroupChatDetails", {groupSelected: group.item})}>
                                    <Image
                                        source={{
                                            uri: (group.item.picture !== "") ? "data:image/jpeg;base64," + group.item.picture : "https://www.tenniscall.com/images/chat.jpg"
                                        }}
                                        style={{
                                            ...Styles.imageStyle,
                                            borderColor: (darkMode) ? "white" : "black",
                                            borderWidth: 1,
                                            width: getIconSize(110),
                                            height: getIconSize(110)
                                        }}
                                    />
                                </TouchableOpacity>
                                <Text style={{
                                    color: (darkMode) ? "white" : "black",
                                    marginLeft: "5%",
                                    marginRight: "13%"
                                }}>{group.item.name}</Text>
                            </TouchableOpacity>

                        )
                    }}
                    keyExtractor={(comp, index) => index + ""}
                />
                <View style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    marginBottom: "3%"
                }}>
                    <FAB
                        title="+"
                        placement="right"
                        titleStyle={{ fontSize: getFontSize(20), color: (darkMode) ? "white" : "black" }}
                        color={(darkMode) ? "#242121" : "#F5F5F5"}
                        style={{ borderColor: "#ca2613", borderWidth: 2, height: getIconSize(170), width: getIconSize(170)}}
                        onPress={() => navigation.navigate("CreateGroup")}
                    />
                </View>
            </View>
        </View>
    )
}

export default GroupList
