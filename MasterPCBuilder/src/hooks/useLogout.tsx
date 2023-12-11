import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { usePrimaryContext } from '../contexts/PrimaryContext';
import { RootStackParamList } from '../navigations/StackNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = {}

const useLogout = () => {
    const { user, setUser } = usePrimaryContext();

    function logout(navigation: NativeStackNavigationProp<RootStackParamList, any, undefined>) {
        //setUser("");
        navigation.navigate("Login");
    }

    return {
        logout
    }
}

export default useLogout

const styles = StyleSheet.create({})