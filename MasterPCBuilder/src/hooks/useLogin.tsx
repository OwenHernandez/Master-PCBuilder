import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/StackNavigator';
import { usePrimaryContext } from '../contexts/PrimaryContext';
import IUserType from '../interfaces/IUserType';
import axios from 'axios';
import { Globals } from '../components/Globals';
import EncryptedStorage from 'react-native-encrypted-storage';
import RNFetchBlob from "rn-fetch-blob";

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
            try {
                const loginResponse = await axios.post(Globals.IP + "/api/v1/login", { nick, password });

                if (loginResponse.data === Globals.INC_PASS_USR || loginResponse.data === Globals.NOT_ACTIVE) {
                    setErrorMsg(loginResponse.data);
                } else {

                    await EncryptedStorage.setItem("token", loginResponse.data);
                    setToken(loginResponse.data);
                    const byNickResponse = await axios.get(Globals.IP + "/api/v2/users?nick=" + nick, { headers: { 'Authorization': "Bearer " + loginResponse.data } });
                    const response = await RNFetchBlob.fetch(
                        'GET',
                        Globals.IP + '/api/v2/users/img/' + byNickResponse.data.id + '/' + byNickResponse.data.picture,
                        { Authorization: `Bearer ${loginResponse.data}` }
                    );
                    let picture = ""
                    if (response.data !== Globals.IMG_NOT_FOUND) {
                        picture = response.base64();
                    }

                    const newUser: IUserType = {
                        id: byNickResponse.data.id,
                        nick: byNickResponse.data.nick,
                        email: byNickResponse.data.email,
                        picture: picture,
                        friends: byNickResponse.data.friends,
                        componentsWished: byNickResponse.data.componentsWanted
                    }
                    setUser(newUser);
                    navigation.navigate("DrawerNavigator");
                }
            } catch (err) {
                console.error(err);
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