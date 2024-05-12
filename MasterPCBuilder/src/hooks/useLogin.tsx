import {PixelRatio, StyleSheet, Text, View} from 'react-native'
import React, {useState} from 'react'
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigations/StackNavigator';
import {usePrimaryContext} from '../contexts/PrimaryContext';
import IUserType from '../interfaces/IUserType';
import axios from 'axios';
import {Globals} from '../components/Globals';
import EncryptedStorage from 'react-native-encrypted-storage';
import RNFetchBlob from "rn-fetch-blob";
import Toast from "react-native-toast-message";

const useLogin = () => {
    const {setUser, setToken, token} = usePrimaryContext();
    const [users, setUsers] = useState([{}] as IUserType[]);
    const [nick, setNick] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const [loading, setLoading] = useState(false);

    function changeNick(newNick: string) {
        setNick(newNick);
    }

    function changePassword(newPass: string) {
        setPassword(newPass);
    }

    function checkLogin(navigation: NativeStackNavigationProp<RootStackParamList, "Login", undefined>) {
        if (nick !== "" && password !== "") {
            login(navigation);
        } else {
            Toast.show({
                position: 'bottom',
                type: 'error',
                text1: "The inputs can't be empty",
                text1Style: {fontSize: getFontSize(15)},
                visibilityTime: 3000
            });
        }
    }

    async function login(navigation: NativeStackNavigationProp<RootStackParamList, "Login", undefined>) {
        setLoading(true); // Activar el indicador de carga
        try {
            const loginResponse = await axios.post(Globals.IP_HTTP + "/api/v1/login", {nick, password});

            await EncryptedStorage.setItem("token", loginResponse.data);
            setToken(loginResponse.data);
            const byNickResponse = await axios.get(Globals.IP_HTTP + "/api/v2/users?nick=" + nick, {headers: {'Authorization': "Bearer " + loginResponse.data}});
            const userPicResponse = await RNFetchBlob.fetch(
                'GET',
                Globals.IP_HTTP + '/api/v2/users/img/' + byNickResponse.data.id + '/' + byNickResponse.data.picture,
                {Authorization: `Bearer ${loginResponse.data}`}
            );
            let picture = ""
            if (userPicResponse.data !== Globals.IMG_NOT_FOUND) {
                picture = userPicResponse.base64();
            }

            let newUser: IUserType = {
                id: byNickResponse.data.id,
                nick: byNickResponse.data.nick,
                email: byNickResponse.data.email,
                picture: picture,
                friends: byNickResponse.data.friends,
                blockedUsers: byNickResponse.data.blockedUsers,
                componentsWanted: byNickResponse.data.componentsWanted,
                deleted: byNickResponse.data.deleted
            }
            if (newUser.friends !== null) {
                for (const friend of newUser.friends) {
                    const friendPicResponse = await RNFetchBlob.fetch(
                        'GET',
                        Globals.IP_HTTP + '/api/v2/users/img/' + friend.id + '/' + friend.picture,
                        {Authorization: `Bearer ${loginResponse.data}`}
                    );
                    picture = ""
                    if (friendPicResponse.data !== Globals.IMG_NOT_FOUND) {
                        picture = friendPicResponse.base64();
                    }
                    friend.picture = picture;
                }
            }
            setUser(newUser);
            navigation.navigate("DrawerNavigator");
        } catch (err) {
            console.log(err);
            Toast.show({
                position: 'bottom',
                type: 'error',
                text1: "The user or password are incorrect",
                text1Style: {fontSize: getFontSize(15)},
                visibilityTime: 3000
            });
            setPassword("");
            setNick("");
        } finally {
            setLoading(false); // Desactivar el indicador de carga independientemente del resultado
        }
    }

    return {
        changeNick,
        changePassword,
        checkLogin,
        errorMsg,
        nick,
        password,
        loading
    }
}

export default useLogin