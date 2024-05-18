import {
    Alert,
    Dimensions,
    FlatList,
    Image,
    PixelRatio,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import React, {useEffect, useState} from 'react'
import {SafeAreaView} from 'react-native-safe-area-context'
import {RootStackParamList} from '../navigations/StackNavigator';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {usePrimaryContext} from '../contexts/PrimaryContext';
import useLogout from '../hooks/useLogout';
import {Styles} from '../themes/Styles';
import Octicon from 'react-native-vector-icons/Octicons';
import {DrawerActions} from '@react-navigation/native';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderScreen from "../components/HeaderScreen";
import axios from "axios";
import {Globals} from "../components/Globals";
import RNFetchBlob from "rn-fetch-blob";

type Props = NativeStackScreenProps<RootStackParamList, 'OtherUserProfile'>;

const OtherUserProfile = (props: Props) => {
    const {user, darkMode, token, setUser} = usePrimaryContext();
    const {navigation, route} = props;
    const userSelected = route.params.userSelected;
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;
    const [friendWithUser, setFriendWithUser] = useState(false);
    const [blockedUser, setBlockedUser] = useState(false);

    /**
     * `useEffect` hook that is executed when the `user` state changes.
     *
     * This hook does the following:
     * 1. Sets `friendWithUser` state to false.
     * 2. Calls the `isFriend` function to check if the selected user is a friend of the current user.
     * 3. Calls the `isBlocked` function to check if the selected user is blocked by the current user.
     *
     * As the dependency array contains `user`, this hook will run whenever the `user` state changes.
     */
    useEffect(() => {
        setFriendWithUser(false);
        isFriend();
        isBlocked();
    }, [user]);

    /**
     * Function to check if a user is a friend.
     *
     * This function iterates over the `friends` array of the current user.
     * For each friend, it checks if the friend's id is the same as the selected user's id.
     * If it finds a match, it sets the `friendWithUser` state to true and returns.
     * If it doesn't find a match after iterating over the entire array, it sets the `friendWithUser` state to false.
     *
     * @function
     */
    function isFriend() {
        for (const friend of user.friends) {
            if (friend.id === userSelected.id) {
                setFriendWithUser(true);
                return;
            }
        }
        setFriendWithUser(false);
    }

    /**
     * Function to check if a user is blocked.
     *
     * This function iterates over the `blockedUsers` array of the current user.
     * For each blocked user, it checks if the blocked user's id is the same as the selected user's id.
     * If it finds a match, it sets the `blockedUser` state to true and returns.
     * If it doesn't find a match after iterating over the entire array, it sets the `blockedUser` state to false.
     *
     * @function
     */
    function isBlocked() {
        for (const blockedUser of user.blockedUsers) {
            if (blockedUser.id === userSelected.id) {
                setBlockedUser(true);
                return;
            }
        }
        setBlockedUser(false);
    }

    /**
     * Asynchronous function to add or remove a friend.
     *
     * This function does the following:
     * 1. Sends a PUT request to the server to add or remove the selected user as a friend of the current user. The request headers contain the authorization token.
     * 2. Creates a new user object with the same properties as the current user, but with the `friends` property updated with the response data.
     * 3. Iterates over the `friends` array of the new user. For each friend, it sends a GET request to the server to fetch the friend's picture. The request headers contain the authorization token.
     * 4. If the response data is not equal to `Globals.IMG_NOT_FOUND`, it converts the response data to base64 and assigns it to the `picture` property of the friend object. Otherwise, it assigns an empty string to the `picture` property of the friend object.
     * 5. Calls the `isFriend` function to check if the selected user is a friend of the current user.
     * 6. Calls the `isBlocked` function to check if the selected user is blocked by the current user.
     * 7. Updates the `user` state with the new user object.
     *
     * @async
     * @function
     * @throws Will log any error that occurs during the execution of the function.
     */
    async function addRemoveFriend() {
        try {
            const response = await axios.put(Globals.IP_HTTP + "/api/v2/users/friends/" + user.id + "/" + userSelected.id, null, {headers: {"Authorization": "Bearer " + token}});

            let newUser = {
                ...user,
                friends: response.data.friends
            }
            for (const friend of newUser.friends) {
                const friendPicResponse = await RNFetchBlob.fetch(
                    'GET',
                    Globals.IP_HTTP + '/api/v2/users/img/' + friend.id + '/' + friend.picture,
                    {Authorization: `Bearer ${token}`}
                );
                let picture = ""
                if (friendPicResponse.data !== Globals.IMG_NOT_FOUND) {
                    picture = friendPicResponse.base64();
                }
                friend.picture = picture;
            }
            isFriend();
            isBlocked();
            setUser(newUser);
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Asynchronous function to add or remove a block on a user.
     *
     * This function does the following:
     * 1. Sends a PUT request to the server to add or remove the selected user from the blocked users of the current user. The request headers contain the authorization token.
     * 2. Creates a new user object with the same properties as the current user, but with the `friends` and `blockedUsers` properties updated with the response data.
     * 3. Iterates over the `friends` array of the new user. For each friend, it sends a GET request to the server to fetch the friend's picture. The request headers contain the authorization token.
     * 4. If the response data is not equal to `Globals.IMG_NOT_FOUND`, it converts the response data to base64 and assigns it to the `picture` property of the friend object. Otherwise, it assigns an empty string to the `picture` property of the friend object.
     * 5. Calls the `isFriend` function to check if the selected user is a friend of the current user.
     * 6. Calls the `isBlocked` function to check if the selected user is blocked by the current user.
     * 7. Updates the `user` state with the new user object.
     *
     * @async
     * @function
     * @throws Will log any error that occurs during the execution of the function.
     */
    async function addRemoveBlock() {
        try {
            const response = await axios.put(Globals.IP_HTTP + "/api/v2/users/block/" + user.id + "/" + userSelected.id, null, {headers: {"Authorization": "Bearer " + token}});

            let newUser = {
                ...user,
                friends: response.data.friends,
                blockedUsers: response.data.blockedUsers
            }
            for (const friend of newUser.friends) {
                const friendPicResponse = await RNFetchBlob.fetch(
                    'GET',
                    Globals.IP_HTTP + '/api/v2/users/img/' + friend.id + '/' + friend.picture,
                    {Authorization: `Bearer ${token}`}
                );
                let picture = ""
                if (friendPicResponse.data !== Globals.IMG_NOT_FOUND) {
                    picture = friendPicResponse.base64();
                }
                friend.picture = picture;
            }
            isFriend();
            isBlocked();
            setUser(newUser);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: (darkMode) ? "#242121" : "#F5F5F5"}}>
            <HeaderScreen name={userSelected.nick + "'s Profile"} navigation={navigation} profile={false}
                          drawer={false}/>
            <View style={{alignItems: 'center', margin: "5%"}}>
                {
                    (userSelected.picture !== "") ?
                        <Image
                            source={{
                                uri: "data:image/jpeg;base64," + userSelected.picture
                            }}
                            style={{
                                ...Styles.imageStyle,
                                borderColor: (darkMode) ? "white" : "black",
                                borderWidth: 1,
                                width: getIconSize(300),
                                height: getIconSize(300)
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
                                width: getIconSize(300),
                                height: getIconSize(300)
                            }}
                        />
                }
                <Text style={{fontSize: 40, color: (darkMode) ? "white" : "black"}}>{userSelected.nick}</Text>
                <Text style={{fontSize: 20, color: (darkMode) ? "white" : "black"}}>{userSelected.email}</Text>
            </View>
            <TouchableOpacity style={{...Styles.touchable, marginBottom: "3%", padding: "6%", opacity: (!blockedUser) ? 1 : 0.5}}
                              onPress={addRemoveFriend} disabled={(blockedUser)}>
                <Text
                    style={{
                        fontSize: getFontSize(20),
                        textAlign: 'center',
                        color: (darkMode) ? "white" : "black"
                    }}>{(!friendWithUser) ? "Add " : "Remove "}
                    Friend</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{...Styles.touchable, marginBottom: "3%", padding: "6%"}}
                              onPress={addRemoveBlock}>
                <Text style={{
                    fontSize: getFontSize(20),
                    textAlign: 'center',
                    color: (darkMode) ? "white" : "black"
                }}>{(!blockedUser ? "Block " : "UnBlock ")}user</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default OtherUserProfile