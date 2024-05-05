import React, {useEffect, useRef, useState} from 'react'
import {Button, Col, Container, Row, Form} from "react-bootstrap";
import {useAppContext} from "../Context/AppContextProvider";
import {useQuery} from "@apollo/client";
import {GET_MESSAGES_BY_RECEIVER_AND_AUTHOR} from "../Querys/Querys";
import * as encoding from 'text-encoding';
import {useLocation} from "react-router-dom";
import {Client} from "@stomp/stompjs";
import {Globals} from "./Globals";
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
    const {token, darkMode} = useAppContext();
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
        <Col>
            <Container fluid>
                <Row className="m-4 mb-1">
                    <Col style={{
                        color: (darkMode) ? "white" : "black"
                    }}>
                        <h1>{userSelected.nick}</h1>
                    </Col>
                </Row>
                <Row className={"m-2"}>
                    <Col style={{
                        height: "70vh",
                        overflow: "auto",
                        margin: "1%"
                    }}>
                        <Container fluid>
                            {
                                msgs.map((msg: IMsgType, index) => {
                                    if (msg.content === undefined) {
                                        return;
                                    }
                                    if (msg.author === "admins") {
                                        return (
                                            <Row key={index}>
                                                <Col xs={12} style={{
                                                    color: "white",
                                                    width: "100%",
                                                    textAlign: "right"
                                                }}>
                                                        <p style={{color: "gray"}}>
                                                            {msg.date}
                                                        </p>
                                                </Col>
                                                <Col xs={12} style={{
                                                    color: "white",
                                                    display: "flex",
                                                    justifyContent: "flex-end"
                                                }}>
                                                        <p style={{
                                                            backgroundColor: "#ca2613",
                                                            padding: "0.5%",
                                                            width: "fit-content",
                                                            maxWidth: "80%",
                                                            borderRadius: "5px",
                                                            wordWrap: "break-word"
                                                        }}>
                                                            {msg.content}
                                                        </p>
                                                </Col>
                                            </Row>
                                        );
                                    } else {
                                        return (
                                            <Row key={index}>
                                                <Col xs={12} style={{
                                                    color: "white",
                                                    width: "100%",
                                                    textAlign: "left"
                                                }}>
                                                    <p style={{color: "gray"}}>
                                                        {msg.date}
                                                    </p>
                                                </Col>
                                                <Col xs={12} style={{
                                                    color: "white",
                                                    display: "flex",
                                                    justifyContent: "flex-start"
                                                }}>
                                                    <p style={{
                                                        backgroundColor: "#676767",
                                                        padding: "0.5%",
                                                        width: "fit-content",
                                                        borderRadius: "5px",
                                                        wordWrap: "break-word"
                                                    }}>
                                                        {msg.content}
                                                    </p>
                                                </Col>
                                            </Row>
                                        );
                                    }
                                })
                            }
                            <Row ref={endOfMessagesRef}/>
                        </Container>
                    </Col>
                </Row>
                <Row className={"m-4"}>
                    <Col xs={11} style={{
                        width: "95%"
                    }}>
                        <Form.Control
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            data-bs-theme={(darkMode) ? "dark" : "light"}
                        />
                    </Col>
                    <Col style={{
                        width: "5%",
                        textAlign: "center"
                    }}>
                        <Button
                            variant={(!darkMode) ? "light" : "dark"}
                            onClick={sendToUser}
                        >
                            <IoMdSend/>
                        </Button>
                    </Col>
                </Row>
            </Container>
        </Col>
    )
}
export default AdminChat;