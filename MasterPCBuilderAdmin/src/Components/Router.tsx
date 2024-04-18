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
import {FaTools, FaUsers, FaHome, FaChartPie, FaUser, FaCog, FaSignOutAlt} from 'react-icons/fa';
import React from "react";
import User from "./User";
type Props = {}


const Router = (props: Props) => {
    const { isLoged, user } = useAppContext();
    console.log(isLoged);

    return (
        <BrowserRouter>
            <div style={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>
                {isLoged === true ? <Side /> : null}
                <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
                    {isLoged === true ? <NavLocal /> : null}
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        <Routes>
                            <Route path="/" element={<Login />} />
                            <Route path='/login' element={<Login />} />
                            <Route path='/home' element={<Protector isLoged={isLoged}><Home /></Protector>} />
                            <Route path='/users' element={<Protector isLoged={isLoged}><User /></Protector>} />

                        </Routes>
                    </div>
                </div>
            </div>
        </BrowserRouter>
    )
}
function NavLocal() {
    return (
        <div style={{ width: "100%" }}>
            <Navbar expand="lg" className="bg-body-tertiary">

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="#home">Home</Nav.Link>
                        <Nav.Link href="#link">Link</Nav.Link>
                        <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
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
                        <Nav.Link href="#dashboard" className="text-dark">
                            <FaChartPie/> Dashboard
                        </Nav.Link>

                    </Nav>
                    <Nav.Item className="mt-auto p-3 ">
                        <Nav.Link href="#settings" className="text-dark pb-2">
                            <FaCog/> Settings
                        </Nav.Link>
                        <Nav.Link href="#logout" className="text-danger">
                            <FaSignOutAlt/> Logout
                        </Nav.Link>
                    </Nav.Item>
                </Navbar>

            </div>
    )
}

export default Router
