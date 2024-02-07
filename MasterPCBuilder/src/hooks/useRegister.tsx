import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/StackNavigator';
import IUserType from '../interfaces/IUserType';
import axios from 'axios';

type Props = {}

const useRegister = () => {
    const [nick, setNick] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confPassword, setConfPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

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

    async function createUser(user: IUserType) {
        try {
            await axios.post("http://172.26.15.0:8080/users", user);
        } catch (error) {
            console.log(error);
        }
    }

    function checkRegister(navigation: NativeStackNavigationProp<RootStackParamList, "Register", undefined>) {
        if (nick !== "" && email !== "" && password !== "" && confPassword !== "") {
            if (password === confPassword) {

            } else {
                setErrorMsg("The passwords must be the same");
                setPassword("");
                setConfPassword("");
            }
        } else {
            setErrorMsg("The inputs can't be empty");
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