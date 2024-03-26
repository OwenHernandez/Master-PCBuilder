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
import Animated from "react-native-reanimated";

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

const Chat = (props: Props) => {
    Object.assign(global, {
        TextEncoder: encoding.TextEncoder,
        TextDecoder: encoding.TextDecoder,
    });

    const {user, darkMode, token} = usePrimaryContext();
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

    useEffect(() => {
        connect();
    }, []);

    /*
    function enviar() {
        let stompClient = stompRef.current;
        let messageTo = {
            author: autor,
            receiver: "no hay receptor específico",
            content: mensaje
        };

        stompClient.publish({ destination: "/app/mensajegeneral", body: JSON.stringify(messageTo) });
        console.log("enviado público");
        /*
        let arr = historico;
        arr.push("le dices a  todos: "  + messageTo.content);
        setHistorico([...arr]);
    }
     */
    function sendPrivate() {
        let stompClient = stompRef.current;
        let messageTo = {
            author: user.nick,
            receiver: userSelected.nick,
            content: message
        };
        stompClient.publish({destination: "/app/private", body: JSON.stringify(messageTo)});
        console.log("enviado privado");

        setMsgs( prevMsgs => [{msg: messageTo.content, author: messageTo.author, receiver: messageTo.receiver, date: getFormattedDate()}, ...prevMsgs]);
        setMessage("");
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
        console.log("datos: " + datos);
        //setRecibido(datos.body);
        let nuevoMensaje = JSON.parse(datos.body);
        console.log(nuevoMensaje);
        let arr = msgs;
        arr.push({msg: nuevoMensaje.content, author: nuevoMensaje.author, receiver: nuevoMensaje.receiver, date: nuevoMensaje.date});
        setMsgs([...arr]);
    }

    function onPrivateMessageReceived(datos: any) {
        console.log("datos: " + datos);
        //setRecibido(datos.body);
        let nuevoMensaje = JSON.parse(datos.body);
        console.log(nuevoMensaje);
        let arr = msgs;
        arr.push({msg: nuevoMensaje.content, author: nuevoMensaje.author, receiver: nuevoMensaje.receiver, date: nuevoMensaje.date});
        setMsgs([...arr]);
    }


    function connect() {

        async function getPrivateMessages() {
            let response = await axios.get(
                Globals.IP_HTTP + "/api/v2/messages?receiver=" + userSelected.nick + "&author=" + user.nick,
                {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Authorization": "Bearer " + token
                    }
                }
            );
            setMsgs([]);
            response.data.map((msg: any) => {
                let newMsg: IMsgType = {
                    author: msg.author,
                    receiver: msg.receiver,
                    msg: msg.content,
                    date: msg.date
                }
                setMsgs((msgs) => [newMsg, ...msgs]);
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
        }

        stompRef.current.activate();
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={Styles.headerView}>
                <TouchableOpacity onPress={() => navigation.navigate("OtherUserProfile", {userSelected})}>
                    <Image
                        source={{
                            uri: (userSelected?.picture !== "") ? "data:image/jpeg;base64," + userSelected?.picture : "https://www.softzone.es/app/uploads-softzone.es/2018/04/guest.png?x=480&quality=40"
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
                <FlatList
                    inverted={true}
                    ref={flatListRef}
                    data={msgs}
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
                                            <Text style={{fontSize: getFontSize(15), color: "white"}}>{msg.item.msg}</Text>
                                        </View>
                                    </View>
                                </View>
                            );
                        } else if (msg.item?.author === userSelected.nick) {
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
                                            <Text style={{fontSize: getFontSize(15), color: "white"}}>{msg.item.msg}</Text>
                                        </View>
                                    </View>
                                </View>
                            );
                        }

                    }}
                />
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
                        borderRadius: 20,
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