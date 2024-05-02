import {BrowserRouter, Link, Route, Routes, useNavigate} from 'react-router-dom'
import {useAppContext} from '../Context/AppContextProvider'
import Home from './Home'
import Login from './Login'
import '../Styles/Router.css'
import Protector from './Protector'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logoLight from '../img/logo_light.png'
import logoDark from '../img/logo_dark.png'
import {FaTools, FaUsers, FaHome, FaChartPie, FaUser, FaCog, FaSignOutAlt, FaAmazon} from 'react-icons/fa';
import React, {Dispatch, SetStateAction, useState} from "react";
import User from "./User";
import Components from "./Components";
import {local} from "d3";
import Build from "./Build";
import {FaComputer, FaRegSun} from "react-icons/fa6";
import Chats from "./Chats";
import AdminChat from "./AdminChat";
import {Button, Col, Container, Offcanvas, Row} from "react-bootstrap";
import {IoMoonOutline} from "react-icons/io5";

type Props = {}


const Router = (props: Props) => {
    const {isLoged, user, darkMode, setDarkMode} = useAppContext();
    const token = localStorage.getItem('authToken');

    return (
        <BrowserRouter>
            <Container fluid style={{
                backgroundColor: (darkMode) ? "#242121" : "white"
            }}>
                {isLoged && <CustomNavbar/>}
                <Row style={{
                    width: "100vw",
                    height: '92.7vh',
                    backgroundColor: (darkMode) ? "#242121" : "white"
                }}>
                    <Routes>
                        <Route path="/" element={<Login/>}/>
                        <Route path='/login' element={<Login/>}/>
                        <Route path='/home' element={<Protector isLoged={isLoged}><Home/></Protector>}/>
                        <Route path='/users' element={<Protector isLoged={isLoged}><User/></Protector>}/>
                        <Route path='/components' element={<Protector isLoged={isLoged}><Components/></Protector>}/>
                        <Route path='/builds' element={<Protector isLoged={isLoged}><Build/></Protector>}/>
                        <Route path='/chats' element={<Protector isLoged={isLoged}><Chats/></Protector>}/>
                        <Route path='/chat' element={<Protector isLoged={isLoged}><AdminChat/></Protector>}/>
                    </Routes>
                </Row>
            </Container>
        </BrowserRouter>
    )
}

function CustomNavbar() {
    const {darkMode, setDarkMode} = useAppContext();
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    return (
        <Row>
            <Navbar expand={false} className="bg-body-tertiary mb-3" sticky="top"
                    data-bs-theme={(darkMode) ? "dark" : "light"}>
                <Container fluid>
                    <Row style={{width: "100vw"}}>
                        <Col xs={10}>
                            <Navbar.Brand>MasterPCBuilder</Navbar.Brand>
                        </Col>
                        <Col md={1} style={{textAlign: "center", paddingTop: "0.1%"}}>
                            {
                                (!darkMode) ? <FaRegSun size={"2rem"} onClick={() => {
                                        setDarkMode(!darkMode);
                                    }}/> :
                                    <IoMoonOutline size={"2rem"} color={"white"} onClick={() => {
                                        setDarkMode(!darkMode);
                                    }}/>
                            }
                        </Col>
                        <Col md={1} style={{textAlign: "center"}}>
                            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${false}`}/>
                        </Col>
                        <Navbar.Offcanvas
                            id={`offcanvasNavbar-expand-${false}`}
                            aria-labelledby={`offcanvasNavbarLabel-expand-${false}`}
                            placement="start"
                            data-bs-theme={(darkMode) ? "dark" : "light"}
                        >
                            <Offcanvas.Header closeButton>
                                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${false}`}>
                                    Menu
                                </Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body>
                                <CustomNav/>
                            </Offcanvas.Body>
                        </Navbar.Offcanvas>
                    </Row>
                </Container>
            </Navbar>
        </Row>
    )
}

function CustomNav() {
    const {darkMode, setIsLoged} = useAppContext();
    const navigate = useNavigate();
    return (
        <Container fluid>
            <Row>
                <Col>
                    <img src={(darkMode) ? logoDark : logoLight} alt='logo' style={{maxWidth: "100%"}}/>
                </Col>
            </Row>
            <Row>
                <Col xs={6} className={"mb-3 mt-3"}>
                    <Button variant={(!darkMode) ? "light" : "dark"} style={{
                        width: "100%",
                        textAlign: "center",
                        color: (darkMode) ? "white" : "black"
                    }} onClick={() => navigate("/home")}>
                        <FaChartPie/> Dashboard
                    </Button>
                </Col>
                <Col xs={6} className={"mb-3 mt-3"}>
                    <Button variant={(!darkMode) ? "light" : "dark"} style={{
                        width: "100%",
                        textAlign: "center",
                        color: (darkMode) ? "white" : "black"
                    }} onClick={() => navigate("/users")}>
                        <FaUser/> Users
                    </Button>
                </Col>
                <Col xs={6} className={"mb-3"}>
                    <Button variant={(!darkMode) ? "light" : "dark"} style={{
                        width: "100%",
                        textAlign: "center",
                        color: (darkMode) ? "white" : "black"
                    }} onClick={() => navigate("/components")}>
                        <FaAmazon/> Components
                    </Button>
                </Col>
                <Col xs={6} className={"mb-3"}>
                    <Button variant={(!darkMode) ? "light" : "dark"} style={{
                        width: "100%",
                        textAlign: "center",
                        color: (darkMode) ? "white" : "black"
                    }} onClick={() => navigate("/builds")}>
                        <FaComputer/> Builds
                    </Button>
                </Col>
                <Col xs={6} className={"mb-3"}>
                    <Button variant={(!darkMode) ? "light" : "dark"} style={{
                        width: "100%",
                        textAlign: "center",
                        color: (darkMode) ? "white" : "black"
                    }} onClick={() => navigate("/chats")}>
                        <FaUsers/> Chats
                    </Button>
                </Col>
                <Col xs={12}>
                    <Button variant={"outline-danger"} onClick={() => {
                        localStorage.removeItem('authToken');
                        setIsLoged(false);
                        navigate("/login");
                    }} style={{
                        width: "100%",
                        textAlign: "center"
                    }}>
                        <FaSignOutAlt/> Logout
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}

export default Router
