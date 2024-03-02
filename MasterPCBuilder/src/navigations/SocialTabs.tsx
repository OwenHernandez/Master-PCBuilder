import { View, Text, PixelRatio, Dimensions } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicon from 'react-native-vector-icons/Ionicons';
import Social from '../screens/Social';
import CreatePost from '../screens/CreatePost';
import { usePrimaryContext } from '../contexts/PrimaryContext';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {}

export type RootTabsParamList = {
    Posts: undefined;
    Create: undefined;
}

const Tab = createBottomTabNavigator<RootTabsParamList>();

const SocialTabs = (props: Props) => {
    const { user, darkMode } = usePrimaryContext();
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;

    return (
        <Tab.Navigator initialRouteName='Posts' screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Create"
                options={{
                    tabBarIcon: ({ focused }) => <Material name={(focused) ? "plus-circle" : "plus-circle-outline"} size={getIconSize(80)} color={(darkMode) ? "white" : "black"} />,
                    tabBarInactiveBackgroundColor: (darkMode) ? "#242121" : "#F5F5F5", tabBarActiveBackgroundColor: (darkMode) ? "#242121" : "#F5F5F5",
                    //tabBarItemStyle: { borderTopColor: "red", borderTopWidth: 2 },
                    tabBarLabelStyle: { fontSize: getFontSize(13) },
                    tabBarStyle: { borderTopColor: "#ca2613", borderTopWidth: 2 }
                }}
                component={CreatePost}
            />
            <Tab.Screen name="Posts"
                options={{
                    tabBarIcon: ({ focused }) => <Ionicon name={(focused) ? 'people-sharp' : 'people-outline'} size={getIconSize(80)} color={(darkMode) ? "white" : "black"} />,
                    tabBarInactiveBackgroundColor: (darkMode) ? "#242121" : "#F5F5F5", tabBarActiveBackgroundColor: (darkMode) ? "#242121" : "#F5F5F5",
                    //tabBarItemStyle: { borderTopColor: "red", borderTopWidth: 2 },
                    tabBarLabelStyle: { fontSize: getFontSize(13) },
                    tabBarStyle: { borderTopColor: "#ca2613", borderTopWidth: 2 }
                }}
                component={Social}
            />
        </Tab.Navigator>
    )
}

export default SocialTabs