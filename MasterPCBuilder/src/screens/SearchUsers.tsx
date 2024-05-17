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

    /**
     * `useEffect` hook that is executed when the `user` state changes.
     *
     * This hook calls the `getUsers` function to fetch the list of users.
     * As the dependency array contains `user`, this hook will run whenever the `user` state changes.
     */
    useEffect(() => {
        getUsers();
    }, [user]);

    /**
     * Asynchronous function to fetch the list of users from the server.
     *
     * This function does the following:
     * 1. Initializes the `userList` and `usersByNick` states to empty arrays.
     * 2. Sends a GET request to the server to fetch the list of users. The request headers contain the authorization token.
     * 3. Iterates over the response data, which is an array of users.
     * 4. For each user, if the user's nickname is not the same as the current user's nickname and the user is not a friend of the current user, it sends a GET request to the server to fetch the user's profile picture.
     * 5. If the response data is not equal to `Globals.IMG_NOT_FOUND`, it converts the response data to base64 and assigns it to the `picture` property of the user.
     * 6. Adds the user to the `userList` and `usersByNick` states.
     *
     * @async
     * @function
     * @throws Will log any error that occurs during the execution of the function.
     */
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

    /**
     * Function to check if a user is blocked.
     *
     * This function iterates over the `blockedUsers` array of the current user.
     * For each blocked user, it checks if the blocked user's id is the same as the selected user's id.
     * If it finds a match, it returns true, indicating that the selected user is blocked.
     * If it doesn't find a match after iterating over the entire array, it returns false, indicating that the selected user is not blocked.
     *
     * @function
     * @param {IUserType} userSelected - The user to check if they are blocked.
     * @returns {boolean} - Returns true if the selected user is blocked, false otherwise.
     */
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
