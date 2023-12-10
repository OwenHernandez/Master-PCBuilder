import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/StackNavigator';

type Props = {}

const useLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    function changeEmail(newEmail: string) {
        setEmail(newEmail);
    }

    function changePassword(newPass: string) {
        setPassword(newPass);
    }

    function checkLogin(navigation: NativeStackNavigationProp<RootStackParamList, "Login", undefined>) {
        if (email !== "" && password !== "") {
            //Faltaria comprobar si la contraseña esta bien
            navigation.navigate("Profile");
        } else {
            setErrorMsg("The inputs can't be empty");
        }
    }

    return {
        changeEmail,
        changePassword,
        checkLogin,
        errorMsg
    }
}

export default useLogin

const styles = StyleSheet.create({})