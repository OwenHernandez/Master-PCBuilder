import { View, Text, SafeAreaView, Dimensions, PixelRatio, TouchableOpacity, Image, TextInput, Alert } from 'react-native'
import React from 'react'
import { usePrimaryContext } from '../contexts/PrimaryContext';
import { RootStackParamList } from '../navigations/StackNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Styles } from '../themes/Styles';
import Octicons from 'react-native-vector-icons/Octicons';
import { DrawerActions } from '@react-navigation/native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicon from 'react-native-vector-icons/Octicons';

type Props = NativeStackScreenProps<RootStackParamList, 'SearchFriends'>;

const SearchFriends = (props: Props) => {
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
                            uri: user.picture
                        }}
                        style={{ ...Styles.imageStyle, borderColor: (darkMode) ? "white" : "black", borderWidth: 1, width: getIconSize(110), height: getIconSize(110) }}
                    />
                </TouchableOpacity>
                <Text style={{ ...Styles.headerText, color: (darkMode) ? "white" : "black", fontSize: getFontSize(20) }}>{route.name}</Text>
                <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
                    <Octicon name='three-bars' size={30} color={(darkMode) ? "white" : "black"}></Octicon>
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-around", margin: "10%", alignItems: "center" }}>
                <View style={{ width: "80%" }}>
                    <TextInput placeholder='Search a friend by the nick' placeholderTextColor={(darkMode) ? "white" : "black"} style={{ borderWidth: 2, borderColor: "#ca2613", borderRadius: 20, paddingHorizontal: "5%", marginVertical: "5%", fontSize: getFontSize(15), color: (darkMode) ? "white" : "black" }}></TextInput>
                    <TextInput placeholder='Search a friend by the email' placeholderTextColor={(darkMode) ? "white" : "black"} style={{ borderWidth: 2, borderColor: "#ca2613", borderRadius: 20, paddingHorizontal: "5%", fontSize: getFontSize(15), color: (darkMode) ? "white" : "black" }}></TextInput>
                </View>
                <TouchableOpacity onPress={() => Alert.alert("buscaria en la api")}>
                    <FontAwesome5Icon name="search" size={getIconSize(80)} color={(darkMode) ? "white" : "black"} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default SearchFriends