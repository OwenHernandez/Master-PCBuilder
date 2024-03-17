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
                    sendRegister();
                    Toast.show({
                        position: 'bottom',
                        type: 'error',
                        text1: "Please, check your email to confirm your account",
                        text1Style: { fontSize: getFontSize(15) },
                        visibilityTime: 3000
                    });
                } else {
                    Toast.show({
                        position: 'bottom',
                        type: 'error',
                        text1: "You must provide a valid email",
                        text1Style: { fontSize: getFontSize(15) },
                        visibilityTime: 3000
                    });
                    setPassword("");
                    setConfPassword("");
                }
            } else {
                Toast.show({
                    position: 'bottom',
                    type: 'error',
                    text1: "The passwords must match",
                    text1Style: { fontSize: getFontSize(15) },
                    visibilityTime: 3000
                });
                setPassword("");
                setConfPassword("");
            }
        } else {
            Toast.show({
                position: 'bottom',
                type: 'error',
                text1: "The inputs can't be empty",
                text1Style: { fontSize: getFontSize(15) },
                visibilityTime: 3000
            });
            setPassword("");
            setConfPassword("");
        }
    }

    async function sendRegister() {
        try {
            const response = await axios.post(Globals.IP + "/api/v1/register", { nick, email, password });
        } catch (err) {
            console.log(err);
            Toast.show({
                position: 'bottom',
                type: 'error',
                text1: "Something went wrong, please try again later",
                text1Style: { fontSize: getFontSize(15) },
                visibilityTime: 3000
            });
        }
    }

    return {
        changeNick,
        changeEmail,
        changePassword,
        changeConfPass,
        checkRegister,
        errorMsg,
        nick,
        email,
        password,
        confPassword
    }
}

export default useRegister

const styles = StyleSheet.create({})