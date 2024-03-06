import {Dimensions, Image, PixelRatio, Text, TouchableOpacity, View} from "react-native";
import {Styles} from "../themes/Styles";
import {DrawerActions} from "@react-navigation/native";
import Octicons from "react-native-vector-icons/Octicons";
import React, {useEffect, useState} from "react";
import {usePrimaryContext} from "../contexts/PrimaryContext";
import Octicon from "react-native-vector-icons/Octicons";
import Material from "react-native-vector-icons/MaterialCommunityIcons";
import IUserType from "../interfaces/IUserType";

type Props = {
    name: string;
    navigation: any;
    profile: boolean;
    drawer: boolean;
}

const HeaderScreen = (props: Props) => {
    const { user, darkMode } = usePrimaryContext();
    const { name, navigation, profile, drawer } = props;
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;
    return (
        <View style={Styles.headerView}>
            {(profile) ?
                <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
                    <Octicon name='gear' size={getIconSize(100)} color={(darkMode) ? "white" : "black"}></Octicon>
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                    <Image
                        source={{
                            uri: (user?.picture !== "") ? "data:image/jpeg;base64," + user?.picture : "https://www.softzone.es/app/uploads-softzone.es/2018/04/guest.png?x=480&quality=40",
                            width: getIconSize(100),
                            height: getIconSize(100)
                        }}
                        style={{ ...Styles.imageStyle, borderColor: (darkMode) ? "white" : "black", borderWidth: 1 }}
                    />
                </TouchableOpacity>
            }
            <Text style={{
                ...Styles.headerText,
                color: (darkMode) ? "white" : "black",
                fontSize: getFontSize(20)
            }}>{name}</Text>
            {(!drawer) ?
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Material name='keyboard-backspace' size={getIconSize(100)} color={(darkMode) ? "white" : "black"}></Material>
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
                    <Octicons name='three-bars' size={getIconSize(100)}
                              color={(darkMode) ? "white" : "black"}></Octicons>
                </TouchableOpacity>
            }

        </View>
    );
}

export default HeaderScreen;