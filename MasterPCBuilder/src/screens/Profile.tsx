import { Dimensions, Image, PixelRatio, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, {useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { RootStackParamList } from '../navigations/StackNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { usePrimaryContext } from '../contexts/PrimaryContext';
import useLogout from '../hooks/useLogout';
import { Styles } from '../themes/Styles';
import Octicon from 'react-native-vector-icons/Octicons';
import { DrawerActions } from '@react-navigation/native';
import axios from "axios";
import {Globals} from "../components/Globals";
import HeaderScreen from "../components/HeaderScreen";

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const Profile = (props: Props) => {
    const { user, darkMode, token } = usePrimaryContext();
    const { navigation, route } = props;
    const [img, setImg] = useState<any>();
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;
    const { logout } = useLogout();

    /*const actions = [
        { name: "Your Balls", nav: "UserBuildsList" },
        { name: "Your Posts", nav: "UserPostsList" },
        { name: "Liked Posts", nav: "LikedPostsList" },
        { name: "Wish List", nav: "WishList" },
        { name: "Friends", nav: "FriendsList" }
    ];*/

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: (darkMode) ? "#242121" : "#F5F5F5" }}>
            <HeaderScreen name={route.name} navigation={navigation} profile={true} drawer={true}/>
            <ScrollView>
                <View style={{ alignItems: 'center', margin: "5%" }}>
                    <Image
                        source={{
                            uri: "data:image/jpeg;base64," + user?.picture,
                        }}
                        style={{ ...Styles.imageStyle, borderColor: (darkMode) ? "white" : "black", borderWidth: 1, width: getIconSize(300), height: getIconSize(300) }}
                    />
                    <Text style={{ fontSize: getFontSize(40), color: (darkMode) ? "white" : "black" }}>{user?.nick}</Text>
                    <Text style={{ fontSize: getFontSize(20), color: (darkMode) ? "white" : "black" }}>{user?.email}</Text>
                </View>
                <TouchableOpacity style={{ ...Styles.touchable, marginBottom: "3%", padding: "6%" }} onPress={() => navigation.navigate("UserBuildsList")}>
                    <Text style={{ fontSize: getFontSize(20), textAlign: 'center', color: (darkMode) ? "white" : "black" }}>Your Builds</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...Styles.touchable, marginBottom: "3%", padding: "6%" }} onPress={() => navigation.navigate("WishList")}>
                    <Text style={{ fontSize: getFontSize(20), textAlign: 'center', color: (darkMode) ? "white" : "black" }}>Wish List</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...Styles.touchable, marginBottom: "3%", padding: "6%" }} onPress={() => navigation.navigate("Friends")}>
                    <Text style={{ fontSize: getFontSize(20), textAlign: 'center', color: (darkMode) ? "white" : "black" }}>Friends</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...Styles.touchable, marginBottom: "3%", padding: "6%", borderColor: "violet" }} onPress={() => logout(navigation)}>
                    <Text style={{ fontSize: getFontSize(20), textAlign: 'center', color: (darkMode) ? "white" : "black" }}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Profile