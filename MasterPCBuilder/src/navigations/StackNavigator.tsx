import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react'
import Register from '../screens/Register';
import Login from '../screens/Login';
import Profile from '../screens/Profile';
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
import DrawerNavigator from './DrawerNavigator';
import FriendsTabs from './FriendsTabs';
import Chat from '../screens/Chat';
import IUserType from '../interfaces/IUserType';
import OtherUserProfile from '../screens/OtherUserProfile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IComponentType from "../interfaces/IComponentType";

type Props = {}

export type RootStackParamList = {
    Landing: undefined,
    Register: undefined,
    Login: undefined,
    Social: undefined,
    CreatePost: undefined,
    DrawerNavigator: any,
    Builder: { build?: IBuildType, builds?: IBuildType[] },
    Profile: undefined,
    Settings: undefined,
    UserBuildsList: undefined,
    Post: { post: IPostType },
    Posts: {posts?: IPostType[]},
    WishList: undefined,
    Friends: undefined,
    "Friends List": undefined,
    SearchUsers: undefined,
    CreateComponent: undefined,
    "Components List": { components?: IComponentType[] },
    Chat: { userSelected: IUserType },
    OtherUserProfile: { userSelected: IUserType }
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigator = (props: Props) => {
    const { darkMode, setDarkMode } = usePrimaryContext();

    useEffect(() => {
        async function getDarkMode() {
            let getDarkMode = await AsyncStorage.getItem("darkMode");
            if (getDarkMode === null) {
                await AsyncStorage.setItem("darkMode", "true");
                setDarkMode(true);
            } else {
                if (JSON.stringify(getDarkMode) === "\"true\"") {
                    setDarkMode(true);
                } else {
                    setDarkMode(false);
                }
            }
        }
        getDarkMode();
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
            <Stack.Screen name="Post" component={Post} />
            <Stack.Screen name="WishList" component={WishList} />
            <Stack.Screen name="Friends" component={FriendsTabs} />
            <Stack.Screen name="Chat" component={Chat} />
            <Stack.Screen name="OtherUserProfile" component={OtherUserProfile} />
        </Stack.Navigator>
    )
}

export default StackNavigator