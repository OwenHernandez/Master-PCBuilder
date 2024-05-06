import { View, Text, SafeAreaView, TouchableOpacity, PixelRatio, Dimensions, Image, TextInput, Alert, FlatList } from 'react-native'
import React, {useEffect, useRef, useState} from 'react'
import { Styles } from '../themes/Styles'
import { usePrimaryContext } from '../contexts/PrimaryContext'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/StackNavigator';
import Octicon from 'react-native-vector-icons/Octicons';
import { DrawerActions } from '@react-navigation/native';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import { IMsgType } from '../interfaces/IMsgType';
import IAdminType from "../interfaces/IAdminType";
import axios from "axios";
import {Globals} from "../components/Globals";
import {Client} from "@stomp/stompjs";

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

const AdminChat = (props: Props) => {
    const { user, darkMode, token } = usePrimaryContext();
    const { navigation, route } = props;
    const admin: IAdminType = {
        nick: "admins"
    }
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;
    const [adminMsgs, setAdminMsgs] = useState([{}] as IMsgType[]);
    const stompRef = useRef({} as Client);

    const [message, setMessage] = useState("");
    const flatListRef = useRef();

    useEffect(() => {
        connect();
    }, [user]);

    function sendPrivate() {
        let stompClient = stompRef.current;
        let messageTo = {
            author: user.nick,
            receiver: admin.nick,
            content: message
        };
        stompClient.publish({destination: "/app/private", body: JSON.stringify(messageTo)});
        console.log("enviado privado");

        setAdminMsgs( prevMsgs => [{content: messageTo.content, author: messageTo.author, receiver: messageTo.receiver, date: getFormattedDate()}, ...prevMsgs]);
        setMessage("");
        // @ts-ignore
        flatListRef.current.scrollToOffset({ animated: true });
    }

    function getFormattedDate() {
        const date = new Date();

        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // +1 porque los meses empiezan en 0
        const day = date.getDate().toString().padStart(2, '0');

        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    function onPublicMessageReceived(datos: any) {
        console.log("data: " + datos);
        //setRecibido(datos.body);
        let nuevoMensaje = JSON.parse(datos.body);
        console.log(nuevoMensaje);
        let arr = adminMsgs;
        arr.push({content: nuevoMensaje.content, author: nuevoMensaje.author, receiver: nuevoMensaje.receiver, date: nuevoMensaje.date});
        setAdminMsgs([...arr]);
    }

    function onPrivateMessageReceived(datos: any) {
        console.log("data: " + datos);
        //setRecibido(datos.body);
        let nuevoMensaje = JSON.parse(datos.body);
        console.log(nuevoMensaje);
        let arr = adminMsgs;
        arr.push({content: nuevoMensaje.content, author: nuevoMensaje.author, receiver: nuevoMensaje.receiver, date: nuevoMensaje.date});
        setAdminMsgs([...arr]);
    }


    function connect() {

        function getPrivateMessages() {
            setAdminMsgs([]);
            getUserAuthorMsgs();
            getUserReceiverMsgs();
            setAdminMsgs(adminMsgs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
        }
        async function getUserAuthorMsgs() {
            let userAuthor = await axios.get(
                Globals.IP_HTTP + "/api/v2/messages?receiver=" + admin.nick + "&author=" + user.nick,
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
                setAdminMsgs((msgs) => [newMsg, ...msgs]);
            });

        }

        async function getUserReceiverMsgs() {
            let userReceiver = await axios.get(
                Globals.IP_HTTP + "/api/v2/messages?receiver=" + user.nick + "&author=" + admin.nick,
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
                setAdminMsgs((msgs) => [newMsg, ...msgs]);
            });
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
            stompClient.subscribe('/users/queue/replies-' + user.nick, onPrivateMessageReceived);
        }

        stompRef.current.activate();
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{...Styles.headerView}}>
                <Text style={{ ...Styles.headerText, color: (darkMode) ? "white" : "black", fontSize: getFontSize(20) }}>Support</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Material name='keyboard-backspace' size={getIconSize(100)} color={(darkMode) ? "white" : "black"}></Material>
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1, marginVertical: "2%" }}>
                <FlatList
                    inverted={true}
                    ref={flatListRef}
                    data={adminMsgs}
                    renderItem={(msg) => {
                        if (msg.item?.author === user.nick) {
                            return (
                                <View>
                                    <View style={{flexDirection: "row", justifyContent: "flex-end"}}>
                                        <Text style={{fontSize: getFontSize(15), color: "#a3a3a3", fontStyle: "italic"}}>{msg.item.date}</Text>
                                    </View>
                                    <View style={{flexDirection: "row", justifyContent: "flex-end"}}>
                                        <View style={{
                                            backgroundColor: "#ca2613",
                                            borderRadius: 20,
                                            padding: "1%",
                                            paddingHorizontal: "3%",
                                            margin: "2%",
                                            maxWidth: "90%"
                                        }}>
                                            <Text style={{fontSize: getFontSize(15), color: "white"}}>{msg.item.content}</Text>
                                        </View>
                                    </View>
                                </View>
                            );
                        } else if (msg.item?.author === admin.nick) {
                            return (
                                <View>
                                    <View style={{flexDirection: "row", justifyContent: "flex-end"}}>
                                        <Text style={{fontSize: getFontSize(15), color: "#a3a3a3", fontStyle: "italic"}}>{msg.item.date}</Text>
                                    </View>
                                    <View style={{flexDirection: "row", justifyContent: "flex-end"}}>
                                        <View style={{
                                            backgroundColor: "#ca2613",
                                            borderRadius: 20,
                                            padding: "1%",
                                            paddingHorizontal: "3%",
                                            margin: "2%",
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
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center", marginBottom: "3%" }}>
                <TextInput placeholder='Ask a question to an Admin' placeholderTextColor={"#a3a3a3"} style={{ borderWidth: 2, borderColor: "#ca2613", borderRadius: 20, paddingHorizontal: "5%", width: "80%", fontSize: getFontSize(15), color: (darkMode) ? "white" : "black" }}></TextInput>
                <TouchableOpacity onPress={() => Alert.alert("enviaria el mensaje")}>
                    <Material name="send" size={getIconSize(80)} color={(!darkMode) ? "black" : "white"}></Material>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default AdminChat