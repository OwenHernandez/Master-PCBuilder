import React, {useEffect, useState} from 'react'
import {Button, Row} from "react-bootstrap";
import {useAppContext} from "../Context/AppContextProvider";
import {useQuery} from "@apollo/client";
import {GET_FILE, GET_USERS} from "../Querys/Querys";
import {FaChartPie} from "react-icons/fa";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {Globals} from "../Type/Globals";
import ImgViewer from "./ImgViewer";

type Props = {}

const Chats = (props: Props) => {
    const {token} = useAppContext();
    const {loading, error, data: dataUsers, refetch} = useQuery(GET_USERS, {pollInterval: 5000});

    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            setUsers(dataUsers?.users);
        }

        fetchData();
    }, []);

    return (
        <div style={{width: "90vw", height: "100vh"}}>
            <Row style={{margin: "4%", marginBottom: "2%"}}>
                <h1>Chats</h1>
            </Row>
            <Row style={{margin: "5%", marginTop: "3%"}}>
                {
                    users.map((user: any, index: number) => {

                        return (
                            <button
                                className="button-style"
                                style={{width: "30%"}}
                                onClick={() => navigate("/chat/" + user.nick)}
                            >
                                <div
                                    className="text-style"
                                >
                                    <ImgViewer filename={user.picture} />
                                    {user.nick}
                                </div>
                            </button>
                        )
                    })
                }
            </Row>
        </div>
    )
}
export default Chats;