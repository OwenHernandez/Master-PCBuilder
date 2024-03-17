import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { usePrimaryContext } from '../contexts/PrimaryContext';
import { RootStackParamList } from '../navigations/StackNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import EncryptedStorage from "react-native-encrypted-storage";

type Props = {}

const useLogout = () => {
    const { user, setUser, setToken } = usePrimaryContext();

    async function logout(navigation: NativeStackNavigationProp<RootStackParamList, any, undefined>) {
        //setUser(null);
        setToken("");
        await EncryptedStorage.setItem("token", "");
        navigation.navigate("Login");
    }

    return {
        logout
    }
}

export default useLogout