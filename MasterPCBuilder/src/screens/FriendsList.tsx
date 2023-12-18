import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { Styles } from '../themes/Styles';
import Component from '../components/Component';
import { usePrimaryContext } from '../contexts/PrimaryContext';
import { RootStackParamList } from '../navigations/StackNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Octicons';
import IUserType from '../interfaces/IUserType';

type Props = NativeStackScreenProps<RootStackParamList, 'FriendsList'>;

const FriendsList = (props: Props) => {
    const { navigation, route } = props;
    const { user } = usePrimaryContext();
    const tempFriendsList: IUserType[] = [
        {
            nick: "Amigo1",
            email: "amigo1@gmail.com",
            profilePic: "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0=",
        },
        {
            nick: "Amigo2",
            email: "amigo2@gmail.com",
            profilePic: "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0=",
        }
    ];
    useEffect(() => {
        //Buscaria en la base de datos los que tenga en la wishlist
    }, []);

    return (
        <View>
            <View style={Styles.headerView}>
                <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                    <Image
                        source={{
                            uri: user.profilePic,
                            width: 35,
                            height: 35
                        }}
                        style={{ ...Styles.imageStyle }}
                    />
                </TouchableOpacity>
                <Text style={Styles.headerText}>{route.name}</Text>
                <TouchableOpacity onPress={() => Alert.alert("Iria al drawer")}>
                    <Icon name='three-bars' size={30} color={"white"}></Icon>
                </TouchableOpacity>
            </View>
            <FlatList
                data={tempFriendsList}
                renderItem={(friend) => {
                    return (
                        <View>
                            <TouchableOpacity onPress={() => Alert.alert("Abriria el chat")}>
                                <TouchableOpacity onPress={() => Alert.alert("Abriria el perfil del amigo")}>
                                    <Image
                                        source={{
                                            uri: friend.item.profilePic,
                                            width: 35,
                                            height: 35
                                        }}
                                    />
                                </TouchableOpacity>
                                <Text>{friend.item.nick}</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }}
                keyExtractor={(comp, index) => index + ""}
            />
        </View>
    )
}

export default FriendsList

const styles = StyleSheet.create({})