import { StatusBar, StyleSheet, Text, View } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react'
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
import Landing from '../screens/Landing';
import { usePrimaryContext } from '../contexts/PrimaryContext';
import IPostType from '../interfaces/IPostType';
import IBuildType from '../interfaces/IBuildType';
import LikedPostsList from '../screens/LikedPostsList';
import DrawerNavigator from './DrawerNavigator';
import FriendsTabs from './FriendsTabs';

type Props = {}

export type RootStackParamList = {
    Landing: undefined,
    Register: undefined,
    Login: undefined,
    Social: undefined,
    CreatePost: undefined,
    SearchPost: undefined,
    DrawerNavigator: any,
    Builder: undefined,
    Profile: undefined,
    Settings: undefined,
    UserBuildsList: undefined,
    Build: { build: IBuildType }
    UserPostsList: undefined,
    LikedPostsList: undefined,
    Post: { post: IPostType },
    WishList: undefined,
    Friends: undefined,
    FriendsList: undefined,
    AddFriend: undefined,
    SearchFriends: undefined
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const StackNavigator = (props: Props) => {
    const { darkMode } = usePrimaryContext();

    useEffect(() => {
        //Miraria el darkMode en el asyncStorage y lo pondria en el contexto
    }, []);

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: {
                    backgroundColor: (darkMode) ? "#242121" : "#F5F5F5"
                }
            }}
        >
            <Stack.Screen name='Landing' component={Landing} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
            <Stack.Screen name="UserBuildsList" component={UserBuildsList} />
            <Stack.Screen name="LikedPostsList" component={LikedPostsList} />
            <Stack.Screen name="UserPostsList" component={UserPostsList} />
            <Stack.Screen name="Post" component={Post} />
            <Stack.Screen name="WishList" component={WishList} />
            <Stack.Screen name="Friends" component={FriendsTabs} />
        </Stack.Navigator>
    )
}

export default StackNavigator