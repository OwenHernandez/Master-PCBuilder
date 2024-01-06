import { Alert, Dimensions, FlatList, Image, PixelRatio, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { Styles } from '../themes/Styles';
import Component from '../components/Component';
import { usePrimaryContext } from '../contexts/PrimaryContext';
import { RootStackParamList } from '../navigations/StackNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Octicons';
import IUserType from '../interfaces/IUserType';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicon from 'react-native-vector-icons/Octicons';
import { DrawerActions } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'FriendsList'>;

const FriendsList = (props: Props) => {
    const { navigation, route } = props;
    const { user, darkMode } = usePrimaryContext();
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;
    const tempFriendsList: IUserType[] = [
        {
            nick: "Amigo1jkjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj",
            email: "amigo1@gmail.com",
            profilePic: "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0=",
        },
        {
            nick: "Amigo2",
            email: "amigo2@gmail.com",
            profilePic: "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0=",
        },
        {
            nick: "Amigo2",
            email: "amigo2@gmail.com",
            profilePic: "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0=",
        },
        {
            nick: "Amigo2",
            email: "amigo2@gmail.com",
            profilePic: "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0=",
        },
        {
            nick: "Amigo2",
            email: "amigo2@gmail.com",
            profilePic: "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0=",
        },
        {
            nick: "Amigo2",
            email: "amigo2@gmail.com",
            profilePic: "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0=",
        },
        {
            nick: "Amigo2",
            email: "amigo2@gmail.com",
            profilePic: "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0=",
        },
        {
            nick: "Amigo2",
            email: "amigo2@gmail.com",
            profilePic: "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0=",
        }
    ];
    useEffect(() => {
        //Buscaria en la base de datos los que tenga en la wishlist
    }, []);

    return (
        <View style={{ backgroundColor: (darkMode) ? "#242121" : "#F5F5F5" }}>
            <View style={Styles.headerView}>
                <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                    <Image
                        source={{
                            uri: user.profilePic
                        }}
                        style={{ ...Styles.imageStyle, borderColor: (darkMode) ? "white" : "black", borderWidth: 1, width: getIconSize(110), height: getIconSize(110) }}
                    />
                </TouchableOpacity>
                <Text style={{ ...Styles.headerText, color: (darkMode) ? "white" : "black" }}>{route.name}</Text>
                <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
                    <Octicon name='three-bars' size={30} color={(darkMode) ? "white" : "black"}></Octicon>
                </TouchableOpacity>
            </View>
            <View style={{ height: "90%" }}>
                <FlatList
                    data={tempFriendsList}
                    renderItem={(friend) => {
                        return (

                            <TouchableOpacity onPress={() => Alert.alert("Abriria el chat")} style={{ ...Styles.touchable, flexDirection: "row", alignItems: "center", margin: "3%" }}>
                                <TouchableOpacity onPress={() => Alert.alert("Abriria el perfil del amigo")}>
                                    <Image
                                        source={{
                                            uri: friend.item.profilePic
                                        }}
                                        style={{ ...Styles.imageStyle, borderColor: (darkMode) ? "white" : "black", borderWidth: 1, width: getIconSize(110), height: getIconSize(110) }}
                                    />
                                </TouchableOpacity>
                                <Text style={{ color: (darkMode) ? "white" : "black", marginLeft: "5%", marginRight: "13%" }}>{friend.item.nick}</Text>
                            </TouchableOpacity>

                        )
                    }}
                    keyExtractor={(comp, index) => index + ""}
                />
            </View>
        </View>
    )
}

export default FriendsList

const styles = StyleSheet.create({})