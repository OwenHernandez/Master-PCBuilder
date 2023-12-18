import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/StackNavigator';
import { Styles } from '../themes/Styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Landing'>;

const Landing = (props: Props) => {
    const { navigation, route } = props;
    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ ...Styles.headerText, fontSize: 30, marginBottom: "30%" }}>Master-PCBuilder</Text>
                <TouchableOpacity style={Styles.touchable} onPress={() => navigation.navigate("Login")}>
                    <Text style={{ color: "white", fontSize: 20 }}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={Styles.touchable} onPress={() => navigation.navigate("Register")}>
                    <Text style={{ color: "white", fontSize: 20 }}>Register</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Landing

const styles = StyleSheet.create({})