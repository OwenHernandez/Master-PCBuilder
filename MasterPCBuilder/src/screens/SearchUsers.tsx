import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    PixelRatio,
    Dimensions,
    TextInput, FlatList, Image
} from 'react-native'
import React, {useEffect, useState} from 'react'
import {usePrimaryContext} from '../contexts/PrimaryContext';
import {Styles} from '../themes/Styles';
import {RootStackParamList} from '../navigations/StackNavigator';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import HeaderScreen from "../components/HeaderScreen";
import axios from "axios";
import {Globals} from "../components/Globals";
import RNFetchBlob from "rn-fetch-blob";
import IUserType from "../interfaces/IUserType";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

type Props = NativeStackScreenProps<RootStackParamList, 'SearchUsers'>;

const SearchUsers = (props: Props) => {
    const {user, darkMode, token, setUser} = usePrimaryContext();
    const {navigation, route} = props;
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;
    const [friendNick, setFriendNick] = useState("");
    const [userList, setUserList] = useState([{}] as IUserType[]);
    const [usersByNick, setUsersByNick] = useState([{}] as IUserType[]);

    useEffect(() => {
        getUsers();
    }, [user]);

    async function getUsers() {
        try {
            setUserList([]);
            setUsersByNick([]);
            const response = await axios.get(Globals.IP_HTTP + "/api/v2/users", {headers: {"Authorization": "Bearer " + token}});
            for (const userNotFriend of response.data) {
                if (user.nick !== userNotFriend.nick) {
                    if (user.friends.filter((friend) => friend.id === userNotFriend.id).length === 0) {
                        const userPicResponse = await RNFetchBlob.fetch(
                            'GET',
                            Globals.IP_HTTP + '/api/v2/users/img/' + userNotFriend.id + '/' + userNotFriend.picture,
                            {Authorization: `Bearer ${token}`}
                        );
                        let picture = ""
                        if (userPicResponse.data !== Globals.IMG_NOT_FOUND) {
                            picture = userPicResponse.base64();
                        }
                        userNotFriend.picture = picture;
                        setUserList(prevUsers => [...prevUsers, userNotFriend]);
                        setUsersByNick(prevUsers => [...prevUsers, userNotFriend]);
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }
    }

    function isBlocked(userSelected: IUserType): boolean {
        for (const blockedUser of user.blockedUsers) {
            if (blockedUser.id === userSelected.id) {
                return true;
            }
        }
        return false;
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: (darkMode) ? "#242121" : "#F5F5F5"}}>
            <HeaderScreen name={"Search"} navigation={navigation} profile={false} drawer={true}/>
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
                                    setUsersByNick(userList);
                                else
                                    setUsersByNick(userList.filter((u) => u.nick.toLowerCase().includes(text)))
                            }}
                        ></TextInput>
                    </View>
                    <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                        <FontAwesome5Icon name="search" size={getIconSize(80)}
                                          color={(darkMode) ? "white" : "black"}/>
                    </View>
                </View>
                <FlatList
                    data={usersByNick}
                    renderItem={(u) => {
                        if (!u.item.deleted) {
                            return (
                                <TouchableOpacity
                                    onPress={() => navigation.navigate("OtherUserProfile", {userSelected: u.item})}
                                    style={{
                                        ...Styles.touchable,
                                        flexDirection: "row",
                                        alignItems: "center",
                                        margin: "5%",
                                        opacity: (!isBlocked(u.item)) ? 1 : 0.5
                                    }}>
                                    {
                                        (u.item.picture !== "") ?
                                            <Image
                                                source={{
                                                    uri: "data:image/jpeg;base64," + u.item.picture,
                                                    width: getIconSize(100),
                                                    height: getIconSize(100)
                                                }}
                                                style={{
                                                    ...Styles.imageStyle,
                                                    borderColor: (darkMode) ? "white" : "black",
                                                    borderWidth: 1
                                                }}
                                            />
                                            :
                                            <Image
                                                source={
                                                    require("../../img/defaultProfilePic.png")
                                                }
                                                style={{
                                                    ...Styles.imageStyle,
                                                    borderColor: (darkMode) ? "white" : "black",
                                                    borderWidth: 1,
                                                    width: getIconSize(110),
                                                    height: getIconSize(110)
                                                }}
                                            />
                                    }
                                    <Text style={{
                                        color: (darkMode) ? "white" : "black",
                                        marginLeft: "5%",
                                        marginRight: "13%"
                                    }}>{u.item.nick}</Text>
                                </TouchableOpacity>
                            )
                        }
                    }}
                    keyExtractor={(comp, index) => index + ""}
                />
            </View>
        </SafeAreaView>
    )
}

export default SearchUsers
