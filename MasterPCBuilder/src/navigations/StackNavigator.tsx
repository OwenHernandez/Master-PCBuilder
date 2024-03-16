import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react'
import Register from '../screens/Register';
import Login from '../screens/Login';
import Post from '../screens/Post';
import UserBuildsList from '../screens/UserBuildsList';
import WishList from '../screens/WishList';
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
import ComponentScreen from "../screens/ComponentScreen";
import EditComponent from "../screens/EditComponent";
import AdminChat from "../screens/AdminChat";

type Props = {}

export type RootStackParamList = {
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
    Chat: { friend: IUserType },
    AdminChat: undefined,
    OtherUserProfile: { userSelected: IUserType },
    ComponentScreen: { comp: IComponentType },
    EditComponent: { comp: IComponentType }
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
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
            <Stack.Screen name="UserBuildsList" component={UserBuildsList} />
            <Stack.Screen name="Post" component={Post} />
            <Stack.Screen name="WishList" component={WishList} />
            <Stack.Screen name="Friends" component={FriendsTabs} />
            <Stack.Screen name="Chat" component={Chat} />
            <Stack.Screen name="AdminChat" component={AdminChat} />
            <Stack.Screen name="OtherUserProfile" component={OtherUserProfile} />
            <Stack.Screen name="ComponentScreen" component={ComponentScreen} />
            <Stack.Screen name="EditComponent" component={EditComponent} />
        </Stack.Navigator>
    )
}

export default StackNavigator