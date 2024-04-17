import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useAppContext } from '../Context/AppContextProvider'
import Home from './Home'
import Login from './Login'
import '../Styles/Router.css'
import Protector from './Protector'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Row } from 'react-bootstrap'
import logo from '../img/logo_transparent.png'
import axios from 'axios'
import { Globals } from '../Type/Globals'
import { useEffect, useState } from 'react'
import { log } from 'console'
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
                        </Routes>
                    </div>
                </div>
            </div>
        </BrowserRouter>
    )
}
function NavLocal() {
    const { user, token } = useAppContext();
    const [userImage, setUserImage] = useState('');

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await axios.get(`${Globals.IP_HTTP}/api/v2/users/img/${user.id}/${user.picture}`, {
                    headers: { "Authorization": "Bearer " + token }
                });
                console.log(`${Globals.IP_HTTP}/api/v2/users/img/${user.id}/${user.picture}` + ":" + "data:image/jpeg;base64, " + response.data);

                setUserImage("data:image/jpg;base64, " + response.data); // Asumiendo que response.data es la URL de la imagen
            } catch (error) {
                console.error('Error fetching user image:', error);
            }
        };

        fetchImage();
    }, [user.id, user.picture, token]); // Dependencias que, si cambian, deberían reactivar la petición

    return (
        <div style={{ width: "100%" }}>
            <Navbar expand="lg" className="bg-body-tertiary">
                <img src={logo} alt='logo' style={{ maxWidth: "3%", height: "3%" }} />
                <Navbar.Brand href="#home" style={{ marginRight: "2%" }}>MasterPCBuilder</Navbar.Brand>
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
                    <Nav className='ms-auto'>
                        <Nav.Item style={{ marginTop: "15%" }}>{user.nick}</Nav.Item>
                        <Nav.Item>
                            <img src={userImage} style={{ maxWidth: "66.95px", height: "66.95px" }} />
                        </Nav.Item>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
}
function Side() {
    return (
        <Sidebar style={{ width: '250px', height: "100vh" }}> {/* Ajuste de ancho para Sidebar */}
            <Menu>
                <SubMenu label="Charts">
                    <MenuItem> Pie charts </MenuItem>
                    <MenuItem> Line charts </MenuItem>
                </SubMenu>
                <MenuItem> Documentation </MenuItem>
                <MenuItem> Calendar </MenuItem>
            </Menu>
        </Sidebar>
    )
}

export default Router