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
    const msgsRef = useRef([{}] as IMsgType[]);

    useEffect(() => {
        connect();
    }, [user]);

    function sendToAdmin() {
        let stompClient = stompRef.current;
        let messageTo = {
            author: user.nick,
            receiver: admin.nick,
            content: message,
            date: getFormattedDate()
        };
        stompClient.publish({destination: "/app/message/admins", body: JSON.stringify(messageTo)});
        console.log("enviado privado");

        msgsRef.current.unshift({content: messageTo.content, author: messageTo.author, receiver: messageTo.receiver, date: messageTo.date});

        setAdminMsgs( [...msgsRef.current]);
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

    function onAdminMessageReceived(datos: any) {
        console.log("datos: " + datos);
        //setRecibido(datos.body);
        let nuevoMensaje = JSON.parse(datos.body);
        console.log(nuevoMensaje);
        msgsRef.current.unshift({content: nuevoMensaje.content, author: nuevoMensaje.author, receiver: nuevoMensaje.receiver, date: nuevoMensaje.date});
        setAdminMsgs([...msgsRef.current]);
    }


    function connect() {

        function getAdminMessages() {
            msgsRef.current = [];
            setAdminMsgs([]);
            getMsgs();
        }

        async function getMsgs() {
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
                msgsRef.current.push(newMsg);
            });

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
                msgsRef.current.push(newMsg);
            });

            msgsRef.current.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            setAdminMsgs([...msgsRef.current]);
        }

        getAdminMessages();

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
            stompClient.subscribe('/topic/admins/' + user.nick, onAdminMessageReceived);
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
                        } else if (msg.item?.author === admin.nick) {
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
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center", marginBottom: "3%" }}>
                <TextInput
                    placeholder='Ask something to an admin'
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
                <TouchableOpacity onPress={sendToAdmin}>
                    <Material name="send" size={getIconSize(80)} color={(!darkMode) ? "black" : "white"}></Material>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default AdminChat