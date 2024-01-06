import { Alert, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { RootStackParamList } from '../navigations/StackNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { usePrimaryContext } from '../contexts/PrimaryContext';
import useLogout from '../hooks/useLogout';
import { Styles } from '../themes/Styles';
import Octicon from 'react-native-vector-icons/Octicons';
import { DrawerActions } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const Profile = (props: Props) => {
    const { user, darkMode } = usePrimaryContext();
    const { navigation, route } = props;
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
            <View style={Styles.headerView}>
                <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
                    <Octicon name='gear' size={30} color={(darkMode) ? "white" : "black"}></Octicon>
                </TouchableOpacity>
                <Text style={{ ...Styles.headerText, color: (darkMode) ? "white" : "black" }}>{route.name}</Text>
                <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
                    <Octicon name='three-bars' size={30} color={(darkMode) ? "white" : "black"}></Octicon>
                </TouchableOpacity>
            </View>
            <ScrollView>
                <View style={{ alignItems: 'center', margin: "5%" }}>
                    <Image
                        source={{
                            uri: user.profilePic,
                            width: 100,
                            height: 100
                        }}
                        style={{ ...Styles.imageStyle, borderColor: (darkMode) ? "white" : "black", borderWidth: 1 }}
                    />
                    <Text style={{ fontSize: 40, color: (darkMode) ? "white" : "black" }}>{user.nick}</Text>
                    <Text style={{ fontSize: 20, color: (darkMode) ? "white" : "black" }}>{user.email}</Text>
                </View>
                <TouchableOpacity style={{ ...Styles.touchable, marginBottom: 10, padding: 20 }} onPress={() => navigation.navigate("UserBuildsList")}>
                    <Text style={{ fontSize: 20, textAlign: 'center', color: (darkMode) ? "white" : "black" }}>Your Builds</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...Styles.touchable, marginBottom: 10, padding: 20 }} onPress={() => navigation.navigate("UserPostsList")}>
                    <Text style={{ fontSize: 20, textAlign: 'center', color: (darkMode) ? "white" : "black" }}>Your Posts</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...Styles.touchable, marginBottom: 10, padding: 20 }} onPress={() => navigation.navigate("LikedPostsList")}>
                    <Text style={{ fontSize: 20, textAlign: 'center', color: (darkMode) ? "white" : "black" }}>Liked Posts</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...Styles.touchable, marginBottom: 10, padding: 20 }} onPress={() => navigation.navigate("WishList")}>
                    <Text style={{ fontSize: 20, textAlign: 'center', color: (darkMode) ? "white" : "black" }}>Wish List</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...Styles.touchable, marginBottom: 10, padding: 20 }} onPress={() => navigation.navigate("Friends")}>
                    <Text style={{ fontSize: 20, textAlign: 'center', color: (darkMode) ? "white" : "black" }}>Friends</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...Styles.touchable, marginBottom: 10, padding: 20, borderColor: "violet" }} onPress={() => logout(navigation)}>
                    <Text style={{ fontSize: 20, textAlign: 'center', color: (darkMode) ? "white" : "black" }}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Profile