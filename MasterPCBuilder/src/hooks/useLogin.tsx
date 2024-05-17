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
import {UserRepository} from "../data/Database";
import {transformUserDTOToEntity} from "../data/transformers/UserTransformer";

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
                role: byNickResponse.data.role,
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
            let userSave = transformUserDTOToEntity(newUser);
            userSave.password = password;
            await UserRepository.save(userSave);
            setUser(newUser);
            navigation.navigate("DrawerNavigator");
        } catch (err) {
            setLoading(false); // Asegúrate de desactivar el indicador de carga

            if (err.response) {
                // El servidor respondió con un código de estado fuera del rango 2xx
                console.log("Error data:", err.response.data);
                console.log("Error status:", err.response.status);
                Toast.show({
                    position: 'bottom',
                    type: 'error',
                    text1: "The user or password are incorrect",
                    text1Style: {fontSize: getFontSize(15)},
                    visibilityTime: 3000
                });
            } else if (err.request) {
                let userDDBB = await UserRepository.findOneBy({nick: nick, password: password});
                if (userDDBB === null) {
                    // La solicitud fue hecha pero no se recibió respuesta
                    console.log("error user not found: " + userDDBB);
                    Toast.show({
                        position: 'bottom',
                        type: 'error',
                        text1: "The user or password are incorrect",
                        text1Style: {fontSize: getFontSize(15)},
                        visibilityTime: 3000
                    });
                } else {
                    let userOffLine: IUserType = {
                        id: userDDBB.id,
                        nick: userDDBB.nick,
                        email: userDDBB.email,
                        picture: userDDBB.picture,
                        role: userDDBB.role,
                        friends: [],
                        blockedUsers: [],
                        componentsWanted: [],
                        deleted: userDDBB.deleted
                    }
                    setUser(userOffLine);
                    navigation.navigate("DrawerNavigator");
                }
            } else {
                // Algo más causó el error
                console.log("Error", err.message);
                Toast.show({
                    position: 'bottom',
                    type: 'error',
                    text1: "Login failed",
                    text1Style: {fontSize: getFontSize(15)},
                    visibilityTime: 3000
                });
            }

            setPassword("");
            setNick("");
        } finally {
            setLoading(false); // Asegúrate de desactivar el indicador de carga
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