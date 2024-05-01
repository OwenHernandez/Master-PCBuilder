import {BrowserRouter, Link, Route, Routes} from 'react-router-dom'
import { useAppContext } from '../Context/AppContextProvider'
import Home from './Home'
import Login from './Login'
import '../Styles/Router.css'
import Protector from './Protector'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from '../img/logo_light.png'
import {FaTools, FaUsers, FaHome, FaChartPie, FaUser, FaCog, FaSignOutAlt, FaAmazon} from 'react-icons/fa';
import React from "react";
import User from "./User";
import Components from "./Components";
import {local} from "d3";
import Build from "./Build";
import {FaComputer} from "react-icons/fa6";
import Chats from "./Chats";
import AdminChat from "./AdminChat";
type Props = {}


const Router = (props: Props) => {
    const { isLoged, user } = useAppContext();
    const token = localStorage.getItem('authToken');

    return (
        <BrowserRouter>
            <div style={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>
                {isLoged ? <Side /> : null}
                <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        <Routes>
                            <Route path="/" element={<Login />} />
                            <Route path='/login' element={<Login />} />
                            <Route path='/home' element={<Protector isLoged={isLoged}><Home /></Protector>} />
                            <Route path='/users' element={<Protector isLoged={isLoged}><User /></Protector>} />
                            <Route path='/components' element={<Protector isLoged={isLoged}><Components /></Protector>} />
                            <Route path='/builds' element={<Protector isLoged={isLoged}><Build /></Protector>} />
                            <Route path='/chats' element={<Protector isLoged={isLoged}><Chats /></Protector>} />
                            <Route path='/chat' element={<Protector isLoged={isLoged}><AdminChat /></Protector>} />
                        </Routes>
                    </div>
                </div>
            </div>
        </BrowserRouter>
    )
}
function Side() {
    return (
            <div style={{ width: '250px', height: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Navbar bg="light" expand="lg" className="flex-column align-items-start py-2" style={{flex: 1}}>
                    <img src={logo} alt='logo' style={{maxWidth: "100%"}}/>
                    <Nav className="flex-column w-100">
                        <Nav.Link className="text-dark">
                            <Link to="/home"><FaChartPie/> Dashboard</Link>
                        </Nav.Link>
                        <Nav.Link className="text-dark">
                            <Link to="/users"><FaUser/> Users</Link>
                        </Nav.Link>
                        <Nav.Link className="text-dark">
                            <Link to="/components"><FaAmazon/> Components</Link>
                        </Nav.Link>
                        <Nav.Link className="text-dark">
                            <Link to="/builds"><FaComputer/> Builds</Link>
                        </Nav.Link>
                        <Nav.Link className="text-dark">
                            <Link to="/chats"><FaUsers/> Chats</Link>
                        </Nav.Link>
                    </Nav>
                    <Nav.Item className="mt-auto p-3 ">
                        <Nav.Link href="#logout" className="text-danger">
                            <FaSignOutAlt/> Logout
                        </Nav.Link>
                    </Nav.Item>
                </Navbar>

            </div>
    )
}

export default Router
