import {
    Dimensions,
    FlatList,
    Image,
    PixelRatio,
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity,
    View
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

type Props = NativeStackScreenProps<RootStackParamList, 'GroupChat'>;

const GroupChat = (props: Props) => {
    Object.assign(global, {
        TextEncoder: encoding.TextEncoder,
        TextDecoder: encoding.TextDecoder,
    });

    const {user, darkMode, token, setUser} = usePrimaryContext();
    const {navigation, route} = props;
    const groupSelected = route.params.group;
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;
    const [msgs, setMsgs] = useState([{}] as IMsgType[]);
    const msgsRef = useRef([{}] as IMsgType[]);
    const stompRef = useRef({} as Client);

    const [message, setMessage] = useState("");
    const flatListRef = useRef();

    useEffect(() => {
        connect();
    }, [user]);

    function sendMsg() {
        let stompClient = stompRef.current;
        let messageTo = {
            author: user.nick,
            topic: "groupChat" + groupSelected.id,
            content: message
        };

        stompClient.publish({destination: "/app/public/" + messageTo.topic, body: JSON.stringify(messageTo)});
        console.log("enviado mensaje al topic: " + messageTo.topic);

        //setMsgs( prevMsgs => [{msg: messageTo.content, author: messageTo.author, date: getFormattedDate()}, ...prevMsgs]);
        //setMsgs(msgs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
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

    function onPublicMessageReceived(datos: any) {
        console.log("datos: " + datos);
        //setRecibido(datos.body);
        let msg = JSON.parse(datos.body);
        console.log(msg);
        console.log("msgs: " + msgs.length);
        msgsRef.current.unshift({content: msg.content, author: msg.author, date: getFormattedDate()});
        msgsRef.current.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        setMsgs([...msgsRef.current]);
        //setMsgs( prevMsgs => [{content: msg.content, author: msg.author, date: getFormattedDate()}, ...prevMsgs]);
        //setMsgs(msgs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }

    function connect() {

        function getPublicMessages() {
            setMsgs([]);
            msgsRef.current = [];
            getTopicMsgs();
            setMsgs(msgs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        }
        async function getTopicMsgs() {
            let topicMsgs = await axios.get(
                Globals.IP_HTTP + "/api/v2/messages?topic=groupChat" + groupSelected.id,
                {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Authorization": "Bearer " + token
                    }
                }
            );

            topicMsgs.data.map((msg: any) => {
                let newMsg: IMsgType = {
                    author: msg.author,
                    receiver: msg.receiver,
                    topic: msg.topic,
                    content: msg.content,
                    date: msg.date
                }
                setMsgs((msgs) => [newMsg, ...msgs]);
                msgsRef.current.push(newMsg);
            });

        }

        getPublicMessages();

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
            stompClient.subscribe('/topic/groupChat' + groupSelected.id, onPublicMessageReceived);
        }

        stompRef.current.activate();
    }

    function isBlocked(userSelected: string) {
        for (const blockedUser of user.blockedUsers) {
            if (blockedUser.nick === userSelected) {
                return true;
            }
        }
        return false;
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={Styles.headerView}>
                <TouchableOpacity onPress={() => navigation.navigate("GroupChatDetails", {groupSelected: groupSelected})}>
                    {
                        (groupSelected?.picture !== "") ?
                            <Image
                                source={{
                                    uri: "data:image/jpeg;base64," + groupSelected?.picture
                                }}
                                style={{
                                    ...Styles.imageStyle,
                                    borderColor: (darkMode) ? "white" : "black",
                                    borderWidth: 1,
                                    width: getIconSize(110),
                                    height: getIconSize(110)
                                }}
                            />
                            :
                            <Image
                                source={
                                    require("../../img/defaultChatPic.jpg")
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
                    fontSize: getFontSize(20),
                    maxWidth: "70%"
                }}>{groupSelected?.name}</Text>
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
                        if (msg.item?.content !== undefined) {
                            if (msg.item?.author === user.nick) {
                                return (
                                    <View>
                                        <View style={{flexDirection: "row", justifyContent: "flex-end"}}>
                                            <Text style={{color: "white"}}>You, </Text>
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
                            } else if (msg.item?.author !== user.nick) {
                                return (
                                    <View>
                                        <View style={{flexDirection: "row", justifyContent: "flex-start"}}>
                                            <Text style={{color: "white", marginLeft: "2%"}}>{msg.item.author}, </Text>
                                            <Text style={{fontSize: getFontSize(15), color: "#a3a3a3", fontStyle: "italic"}}>{msg.item.date}</Text>
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
                    placeholder='Say something to your friends'
                    defaultValue={message}
                    placeholderTextColor="#a3a3a3"
                    style={{
                        borderWidth: 2,
                        borderColor: "#ca2613",
                        
                        paddingHorizontal: "5%",
                        width: "80%",
                        fontSize: getFontSize(15),
                        color: (darkMode) ? "white" : "black"
                    }}
                    onChangeText={(text) => setMessage(text)}
                ></TextInput>
                <TouchableOpacity onPress={sendMsg}>
                    <Material name="send" size={getIconSize(80)} color={(!darkMode) ? "black" : "white"}></Material>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default GroupChat