import { View, Text, SafeAreaView, TouchableOpacity, Image, PixelRatio, Dimensions, TextInput, FlatList, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { usePrimaryContext } from '../contexts/PrimaryContext';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import Octicons from 'react-native-vector-icons/Octicons';
import { DrawerActions } from '@react-navigation/native';
import { Styles } from '../themes/Styles';
import { RootTabsParamList } from '../navigations/SocialTabs';
import { RootStackParamList } from '../navigations/StackNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import DropDownPicker, { ItemType, ValueType } from 'react-native-dropdown-picker';
import IBuildType from '../interfaces/IBuildType';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicon from 'react-native-vector-icons/Octicons';

type Props = NativeStackScreenProps<RootStackParamList, 'AddFriend'>;

const AddFriend = (props: Props) => {
    const { user, darkMode } = usePrimaryContext();
    const { navigation, route } = props;
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: (darkMode) ? "#242121" : "#F5F5F5" }}>
            <View style={Styles.headerView}>
                <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                    <Image
                        source={{
                            uri: user.profilePic
                        }}
                        style={{ ...Styles.imageStyle, borderColor: (darkMode) ? "white" : "black", borderWidth: 1, width: getIconSize(110), height: getIconSize(110) }}
                    />
                </TouchableOpacity>
                <Text style={{ ...Styles.headerText, color: (darkMode) ? "white" : "black" }}>{route.name}</Text>
                <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
                    <Octicon name='three-bars' size={30} color={(darkMode) ? "white" : "black"}></Octicon>
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ backgroundColor: '#524f4f', padding: "10%", borderRadius: 20, alignItems: "center", marginHorizontal: "10%", marginBottom: "2%" }}>
                    <TextInput placeholder='Nick' style={{ ...Styles.textInput, marginBottom: "5%" }} placeholderTextColor={"black"}></TextInput>
                </View>
                <TouchableOpacity style={{ ...Styles.touchable }} onPress={() => { Alert.alert("Crearia el post y lo mandaria al social"); navigation.navigate("Social") }}>
                    <Text style={{ fontSize: getFontSize(20), color: (darkMode) ? "white" : "black", textAlign: 'center' }}>Add Friend</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default AddFriend