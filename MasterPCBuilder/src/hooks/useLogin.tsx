import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/StackNavigator';
import { usePrimaryContext } from '../contexts/PrimaryContext';
import IUserType from '../interfaces/IUserType';
import axios from 'axios';

const useLogin = () => {
    const { setUser } = usePrimaryContext();
    const [users, setUsers] = useState([{}] as IUserType[]);
    const [nick, setNick] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    let usersTemp: IUserType[] = [
        {
            nick: "Coso",
            email: "coso@gmail.com",
            password: "coso",
            profilePic: "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0=",
            friends: [
                {
                    nick: "Amigo2"
                },
                {
                    nick: "Amigo1jkjjjjjjjjjjjj"
                }
            ]
        },
        {
            nick: "Amigo2",
            email: "amigo2@gmail.com",
            password: "amigo2",
            profilePic: "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0=",
            friends: [
                {
                    nick: "Coso"
                },
                {
                    nick: "Amigo1jkjjjjjjjjjjjj"
                }
            ]
        },
        {
            nick: "Amigo1jkjjjjjjjjjjjj",
            email: "amigo1@gmail.com",
            password: "amigo1",
            profilePic: "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0=",
            friends: [
                {
                    nick: "Amigo2"
                },
                {
                    nick: "Coso"
                }
            ]
        }
    ];

    async function getUsers() {
        //const response = await axios.get("");
        setUsers(usersTemp);
    }

    function changeNick(newNick: string) {
        setNick(newNick);
    }

    function changePassword(newPass: string) {
        setPassword(newPass);
    }

    function checkLogin(navigation: NativeStackNavigationProp<RootStackParamList, "Login", undefined>) {
        if (nick !== "" && password !== "") {
            users.forEach((userForEach) => {
                if (userForEach.nick === nick) {
                    if (userForEach.password === password) {
                        setUser(userForEach);
                        navigation.navigate("DrawerNavigator");
                    }
                }
            });
            setErrorMsg("The email or password are incorrect");
        } else {
            setErrorMsg("The inputs can't be empty");
        }
    }

    return {
        changeNick,
        changePassword,
        checkLogin,
        errorMsg,
        getUsers
    }
}

export default useLogin

const styles = StyleSheet.create({})