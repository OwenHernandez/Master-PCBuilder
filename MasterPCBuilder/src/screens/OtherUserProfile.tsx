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

    useEffect(() => {
        setFriendWithUser(false);
        isFriend();
    }, [user]);

    function isFriend() {
        for (const friend of user.friends) {
            if (friend.id === userSelected.id) {
                setFriendWithUser(true);
            }
        }
    }

    async function addRemoveFriend() {
        try {
            const response = await axios.put(Globals.IP + "/api/v2/users/friends/" + user.id + "/" + userSelected.id, null, {headers: {"Authorization": "Bearer " + token}});

            let newUser = {
                ...user,
                friends: response.data.friends
            }
            for (const friend of newUser.friends) {
                const friendPicResponse = await RNFetchBlob.fetch(
                    'GET',
                    Globals.IP + '/api/v2/users/img/' + friend.id + '/' + friend.picture,
                    {Authorization: `Bearer ${token}`}
                );
                let picture = ""
                if (friendPicResponse.data !== Globals.IMG_NOT_FOUND) {
                    picture = friendPicResponse.base64();
                }
                friend.picture = picture;
            }

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
                <Image
                    source={{
                        uri: (userSelected.picture !== "") ? "data:image/jpeg;base64," + userSelected.picture : "https://www.softzone.es/app/uploads-softzone.es/2018/04/guest.png?x=480&quality=40"
                    }}
                    style={{
                        ...Styles.imageStyle,
                        borderColor: (darkMode) ? "white" : "black",
                        borderWidth: 1,
                        width: getIconSize(300),
                        height: getIconSize(300)
                    }}
                />
                <Text style={{fontSize: 40, color: (darkMode) ? "white" : "black"}}>{userSelected.nick}</Text>
                <Text style={{fontSize: 20, color: (darkMode) ? "white" : "black"}}>{userSelected.email}</Text>
            </View>
            <TouchableOpacity style={{...Styles.touchable, marginBottom: "3%", padding: "6%"}}
                              onPress={addRemoveFriend}>
                <Text
                    style={{
                        fontSize: getFontSize(20),
                        textAlign: 'center',
                        color: (darkMode) ? "white" : "black"
                    }}>{(!friendWithUser) ? "Add " : "Remove "}
                    Friend</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{...Styles.touchable, marginBottom: "3%", padding: "6%"}}
                              onPress={() => Alert.alert("No esta implementado")}>
                <Text style={{
                    fontSize: getFontSize(20),
                    textAlign: 'center',
                    color: (darkMode) ? "white" : "black"
                }}>Follow</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default OtherUserProfile