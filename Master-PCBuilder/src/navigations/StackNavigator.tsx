import { StyleSheet, Text, View } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react'
import Register from '../screens/Register';
import Login from '../screens/Login';

type Props = {}
export type RootStackParamList = {
    Register: undefined,
    Login: undefined,
    Home: undefined
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigator = (props: Props) => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
    )
}

export default StackNavigator

const styles = StyleSheet.create({})