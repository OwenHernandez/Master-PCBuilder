import React, {useEffect, useState} from 'react'
import {Button, Row} from "react-bootstrap";
import {useAppContext} from "../Context/AppContextProvider";
import {useQuery} from "@apollo/client";
import {GET_USERS} from "../Querys/Querys";
import {useParams} from "react-router-dom";

type Props = {}

const AdminChat = (props: Props) => {
    const {token} = useAppContext();
    const {userNick} = useParams();

    return (
        <div style={{width: "90vw", height: "100vh"}}>
            <Row style={{margin: "4%", marginBottom: "2%"}}>
                <h1>Users</h1>
            </Row>
            <Row style={{margin: "5%", marginTop: "3%"}}>
                {userNick}
            </Row>
        </div>
    )
}
export default AdminChat;