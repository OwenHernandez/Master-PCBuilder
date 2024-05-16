import {View, Text, Image, PixelRatio, Dimensions} from 'react-native'
import React from 'react'
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem, createDrawerNavigator } from '@react-navigation/drawer';
import StackNavigator from './StackNavigator';
import Profile from '../screens/Profile'
import { usePrimaryContext } from '../contexts/PrimaryContext'
import Settings from '../screens/Settings';
import Builder from '../screens/Builder';
import Social from '../screens/Social';
import SocialTabs from './SocialTabs';
import FriendsTabs from './FriendsTabs';
import IBuildType from '../interfaces/IBuildType';
import Icon from "react-native-vector-icons/Octicons";
import ComponentsTabs from "./ComponentsTabs";
import Ionicon from "react-native-vector-icons/Ionicons";

type Props = {}

export type RootDrawerParamList = {
    Landing: undefined;
    Profile: undefined;
    Settings: undefined;
    Components: undefined;
    Builder: { build?: IBuildType, builds?: IBuildType[] };
    Social: undefined;
    Friends: undefined;
}

const Drawer = createDrawerNavigator();

const DrawerNavigator = (props: Props) => {
    const {darkMode} = usePrimaryContext();
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;

    return (
        <Drawer.Navigator
            screenOptions={{
                headerShown: false,
                drawerInactiveTintColor: (!darkMode) ? "#242121" : "#F5F5F5",
                drawerContentContainerStyle: {backgroundColor: (darkMode) ? "#242121" : "#F5F5F5"},
                drawerContentStyle: {
                    backgroundColor: (darkMode) ? "#242121" : "#F5F5F5"
                }
            }}
            drawerContent={(props) => DrawerPersonalizado(props)}
        >
            <Drawer.Screen name="Social" component={SocialTabs}/>
            <Drawer.Screen name="Builder" component={Builder}/>
            <Drawer.Screen name="Profile" component={Profile}/>
            <Drawer.Screen name="Friends" component={FriendsTabs}/>
            <Drawer.Screen name="Settings" component={Settings}/>
            <Drawer.Screen name="Components" component={ComponentsTabs} />
        </Drawer.Navigator>
    )

    function DrawerPersonalizado({navigation}: DrawerContentComponentProps) {

        return (
            <DrawerContentScrollView
                style={{ flex: 1, backgroundColor: (darkMode) ? "#242121" : "#F5F5F5" }}
                contentContainerStyle={{ flex: 1 }}
            >
                    <View style={{flex:1, }}>
                        <View style={{flex:1}}>
                            <Image
                                style={{width: "100%", height: 170, marginBottom: 10}}
                                source={(darkMode) ? require("../../img/logo_dark.png") : require("../../img/logo_light.png")}
                            />
                        </View>
                        <View style={{flex:1}}>
                            <DrawerItem
                                labelStyle={{color: (darkMode) ? "white" : "black"}}
                                icon={() => <Icon name="device-desktop" color={darkMode ? 'white' : 'black'} size={getIconSize(45)} />}
                                label="Social"
                                onPress={() => navigation.navigate("Social")}
                            />
                            <DrawerItem
                                labelStyle={{color: (darkMode) ? "white" : "black"}}
                                icon={() => <Ionicon name="hardware-chip-outline" color={darkMode ? 'white' : 'black'} size={getIconSize(45)} />}
                                label="Components"
                                onPress={() => navigation.navigate("Components")}
                            />
                            <DrawerItem
                                labelStyle={{color: (darkMode) ? "white" : "black"}}
                                icon={() => <Icon name="person" color={darkMode ? 'white' : 'black'} size={getIconSize(45)} />}
                                label="Friends"
                                onPress={() => navigation.navigate("Friends")}
                            />
                            <DrawerItem
                                labelStyle={{color: (darkMode) ? "white" : "black"}}
                                icon={() => <Icon name="codespaces" color={darkMode ? 'white' : 'black'} size={getIconSize(45)} />}
                                label="Builder"
                                onPress={() => navigation.navigate("Builder")}
                            />
                            <DrawerItem
                                labelStyle={{color: (darkMode) ? "white" : "black"}}
                                icon={() => <Icon name="home" color={darkMode ? 'white' : 'black'} size={getIconSize(45)} />}
                                label="Profile"
                                onPress={() => navigation.navigate("Profile")}
                            />
                            <DrawerItem
                                labelStyle={{color: (darkMode) ? "white" : "black"}}
                                icon={() => <Icon name="gear" color={darkMode ? 'white' : 'black'} size={getIconSize(45)} />}
                                label="Settings"
                                onPress={() => navigation.navigate("Settings")}
                            />
                        </View>
                    <View style={{flex: 1, justifyContent: 'flex-end'}}>
                        <DrawerItem
                            labelStyle={{color: (darkMode) ? "white" : "black"}}
                            icon={() => <Icon name="sign-out" color={darkMode ? 'white' : 'black'} size={getIconSize(45)} />}
                            label="Logout"
                            onPress={() => navigation.navigate("Login")}
                        />
                    </View>
                </View>
            </DrawerContentScrollView>
        )
    }
}
export default DrawerNavigator