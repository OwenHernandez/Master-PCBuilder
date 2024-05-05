import React, {useEffect, useState} from 'react'
import {useAppContext} from '../Contexts/AppContextProvider';
import {Form, Button, Container, Row, Col, Accordion, Modal, Image, Dropdown} from 'react-bootstrap';
import {useMutation, useQuery} from "@apollo/client";
import {
    DELETE_COMPONENT,
    GET_COMPONENTS,
    GET_SELLERS,
    UPDATE_COMPONENT
} from "../Querys/Querys";
import IComponentInput from "../Types/ComponentInput";
import ImgViewer from "../Components/ImgViewer";

type Props = {}

export interface IComponentType {
    id: number;
    name: string;
    price: number;
    amazon_price: number;
    ebay_price: number;
    type: string;
    image: string;
    description: string;
    sellerName: string;
    deleted: boolean;
}

export interface ISellerType {
    id: number;
    name: string;
    image: string;
}

const Components = (props: Props) => {
    const {token, darkMode} = useAppContext();
    const {loading, error, data: dataComponents, refetch: refetchComponents} = useQuery(GET_COMPONENTS,{
        onCompleted: () => {
            setComponents(dataComponents.components);
        }
    });
    const {loading: loadingSeller, error: errorSeller, data: dataSeller, refetch: refetchSellers} = useQuery(GET_SELLERS, {
        onCompleted: () => {
            setSellers(dataSeller.sellers);
        }
    });
    const [updateComponentG] = useMutation(UPDATE_COMPONENT);
    const [deleteComponentG] = useMutation(DELETE_COMPONENT);
    const [components, setComponents] = useState([] as any[]);
    const [sellers, setSellers] = useState<Array<ISellerType>>([]);
    const [componentSelected, setComponentSelected] = useState<IComponentType>();
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [filename, setFilename] = useState("");
    const [photoBase64, setPhotoBase64] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [sellerName, setSellerName] = useState("");
    const [type, setType] = useState("");

    useEffect(() => {
        refetchComponents();
        refetchSellers();
    }, [refetchComponents, refetchSellers]);

    function handleShowEdit() {
        setFilename("");
        setPhotoBase64("");
        setShowEdit(!showEdit)
    }

    function handleShowDelete() {
        setShowDelete(!showDelete);
    }

    async function updateComponent(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const cleanBase64 = photoBase64.replace(/^data:.+;base64,/, "");
        if (isNaN(parseFloat(price))) {
            alert("Price must be a number");
            return;
        }
        try {
            const updateComponent: IComponentInput = {
                description: description,
                image: filename,
                image64: cleanBase64,
                type: type,
                price: parseFloat(price),
                amazon_price: componentSelected?.amazon_price!,
                ebay_price: componentSelected?.ebay_price!,
                name: componentSelected?.name!,
                sellerName: sellerName,
                deleted: false
            };
            await updateComponentG({variables: {id: componentSelected?.id, component: updateComponent}});
            setComponents(prevComponents =>
                prevComponents.map(comp => {
                if (comp.id === componentSelected?.id) {
                    let newComp = {...comp};
                    if (description !== "") {
                        newComp.description = description;
                    }
                    if (price !== "") {
                        newComp.price = parseFloat(price);
                    }
                    if (type !== "") {
                        newComp.type = type;
                    }
                    if (filename !== "") {
                        newComp.image = comp.name + "_" + filename;
                    }
                    if (sellerName !== "") {
                        newComp.sellerName = sellerName;
                    }
                    newComp.deleted = false;
                    return newComp;
                }
                return comp;
            }));
        } catch (error) {
            console.log(error);
        }
        handleShowEdit();
    }

    async function deleteComponent() {
        try {
            await deleteComponentG({variables: {id: componentSelected?.id}});
            setComponents([...components.map((comp) => {
                if (comp.id === componentSelected?.id) {
                    return {...comp, deleted: true};
                }
                return comp;
            })]);
        } catch (error) {
            console.log(error)
        }
        handleShowDelete()
    }

    if (loading || loadingSeller) {
        return <div>Loading data...</div>;
    }

    if (!components || !sellers) {
        return <div>Data is not fully loaded yet.</div>;
    }

    const typeList = [
        {label: "CPU", value: "CPU"},
        {label: "GPU", value: "GPU"},
        {label: "Motherboard", value: "Motherboard"},
        {label: "RAM", value: "RAM"},
        {label: "Storage", value: "Storage"},
        {label: "Case", value: "Case"},
        {label: "Cooling", value: "Cooling"},
        {label: "PSU", value: "PSU"},
        {label: "TV", value: "TV"},
        {label: "Keyboard", value: "Keyboard"},
        {label: "Mouse", value: "Mouse"},
        {label: "Headphones", value: "Headphones"},
        {label: "Speakers", value: "Speakers"},
        {label: "Microphone", value: "Microphone"}
    ];

    return (
        <Col>
            <Container fluid>
                <Row className="m-4 mb-2">
                    <h1 style={{color: (darkMode) ? "white" : "black"}}>Components</h1>
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
                                                {comp.name}
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
                                                        <h3>{comp.description}</h3>
                                                        <h4>Type: {comp.type}</h4>
                                                        <h4>Seller: {comp.sellerName}</h4>
                                                        <Dropdown
                                                            id="nav-dropdown-dark-example"
                                                            title="Prices"
                                                        >
                                                            <Dropdown.Toggle id="dropdown-basic" variant={(darkMode) ? "dark" : "light"} size={"lg"}style={{
                                                                color: (comp.deleted) && "gray"
                                                            }}>
                                                                Prices:
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu>
                                                                <Dropdown.Item className="disabled">
                                                                    Price: {comp.price} €
                                                                </Dropdown.Item>
                                                                <Dropdown.Item className="disabled">
                                                                    Amazon Price: {comp.amazon_price} €
                                                                </Dropdown.Item>
                                                                <Dropdown.Item className="disabled">
                                                                    Ebay Price: {comp.ebay_price} €
                                                                </Dropdown.Item>
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                        <p>{(comp.deleted) && "Deleted"}</p>
                                                    </Col>
                                                    <Col xs={3}>
                                                        <ImgViewer filename={comp.image} category={""}/>
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
                                                                        setDescription(comp.description);
                                                                        setPrice(comp.price.toString());
                                                                        setType(comp.type);
                                                                        setSellerName(comp.sellerName);
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

                <Modal show={showEdit} onHide={handleShowEdit} data-bs-theme={(darkMode) ? "dark" : "light"}>
                    <Modal.Header closeButton>
                        <Modal.Title
                            style={{color: (darkMode) ? "white" : "black"}}>Edit {componentSelected?.name}</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={updateComponent}>
                        <Modal.Body>
                            <Form.Group className={"mb-4"}>
                                <Form.Control
                                    type="text"
                                    name="description"
                                    placeholder="Insert the description"
                                    value={description}
                                    onChange={(event) => setDescription(event.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className={"mb-4"}>
                                <Form.Control
                                    type="number"
                                    name="price"
                                    placeholder="Insert the price"
                                    value={price}
                                    onChange={(event) => setPrice(event.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className={"mb-4"}>
                                <Form.Select
                                    defaultValue={componentSelected !== undefined ? componentSelected.type : ""}
                                    aria-label="Type" value={type} onChange={(event) => {
                                    setType(event.target.value)
                                }}>
                                    <option>Choose Type</option>
                                    {
                                        typeList.map((type, index) => {
                                            return (
                                                <option value={type.value}>{type.label}</option>
                                            )
                                        })
                                    }
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className={"mb-4"}>
                                <Form.Select
                                    defaultValue={componentSelected !== undefined ? componentSelected.sellerName : ""}
                                    aria-label="Seller" value={sellerName} onChange={(event) => {
                                    setSellerName(event.target.value)
                                }}>
                                    <option>Choose Seller</option>
                                    {
                                        sellers.map((seller, index) => {
                                            return (
                                                <option value={seller.name}>{seller.name}</option>
                                            )
                                        })
                                    }
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
                                            setFilename(file.name);
                                            setPhotoBase64(fileReader.result as string);
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
                                Update Component
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
                        <Button variant="danger" onClick={deleteComponent}>
                            Delete Component
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </Col>
    );
}
export default Components;
