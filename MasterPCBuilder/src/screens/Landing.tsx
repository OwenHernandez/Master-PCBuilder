import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/StackNavigator';
import { Styles } from '../themes/Styles';
import { usePrimaryContext } from '../contexts/PrimaryContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Landing'>;

const Landing = (props: Props) => {
    const { darkMode } = usePrimaryContext();
    const { navigation, route } = props;
    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Image
                    source={(darkMode) ? require("../../img/logo_dark.png") : require("../../img/logo_light.png")}
                    style={{ width: 300, height: 300 }}
                />
                <TouchableOpacity style={Styles.touchable} onPress={() => navigation.navigate("Login")}>
                    <Text style={{ color: (darkMode) ? "white" : "black", fontSize: 20 }}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={Styles.touchable} onPress={() => navigation.navigate("Register")}>
                    <Text style={{ color: (darkMode) ? "white" : "black", fontSize: 20 }}>Register</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Landing

const styles = StyleSheet.create({})