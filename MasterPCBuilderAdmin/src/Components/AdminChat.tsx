import React, {useEffect, useRef, useState} from 'react'
import {Button, Col, Row} from "react-bootstrap";
import {useAppContext} from "../Context/AppContextProvider";
import {useQuery} from "@apollo/client";
import {GET_MESSAGES_BY_RECEIVER_AND_AUTHOR} from "../Querys/Querys";
import * as encoding from 'text-encoding';
import {useLocation, useParams} from "react-router-dom";
import {Client} from "@stomp/stompjs";
import {Globals} from "../Type/Globals";
import axios from "axios";
import {FaUsers} from "react-icons/fa";
import {FaArrowRight} from "react-icons/fa6";
import {IoMdSend} from "react-icons/io";

type Props = {}

export interface IMsgType {
    author: string;
    receiver: string | undefined;
    content: string;
    date: string;
}

export interface IUserType {
    id: number;
    nick: string;
    email: string;
    picture: string;
    role: string;
    active: boolean;
    deleted: boolean;
    friends: IUserType[];
    blockedUsers: IUserType[];
    componentsWanted: any[];
}

const AdminChat = (props: Props) => {
    const {token} = useAppContext();
    const location = useLocation();
    const {userSelected} = location.state;
    const {
        loading: loadingAdminAuthorMsgs,
        error: errorAdminAuthorMsgs,
        data: dataAdminAuthorMsgs,
        refetch: refetchAdminAuthorMsgs
    } = useQuery(GET_MESSAGES_BY_RECEIVER_AND_AUTHOR,
        {
            variables: {receiver: userSelected.nick, author: "admins"},
            onCompleted: () => {
                msgsRef.current.push(...dataAdminAuthorMsgs.byReceiverAndAuthor);
                // @ts-ignore
                msgsRef.current = [...new Set(msgsRef.current)];
                setMsgs([...msgsRef.current.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())]);
            }
        }
    );

    const {
        loading: loadingAdminReceiverMsgs,
        error: errorAdminReceiverMsgs,
        data: dataAdminReceiverMsgs,
        refetch: refetchAdminReceiverMsgs
    } = useQuery(GET_MESSAGES_BY_RECEIVER_AND_AUTHOR,
        {
            variables: {receiver: "admins", author: userSelected.nick},
            onCompleted: () => {
                msgsRef.current.push(...dataAdminReceiverMsgs.byReceiverAndAuthor);
                // @ts-ignore
                msgsRef.current = [...new Set(msgsRef.current)];
                setMsgs([...msgsRef.current.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())]);
            }
        }
    );

    Object.assign(global, {
        TextEncoder: encoding.TextEncoder,
        TextDecoder: encoding.TextDecoder,
    });

    const [msgs, setMsgs] = useState([{}] as IMsgType[]);
    const stompRef = useRef({} as Client);
    const [message, setMessage] = useState("");
    const [blockedUser, setBlockedUser] = useState(false);
    const msgsRef = useRef([{}] as IMsgType[]);
    const endOfMessagesRef = useRef(null);

    useEffect(() => {
        msgsRef.current = [];
        setMsgs([]);
        connect();
        refetchAdminAuthorMsgs();
        refetchAdminReceiverMsgs();
    }, [refetchAdminAuthorMsgs, refetchAdminReceiverMsgs]);

    useEffect(() => {
        if (endOfMessagesRef.current) {
            // @ts-ignore
            endOfMessagesRef.current.scrollIntoView({behavior: "smooth"});
        }
    }, [msgs]);

    function sendToUser() {
        let stompClient = stompRef.current;
        let messageTo = {
            author: "admins",
            receiver: userSelected.nick,
            content: message,
            date: getFormattedDate()
        };
        stompClient.publish({destination: "/app/admin/message/" + userSelected.nick, body: JSON.stringify(messageTo)});
        console.log("enviado privado");
        msgsRef.current.push({
            content: messageTo.content,
            author: messageTo.author,
            receiver: messageTo.receiver,
            date: messageTo.date
        });

        setMsgs([...msgsRef.current]);
        setMessage("");
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
        let nuevoMensaje = JSON.parse(datos.body);
        console.log(nuevoMensaje);
        msgsRef.current.push({
            content: nuevoMensaje.content,
            author: nuevoMensaje.author,
            receiver: nuevoMensaje.receiver,
            date: nuevoMensaje.date
        });
        setMsgs([...msgsRef.current]);
    }

    function connect() {

        async function getReceiver() {
            try {
                await dataAdminReceiverMsgs?.byReceiverAndAuthor.map((msg: IMsgType) => {
                    msgsRef.current.push(msg);
                });
            } catch (error) {
                console.log("Error while trying to get the messages: ", error);
            }
        }

        async function getAuthor() {
            try {
                await dataAdminAuthorMsgs?.byReceiverAndAuthor.map((msg: IMsgType) => {
                    msgsRef.current.push(msg);
                });
            } catch (error) {
                console.log("Error while trying to get the messages: ", error);
            }
        }

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
            stompClient.subscribe('/topic/admins', onAdminMessageReceived);
        }

        stompRef.current.activate();
    }

    return (
        <div style={{width: "100rem", height: "10rem"}}>
            <Row style={{margin: "4%", marginBottom: "2%"}}>
                <h1>{userSelected.nick}</h1>
            </Row>
            <Row style={{margin: "2%"}}>
                <Col style={{
                    width: "100%",
                    height: "70vh",
                    overflow: "auto",
                    margin: "1%"
                }}>
                    {
                        msgs.map((msg: IMsgType, index) => {
                            if (msg.content === undefined) {
                                return;
                            }
                            return (
                                <div>
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: (msg.author !== "admins") ? "flex-start" : "flex-end"
                                    }}>
                                        <div style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: (msg.author !== "admins") ? "flex-start" : "flex-end"
                                        }}>
                                            <div style={{color: "gray", margin: "5px"}}>
                                                {msg.date}
                                            </div>
                                            <div style={{
                                                backgroundColor: (msg.author === "admins") ? "#ca2613" : "#676767",
                                                color: "white",
                                                width: "fit-content",
                                                padding: "0.5rem",
                                                margin: "0.5rem"
                                            }}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    }
                    <div ref={endOfMessagesRef}/>
                </Col>
                <div>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        style={{width: "95%", height: "3rem", borderWidth: "0.3rem", borderColor: "#ca2613", fontSize: "1.2rem", padding: "1%"}}
                    />
                    <button
                        style={{width: "5%", height: "3rem", backgroundColor: "white", borderWidth: 0}}
                        onClick={sendToUser}
                    >
                        <IoMdSend/>
                    </button>
                </div>
            </Row>
        </div>
    )
}
export default AdminChat;