import {BrowserRouter, Route, Routes, useNavigate} from 'react-router-dom'
import {useAppContext} from '../Context/AppContextProvider'
import Home from './Home'
import Login from './Login'
import '../Styles/Router.css'
import Protector from './Protector'
import Navbar from 'react-bootstrap/Navbar';
import logoLight from '../img/logo_light.png'
import logoDark from '../img/logo_dark.png'
import {FaUsers, FaChartPie, FaUser, FaSignOutAlt, FaAmazon} from 'react-icons/fa';
import React, {useState} from "react";
import Users from "./Users";
import Components from "./Components";
import Builds from "./Builds";
import {FaComputer, FaRegSun} from "react-icons/fa6";
import AdminChat from "./AdminChat";
import {Button, Col, Container, Offcanvas, Row} from "react-bootstrap";
import {IoMoonOutline} from "react-icons/io5";

type Props = {}


const Router = (props: Props) => {
    const {isLoged, user, darkMode, setDarkMode} = useAppContext();
    const token = localStorage.getItem('authToken');
    setDarkMode((localStorage.getItem('darkMode') === 'true'));

    return (
        <BrowserRouter>
            <Container fluid style={{
                backgroundColor: (darkMode) ? "#242121" : "white",
                width: "100vw",
                height: "100vh"
            }}>
                {isLoged && <CustomNavbar/>}
                <Row style={{
                    width: "100vw",
                    height: 'auto',
                    backgroundColor: (darkMode) ? "#242121" : "white",
                    overflow: "auto"
                }}>
                    <Routes>
                        <Route path="/" element={<Login/>}/>
                        <Route path='/login' element={<Login/>}/>
                        <Route path='/home' element={<Protector isLoged={isLoged}><Home/></Protector>}/>
                        <Route path='/users' element={<Protector isLoged={isLoged}><Users/></Protector>}/>
                        <Route path='/components' element={<Protector isLoged={isLoged}><Components/></Protector>}/>
                        <Route path='/builds' element={<Protector isLoged={isLoged}><Builds/></Protector>}/>
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
            <Navbar expand={false} className="bg-body-tertiary mb-3 px-3 " sticky="top"
                    data-bs-theme={(darkMode) ? "dark" : "light"}>
                <Navbar.Brand>MasterPCBuilder</Navbar.Brand>
                <Row>
                    <Col xs={"auto"}>
                        {
                            (!darkMode) ? <FaRegSun size={"2rem"} onClick={() => {
                                    localStorage.setItem('darkMode', JSON.stringify(!darkMode));
                                    setDarkMode(!darkMode);
                                }}/> :
                                <IoMoonOutline size={"2rem"} color={"white"} onClick={() => {
                                    localStorage.setItem('darkMode', JSON.stringify(!darkMode));
                                    setDarkMode(!darkMode);
                                }}/>
                        }
                    </Col>
                    <Col xs={"auto"}>
                        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${false}`}/>
                    </Col>
                </Row>
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
