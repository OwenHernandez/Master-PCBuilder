import React, {useEffect, useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../img/logo_transparent.png'
import axios from 'axios'
import { Globals } from '../Type/Globals';
import { useAppContext } from '../Context/AppContextProvider';
import {Form, Button, Container, Row, Col, Accordion, Modal} from 'react-bootstrap';
import { UserType } from '../Type/User';
import NavDropdown from "react-bootstrap/NavDropdown";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
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
}
const Components=(props: Props) => {
    const {token} = useAppContext();
    const [components, setComponents] = useState([])
    const [sellers, setSellers] = useState([])
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
            const response = await axios.get("http://localhost:8080/api/v2/components", { headers: { "Authorization": "Bearer " + token } });
            const responseSeller = await axios.get("http://localhost:8080/api/v3/sellers", { headers: { "Authorization": "Bearer " + token } });
            setComponents(response.data);
            setSellers(responseSeller.data)
        }
        getComponents()
    }, [locura]);
    function handleShowEdit() {
        setShowEdit(!showEdit)
    }
    function handleShowDelete() {
        setShowDelete(!showDelete);
    }
    function handleShowAdd() {
        setShowAdd(!showAdd);
    }
    async function updateUser(event:React.FormEvent<HTMLFormElement>){
        event.preventDefault();
        const cleanBase64 = photoBase64.replace(/^data:image\/png;base64,/, "");
        const response = await axios.put("http://localhost:8080/api/v3/components/"+componentSelected?.id, {
            description: description,
            image: nombrefichero,
            image64: cleanBase64,
            type: type,
            price: price,
            sellerId: sellerId
        },{headers: {"Authorization": "Bearer " + token}});
        setLocura(!locura);
        handleShowEdit()
    }
    async function addUser(event:React.FormEvent<HTMLFormElement>){
        event.preventDefault();
        const cleanBase64 = photoBase64.replace(/^data:image\/png;base64,/, "");

        console.log("PICTURE:"+nombrefichero)
        console.log("PICTURE:"+cleanBase64)

        const response = await axios.post("http://localhost:8080/api/v3/components", {
            description: description,
            image: nombrefichero,
            image64: cleanBase64,
            name: name,
            type: type,
            price: price,
            amazon_price: amazon_price,
            ebay_price: ebay_price,
            sellerName: sellerName
        },{headers: {"Authorization": "Bearer " + token}});
        setLocura(!locura);
        handleShowAdd();
    }
    async function deleteUser(){
        const response = await axios.delete("http://localhost:8080/api/v3/components/"+componentSelected?.id,{headers : {"Authorization": "Bearer " + token}});
        setLocura(!locura);
        handleShowDelete()
    }
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
                                                                            seller.id === component.sellerId ? <h4>Seller: {seller.name}</h4> : <></>
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
                                                            sellers.map((seller: any, index: number) => {
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
                <Form onSubmit={updateUser}>
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
                            <Form.Select aria-label="Seller" value={sellerId} onChange={(event) => {
                                setSellerId(parseInt(event.target.value))
                            }}>
                                {
                                    sellers.map((seller: any, index: number) => {
                                        return (
                                            <option value={seller.id}>{seller.name}</option>
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
}
export default Components;
