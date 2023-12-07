import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigations/StackNavigator'
import useRegister from '../hooks/useRegister';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

const Register = (props: Props) => {
    const { navigation } = props;
    const { changeNick, changeEmail, changePassword, changeConfPass, checkRegister, errorMsg } = useRegister();
    return (
        <View>
            <TextInput placeholder='Nick' onChangeText={changeNick}></TextInput>
            <TextInput placeholder='Email' onChangeText={changeEmail}></TextInput>
            <TextInput secureTextEntry={true} placeholder='Password' onChangeText={changePassword}></TextInput>
            <TextInput secureTextEntry={true} placeholder='Confirm Password' onChangeText={changeConfPass}></TextInput>
            <TouchableOpacity onPress={() => checkRegister(navigation)}>
                <Text>Register</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text>Login</Text>
            </TouchableOpacity>
            <Text style={{ color: "red" }}>{errorMsg}</Text>
        </View>
    )
}

export default Register

const styles = StyleSheet.create({})