import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/StackNavigator';
import { usePrimaryContext } from '../contexts/PrimaryContext';

const useLogin = () => {
    const { setUser } = usePrimaryContext();
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
            setUser({ nick: "Coso", email: "coso@gmail.com", profilePic: "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0=", lightMode: true });
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