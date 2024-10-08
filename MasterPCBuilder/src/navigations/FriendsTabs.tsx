import { View, Text, PixelRatio, Dimensions } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { usePrimaryContext } from '../contexts/PrimaryContext';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import FriendsList from '../screens/FriendsList';
import SearchUsers from '../screens/SearchUsers';
import GroupList from "../screens/GroupList";

type Props = {}

export type FriendsTabsParamList = {
    "Friends List": undefined;
    "Search Users": undefined;
    "Group List": undefined;
}

const Tab = createBottomTabNavigator<FriendsTabsParamList>();

const FriendsTabs = (props: Props) => {
    const { user, darkMode } = usePrimaryContext();
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;

    return (
        <Tab.Navigator initialRouteName='Friends List' screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Search Users"
                options={{
                    tabBarIcon: ({ focused }) => <Material name={(focused) ? "plus-circle" : "plus-circle-outline"} size={getIconSize(80)} color={(darkMode) ? "white" : "black"} />,
                    tabBarInactiveBackgroundColor: (darkMode) ? "#242121" : "#F5F5F5", tabBarActiveBackgroundColor: (darkMode) ? "#242121" : "#F5F5F5",
                    //tabBarItemStyle: { borderTopColor: "red", borderTopWidth: 2 },
                    tabBarLabelStyle: { fontSize: getFontSize(13) },
                    tabBarStyle: { borderTopColor: "#ca2613", borderTopWidth: 2 }
                }}
                component={SearchUsers}
            />
            <Tab.Screen name="Friends List"
                options={{
                    tabBarIcon: ({ focused }) => <Ionicon name={(focused) ? 'people-sharp' : 'people-outline'} size={getIconSize(80)} color={(darkMode) ? "white" : "black"} />,
                    tabBarInactiveBackgroundColor: (darkMode) ? "#242121" : "#F5F5F5", tabBarActiveBackgroundColor: (darkMode) ? "#242121" : "#F5F5F5",
                    //tabBarItemStyle: { borderTopColor: "red", borderTopWidth: 2 },
                    tabBarLabelStyle: { fontSize: getFontSize(13) },
                    tabBarStyle: { borderTopColor: "#ca2613", borderTopWidth: 2 }
                }}
                component={FriendsList}
            />
            <Tab.Screen name="Group List"
                        options={{
                            tabBarIcon: ({ focused }) => <Material name={(focused) ? 'account-group' : 'account-group-outline'} size={getIconSize(80)} color={(darkMode) ? "white" : "black"} />,
                            tabBarInactiveBackgroundColor: (darkMode) ? "#242121" : "#F5F5F5", tabBarActiveBackgroundColor: (darkMode) ? "#242121" : "#F5F5F5",
                            //tabBarItemStyle: { borderTopColor: "red", borderTopWidth: 2 },
                            tabBarLabelStyle: { fontSize: getFontSize(13) },
                            tabBarStyle: { borderTopColor: "#ca2613", borderTopWidth: 2 }
                        }}
                        component={GroupList}
            />
        </Tab.Navigator>
    )
}

export default FriendsTabs