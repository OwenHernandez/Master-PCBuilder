import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { RootStackParamList } from '../navigations/StackNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import useLogin from '../hooks/useLogin';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const Login = (props: Props) => {
    const { navigation } = props;
    const { changeEmail, changePassword, checkLogin, errorMsg } = useLogin();
    return (
        <View>
            <TextInput placeholder='Nick'></TextInput>
            <TextInput placeholder='Email'></TextInput>
            <TextInput secureTextEntry={true} placeholder='Password'></TextInput>
            <TextInput secureTextEntry={true} placeholder='Confirm Password'></TextInput>
            <TouchableOpacity onPress={() => Alert.alert("Check if the password and conf.pass inputs are the same and go to the home page")}>
                <Text>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text>Register</Text>
            </TouchableOpacity>
            <Text style={{ color: "red" }}>{errorMsg}</Text>
        </View>
    )
}

export default Login

const styles = StyleSheet.create({})