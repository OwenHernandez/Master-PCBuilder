import { View, Text, PixelRatio, Dimensions } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicon from 'react-native-vector-icons/Ionicons';
import Social from '../screens/Social';
import CreatePost from '../screens/CreatePost';
import { usePrimaryContext } from '../contexts/PrimaryContext';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import SearchPost from '../screens/SearchPost';
import FriendsList from '../screens/FriendsList';
import AddFriend from '../screens/AddFriend';
import SearchFriends from '../screens/SearchFriends';

type Props = {}

export type FriendsTabsParamList = {
    Friends: undefined;
    Add: undefined;
    Search: undefined;
}

const Tab = createBottomTabNavigator<FriendsTabsParamList>();

const FriendsTabs = (props: Props) => {
    const { user, darkMode } = usePrimaryContext();
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;

    return (
        <Tab.Navigator initialRouteName='Friends' screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Add"
                options={{
                    tabBarIcon: ({ focused }) => <Material name={(focused) ? "plus-circle" : "plus-circle-outline"} size={getIconSize(90)} color={(darkMode) ? "white" : "black"} />,
                    tabBarInactiveBackgroundColor: (darkMode) ? "#242121" : "#F5F5F5", tabBarActiveBackgroundColor: (darkMode) ? "#242121" : "#F5F5F5",
                    //tabBarItemStyle: { borderTopColor: "red", borderTopWidth: 2 },
                    tabBarLabelStyle: { fontSize: getFontSize(13) },
                    tabBarStyle: { borderTopColor: "#ca2613", borderTopWidth: 2 }
                }}
                component={AddFriend}
            />
            <Tab.Screen name="Friends"
                options={{
                    tabBarIcon: ({ focused }) => <Ionicon name={(focused) ? 'people-sharp' : 'people-outline'} size={getIconSize(90)} color={(darkMode) ? "white" : "black"} />,
                    tabBarInactiveBackgroundColor: (darkMode) ? "#242121" : "#F5F5F5", tabBarActiveBackgroundColor: (darkMode) ? "#242121" : "#F5F5F5",
                    //tabBarItemStyle: { borderTopColor: "red", borderTopWidth: 2 },
                    tabBarLabelStyle: { fontSize: getFontSize(13) },
                    tabBarStyle: { borderTopColor: "#ca2613", borderTopWidth: 2 }
                }}
                component={FriendsList}
            />
            <Tab.Screen name="Search"
                options={{
                    tabBarIcon: ({ focused }) => <Ionicon name={(focused) ? "search-circle" : "search-circle-outline"} size={getIconSize(90)} color={(darkMode) ? "white" : "black"} />,
                    tabBarInactiveBackgroundColor: (darkMode) ? "#242121" : "#F5F5F5", tabBarActiveBackgroundColor: (darkMode) ? "#242121" : "#F5F5F5",
                    //tabBarItemStyle: { borderTopColor: "red", borderTopWidth: 2 },
                    tabBarLabelStyle: { fontSize: getFontSize(13) },
                    tabBarStyle: { borderTopColor: "#ca2613", borderTopWidth: 2 }
                }}
                component={SearchFriends}
            />
        </Tab.Navigator>
    )
}

export default FriendsTabs