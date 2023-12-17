import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import React from 'react'

type Props = {}

const Settings = (props: Props) => {
    return (
        <View>
            <TouchableOpacity onPress={() => Alert.alert("Cambiaria el modo")}>
                <Text>Change Mode to Dark/Light</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Alert.alert("Cambiaria el nick (siempre cuando no exista)")}>
                <Text>Change Nick</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Alert.alert("Cambiaria la password")}>
                <Text>Change Password</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Settings

const styles = StyleSheet.create({})