import {
    Alert,
    Dimensions,
    FlatList,
    Image, Modal,
    PixelRatio,
    ScrollView,
    StyleSheet,
    Text, TextInput,
    TouchableOpacity,
    View
} from 'react-native'
import React, {useEffect, useState} from 'react'
import {SafeAreaView} from 'react-native-safe-area-context'
import {RootStackParamList} from '../navigations/StackNavigator';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {usePrimaryContext} from '../contexts/PrimaryContext';
import useLogout from '../hooks/useLogout';
import {Styles} from '../themes/Styles';
import Octicon from 'react-native-vector-icons/Octicons';
import {DrawerActions} from '@react-navigation/native';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderScreen from "../components/HeaderScreen";
import axios from "axios";
import {Globals} from "../components/Globals";
import RNFetchBlob from "rn-fetch-blob";
import IUserType from "../interfaces/IUserType";
import IGroupChatType from "../interfaces/IGroupChatType";
import IBuildComponentType from "../interfaces/IBuildComponentType";
import Component from "../components/Component";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

type Props = NativeStackScreenProps<RootStackParamList, 'GroupChatDetails'>;

const GroupChatDetails = (props: Props) => {
    const {user, darkMode, token, setUser} = usePrimaryContext();
    const {navigation, route} = props;
    let groupSelected = route.params.groupSelected;
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;
    const [groupTemp, setGroupTemp] = useState({} as IGroupChatType);
    const [groupAdmin, setGroupAdmin] = useState(false);
    const [size, setSize] = useState(0);
    const [modalAddMemberVisible, setModalAddMemberVisible] = useState(false);
    const [friendsList, setFriendsList] = useState([{}] as IUserType[]);
    const [friendsByName, setFriendsByName] = useState([{}] as IUserType[]);

    useEffect(() => {
        setGroupTemp(groupSelected);
        setSize(groupTemp.users.length);
        setGroupAdmin(groupTemp.admin.id === user.id);
        setFriendsList(user.friends);
        setFriendsByName(user.friends);
    }, [groupSelected, user]);

    function isBlocked(userSelected: IUserType) {
        for (const blockedUser of user.blockedUsers) {
            if (blockedUser.id === userSelected.id) {
                return true;
            }
        }
        return false;
    }

    async function addRemoveMember(userSelected: IUserType) {
        try {
            const response = await axios.put(Globals.IP_HTTP + "/api/v2/groupchats/" + groupSelected.id + "/users/" + userSelected.id, null, {headers: {Authorization: "Bearer " + token}});
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: (darkMode) ? "#242121" : "#F5F5F5"}}>
            <HeaderScreen name={groupTemp.name + "'s Details"} navigation={navigation} profile={false}
                          drawer={false}/>
            <View style={{alignItems: 'center', margin: "5%"}}>
                <Image
                    source={{
                        uri: (groupTemp.picture !== "") ? "data:image/jpeg;base64," + groupTemp.picture : "https://www.softzone.es/app/uploads-softzone.es/2018/04/guest.png?x=480&quality=40"
                    }}
                    style={{
                        ...Styles.imageStyle,
                        borderColor: (darkMode) ? "white" : "black",
                        borderWidth: 1,
                        width: getIconSize(300),
                        height: getIconSize(300)
                    }}
                />
                <Text style={{
                    fontSize: getFontSize(40),
                    color: (darkMode) ? "white" : "black"
                }}>{groupTemp.name}</Text>
                <Text style={{
                    fontSize: getFontSize(20),
                    color: (darkMode) ? "white" : "black"
                }}>{groupTemp.description}</Text>
                <Text style={{fontSize: getFontSize(20), color: (darkMode) ? "white" : "black"}}>{size} members</Text>
                <Material name="crown" size={getIconSize(80)} color="#cfa717"/>
                <TouchableOpacity onPress={() => navigation.navigate("Chat", {friend: groupTemp.admin})}
                                  style={{
                                      ...Styles.touchable,
                                      flexDirection: "row",
                                      alignItems: "center",
                                      margin: "3%"
                                  }}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("OtherUserProfile", {userSelected: groupTemp.admin})}>
                        <Image
                            source={{
                                uri: (groupTemp.admin.picture !== "") ? "data:image/jpeg;base64," + groupTemp.admin.picture : "https://www.softzone.es/app/uploads-softzone.es/2018/04/guest.png?x=480&quality=40",
                            }}
                            style={{
                                ...Styles.imageStyle,
                                borderColor: (darkMode) ? "white" : "black",
                                borderWidth: 1,
                                width: getIconSize(110),
                                height: getIconSize(110)
                            }}
                        />
                        <Text style={{
                            fontSize: getFontSize(20),
                            color: (darkMode) ? "white" : "black",
                            margin: "3%"
                        }}>{groupTemp.admin.nick}</Text>
                    </TouchableOpacity>
                </TouchableOpacity>
            </View>
            <FlatList
                data={groupTemp.users}
                renderItem={(user) => {
                    return (
                        <TouchableOpacity onPress={() => navigation.navigate("Chat", {friend: user.item})}
                                          style={{
                                              ...Styles.touchable,
                                              flexDirection: "row",
                                              alignItems: "center",
                                              margin: "3%",
                                              opacity: (!isBlocked(user.item)) ? 1 : 0.5
                                          }}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate("OtherUserProfile", {userSelected: user.item})}>
                                <Image
                                    source={{
                                        uri: (user.item.picture !== "") ? "data:image/jpeg;base64," + user.item.picture : "https://www.softzone.es/app/uploads-softzone.es/2018/04/guest.png?x=480&quality=40",
                                    }}
                                    style={{
                                        ...Styles.imageStyle,
                                        borderColor: (darkMode) ? "white" : "black",
                                        borderWidth: 1,
                                        width: getIconSize(110),
                                        height: getIconSize(110)
                                    }}
                                />
                                <Text style={{
                                    fontSize: getFontSize(20),
                                    color: (darkMode) ? "white" : "black",
                                    margin: "3%"
                                }}>{user.item.nick}</Text>
                            </TouchableOpacity>
                            {groupAdmin &&
                                <TouchableOpacity
                                    onPress={() => {
                                        addRemoveMember(user.item)
                                    }}>
                                    <Material name="account-off" size={getIconSize(80)}
                                              color={(darkMode) ? "white" : "black"}/>
                                </TouchableOpacity>
                            }
                        </TouchableOpacity>
                    );
                }}
            />

            <View>
                {groupAdmin &&
                    <TouchableOpacity
                        onPress={() => setModalAddMemberVisible(!modalAddMemberVisible)}
                        style={{
                            ...Styles.touchable,
                            flexDirection: "row",
                            alignItems: "center",
                            margin: "3%"
                        }}
                    >
                        <Material name="account-plus" size={getIconSize(80)} color={(darkMode) ? "white" : "black"}/>
                        <Text style={{
                            fontSize: getFontSize(20),
                            color: (darkMode) ? "white" : "black",
                            margin: "3%"
                        }}>Add member</Text>
                    </TouchableOpacity>
                }
                <TouchableOpacity
                    onPress={() => {
                        addRemoveMember(user)
                        navigation.navigate("Group List");
                    }}
                    style={{
                        ...Styles.touchable,
                        flexDirection: "row",
                        alignItems: "center",
                        margin: "3%"
                    }}
                >
                    <Material name="exit-run" size={getIconSize(80)} color="#ca2613"/>
                    <Text style={{
                        fontSize: getFontSize(20),
                        color: "#ca2613",
                        margin: "3%"
                    }}>Leave Group</Text>
                </TouchableOpacity>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalAddMemberVisible}
                onRequestClose={() => setModalAddMemberVisible(!modalAddMemberVisible)}
            >
                <View style={{...styles.modalContainer}}>
                    <View style={{...styles.modalContent, backgroundColor: (darkMode) ? "#242121" : "#F5F5F5"}}>
                        <View style={{flexDirection: "row", justifyContent: "space-between", margin: "5%"}}>
                            <Text style={{
                                fontSize: getFontSize(20),
                                color: (darkMode) ? "white" : "black",
                                marginHorizontal: "5%"
                            }}>Choose a user and press to add them</Text>
                            <TouchableOpacity onPress={() => setModalAddMemberVisible(!modalAddMemberVisible)}>
                                <Material name='close-box' size={getIconSize(100)}
                                          color={(darkMode) ? "white" : "black"}></Material>
                            </TouchableOpacity>
                        </View>
                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-around",
                            margin: "10%",
                            alignItems: "center"
                        }}>
                            <TextInput
                                placeholder='Search a friend by name'
                                placeholderTextColor={"#a3a3a3"}
                                style={{
                                    borderWidth: 2,
                                    borderColor: "#ca2613",
                                    borderRadius: 20,
                                    paddingHorizontal: "5%",
                                    width: "80%",
                                    fontSize: getFontSize(15),
                                    color: (darkMode) ? "white" : "black"
                                }}
                                onChangeText={(text) => {
                                    if (text === "")
                                        setFriendsByName(friendsList);
                                    else
                                        setFriendsByName(friendsList.filter((friend) => friend.nick.toLowerCase().includes(text)))
                                }}
                            ></TextInput>
                            <FontAwesome5Icon name="search" size={getIconSize(80)}
                                              color={(darkMode) ? "white" : "black"}/>
                        </View>
                        <FlatList
                            data={friendsByName}
                            renderItem={(friend) => {
                                return (
                                    <TouchableOpacity onPress={() => {
                                        addRemoveMember(friend.item);
                                        setModalAddMemberVisible(!modalAddMemberVisible);
                                    }}
                                                      style={{
                                                          ...Styles.touchable,
                                                          flexDirection: "row",
                                                          alignItems: "center",
                                                          margin: "3%"
                                                      }}>
                                        <Image
                                            source={{
                                                uri: (friend.item.picture !== "") ? "data:image/jpeg;base64," + friend.item.picture : "https://www.softzone.es/app/uploads-softzone.es/2018/04/guest.png?x=480&quality=40",
                                            }}
                                            style={{
                                                ...Styles.imageStyle,
                                                borderColor: (darkMode) ? "white" : "black",
                                                borderWidth: 1,
                                                width: getIconSize(110),
                                                height: getIconSize(110)
                                            }}
                                        />
                                        <Text style={{
                                            color: (darkMode) ? "white" : "black",
                                            marginLeft: "5%",
                                            marginRight: "13%"
                                        }}>{friend.item.nick}</Text>
                                    </TouchableOpacity>

                                )
                            }}
                            keyExtractor={(comp, index) => index + ""}
                        />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

export default GroupChatDetails

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        marginTop: "40%",
        borderColor: "#ca2613",
        borderWidth: 2
    },
    modalContent: {
        borderRadius: 10
    },
    closeModalText: {
        marginTop: 10,
        color: 'red',
    }
});