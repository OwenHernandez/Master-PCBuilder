import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    PixelRatio,
    Dimensions,
    Image,
    TextInput,
    FlatList
} from 'react-native'
import React, {useEffect, useRef, useState} from 'react'
import * as encoding from 'text-encoding';
import {Styles} from '../themes/Styles'
import {usePrimaryContext} from '../contexts/PrimaryContext'
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigations/StackNavigator';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import {IMsgType} from '../interfaces/IMsgType';
import {Client} from "@stomp/stompjs";
import axios from "axios";
import {Globals} from "../components/Globals";
import RNFetchBlob from "rn-fetch-blob";

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

const Chat = (props: Props) => {
    Object.assign(global, {
        TextEncoder: encoding.TextEncoder,
        TextDecoder: encoding.TextDecoder,
    });

    const {user, darkMode, token, setUser} = usePrimaryContext();
    const {navigation, route} = props;
    const userSelected = route.params.friend;
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;
    const [msgs, setMsgs] = useState([{}] as IMsgType[]);
    const stompRef = useRef({} as Client);

    const [message, setMessage] = useState("");
    const flatListRef = useRef();
    const [blockedUser, setBlockedUser] = useState(false);
    const msgsRef = useRef([{}] as IMsgType[]);

    useEffect(() => {
        connect();
        isBlocked();
    }, [user]);

    function sendPrivate() {
        let stompClient = stompRef.current;
        let messageTo = {
            author: user.nick,
            receiver: userSelected.nick,
            content: message,
            date: getFormattedDate()
        };
        stompClient.publish({destination: "/app/private", body: JSON.stringify(messageTo)});
        console.log("enviado privado");
        msgsRef.current.unshift({content: messageTo.content, author: messageTo.author, receiver: messageTo.receiver, date: messageTo.date});

        setMsgs( [...msgsRef.current]);
        setMessage("");
        // @ts-ignore
        flatListRef.current.scrollToOffset({ animated: true });
    }

    function getFormattedDate() {
        const date = new Date();

        // Usar toLocaleString() para obtener la fecha formateada según la zona horaria
        const dateString = date.toLocaleString('en-GB', {
            timeZone: 'Europe/London',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false // Usar formato de 24 horas
        }).replace(/,/g, '');

        // Desglosar la fecha en componentes para reordenarlos
        const parts = dateString.split('/');
        const timePart = parts[2].split(' ')[1];

        // Reordenar los componentes para ajustar al formato deseado
        const year = parts[2].split(' ')[0];
        const month = parts[1];
        const day = parts[0];

        // Reconstruir la fecha en el formato aaaa-mm-dd hh:mm:ss
        return `${year}-${month}-${day} ${timePart}`;
    }
/*
    function onPublicMessageReceived(datos: any) {
        console.log("datos: " + datos);
        //setRecibido(datos.body);
        let nuevoMensaje = JSON.parse(datos.body);
        console.log(nuevoMensaje);
        let arr = msgs;
        arr.push({content: nuevoMensaje.content, author: nuevoMensaje.author, receiver: nuevoMensaje.receiver, date: nuevoMensaje.date});
        setMsgs([...arr]);
    }
*/
    function onPrivateMessageReceived(datos: any) {
        console.log("datos: " + datos);
        //setRecibido(datos.body);
        let nuevoMensaje = JSON.parse(datos.body);
        console.log(nuevoMensaje);
        msgsRef.current.unshift({content: nuevoMensaje.content, author: nuevoMensaje.author, receiver: nuevoMensaje.receiver, date: nuevoMensaje.date});
        setMsgs([...msgsRef.current]);
    }

    function connect() {

        function getPrivateMessages() {
            msgsRef.current = [];
            setMsgs([]);
            getMsgs();


        }
        async function getMsgs() {
            let userAuthor = await axios.get(
                Globals.IP_HTTP + "/api/v2/messages?receiver=" + userSelected.nick + "&author=" + user.nick,
                {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Authorization": "Bearer " + token
                    }
                }
            );

            userAuthor.data.map((msg: any) => {
                let newMsg: IMsgType = {
                    author: msg.author,
                    receiver: msg.receiver,
                    content: msg.content,
                    date: msg.date
                }
                msgsRef.current.push(newMsg);
            });

            let userReceiver = await axios.get(
                Globals.IP_HTTP + "/api/v2/messages?receiver=" + user.nick + "&author=" + userSelected.nick,
                {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Authorization": "Bearer " + token
                    }
                }
            );
            userReceiver.data.map((msg: any) => {
                let newMsg: IMsgType = {
                    author: msg.author,
                    receiver: msg.receiver,
                    content: msg.content,
                    date: msg.date
                }
                msgsRef.current.push(newMsg);
            });

            msgsRef.current.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            setMsgs([...msgsRef.current]);
        }

        getPrivateMessages();

        stompRef.current = new Client({
            brokerURL: Globals.IP_WEBSOCKET + '/websocket',
            connectHeaders: {
                "Authorization": 'Bearer ' + token,
            },
            debug: function (str) {
                console.log(str);
            },

            onConnect: connectOK,
            onWebSocketError: (error) => console.log(error),
            onStompError: (frame) => {
                console.log('Additional details: ' + frame.body);
            },
            forceBinaryWSFrames: true,
            appendMissingNULLonIncoming: true,
        });

        function connectOK() {
            console.log("entra en conectarOK");
            let stompClient = stompRef.current;
            //stompClient.subscribe('/topic/general', onPublicMessageReceived);
            stompClient.subscribe('/users/queue/messages', onPrivateMessageReceived);
        }

        stompRef.current.activate();
    }

    function isBlocked() {
        for (const blockedUser of user.blockedUsers) {
            if (blockedUser.id === userSelected.id) {
                setBlockedUser(true);
                return;
            }
        }
        setBlockedUser(false);
    }

    async function addRemoveBlock() {
        try {
            const response = await axios.put(Globals.IP_HTTP + "/api/v2/users/block/" + user.id + "/" + userSelected.id, null, {headers: {"Authorization": "Bearer " + token}});

            let newUser = {
                ...user,
                friends: response.data.friends,
                blockedUsers: response.data.blockedUsers
            }
            for (const friend of newUser.friends) {
                const friendPicResponse = await RNFetchBlob.fetch(
                    'GET',
                    Globals.IP_HTTP + '/api/v2/users/img/' + friend.id + '/' + friend.picture,
                    {Authorization: `Bearer ${token}`}
                );
                let picture = ""
                if (friendPicResponse.data !== Globals.IMG_NOT_FOUND) {
                    picture = friendPicResponse.base64();
                }
                friend.picture = picture;
            }
            isBlocked();
            setUser(newUser);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={Styles.headerView}>
                <TouchableOpacity onPress={() => navigation.navigate("OtherUserProfile", {userSelected})}>
                    {
                        (userSelected?.picture !== "") ?
                            <Image
                                source={{
                                    uri: "data:image/jpeg;base64," + userSelected?.picture,
                                    width: getIconSize(100),
                                    height: getIconSize(100)
                                }}
                                style={{...Styles.imageStyle, borderColor: (darkMode) ? "white" : "black", borderWidth: 1}}
                            />
                            :
                            <Image
                                source={
                                    require("../../img/defaultProfilePic.png")
                                }
                                style={{
                                    ...Styles.imageStyle,
                                    borderColor: (darkMode) ? "white" : "black",
                                    borderWidth: 1,
                                    width: getIconSize(110),
                                    height: getIconSize(110)
                                }}
                            />
                    }
                </TouchableOpacity>
                <Text style={{
                    ...Styles.headerText,
                    color: (darkMode) ? "white" : "black",
                    fontSize: getFontSize(20)
                }}>{userSelected?.nick}</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Material name='keyboard-backspace' size={getIconSize(100)}
                              color={(darkMode) ? "white" : "black"}></Material>
                </TouchableOpacity>
            </View>
            <View style={{flex: 1, marginVertical: "2%"}}>
                { (!blockedUser) ?
                <FlatList
                    inverted={true}
                    ref={flatListRef}
                    data={msgs}
                    renderItem={(msg) => {
                        if (msg.item?.author === user.nick) {
                            return (
                                <View>
                                    <View style={{flexDirection: "row", justifyContent: "flex-end"}}>
                                        <Text style={{fontSize: getFontSize(15), color: "#a3a3a3", fontStyle: "italic", marginRight: "2%"}}>{msg.item.date}</Text>
                                    </View>
                                    <View style={{flexDirection: "row", justifyContent: "flex-end"}}>
                                        <View style={{
                                            backgroundColor: "#ca2613",
                                            //
                                            padding: "1%",
                                            paddingHorizontal: "3%",
                                            margin: "2%",
                                            marginRight: "3%",
                                            maxWidth: "90%"
                                        }}>
                                            <Text style={{fontSize: getFontSize(15), color: "white"}}>{msg.item.content}</Text>
                                        </View>
                                    </View>
                                </View>
                            );
                        } else if (msg.item?.author === userSelected.nick) {
                            return (
                                <View>
                                    <View style={{flexDirection: "row", justifyContent: "flex-start"}}>
                                        <Text style={{fontSize: getFontSize(15), color: "#a3a3a3", fontStyle: "italic", marginLeft: "2%"}}>{msg.item.date}</Text>
                                    </View>
                                    <View style={{flexDirection: "row", justifyContent: "flex-start"}}>
                                        <View style={{
                                            backgroundColor: "#676767",
                                            //
                                            padding: "1%",
                                            paddingHorizontal: "3%",
                                            margin: "2%",
                                            marginLeft: "3%",
                                            maxWidth: "90%"
                                        }}>
                                            <Text style={{fontSize: getFontSize(15), color: "white"}}>{msg.item.content}</Text>
                                        </View>
                                    </View>
                                </View>
                            );
                        }

                    }}
                />
                    :
                    <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                        <Text style={{fontSize: getFontSize(20), color: (!darkMode) ? "black" : "white"}}>You have blocked this user</Text>
                        <TouchableOpacity onPress={addRemoveBlock}>
                            <Text style={{fontSize: getFontSize(20), color: "#ca2613", textDecorationLine: "underline"}}>Unblock them?</Text>
                        </TouchableOpacity>
                    </View>
                }
            </View>
            <View style={{
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                marginBottom: "3%"
            }}>
                <TextInput
                    placeholder='Say something to your friend'
                    defaultValue={message}
                    placeholderTextColor="#a3a3a3"
                    style={{
                        borderWidth: 2,
                        borderColor: "#ca2613",
                        //
                        paddingHorizontal: "5%",
                        width: "80%",
                        fontSize: getFontSize(15),
                        color: (darkMode) ? "white" : "black"
                    }}
                    onChangeText={(text) => setMessage(text)}
                ></TextInput>
                <TouchableOpacity onPress={sendPrivate}>
                    <Material name="send" size={getIconSize(80)} color={(!darkMode) ? "black" : "white"}></Material>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default Chat