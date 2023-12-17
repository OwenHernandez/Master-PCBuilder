import { Alert, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { RootStackParamList } from '../navigations/StackNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { usePrimaryContext } from '../contexts/PrimaryContext';
import useLogout from '../hooks/useLogout';
import { Styles } from '../themes/Styles';
import Icon from 'react-native-vector-icons/Octicons';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const Profile = (props: Props) => {
    const { user } = usePrimaryContext();
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
        <SafeAreaView style={{ flex: 1 }}>
            <View style={Styles.headerView}>
                <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
                    <Icon name='gear' size={30} color={"white"}></Icon>
                </TouchableOpacity>
                <Text style={Styles.headerText}>{route.name}</Text>
                <TouchableOpacity onPress={() => Alert.alert("Iria al drawer")}>
                    <Icon name='three-bars' size={30} color={"white"}></Icon>
                </TouchableOpacity>
            </View>
            <ScrollView>
                <View style={{ alignItems: 'center' }}>
                    <Image
                        source={{
                            uri: user.profilePic,
                            width: 100,
                            height: 100
                        }}
                    />
                    <Text style={{ fontSize: 40, color: "white" }}>{user.nick}</Text>
                    <Text style={{ fontSize: 20, color: "white" }}>{user.email}</Text>
                </View>
                <TouchableOpacity style={{ ...Styles.touchable, marginBottom: 10, padding: 20 }} onPress={() => navigation.navigate("UserBuildsList")}>
                    <Text style={{ fontSize: 20, textAlign: 'center', color: "white" }}>Your Builds</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...Styles.touchable, marginBottom: 10, padding: 20 }} onPress={() => navigation.navigate("UserPostsList")}>
                    <Text style={{ fontSize: 20, textAlign: 'center', color: "white" }}>Your Posts</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...Styles.touchable, marginBottom: 10, padding: 20 }} onPress={() => navigation.navigate("LikedPostsList")}>
                    <Text style={{ fontSize: 20, textAlign: 'center', color: "white" }}>Liked Posts</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...Styles.touchable, marginBottom: 10, padding: 20 }} onPress={() => navigation.navigate("WishList")}>
                    <Text style={{ fontSize: 20, textAlign: 'center', color: "white" }}>Wish List</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...Styles.touchable, marginBottom: 10, padding: 20 }} onPress={() => navigation.navigate("FriendsList")}>
                    <Text style={{ fontSize: 20, textAlign: 'center', color: "white" }}>Friends</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...Styles.touchable, marginBottom: 10, padding: 20, borderColor: "violet" }} onPress={() => logout(navigation)}>
                    <Text style={{ fontSize: 20, textAlign: 'center', color: "white" }}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Profile