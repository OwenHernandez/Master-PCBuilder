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

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: (darkMode) ? "#242121" : "#F5F5F5"}}>
            <HeaderScreen name={"Search"} navigation={navigation} profile={false} drawer={true}/>
            <View style={{height: "90%"}}>
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    margin: "10%",
                    alignItems: "center"
                }}>
                    <TextInput
                        placeholder='Search a friend by name'
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
                                setUsersByNick(userList);
                            else
                                setUsersByNick(userList.filter((u) => u.nick.toLowerCase().includes(text)))
                        }}
                    ></TextInput>
                    <FontAwesome5Icon name="search" size={getIconSize(80)}
                                      color={(darkMode) ? "white" : "black"}/>
                </View>
                <FlatList
                    data={usersByNick}
                    renderItem={(u) => {
                        return (
                            <TouchableOpacity onPress={() => navigation.navigate("OtherUserProfile", {userSelected: u.item})}
                                              style={{
                                                  ...Styles.touchable,
                                                  flexDirection: "row",
                                                  alignItems: "center",
                                                  margin: "3%"
                                              }}>
                                <Image
                                    source={{
                                        uri: (u.item.picture !== "") ? "data:image/jpeg;base64," + u.item.picture : "https://www.softzone.es/app/uploads-softzone.es/2018/04/guest.png?x=480&quality=40",
                                    }}
                                    style={{
                                        ...Styles.imageStyle,
                                        borderColor: (darkMode) ? "white" : "black",
                                        borderWidth: 1,
                                        width: getIconSize(110),
                                        height: getIconSize(110)
                                    }}
                                />
                                <Text style={{
                                    color: (darkMode) ? "white" : "black",
                                    marginLeft: "5%",
                                    marginRight: "13%"
                                }}>{u.item.nick}</Text>
                            </TouchableOpacity>
                        )
                    }}
                    keyExtractor={(comp, index) => index + ""}
                />
            </View>
        </SafeAreaView>
    )
}

export default SearchUsers