import { Alert, ScrollView,Dimensions, PixelRatio, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigations/StackNavigator'
import useRegister from '../hooks/useRegister';
import { Styles } from '../themes/Styles';
import { usePrimaryContext } from '../contexts/PrimaryContext';
import Toast from 'react-native-toast-message';


type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

const Register = (props: Props) => {
    const { navigation, route } = props;
    const { darkMode } = usePrimaryContext();
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;
    const { changeNick, changeEmail, changePassword, changeConfPass, checkRegister, errorMsg } = useRegister();
    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }}>
                <View style={{ ...Styles.headerView, flexDirection: "column" }}>
                    <Text style={{ ...Styles.headerText, color: (darkMode) ? "white" : "black", fontSize: getFontSize(20) }}>{route.name}</Text>
                </View>
                <View style={{flex:1, marginTop:"25%"}}>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ backgroundColor: '#524f4f', padding: "10%", borderRadius: 20 }}>
                            <TextInput placeholder='Nick' placeholderTextColor={"black"} onChangeText={changeNick} style={{ ...Styles.textInput, marginBottom: "3%", width: getIconSize(450) }}></TextInput>
                            <TextInput placeholder='Email' placeholderTextColor={"black"} onChangeText={changeEmail} style={{ ...Styles.textInput, marginBottom: "3%", width: getIconSize(450) }}></TextInput>
                            <TextInput secureTextEntry={true} placeholder='Password' placeholderTextColor={"black"} onChangeText={changePassword} style={{ ...Styles.textInput, marginBottom: "3%", width: getIconSize(450) }}></TextInput>
                            <TextInput secureTextEntry={true} placeholder='Confirm Password' placeholderTextColor={"black"} onChangeText={changeConfPass} style={{ ...Styles.textInput, width: getIconSize(450) }}></TextInput>
                        </View>
                        <View style={{ flexDirection: "row", padding: "8%" }}>
                            <TouchableOpacity style={Styles.touchable} onPress={() => checkRegister(navigation)}>
                                <Text style={{ color: (darkMode) ? "white" : "black", fontSize: getFontSize(20) }}>Register</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={Styles.touchable} onPress={() => navigation.navigate("Login")}>
                                <Text style={{ color: (darkMode) ? "white" : "black", fontSize: getFontSize(20) }}>Login</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={{ color: "red" }}>{errorMsg}</Text>
                        <Toast />
                    </View>
                </View>
            </ScrollView>
        </View >
    )
}

export default Register