import { StyleSheet, Text, TouchableOpacity, View, Alert, Image, Switch } from 'react-native';
import React from 'react'
import { Styles } from '../themes/Styles';
import Icon from 'react-native-vector-icons/Octicons';
import { RootStackParamList } from '../navigations/StackNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { usePrimaryContext } from '../contexts/PrimaryContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const Settings = (props: Props) => {
    const { user, darkMode, setDarkMode } = usePrimaryContext();
    const { navigation, route } = props;
    return (
        <View style={{ flex: 1, backgroundColor: (darkMode) ? "#242121" : "#F5F5F5" }}>
            <View style={Styles.headerView}>
                <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                    <Image
                        source={{
                            uri: user.profilePic,
                            width: 35,
                            height: 35
                        }}
                        style={{ ...Styles.imageStyle, borderColor: (darkMode) ? "white" : "black", borderWidth: 1 }}
                    />
                </TouchableOpacity>
                <Text style={{ ...Styles.headerText, color: (darkMode) ? "white" : "black" }}>{route.name}</Text>
                <TouchableOpacity onPress={() => Alert.alert("Iria al drawer")}>
                    <Icon name='three-bars' size={30} color={(darkMode) ? "white" : "black"}></Icon>
                </TouchableOpacity>
            </View>
            <View style={{ ...Styles.touchable, justifyContent: "center", flexDirection: "row", marginTop: "10%" }}>
                <Text style={{ fontSize: 18, color: (darkMode) ? "white" : "black" }}>Change the mode to {darkMode ? "light" : "dark"}   </Text>
                <Switch
                    onValueChange={() => setDarkMode(!darkMode)}
                    thumbColor={darkMode ? "#ca2613" : "#444242"}
                    trackColor={{ true: "#CCCCCC", false: "#CCCCCC" }}
                    value={darkMode}
                />
            </View>
            {/*
            <TouchableOpacity style={{ ...Styles.touchable }} onPress={() => Alert.alert("Cambiaria el modo")}>
                <Text style={{ fontSize: 20, textAlign: 'center', color: (darkMode) ? "white" : "black" }}>Change Mode to Dark/Light</Text>
            </TouchableOpacity>
            */}
            <TouchableOpacity style={{ ...Styles.touchable }} onPress={() => Alert.alert("Abriria un modal para cambiar el nick (siempre cuando no exista)")}>
                <Text style={{ fontSize: 20, textAlign: 'center', color: (darkMode) ? "white" : "black" }}>Change Nick</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ ...Styles.touchable }} onPress={() => Alert.alert("Te enviaria un email para cambiar la password")}>
                <Text style={{ fontSize: 20, textAlign: 'center', color: (darkMode) ? "white" : "black" }}>Change Password</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ ...Styles.touchable }} onPress={() => Alert.alert("Abriria un modal para cambiar la imagen de fondo")}>
                <Text style={{ fontSize: 20, textAlign: 'center', color: (darkMode) ? "white" : "black" }}>Change Profile Picture</Text>
            </TouchableOpacity>
        </View >
    )
}

export default Settings