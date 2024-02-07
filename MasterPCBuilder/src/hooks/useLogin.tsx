import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/StackNavigator';
import { usePrimaryContext } from '../contexts/PrimaryContext';
import IUserType from '../interfaces/IUserType';
import axios from 'axios';
import { Globals } from '../components/Globals';
import EncryptedStorage from 'react-native-encrypted-storage';

const useLogin = () => {
    const { setUser, setToken, token } = usePrimaryContext();
    const [users, setUsers] = useState([{}] as IUserType[]);
    const [nick, setNick] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    function changeNick(newNick: string) {
        setNick(newNick);
    }

    function changePassword(newPass: string) {
        setPassword(newPass);
    }

    async function checkLogin(navigation: NativeStackNavigationProp<RootStackParamList, "Login", undefined>) {
        if (nick !== "" && password !== "") {
            const response = await axios.post(Globals.IP + "/api/v1/login", { nick, password });
            if (response.data === Globals.INC_PASS_USR || response.data === Globals.NOT_ACTIVE) {
                setErrorMsg(response.data);
            } else {
                await EncryptedStorage.setItem("token", response.data)
                setToken(response.data);
                const response2 = await axios.get(Globals.IP + "/api/v2/users?nick=" + nick, { headers: { 'Authorization': "Bearer " + token } });
                const newUser: IUserType = {
                    nick: response2.data.nick,
                    email: response2.data.email,
                    profilePic: response2.data.picture,
                    friends: response2.data.friends
                }
                setUser(newUser);
            }
        } else {
            setErrorMsg("The inputs can't be empty");
        }
    }

    return {
        changeNick,
        changePassword,
        checkLogin,
        errorMsg
    }
}

export default useLogin

const styles = StyleSheet.create({})