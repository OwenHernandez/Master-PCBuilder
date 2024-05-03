import React, {useEffect, useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../img/logo_transparent.png'
import axios from 'axios'
import { Globals } from '../Type/Globals';
import { useAppContext } from '../Context/AppContextProvider';
import {Form, Button, Container, Row, Col, Accordion, Modal, Image} from 'react-bootstrap';
import { UserType } from '../Type/User';
import NavDropdown from "react-bootstrap/NavDropdown";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import {useMutation, useQuery} from "@apollo/client";
import {IBuild} from "./Home";
import {
    DELETE_COMPONENT,
    GET_BUILDS,
    GET_COMPONENTS,
    GET_SELLERS,
    SAVE_COMPONENT,
    UPDATE_COMPONENT
} from "../Querys/Querys";
import IComponentInput from "../Type/ComponentInput";
import ImgViewer from "./ImgViewer";
type Props = {}
export interface IComponentType {
    id: number;
    name: string;
    price: number;
    amazon_price: number;
    ebay_price: number;
    type: string;
    picture: string;
    description: string;
    sellerId: number;
    deleted: number;
}
export interface ISellerType {
    id: number;
    name: string;
    image: string;

}
const Components=(props: Props) => {
    const {token, darkMode} = useAppContext();
    const { loading, error, data:dataComponents } = useQuery(GET_COMPONENTS);
    const { loading:loadingSeller, error:errorSeller, data:dataSeller } = useQuery(GET_SELLERS);
    const [saveComponentG] = useMutation(SAVE_COMPONENT);
    const [updateComponentG] = useMutation(UPDATE_COMPONENT);
    const [deleteComponentG] = useMutation(DELETE_COMPONENT);
    const [components, setComponents] = useState([])
    const [sellers, setSellers] = useState<Array<ISellerType>>([])
    const [componentSelected, setComponentSelected] = useState<IComponentType>()
    const [showAdd, setShowAdd] = useState(false)
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [locura, setLocura] = useState(false)
    const [nombrefichero, setNombrefichero] = useState("")
    const [photoBase64, setphotoBase64] = useState("")
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [sellerId, setSellerId] = useState(0)
    const [sellerName, setSellerName] = useState("");
    const [amazon_price, setAmazon_price] = useState(0)
    const [ebay_price, setEbay_price] = useState(0)
    const [name, setName] = useState("")
    const [type, setType] = useState("")

    useEffect(() => {
        async function getComponents() {
            setComponents(dataComponents?.components || []);
            setSellers(dataSeller?.sellers || []);
        }
        getComponents()
    }, [locura || dataComponents || dataSeller || loadingSeller || loading || errorSeller || error]);

    function handleShowEdit() {
        setShowEdit(!showEdit)
    }

    function handleShowDelete() {
        setShowDelete(!showDelete);
    }

    function handleShowAdd() {
        setShowAdd(!showAdd);
    }

    async function updateComponent(event:React.FormEvent<HTMLFormElement>){
        event.preventDefault();
        const cleanBase64 = photoBase64.replace(/^data:image\/png;base64,/, "");
        try {
            const updateComponent: IComponentInput = {
                description: description,
                image: nombrefichero,
                image64: cleanBase64,
                type: type,
                price: parseInt(price),
                amazon_price: componentSelected?.amazon_price!,
                ebay_price: componentSelected?.ebay_price!,
                name: componentSelected?.name!,
                sellerName: sellerName
            };
            const update = await updateComponentG({variables: {id: componentSelected?.id, component: updateComponent}});
            setLocura(!locura);
        } catch (error) {
            console.log(error);
        }
        handleShowEdit()
    }

    async function addComponent(event:React.FormEvent<HTMLFormElement>){
        event.preventDefault();
        const cleanBase64 = photoBase64.replace(/^data:image\/png;base64,/, "");

        const newComponent={
            description: description,
            image: nombrefichero,
            image64: cleanBase64,
            name: name,
            type: type,
            price: price,
            amazon_price: amazon_price,
            ebay_price: ebay_price,
            sellerName: sellerName
        }
        try{
            const response = await saveComponentG({variables: {component: newComponent}});
            console.log(response);
        }catch (error){
            console.log(error)
        }
        setLocura(!locura);
        handleShowAdd();
    }

    async function deleteUser(){
        try{
            const response = await deleteComponentG({variables: {id: componentSelected?.id}});
            setLocura(!locura);
        }catch (error){
            console.log(error)
        }
        handleShowDelete()
    }

    if (loading || loadingSeller ) {
        return <div>Loading data...</div>;
    }

    if ( !components || !sellers ){
        return <div>Data is not fully loaded yet.</div>;
    }

    return (
        <Col>
            <Container fluid>
                <Row className="m-4 mb-2">
                    <h1 style={{color: (darkMode) ? "white" : "black"}}>Users</h1>
                </Row>
                <Row className="m-5 mt-3">
                    <Accordion data-bs-theme={(darkMode) ? "dark" : "light"}>
                        {
                            components.map((comp: any, index: number) => {
                                return (
                                    <Accordion.Item eventKey={"" + index} style={{
                                        color: (comp.deleted) && "gray"
                                    }}>
                                        <Accordion.Header>
                                            <Col style={{
                                                color: (comp.deleted) && "gray"
                                            }}>
                                                {comp.nick}
                                            </Col>
                                            <Col style={{
                                                color: (comp.deleted) && "gray"
                                            }}>
                                                {(comp.deleted) && "Deleted"}
                                            </Col>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <Container fluid>
                                                <Row>
                                                    <Col xs={6}>
                                                        <h3>{comp.nick}</h3>
                                                        <p>{comp.email}</p>
                                                        <p>{comp.role}</p>
                                                        <p>{(comp.deleted) && "Deleted"}</p>
                                                    </Col>
                                                    <Col xs={3}>
                                                        <ImgViewer filename={comp.picture}/>
                                                    </Col>
                                                    <Col xs={3}>
                                                        <Container fluid>
                                                            <Row>
                                                                <Col>
                                                                    <Button style={{width: "10vw"}} variant="danger"
                                                                            onClick={() => {
                                                                                setComponentSelected(comp);
                                                                                handleShowDelete()
                                                                            }} disabled={comp.deleted}>
                                                                        Delete
                                                                    </Button>
                                                                </Col>
                                                                <Col>
                                                                    <Button style={{width: "10vw", marginTop: "3%"}}
                                                                            variant="info" onClick={() => {
                                                                        setComponentSelected(comp);
                                                                        handleShowEdit();
                                                                    }}>
                                                                        Edit
                                                                    </Button>
                                                                </Col>
                                                            </Row>
                                                        </Container>
                                                    </Col>
                                                </Row>
                                            </Container>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                )
                            })
                        }
                    </Accordion>
                </Row>
                <Row>
                    <Col>
                        <Button style={{width: "10vw", marginLeft: "6%"}} variant={"success"} onClick={handleShowAdd}>
                            Add User
                        </Button>
                    </Col>
                </Row>

                <Modal show={showEdit} onHide={handleShowEdit} data-bs-theme={(darkMode) ? "dark" : "light"}>
                    <Modal.Header closeButton>
                        <Modal.Title
                            style={{color: (darkMode) ? "white" : "black"}}>Edit {componentSelected?.name}</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={updateComponent}>
                        <Modal.Body>
                            <Form.Group className={"mb-4"}>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    placeholder="Insert a new password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className={"mb-4"}>
                                <Form.Select
                                    defaultValue={userSelected !== undefined ? userSelected.role : "ROLE_ADMIN"}
                                    aria-label="Rol" value={rol} onChange={(event) => {
                                    setRol(event.target.value)
                                }}>
                                    <option>Choose Role</option>
                                    <option value="ROLE_ADMIN">Admin</option>
                                    <option value="ROLE_USER">User</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group>
                                <Form.Control type="file" onChange={(event) => {
                                    const inputElement = event.target as HTMLInputElement;
                                    if (inputElement.files && inputElement.files.length > 0) {
                                        const file = inputElement.files[0];
                                        const fileReader = new FileReader();
                                        fileReader.readAsDataURL(file);
                                        fileReader.onload = () => {
                                            setNombrefichero(file.name);
                                            setphotoBase64(fileReader.result as string);
                                        };
                                    }
                                }}/>
                            </Form.Group>
                            {
                                (photoBase64 !== "") &&
                                <Container fluid>
                                    <Row>
                                        <Col>
                                            <Image src={photoBase64} thumbnail fluid className={"mt-4"}/>
                                        </Col>
                                    </Row>
                                </Container>
                            }
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="outline-secondary" onClick={handleShowEdit}>
                                Close
                            </Button>
                            <Button variant="info" type="submit">
                                Update User
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
                <Modal show={showDelete} onHide={handleShowDelete} data-bs-theme={(darkMode) ? "dark" : "light"}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{color: (darkMode) ? "white" : "black"}}>Are you sure?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{color: (darkMode) ? "white" : "black"}}>Are you sure you want to
                        delete {componentSelected?.name} ?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-secondary" onClick={handleShowDelete}>
                            Close
                        </Button>
                        <Button variant="danger" onClick={deleteUser}>
                            Delete Component
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={showAdd} onHide={handleShowAdd} data-bs-theme={(darkMode) ? "dark" : "light"}>
                    <Form onSubmit={addComponent}>

                        <Modal.Header closeButton>
                            <Modal.Title style={{color: (darkMode) ? "white" : "black"}}>Add a User</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Group className={"mb-4"}>
                                <Form.Control
                                    type="text"
                                    name="nickname"
                                    placeholder="Insert the nickname"
                                    value={nickname}
                                    onChange={(event) => setNickname(event.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className={"mb-4"}>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    placeholder="Insert the password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className={"mb-4"}>
                                <Form.Control
                                    type="text"
                                    name="email"
                                    placeholder="Insert the email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className={"mb-4"}>
                                <Form.Select aria-label="Rol" value={rol} onChange={(event) => {
                                    setRol(event.target.value)
                                }} style={{borderRadius: "0"}}>
                                    <option>Choose Role</option>
                                    <option value="ADMIN">Admin</option>
                                    <option value="USER">User</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group>
                                <Form.Control type="file" onChange={(event) => {
                                    const inputElement = event.target as HTMLInputElement;
                                    if (inputElement.files && inputElement.files.length > 0) {
                                        const file = inputElement.files[0];
                                        const fileReader = new FileReader();
                                        fileReader.readAsDataURL(file);
                                        fileReader.onload = () => {
                                            setNombrefichero(file.name);
                                            setphotoBase64(fileReader.result as string);
                                        };
                                    }
                                }} style={{borderRadius: "0"}}/>
                            </Form.Group>
                            {
                                (photoBase64 !== "") &&
                                <Container fluid>
                                    <Row>
                                        <Col>
                                            <Image src={photoBase64} thumbnail fluid className={"mt-4"}/>
                                        </Col>
                                    </Row>
                                </Container>
                            }
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="outline-secondary" onClick={handleShowAdd} style={{borderRadius: "0"}}>
                                Close
                            </Button>
                            <Button variant="success" type="submit" style={{borderRadius: "0"}}>
                                Add Component
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </Container>
        </Col>
    )

    /*
    return (
        <div style={{width: "90vw", height: "100vh"}}>
            <Row style={{margin: "4%", marginBottom: "2%"}}>
                <h1>Components</h1>
            </Row>
            <Row style={{margin: "5%", marginTop: "3%"}}>
                <Accordion>
                    {
                        components.map((component: any, index: number) => {
                            return (
                                component.deleted===1 ? <></> :
                                <>
                                    {
                                        !component.deleted ? <Accordion.Item eventKey={"" + index}>
                                            <Accordion.Header>{component.name}</Accordion.Header>
                                            <Accordion.Body>
                                                <Row>
                                                    <Col xs={6}>
                                                        <h3>{component.description}</h3>
                                                        <h4>Type: {component.type}</h4>
                                                        {
                                                            sellers.map((seller: any, index: number) => {
                                                                return(
                                                                    <>
                                                                        {
                                                                            seller.name === component.sellerName ? <h4>Seller: {seller.name}</h4> : <></>
                                                                        }
                                                                    </>

                                                                )
                                                            })
                                                        }
                                                        <Navbar>
                                                            <Navbar.Collapse id="navbar-dark-example">
                                                                <Nav>
                                                                    <NavDropdown
                                                                        id="nav-dropdown-dark-example"
                                                                        title="Prices"
                                                                    >
                                                                        <NavDropdown.Item className="disabled">
                                                                            Price: {component.price}€
                                                                        </NavDropdown.Item>
                                                                        <NavDropdown.Item className="disabled">
                                                                            Amazon Price: {component.amazon_price}€
                                                                        </NavDropdown.Item>
                                                                        <NavDropdown.Item className="disabled">
                                                                            Ebay Price: {component.ebay_price}€
                                                                        </NavDropdown.Item>

                                                                    </NavDropdown>
                                                                </Nav>
                                                            </Navbar.Collapse>
                                                        </Navbar>
                                                        {
                                                            sellers.map((seller, index  ) => {

                                                                return(
                                                                    <>
                                                                        {
                                                                            seller.id === component.sellerId ? <h4>Seller: {seller.name}</h4> : <></>
                                                                        }
                                                                    </>

                                                                )
                                                            })
                                                        }
                                                    </Col>
                                                    <Col xs={3}>
                                                        <img src={component.picture} alt={component.nick}
                                                             style={{width: "100%"}}/>
                                                    </Col>
                                                    <Col xs={3}>
                                                        <Button style={{width: "10vw"}} className="btn-danger"
                                                                onClick={() => {
                                                                    setComponentSelected(component);
                                                                    handleShowDelete();
                                                                }}>
                                                            Delete
                                                        </Button>
                                                        <Button style={{width: "10vw", marginTop: "3%"}}
                                                                className="btn-warning" onClick={() => {
                                                            setComponentSelected(component);
                                                            handleShowEdit();
                                                        }}>
                                                            Edit
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </Accordion.Body>
                                        </Accordion.Item> : <></>
                                    }

                                </>
                            )
                        })
                    }
                </Accordion>
            </Row>
            <Row>
                <Button style={{width: "10vw", marginLeft: "6%"}} className="btn-secondary" onClick={handleShowAdd}>
                    Add Component
                </Button>
            </Row>

            <Modal show={showEdit} onHide={handleShowEdit}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit {componentSelected?.name}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={updateComponent}>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                name="description"
                                placeholder="Put the components description"
                                value={description}
                                onChange={(event) => setDescription(event.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                name="price"
                                placeholder="Put the components price"
                                value={price}
                                onChange={(event) => setPrice(event.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Type</Form.Label>
                            <Form.Control
                                type="text"
                                name="price"
                                placeholder="Put the components type"
                                value={type}
                                onChange={(event) => setType(event.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Components Picture</Form.Label>
                            <Form.Control type="file" onChange={(event) => {
                                const inputElement = event.target as HTMLInputElement;
                                if (inputElement.files && inputElement.files.length > 0) {
                                    const file = inputElement.files[0];
                                    const fileReader = new FileReader();
                                    fileReader.readAsDataURL(file);
                                    fileReader.onload = () => {
                                        setNombrefichero(file.name);
                                        setphotoBase64(fileReader.result as string);
                                    };
                                }
                            }}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Select aria-label="Seller" value={sellerName} onChange={(event) => {
                                setSellerName(event.target.value)
                            }}>
                                <option>Choose a Seller</option>
                                {
                                    sellers.map((seller: any, index: number) => {
                                        return (
                                            <option value={seller.name}>{seller.name}</option>
                                        )
                                    })
                                }
                            </Form.Select>
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleShowEdit}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit">
                            Update Component
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
            <Modal show={showDelete} onHide={handleShowDelete}>
                <Modal.Header closeButton>
                    <Modal.Title>Are you sure?</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete {componentSelected?.name} ?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleShowDelete}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={deleteUser}>
                        Delete Component
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showAdd} onHide={handleShowAdd}>
                <Form onSubmit={addUser}>

                    <Modal.Header closeButton>
                        <Modal.Title>Add a Component</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="description"
                                placeholder="Put the components description"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                name="description"
                                placeholder="Put the components description"
                                value={description}
                                onChange={(event) => setDescription(event.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                name="price"
                                placeholder="Put the components price"
                                value={price}
                                onChange={(event) => setPrice(event.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Amazon Price</Form.Label>
                            <Form.Control
                                type="number"
                                name="price"
                                placeholder="Put the components amazon price"
                                value={amazon_price}
                                onChange={(event) => setAmazon_price(parseInt(event.target.value))}
                            />
                        </Form.Group>                        <Form.Group>
                        <Form.Label>Ebay Price</Form.Label>
                        <Form.Control
                            type="number"
                            name="price"
                            placeholder="Put the components price"
                            value={ebay_price}
                            onChange={(event) => setEbay_price(parseInt(event.target.value))}
                        />
                    </Form.Group>
                        <Form.Group>
                            <Form.Label>Type</Form.Label>
                            <Form.Control
                                type="text"
                                name="price"
                                placeholder="Put the components type"
                                value={type}
                                onChange={(event) => setType(event.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Components Picture</Form.Label>
                            <Form.Control type="file" onChange={(event) => {
                                const inputElement = event.target as HTMLInputElement;
                                if (inputElement.files && inputElement.files.length > 0) {
                                    const file = inputElement.files[0];
                                    const fileReader = new FileReader();
                                    fileReader.readAsDataURL(file);
                                    fileReader.onload = () => {
                                        setNombrefichero(file.name);
                                        setphotoBase64(fileReader.result as string);
                                    };
                                }
                            }}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Select aria-label="Seller" value={sellerName} onChange={(event) => {
                                setSellerName(event.target.value)
                            }}>
                                {
                                    sellers.map((seller: any, index: number) => {
                                        return (
                                            <option value={seller.name}>{seller.name}</option>
                                        )
                                    })
                                }
                            </Form.Select>
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleShowEdit}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit">
                            Update Component
                        </Button>
                    </Modal.Footer>
                </Form>

            </Modal>

        </div>
    )
    */
}
export default Components;
