import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { RootStackParamList } from '../navigations/StackNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { usePrimaryContext } from '../contexts/PrimaryContext';
import useLogout from '../hooks/useLogout';
import { Styles } from '../themes/Styles';
import Icon from 'react-native-vector-icons/Octicons';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const Profile = (props: Props) => {
    const { navigation, route } = props;
    const { logout } = useLogout();

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={Styles.headerView}>
                <TouchableOpacity onPress={() => /*navigation.navigate("Settings")*/Alert.alert("Iria a los ajustes")}>
                    <Icon name='gear' size={30}></Icon>
                </TouchableOpacity>
                <Text style={Styles.headerText}>{route.name}</Text>
                <TouchableOpacity>
                    <Icon name='three-bars' size={30}></Icon>
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity style={{ ...Styles.touchable, marginBottom: 10, padding: 20 }} onPress={() => navigation.navigate("UserBuildsList")}>
                    <Text style={{ fontSize: 20, textAlign: 'center' }}>Your Builds</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...Styles.touchable, marginBottom: 10, padding: 20 }} onPress={() => navigation.navigate("UserPostsList")}>
                    <Text style={{ fontSize: 20, textAlign: 'center' }}>Your Posts</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...Styles.touchable, marginBottom: 10, padding: 20 }} onPress={() => navigation.navigate("LikedPostsList")}>
                    <Text style={{ fontSize: 20, textAlign: 'center' }}>Liked Posts</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...Styles.touchable, marginBottom: 10, padding: 20 }} onPress={() => navigation.navigate("WishList")}>
                    <Text style={{ fontSize: 20, textAlign: 'center' }}>Wish List</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...Styles.touchable, marginBottom: 10, padding: 20 }} onPress={() => navigation.navigate("FriendsList")}>
                    <Text style={{ fontSize: 20, textAlign: 'center' }}>Friends</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...Styles.touchable, marginBottom: 10, padding: 20, borderColor: "violet" }} onPress={() => logout(navigation)}>
                    <Text style={{ fontSize: 20, textAlign: 'center' }}>Logout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default Profile