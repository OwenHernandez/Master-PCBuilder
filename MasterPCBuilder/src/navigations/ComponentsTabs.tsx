import { View, Text, PixelRatio, Dimensions } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { usePrimaryContext } from '../contexts/PrimaryContext';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import FriendsList from '../screens/FriendsList';
import SearchUsers from '../screens/SearchUsers';
import CreateComponent from "../screens/CreateComponent";
import ComponentsList from "../screens/ComponentsList";

type Props = {}

export type ComponentsTabsParamList = {
    "Components List": undefined;
    "Create Component": undefined;
}

const Tab = createBottomTabNavigator<ComponentsTabsParamList>();

const ComponentsTabs = (props: Props) => {
    const { user, darkMode } = usePrimaryContext();
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;

    return (
        <Tab.Navigator initialRouteName='Components List' screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Create Component"
                options={{
                    tabBarIcon: ({ focused }) => <Material name={(focused) ? "plus-circle" : "plus-circle-outline"} size={getIconSize(80)} color={(darkMode) ? "white" : "black"} />,
                    tabBarInactiveBackgroundColor: (darkMode) ? "#242121" : "#F5F5F5", tabBarActiveBackgroundColor: (darkMode) ? "#242121" : "#F5F5F5",
                    //tabBarItemStyle: { borderTopColor: "red", borderTopWidth: 2 },
                    tabBarLabelStyle: { fontSize: getFontSize(13) },
                    tabBarStyle: { borderTopColor: "#ca2613", borderTopWidth: 2 }
                }}
                component={CreateComponent}
            />
            <Tab.Screen name="Components List"
                options={{
                    tabBarIcon: ({ focused }) => <Ionicon name={(focused) ? 'hardware-chip' : 'hardware-chip-outline'} size={getIconSize(80)} color={(darkMode) ? "white" : "black"} />,
                    tabBarInactiveBackgroundColor: (darkMode) ? "#242121" : "#F5F5F5", tabBarActiveBackgroundColor: (darkMode) ? "#242121" : "#F5F5F5",
                    //tabBarItemStyle: { borderTopColor: "red", borderTopWidth: 2 },
                    tabBarLabelStyle: { fontSize: getFontSize(13) },
                    tabBarStyle: { borderTopColor: "#ca2613", borderTopWidth: 2 }
                }}
                component={ComponentsList}
            />
        </Tab.Navigator>
    )
}

export default ComponentsTabs