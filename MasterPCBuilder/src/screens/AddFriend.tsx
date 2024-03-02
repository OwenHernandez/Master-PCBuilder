import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    Image,
    PixelRatio,
    Dimensions,
    TextInput,
    FlatList,
    Alert
} from 'react-native'
import React, {useEffect, useState} from 'react'
import {usePrimaryContext} from '../contexts/PrimaryContext';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import Octicons from 'react-native-vector-icons/Octicons';
import {DrawerActions} from '@react-navigation/native';
import {Styles} from '../themes/Styles';
import {RootTabsParamList} from '../navigations/SocialTabs';
import {RootStackParamList} from '../navigations/StackNavigator';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import DropDownPicker, {ItemType, ValueType} from 'react-native-dropdown-picker';
import IBuildType from '../interfaces/IBuildType';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicon from 'react-native-vector-icons/Octicons';
import HeaderScreen from "../components/HeaderScreen";
import axios from "axios";
import {Globals} from "../components/Globals";

type Props = NativeStackScreenProps<RootStackParamList, 'AddFriend'>;

const AddFriend = (props: Props) => {
    const {user, darkMode, token, setUser} = usePrimaryContext();
    const {navigation, route} = props;
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;
    const [friendNick, setFriendNick] = useState("");

    async function addFriend() {
        try {
            const getFriend = await axios.get(Globals.IP + "/api/v2/users?nick=" + friendNick, {headers: {"Authorization": "Bearer " + token}});
            const response = await axios.put(Globals.IP + "/api/v2/users/friends/" + user.id + "/" + getFriend.data.id, null,{headers: {"Authorization": "Bearer " + token}});
            setUser(prevUser => {
                return {
                    ...prevUser,
                    friends: response.data.friends
                }
            });
            setFriendNick("");
            navigation.navigate("Friends List");
        } catch (e) {
            console.log(e);
        }

    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: (darkMode) ? "#242121" : "#F5F5F5"}}>
            <HeaderScreen name={"Add"} navigation={navigation} profile={false} drawer={true}/>
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <TextInput
                    placeholder='Nick'
                    style={{
                        borderWidth: 2,
                        borderColor: "#ca2613",
                        borderRadius: 20,
                        paddingHorizontal: "5%",
                        width: "80%",
                        fontSize: getFontSize(20),
                        color: (darkMode) ? "white" : "black"
                    }}
                    placeholderTextColor={"#a3a3a3"}
                    onChangeText={(text) => setFriendNick(text)}
                ></TextInput>
                <TouchableOpacity style={{...Styles.touchable}} onPress={addFriend}>
                    <Text
                        style={{fontSize: getFontSize(20), color: (darkMode) ? "white" : "black", textAlign: 'center'}}>Add
                        Friend</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default AddFriend