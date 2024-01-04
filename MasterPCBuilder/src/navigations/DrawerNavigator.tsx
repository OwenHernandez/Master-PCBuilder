import { View, Text } from 'react-native'
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import StackNavigator from './StackNavigator';
import Profile from '../screens/Profile'
import { usePrimaryContext } from '../contexts/PrimaryContext'
import Settings from '../screens/Settings';
import Builder from '../screens/Builder';

type Props = {}

export type RootDrawerParamList = {
    Profile: undefined;
    Settings: undefined;
    Builder: undefined;
}

const Drawer = createDrawerNavigator<RootDrawerParamList>();

const DrawerNavigator = (props: Props) => {
    const { darkMode } = usePrimaryContext();

    return (
        <Drawer.Navigator
            screenOptions={{
                headerShown: false,
                drawerInactiveTintColor: (!darkMode) ? "#242121" : "#F5F5F5",
                drawerContentContainerStyle: { backgroundColor: (darkMode) ? "#242121" : "#F5F5F5" },
                drawerContentStyle: {
                    backgroundColor: (darkMode) ? "#242121" : "#F5F5F5"
                }
            }}
        >
            <Drawer.Screen name="Builder" component={Builder} />
            <Drawer.Screen name="Profile" component={Profile} />
            <Drawer.Screen name="Settings" component={Settings} />
            {/*<Drawer.Screen name="StackNavigator" component={StackNavigator} options={{}} />*/}
        </Drawer.Navigator>
    )
}

export default DrawerNavigator