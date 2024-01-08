import { Dimensions, Image, PixelRatio, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/StackNavigator';
import { Styles } from '../themes/Styles';
import { usePrimaryContext } from '../contexts/PrimaryContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Landing'>;

const Landing = (props: Props) => {
    const { darkMode } = usePrimaryContext();
    const { navigation, route } = props;
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Image
                    source={(darkMode) ? require("../../img/logo_dark.png") : require("../../img/logo_light.png")}
                    style={{ width: getIconSize(800), height: getIconSize(800) }}
                />
                <TouchableOpacity style={Styles.touchable} onPress={() => navigation.navigate("Login")}>
                    <Text style={{ color: (darkMode) ? "white" : "black", fontSize: getFontSize(20) }}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={Styles.touchable} onPress={() => navigation.navigate("Register")}>
                    <Text style={{ color: (darkMode) ? "white" : "black", fontSize: getFontSize(20) }}>Register</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Landing

const styles = StyleSheet.create({})