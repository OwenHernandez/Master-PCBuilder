import {Dimensions, Image, PixelRatio, Text, TouchableOpacity, View} from "react-native";
import {Styles} from "../themes/Styles";
import {DrawerActions} from "@react-navigation/native";
import Octicons from "react-native-vector-icons/Octicons";
import React from "react";
import {usePrimaryContext} from "../contexts/PrimaryContext";
import Octicon from "react-native-vector-icons/Octicons";

type Props = {
    name: string;
    navigation: any;
    profile: boolean;
}

const HeaderScreen = (props: Props) => {
    const { user, darkMode } = usePrimaryContext();
    const { name, navigation, profile } = props;
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;

    return (
        <View style={Styles.headerView}>
            {(profile) ?
                <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
                    <Octicon name='gear' size={getIconSize(90)} color={(darkMode) ? "white" : "black"}></Octicon>
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                    <Image
                        source={{
                            uri: "data:image/jpeg;base64," + user.picture,
                            width: getIconSize(110),
                            height: getIconSize(110)
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
            <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
                <Octicons name='three-bars' size={getIconSize(100)}
                          color={(darkMode) ? "white" : "black"}></Octicons>
            </TouchableOpacity>
        </View>
    );
}

export default HeaderScreen;