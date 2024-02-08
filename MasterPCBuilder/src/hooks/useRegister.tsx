import { PixelRatio, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/StackNavigator';
import IUserType from '../interfaces/IUserType';
import axios from 'axios';
import { Globals } from '../components/Globals';
import Toast from 'react-native-toast-message';

type Props = {}

const useRegister = () => {
    const [nick, setNick] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confPassword, setConfPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;

    function changeNick(newNick: string) {
        setNick(newNick);
    }

    function changeEmail(newEmail: string) {
        setEmail(newEmail);
    }

    function changePassword(newPass: string) {
        setPassword(newPass);
    }

    function changeConfPass(newConfPass: string) {
        setConfPassword(newConfPass);
    }

    async function checkRegister(navigation: NativeStackNavigationProp<RootStackParamList, "Register", undefined>) {
        if (nick !== "" && email !== "" && password !== "" && confPassword !== "") {
            if (password === confPassword) {
                if ((/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).test(email)) {
                    const response = await axios.post(Globals.IP + "/api/v1/register", { nick, email, password });
                    Toast.show({
                        position: 'bottom',
                        type: 'info',
                        text1: "Please, verify your email",
                        text1Style: { fontSize: getFontSize(15) },
                        visibilityTime: 3000
                    });
                } else {
                    setErrorMsg("You must provide a valid email");
                    setPassword("");
                    setConfPassword("");
                }
            } else {
                setErrorMsg("The passwords must be the same");
                setPassword("");
                setConfPassword("");
            }
        } else {
            setErrorMsg("The inputs can't be empty");
            setPassword("");
            setConfPassword("");
        }
    }

    return {
        changeNick,
        changeEmail,
        changePassword,
        changeConfPass,
        checkRegister,
        errorMsg
    }
}

export default useRegister

const styles = StyleSheet.create({})