import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { RootStackParamList } from '../navigations/StackNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { usePrimaryContext } from '../contexts/PrimaryContext';
import useLogout from '../hooks/useLogout';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const Profile = (props: Props) => {
    const { navigation } = props;
    const { logout } = useLogout();

    return (
        <SafeAreaView>
            <TouchableOpacity onPress={() => navigation.navigate("UserPostsList")}>
                <Text>Your Posts</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("LikedPostsList")}>
                <Text>Liked Posts</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("WishList")}>
                <Text>Wish List</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("FriendsList")}>
                <Text>Friends</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => logout(navigation)}>
                <Text>Logout</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default Profile

const styles = StyleSheet.create({})