import {
    Dimensions,
    FlatList,
    Image, ImageBackground, Modal,
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
import {Styles} from '../themes/Styles';
import Entypo from 'react-native-vector-icons/Entypo';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderScreen from "../components/HeaderScreen";
import axios from "axios";
import {Globals} from "../components/Globals";
import RNFetchBlob from "rn-fetch-blob";
import IUserType from "../interfaces/IUserType";
import IGroupChatType from "../interfaces/IGroupChatType";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import LinearGradient from "react-native-linear-gradient";
import {Menu, MenuOptions, MenuOption, MenuTrigger} from 'react-native-popup-menu';
import * as ImagePicker from "react-native-image-picker";
import {ImagePickerResponse} from "react-native-image-picker";

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
    const [modalEditGroupVisible, setModalEditGroupVisible] = useState(false);
    const [friendsList, setFriendsList] = useState([{}] as IUserType[]);
    const [friendsByName, setFriendsByName] = useState([{}] as IUserType[]);
    const [newName, setNewName] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newPicture, setNewPicture] = useState("");
    const [newPictureBase64, setNewPictureBase64] = useState("");

    useEffect(() => {
        setGroupTemp(groupSelected);
        setSize(groupSelected.users.length);
        setGroupAdmin(groupSelected.admin.id === user.id);
        setFriendsList(user.friends);
        setFriendsByName(user.friends);
    }, []);

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
            const response = await axios.put(
                Globals.IP_HTTP + "/api/v2/groups/" + groupSelected.id + "/users/" + userSelected.id,
                null,
                {headers: {Authorization: "Bearer " + token}}
            );
            setNewGroup(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    async function changeAdmin(userSelected: IUserType) {
        try {
            const response = await axios.put(
                Globals.IP_HTTP + "/api/v2/groups/" + groupSelected.id + "/admins/" + userSelected.id,
                null,
                {headers: {Authorization: "Bearer " + token}}
            );
            setNewGroup(response.data);
            navigation.navigate("Group List");
        } catch (error) {
            console.error(error);
        }
    }

    async function setNewGroup(newGroup: IGroupChatType) {
        try {
            let picture = "";
            const groupPicResponse = await RNFetchBlob.fetch(
                'GET',
                Globals.IP_HTTP + '/api/v2/groups/img/' + newGroup.id + '/' + newGroup.picture,
                {Authorization: `Bearer ${token}`}
            );
            if (groupPicResponse.data !== Globals.IMG_NOT_FOUND) {
                picture = groupPicResponse.base64();
            }
            newGroup.picture = picture;
            for (const member of newGroup.users) {
                const userPicResponse = await RNFetchBlob.fetch(
                    'GET',
                    Globals.IP_HTTP + '/api/v2/users/img/' + member.id + '/' + member.picture,
                    {Authorization: `Bearer ${token}`}
                );
                picture = ""
                if (userPicResponse.data !== Globals.IMG_NOT_FOUND) {
                    console.log("coso4");
                    picture = userPicResponse.base64();
                }
                member.picture = picture;
            }
            const adminPicResponse = await RNFetchBlob.fetch(
                'GET',
                Globals.IP_HTTP + '/api/v2/users/img/' + newGroup.admin.id + '/' + newGroup.admin.picture,
                {Authorization: `Bearer ${token}`}
            );
            picture = ""
            if (adminPicResponse.data !== Globals.IMG_NOT_FOUND) {
                picture = adminPicResponse.base64();
            }
            newGroup.admin.picture = picture;
            setGroupTemp(newGroup);
            setSize(groupSelected.users.length);
            setGroupAdmin(groupSelected.admin.id === user.id);
            setUser({...user});
        } catch (error) {
            console.error(error);
        }
    }

    function openGallery() {
        ImagePicker.launchImageLibrary({mediaType: 'photo'}, async (response: ImagePickerResponse) => {
            if (response.didCancel) {
                console.log('The user has cancelled the image picker');
            } else if (response.errorMessage) {
                console.log('Error while trying to open gallery:', response.errorMessage);
            } else {
                const imageFile = await RNFetchBlob.fs.readFile(response.assets[0].uri, 'base64');
                try {
                    setNewPicture(response.assets[0].fileName);
                    setNewPictureBase64(imageFile);
                } catch (error) {
                    console.log("Error while trying to change the picture: ", error);
                }

            }
        });
    }

    async function editGroup() {
        try {
            const response = await axios.put(
                Globals.IP_HTTP + "/api/v2/groups/" + groupSelected.id,
                {
                    name: newName,
                    description: newDescription,
                    picture: newPicture,
                    pictureBase64: newPictureBase64
                },
                {headers: {Authorization: "Bearer " + token}}
            );
            setNewGroup(response.data);
            setModalEditGroupVisible(!modalEditGroupVisible);
            setNewName("");
            setNewDescription("");
            setNewPicture("");
            setNewPictureBase64("");
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: (darkMode) ? "#242121" : "#F5F5F5"}}>
            <HeaderScreen name={groupTemp?.name + "'s Details"} navigation={navigation} profile={false}
                          drawer={false}/>
            <ScrollView style={{flex: 1}}>
                <View style={{flex: 1}}>
                    <View style={{alignItems: 'center', flex: 1}}>
                        <ImageBackground
                            source={{
                                uri: (groupTemp?.picture !== "") ? "data:image/jpeg;base64," + groupTemp?.picture : "https://www.tenniscall.com/images/chat.jpg"
                            }}
                            style={{...Styles.imageStyle, width: "100%", height: getIconSize(650)}}
                        >
                            <LinearGradient
                                colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)', '#3e423f', (darkMode) ? "#242121" : "#F5F5F5"]}
                                style={{flex: 1, justifyContent: "flex-end", alignItems: "center"}}>
                                <View style={{justifyContent: 'space-between'}}>
                                    <Text style={{
                                        fontSize: getFontSize(40),
                                        color: (darkMode) ? "white" : "black",
                                        textAlign: "center"
                                    }}>{groupTemp?.name}</Text>
                                    <Text style={{
                                        fontSize: getFontSize(20),
                                        color: (darkMode) ? "white" : "black",
                                        textAlign: "center"
                                    }}>{size} members</Text>
                                </View>
                            </LinearGradient>
                        </ImageBackground>
                    </View>
                    <View style={{margin: "5%", alignItems: "center"}}>
                        <Text style={{
                            fontSize: getFontSize(20),
                            color: (darkMode) ? "white" : "black"
                        }}>{groupTemp.description}{"\n"}</Text>
                        <Text style={{
                            fontSize: getFontSize(25),
                            color: (darkMode) ? "white" : "black"
                        }}>Admin</Text>
                        <TouchableOpacity
                            onPress={() => (groupTemp.admin?.id !== user.id) ? navigation.navigate("Chat", {friend: groupTemp.admin}) : navigation.navigate("Profile")}
                            style={{
                                ...Styles.touchable,
                                flexDirection: "row",
                                alignItems: "center",
                                margin: "3%"
                            }}>
                            {
                                (groupTemp.admin?.id !== user.id) ?
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate("OtherUserProfile", {userSelected: groupTemp.admin})}>
                                        <Image
                                            source={{
                                                uri: (groupTemp.admin?.picture !== "") ? "data:image/jpeg;base64," + groupTemp.admin?.picture : "https://www.softzone.es/app/uploads-softzone.es/2018/04/guest.png?x=480&quality=40",
                                            }}
                                            style={{
                                                ...Styles.imageStyle,
                                                borderColor: (darkMode) ? "white" : "black",
                                                borderWidth: 1,
                                                width: getIconSize(110),
                                                height: getIconSize(110)
                                            }}
                                        />
                                    </TouchableOpacity>
                                    :
                                    <View>
                                        <Image
                                            source={{
                                                uri: (groupTemp.admin?.picture !== "") ? "data:image/jpeg;base64," + groupTemp.admin?.picture : "https://www.softzone.es/app/uploads-softzone.es/2018/04/guest.png?x=480&quality=40",
                                            }}
                                            style={{
                                                ...Styles.imageStyle,
                                                borderColor: (darkMode) ? "white" : "black",
                                                borderWidth: 1,
                                                width: getIconSize(110),
                                                height: getIconSize(110)
                                            }}
                                        />
                                    </View>
                            }
                            <Text style={{
                                color: (darkMode) ? "white" : "black",
                                marginLeft: "5%"
                            }}>{groupTemp.admin?.nick}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={{
                    fontSize: getFontSize(25),
                    color: (darkMode) ? "white" : "black",
                    textAlign: "center"
                }}>Members</Text>
                {
                    groupTemp?.users?.map((member) => {
                        if (member.id !== groupTemp.admin.id) {
                            if (member.id === user.id) {
                                return (
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate("Profile")}
                                        style={{
                                            ...Styles.touchable,
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            height: getIconSize(200),
                                            margin: "3%",
                                            opacity: (!isBlocked(member)) ? 1 : 0.5
                                        }}>
                                        <View style={{flexDirection: "row", alignItems: "center"}}>
                                            <Image
                                                source={{
                                                    uri: (member?.picture !== "") ? "data:image/jpeg;base64," + member?.picture : "https://www.softzone.es/app/uploads-softzone.es/2018/04/guest.png?x=480&quality=40",
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
                                                marginLeft: "10%",
                                                marginRight: "13%"
                                            }}>{member?.nick}</Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            } else {
                                return (
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate("Chat", {friend: member})}
                                        style={{
                                            ...Styles.touchable,
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            height: getIconSize(200),
                                            margin: "3%",
                                            opacity: (!isBlocked(member)) ? 1 : 0.5
                                        }}>
                                        <View style={{flexDirection: "row", alignItems: "center"}}>
                                            <TouchableOpacity
                                                onPress={() => navigation.navigate("OtherUserProfile", {userSelected: member})}>
                                                <Image
                                                    source={{
                                                        uri: (member?.picture !== "") ? "data:image/jpeg;base64," + member?.picture : "https://www.softzone.es/app/uploads-softzone.es/2018/04/guest.png?x=480&quality=40",
                                                    }}
                                                    style={{
                                                        ...Styles.imageStyle,
                                                        borderColor: (darkMode) ? "white" : "black",
                                                        borderWidth: 1,
                                                        width: getIconSize(110),
                                                        height: getIconSize(110)
                                                    }}
                                                />
                                            </TouchableOpacity>
                                            <Text style={{
                                                color: (darkMode) ? "white" : "black",
                                                marginLeft: "10%",
                                                marginRight: "13%"
                                            }}>{member?.nick}</Text>
                                        </View>
                                        {groupAdmin &&
                                            <Menu>
                                                <MenuTrigger>
                                                    <Entypo name={"dots-three-vertical"} size={getIconSize(60)}
                                                            color={(darkMode) ? "white" : "black"}/>
                                                </MenuTrigger>
                                                <MenuOptions
                                                    optionsContainerStyle={{
                                                        backgroundColor: (darkMode) ? "#242121" : "#F5F5F5",
                                                        
                                                        width: getIconSize(500),
                                                        borderColor: "#ca2613",
                                                        borderWidth: 2,
                                                        padding: "2%"
                                                    }}
                                                >
                                                    <MenuOption
                                                        onSelect={() => addRemoveMember(member)}
                                                        text='Remove Member'
                                                        customStyles={{
                                                            optionText: {color: (darkMode) ? "white" : "black"}
                                                        }}
                                                    />
                                                    <MenuOption
                                                        onSelect={() => changeAdmin(member)}
                                                        text='Make Admin'
                                                        customStyles={{
                                                            optionText: {color: (darkMode) ? "white" : "black"}
                                                        }}
                                                    />
                                                    {/* Puedes agregar más opciones aquí */}
                                                </MenuOptions>
                                            </Menu>
                                        }
                                    </TouchableOpacity>
                                );
                            }
                        }
                    })
                }
                <View>
                    {groupAdmin &&
                        <View style={{flexDirection: "row", justifyContent: "space-around"}}>
                            <TouchableOpacity
                                onPress={() => setModalAddMemberVisible(!modalAddMemberVisible)}
                                style={{
                                    ...Styles.touchable,
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: getIconSize(200),
                                    width: "43%",
                                    margin: "3%"
                                }}
                            >
                                <Material name="account-plus" size={getIconSize(80)}
                                          color={(darkMode) ? "white" : "black"}/>
                                <Text style={{
                                    fontSize: getFontSize(15),
                                    color: (darkMode) ? "white" : "black",
                                    margin: "3%"
                                }}>Add member</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setModalEditGroupVisible(!modalEditGroupVisible)}
                                style={{
                                    ...Styles.touchable,
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: getIconSize(200),
                                    width: "43%",
                                    margin: "3%"
                                }}
                            >
                                <Material name="pencil" size={getIconSize(80)}
                                          color={(darkMode) ? "white" : "black"}/>
                                <Text style={{
                                    fontSize: getFontSize(15),
                                    color: (darkMode) ? "white" : "black",
                                    margin: "3%"
                                }}>Edit Group</Text>
                            </TouchableOpacity>
                        </View>
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
                            height: getIconSize(200),
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
            </ScrollView>
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
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalEditGroupVisible}
                onRequestClose={() => setModalEditGroupVisible(!modalEditGroupVisible)}
            >
                <View style={{...styles.modalContainer}}>
                    <View style={{...styles.modalContent, backgroundColor: (darkMode) ? "#242121" : "#F5F5F5"}}>
                        <View style={{flexDirection: "row", justifyContent: "space-between", margin: "5%"}}>
                            <Text style={{
                                fontSize: getFontSize(20),
                                color: (darkMode) ? "white" : "black",
                                marginHorizontal: "5%"
                            }}>Choose a user and press to add them</Text>
                            <TouchableOpacity onPress={() => setModalEditGroupVisible(!modalEditGroupVisible)}>
                                <Material name='close-box' size={getIconSize(100)}
                                          color={(darkMode) ? "white" : "black"}></Material>
                            </TouchableOpacity>
                        </View>
                        <View style={{
                            margin: "10%",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <TextInput
                                placeholder='Change the name of the group'
                                defaultValue={groupTemp.name}
                                placeholderTextColor={"#a3a3a3"}
                                style={{
                                    borderWidth: 2,
                                    borderColor: "#ca2613",
                                    
                                    paddingHorizontal: "5%",
                                    width: "80%",
                                    fontSize: getFontSize(15),
                                    color: (darkMode) ? "white" : "black",
                                    textAlign: "center",
                                    marginBottom: "5%"
                                }}
                                onChangeText={setNewName}
                            ></TextInput>
                            <TextInput
                                placeholder='Change the description of the group'
                                defaultValue={groupTemp.description}
                                multiline={true}
                                numberOfLines={3}
                                placeholderTextColor={"#a3a3a3"}
                                style={{
                                    borderWidth: 2,
                                    borderColor: "#ca2613",
                                    
                                    paddingHorizontal: "5%",
                                    width: "80%",
                                    fontSize: getFontSize(15),
                                    color: (darkMode) ? "white" : "black",
                                    textAlign: "center"
                                }}
                                onChangeText={setNewDescription}
                            ></TextInput>
                            <TouchableOpacity style={{...Styles.touchable}} onPress={openGallery}>
                                {
                                    (newPictureBase64 !== "") ?
                                        <Image
                                            source={{
                                                uri: "data:image/jpeg;base64," + newPictureBase64,
                                                width: getIconSize(300),
                                                height: getIconSize(300)
                                            }}
                                            style={{ ...Styles.imageStyle, borderColor: (darkMode) ? "white" : "black", borderWidth: 1, borderRadius: 10 }}
                                        />
                                        :
                                        (groupTemp.picture !== "") ?
                                            <Image
                                                source={{
                                                    uri: "data:image/jpeg;base64," + groupTemp.picture,
                                                    width: getIconSize(300),
                                                    height: getIconSize(300)
                                                }}
                                                style={{ ...Styles.imageStyle, borderColor: (darkMode) ? "white" : "black", borderWidth: 1, borderRadius: 10 }}
                                            />
                                            :
                                            <Text style={{
                                                fontSize: getFontSize(20),
                                                textAlign: 'center',
                                                color: (darkMode) ? "white" : "black"
                                            }}>Select a new picture for the group</Text>
                                }
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={editGroup}
                                style={{...Styles.touchable}}
                            >
                                <Text style={{
                                    fontSize: getFontSize(20),
                                    textAlign: 'center',
                                    color: (darkMode) ? "white" : "black"
                                }}>Save changes</Text>
                            </TouchableOpacity>
                        </View>
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
        marginTop: "50%",
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