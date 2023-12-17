import { StyleSheet, Text, View } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react'
import Register from '../screens/Register';
import Login from '../screens/Login';
import Profile from '../screens/Profile';
import UserPostsList from '../screens/UserPostsList';
import Post from '../screens/Post';
import UserBuildsList from '../screens/UserBuildsList';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Settings from '../screens/Settings';
import WishList from '../screens/WishList';
import FriendsList from '../screens/FriendsList';

type Props = {}

export type RootStackParamList = {
    Register: undefined,
    Login: undefined,
    Builder: undefined,
    Profile: undefined,
    Settings: undefined,
    UserBuildsList: undefined,
    UserPostsList: undefined,
    LikedPostsList: undefined,
    Post: { post: any },
    WishList: {},
    FriendsList: undefined
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const StackNavigator = (props: Props) => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: {
                    backgroundColor: "black"
                }
            }}
        >
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            {/*<Stack.Screen name="Builder" component={Builder} />*/}
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="UserBuildsList" component={UserBuildsList} />
            <Stack.Screen name="UserPostsList" component={UserPostsList} />
            <Stack.Screen name="Post" component={Post} />
            <Stack.Screen name="WishList" component={WishList} />
            <Stack.Screen name="FriendsList" component={FriendsList} />
        </Stack.Navigator>
    )
}

export default StackNavigator

const styles = StyleSheet.create({})