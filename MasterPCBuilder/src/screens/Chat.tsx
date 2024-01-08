import { View, Text, SafeAreaView, TouchableOpacity, PixelRatio, Dimensions, Image, TextInput, Alert, FlatList } from 'react-native'
import React from 'react'
import { Styles } from '../themes/Styles'
import { usePrimaryContext } from '../contexts/PrimaryContext'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/StackNavigator';
import Octicon from 'react-native-vector-icons/Octicons';
import { DrawerActions } from '@react-navigation/native';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import { IMsgType } from '../interfaces/IMsgType';

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

const Chat = (props: Props) => {
    const { user, darkMode } = usePrimaryContext();
    const { navigation, route } = props;
    const friend = route.params.friend;
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;

    let tempMsg: IMsgType[] = [
        {
            msg: "coso",
            userSend: user,
            userReceive: friend
        },
        {
            msg: "cosocoso",
            userSend: friend,
            userReceive: user
        },
        {
            msg: "coso",
            userSend: user,
            userReceive: friend
        },
        {
            msg: "cosocoso",
            userSend: friend,
            userReceive: user
        },
        {
            msg: "coso",
            userSend: user,
            userReceive: friend
        },
        {
            msg: "cosocoso",
            userSend: friend,
            userReceive: user
        },
        {
            msg: "coso",
            userSend: user,
            userReceive: friend
        },
        {
            msg: "cosocoso",
            userSend: friend,
            userReceive: user
        },
        {
            msg: "coso",
            userSend: user,
            userReceive: friend
        },
        {
            msg: "cosocoso",
            userSend: friend,
            userReceive: user
        },
        {
            msg: "coso",
            userSend: user,
            userReceive: friend
        },
        {
            msg: "cosocoso",
            userSend: friend,
            userReceive: user
        },
        {
            msg: "coso",
            userSend: user,
            userReceive: friend
        },
        {
            msg: "cosocoso",
            userSend: friend,
            userReceive: user
        },
        {
            msg: "coso",
            userSend: user,
            userReceive: friend
        },
        {
            msg: "cosocoso",
            userSend: friend,
            userReceive: user
        },
        {
            msg: "coso",
            userSend: user,
            userReceive: friend
        },
        {
            msg: "cosocoso",
            userSend: friend,
            userReceive: user
        },
        {
            msg: "cosokljfdsghfjdghdskgjhfdjsghjfdsgksdfghrohgfjsdjgkdhjkfdkghfjds",
            userSend: user,
            userReceive: friend
        },
        {
            msg: "cosocosokjdhsfhsdhjfhdsjfhdjshjfhsdjfhdsjkfhhjfdshkjfhsjkdhfjdsjhfjdsfsdhfdshkj",
            userSend: friend,
            userReceive: user
        }
    ];

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={Styles.headerView}>
                <TouchableOpacity onPress={() => navigation.navigate("FriendsProfile", { friend: friend })}>
                    <Image
                        source={{
                            uri: friend.profilePic
                        }}
                        style={{ ...Styles.imageStyle, borderColor: (darkMode) ? "white" : "black", borderWidth: 1, width: getIconSize(110), height: getIconSize(110) }}
                    />
                </TouchableOpacity>
                <Text style={{ ...Styles.headerText, color: (darkMode) ? "white" : "black", fontSize: getFontSize(20) }}>{friend.nick}</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Material name='keyboard-backspace' size={getIconSize(100)} color={(darkMode) ? "white" : "black"}></Material>
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1, marginVertical: "2%" }}>
                <FlatList
                    data={tempMsg}
                    renderItem={(msg) => {
                        if (msg.item.userSend === user) {
                            return (
                                <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                                    <View style={{ backgroundColor: "#ca2613", borderRadius: 20, padding: "1%", paddingHorizontal: "3%", margin: "2%", maxWidth: "90%" }}>
                                        <Text style={{ fontSize: getFontSize(15), color: "white" }}>{msg.item.msg}</Text>
                                    </View>
                                </View>
                            );
                        } else if (msg.item.userSend === friend) {
                            return (
                                <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
                                    <View style={{ backgroundColor: "#575050", borderRadius: 20, padding: "1%", paddingHorizontal: "3%", margin: "2%", maxWidth: "90%" }}>
                                        <Text style={{ fontSize: getFontSize(15), color: "white" }}>{msg.item.msg}</Text>
                                    </View>
                                </View>
                            );
                        }

                    }}
                />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center", marginBottom: "3%" }}>
                <TextInput placeholder='Say something to your friend' placeholderTextColor={(darkMode) ? "white" : "black"} style={{ borderWidth: 2, borderColor: "#ca2613", borderRadius: 20, paddingHorizontal: "5%", width: "80%", fontSize: getFontSize(15), color: (darkMode) ? "white" : "black" }}></TextInput>
                <TouchableOpacity onPress={() => Alert.alert("buscaria en la api")}>
                    <Material name="send" size={getIconSize(80)}></Material>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default Chat