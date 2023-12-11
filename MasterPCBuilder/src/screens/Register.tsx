import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigations/StackNavigator'
import useRegister from '../hooks/useRegister';
import { Styles } from '../themes/Styles';


type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

const Register = (props: Props) => {
    const { navigation, route } = props;
    const { changeNick, changeEmail, changePassword, changeConfPass, checkRegister, errorMsg } = useRegister();
    return (
        <View style={{ flex: 1 }}>
            <View style={{ ...Styles.headerView, flexDirection: "column" }}>
                <Text style={Styles.headerText}>{route.name}</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ backgroundColor: 'purple', padding: "10%" }}>
                    <TextInput placeholder='Nick' placeholderTextColor={"black"} onChangeText={changeNick} style={{ ...Styles.textInput, marginBottom: "3%" }}></TextInput>
                    <TextInput placeholder='Email' placeholderTextColor={"black"} onChangeText={changeEmail} style={{ ...Styles.textInput, marginBottom: "3%" }}></TextInput>
                    <TextInput secureTextEntry={true} placeholder='Password' placeholderTextColor={"black"} onChangeText={changePassword} style={{ ...Styles.textInput, marginBottom: "3%" }}></TextInput>
                    <TextInput secureTextEntry={true} placeholder='Confirm Password' placeholderTextColor={"black"} onChangeText={changeConfPass} style={Styles.textInput}></TextInput>
                </View>
                <View style={{ flexDirection: "row", padding: "8%" }}>
                    <TouchableOpacity style={Styles.touchable} onPress={() => checkRegister(navigation)}>
                        <Text style={{ color: "white", fontSize: 20 }}>Register</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={Styles.touchable} onPress={() => navigation.navigate("Login")}>
                        <Text style={{ color: "white", fontSize: 20 }}>Login</Text>
                    </TouchableOpacity>
                </View>
                <Text style={{ color: "red" }}>{errorMsg}</Text>
            </View>
        </View >
    )
}

export default Register