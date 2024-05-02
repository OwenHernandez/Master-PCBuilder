import React, {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import logo from '../img/logo_transparent.png'
import axios from 'axios'
import {Globals} from '../Type/Globals';
import {useAppContext} from '../Context/AppContextProvider';
import {Form, Button, Container, Row, Col} from 'react-bootstrap';
import {UserType} from '../Type/User';

type Props = {}

const Login = (props: Props) => {
    const {setToken, setIsLoged, setUser, darkMode} = useAppContext();
    const [isWorking, setIsWorking] = useState<number>(0);
    const [errorMsg, setErrorMsg] = useState("");
    const [nick, setNick] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function login(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            if (nick === "" || password === "") {
                setErrorMsg("Nick or password is empty");
                return;
            }

            const response = await axios.post('http://localhost:8080/api/v1/login', {
                nick,
                password
            })
            const data = response.data;
            if (data !== undefined) {
                const responseUser = await axios.get('http://localhost:8080/api/v2/users?nick=' + nick, {headers: {'Authorization': "Bearer " + data}});
                const dataUser = responseUser.data;
                if (dataUser.role === "ROLE_ADMIN") {
                    setIsWorking(1);
                    setToken(data);
                    localStorage.setItem('authToken', data);
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
            setErrorMsg("Nick or password incorrect");
            setNick("");
            setPassword("");
        }

    }

    return (
        <Col style={{backgroundColor: (darkMode) ? "#242121" : "white"}}>
            <Container fluid style={{height: "100vh", display: "flex", justifyContent: "center"}}>
                <Row style={{
                    width: "20vw",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center"
                }}>
                    <Col style={{padding: "10%", borderWidth: "0.3rem", borderColor: "#ca2613"}} className="shadow-lg">
                        <h2 style={{color: (darkMode) ? "white" : "black",}}>Login</h2>
                        <Form onSubmit={login} data-bs-theme={(darkMode) ? "dark" : "light"}>
                            <Form.Group>
                                <Form.Control
                                    type="text"
                                    name="nick"
                                    placeholder="Insert your nick here"
                                    value={nick}
                                    style={{
                                        color: (darkMode) ? "white" : "black",
                                        marginTop: "10%",
                                        marginBottom: "10%",
                                        backgroundColor: (darkMode) ? "#121212" : "#f6f6f6",
                                        textAlign: "center",
                                        borderRadius: "0"
                                    }}
                                    onChange={(event) => setNick(event.target.value)}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    placeholder="Insert your password here"
                                    value={password}
                                    style={{
                                        color: (darkMode) ? "white" : "black",
                                        backgroundColor: (darkMode) ? "#121212" : "#f6f6f6",
                                        marginBottom: "10%",
                                        textAlign: "center",
                                        borderRadius: "0"
                                    }}
                                    onChange={(event) => setPassword(event.target.value)}
                                />
                            </Form.Group>
                            <Button type="submit"
                                    variant={"primary"}
                                    style={{
                                        borderRadius: "0"
                                    }}>
                                Login
                            </Button>
                            <p style={{color: "red", marginTop: "10%"}}>{errorMsg}</p>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </Col>
    )
}
export default Login;
