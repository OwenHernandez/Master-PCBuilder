import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../img/logo_transparent.png'
import axios from 'axios'
import { Globals } from '../Type/Globals';
import { useAppContext } from '../Context/AppContextProvider';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { UserType } from '../Type/User';
type Props = {}

const Login = (props: Props) => {
    const { setToken, setIsLoged, setUser } = useAppContext();
    const [isWorking, setIsWorking] = useState<number>(0);
    const [nickname, setNickname] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function login(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        console.log("NICKNAME" + nickname);
        console.log("PASSWORD:" + password);
        try {
            console.log(Globals.IP_HTTP + '/api/v1/login');
            const response = await axios.post('http://localhost:8080/api/v1/login', {
                nick: nickname,
                password: password
            })
            const data = response.data;
            if (data !== undefined) {
                const responseUser = await axios.get('http://localhost:8080/api/v2/users?nick=' + nickname, { headers: { 'Authorization': "Bearer " + data } });
                const dataUser = responseUser.data;
                if (dataUser.role === "ROLE_ADMIN" && dataUser.active === true) {
                    setIsWorking(1);
                    setToken(data);
                    setIsLoged(true);
                    let newUser: UserType = {
                        id: dataUser.id,
                        nick: dataUser.nick,
                        email: dataUser.email,
                        picture: dataUser.picture,
                        role: dataUser.role,
                        active: dataUser.active,
                        hash: dataUser.hash,
                        password: dataUser.password,
                    }
                    setUser(newUser);
                    navigate('/home');
                } else {
                    console.log("No es admin");
                }
            }
        } catch (error) {
            console.log(error);
        }

    }
    return (
        <div style={{width:"100vw",height:"100vh",display:"flex", justifyContent:"center" }}>
            <Row style={{ width: "20vw",alignItems:"center",  }} className="">
                <Col style={{backgroundColor:"#f5f5f5", padding:"5%"}} className="rounded shadow-lg">
                    <h2>Login</h2>
                    <Form onSubmit={login}>
                        <Form.Group>
                            <Form.Label>Nombre de usuario</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                placeholder="Ingresa tu nombre de usuario"
                                value={nickname}
                                onChange={(event) => setNickname(event.target.value)}
                            />
                        </Form.Group>
                        <Form.Group >
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="login-button mt-2">
                            Login
                        </Button>
                    </Form>
                </Col>
            </Row>
        </div>
    )
}
export default Login;
