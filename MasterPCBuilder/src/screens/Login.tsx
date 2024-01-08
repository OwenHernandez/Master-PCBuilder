import { Alert, Dimensions, PixelRatio, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { RootStackParamList } from '../navigations/StackNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import useLogin from '../hooks/useLogin';
import { Styles } from '../themes/Styles';
import { usePrimaryContext } from '../contexts/PrimaryContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const Login = (props: Props) => {
    const { navigation, route } = props;
    const { darkMode } = usePrimaryContext();
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;
    const { changeNick, changePassword, checkLogin, errorMsg, getUsers } = useLogin();

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <View style={{ ...Styles.headerView, flexDirection: "column" }}>
                <Text style={{ ...Styles.headerText, color: (darkMode) ? "white" : "black", fontSize: getFontSize(20) }}>{route.name}</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ backgroundColor: '#524f4f', padding: "10%", borderRadius: 20 }}>
                    <TextInput placeholder='Nick' placeholderTextColor={"black"} onChangeText={changeNick} style={{ ...Styles.textInput, marginBottom: "3%", width: getIconSize(450) }}></TextInput>
                    <TextInput secureTextEntry={true} placeholder='Password' placeholderTextColor={"black"} onChangeText={changePassword} style={{ ...Styles.textInput, width: getIconSize(450) }}></TextInput>
                </View>
                <View style={{ flexDirection: "row", padding: "8%" }}>
                    <TouchableOpacity style={Styles.touchable} onPress={() => checkLogin(navigation)}>
                        <Text style={{ color: (darkMode) ? "white" : "black", fontSize: getFontSize(20) }}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={Styles.touchable} onPress={() => navigation.navigate("Register")}>
                        <Text style={{ color: (darkMode) ? "white" : "black", fontSize: getFontSize(20) }}>Register</Text>
                    </TouchableOpacity>
                </View>
                <Text style={{ color: "red" }}>{errorMsg}</Text>
            </View>
        </View>
    )
}

export default Login