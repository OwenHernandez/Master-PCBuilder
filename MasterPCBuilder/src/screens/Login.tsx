import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { RootStackParamList } from '../navigations/StackNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import useLogin from '../hooks/useLogin';
import { Styles } from '../themes/Styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const Login = (props: Props) => {
    const { navigation, route } = props;
    const { changeEmail, changePassword, checkLogin, errorMsg } = useLogin();
    return (
        <View style={{ flex: 1 }}>
            <View style={{ ...Styles.headerView, flexDirection: "column" }}>
                <Text style={Styles.headerText}>{route.name}</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ backgroundColor: '#524f4f', padding: "10%", borderRadius: 20 }}>
                    <TextInput placeholder='Email' placeholderTextColor={"black"} onChangeText={changeEmail} style={{ ...Styles.textInput, marginBottom: "3%" }}></TextInput>
                    <TextInput secureTextEntry={true} placeholder='Password' placeholderTextColor={"black"} onChangeText={changePassword} style={{ ...Styles.textInput }}></TextInput>
                </View>
                <View style={{ flexDirection: "row", padding: "8%" }}>
                    <TouchableOpacity style={Styles.touchable} onPress={() => checkLogin(navigation)}>
                        <Text style={{ color: "white", fontSize: 20 }}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={Styles.touchable} onPress={() => navigation.navigate("Register")}>
                        <Text style={{ color: "white", fontSize: 20 }}>Register</Text>
                    </TouchableOpacity>
                </View>
                <Text style={{ color: "red" }}>{errorMsg}</Text>
            </View>
        </View>
    )
}

export default Login