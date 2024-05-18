import React, {useEffect, useState} from 'react'
import {useAppContext} from '../Contexts/AppContextProvider';
import {Form, Button, Container, Row, Col, Accordion, Modal, Image} from 'react-bootstrap';
import {useMutation, useQuery} from "@apollo/client";
import {
    DELETE_SELLER,
    GET_SELLERS,
    SAVE_SELLER,
    UPDATE_SELLER,
} from "../Querys/Querys";
import ImgViewer from "../Components/ImgViewer";
import {ISellerType} from "./Components";

type Props = {}

const Sellers = (props: Props) => {
    const {token, darkMode} = useAppContext();
    const {loading, error, data: dataSeller, refetch: refetchSeller} = useQuery(GET_SELLERS, {
        onCompleted: () => {
            setSellers(dataSeller?.sellers);
        }
    });
    const [saveSellerG] = useMutation(SAVE_SELLER);
    const [updateSellerG] = useMutation(UPDATE_SELLER);
    const [deleteSellerG] = useMutation(DELETE_SELLER);
    const [sellers, setSellers] = useState([] as any[]);
    const [sellerSelected, setSellerSelected] = useState<ISellerType>();
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [filename, setFilename] = useState("");
    const [photoBase64, setPhotoBase64] = useState("");
    const [name, setName] = useState("");

    useEffect(() => {
        refetchSeller();
    }, [refetchSeller]);

    function handleShowEdit() {
        setFilename("");
        setPhotoBase64("");
        setShowEdit(!showEdit)
    }

    function handleShowDelete() {
        setShowDelete(!showDelete);
    }

    function handleShowAdd() {
        setName("");
        setPhotoBase64("");
        setFilename("");
        setShowAdd(!showAdd);
    }

    async function updateSeller(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const cleanBase64 = photoBase64.replace(/^data:.+;base64,/, "");

        try {
            const updateSeller = {
                name: name,
                image: filename,
                image64: cleanBase64,
                deleted: false
            };
            await updateSellerG({variables: {id: sellerSelected?.id, seller: updateSeller}});
            setSellers(prevSellers =>
                prevSellers.map(seller => {
                    if (seller.id === sellerSelected?.id) {
                        let newSeller = {...seller};
                        if (name !== "") {
                            newSeller.name = name;
                        }
                        if (filename !== "") {
                            newSeller.image = name + "_" + filename;
                        }
                        newSeller.deleted = false;
                        return newSeller;
                    }
                    return seller;
                }));
        } catch (error) {
            console.log(error);
        }
        handleShowEdit();
    }

    async function deleteSeller() {
        try {
            await deleteSellerG({variables: {id: sellerSelected?.id}});
            setSellers([...sellers.map((group) => {
                if (group.id === sellerSelected?.id) {
                    return {...group, deleted: true};
                }
                return group;
            })]);
        } catch (error) {
            alert("Seller could not be deleted, probably has components associated");
            console.log(error);
        }
        handleShowDelete()
    }

    async function addUser(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (name === "" || filename === "" || photoBase64 === "") {
            alert("All fields are required");
            return;
        }
        const cleanBase64 = photoBase64.replace(/^data:.+;base64,/, "");

        try {
            let sellerInput = {
                name: name,
                image: filename,
                image64: cleanBase64,
                deleted: false
            };
            await saveSellerG({variables: {seller: sellerInput}});
            sellerInput.image = sellerInput.name + "_" + filename;
            setSellers([...sellers, sellerInput]);
        } catch (e) {
            console.error('Error saving seller:', e);
        }
        handleShowAdd();
    }

    if (!sellers) {
        return <div>Data is not fully loaded yet.</div>;
    }

    return (
        <Col>
            <Container fluid>
                <Row className="m-4 mb-2">
                    <h1 style={{color: (darkMode) ? "white" : "black"}}>Sellers</h1>
                </Row>
                <Row className="m-5 mt-3">
                    <Accordion data-bs-theme={(darkMode) ? "dark" : "light"}>
                        {
                            sellers.map((seller: any, index: number) => {
                                return (
                                    <Accordion.Item eventKey={"" + index} style={{
                                        color: (seller.deleted) && "gray"
                                    }}>
                                        <Accordion.Header>
                                            <Col style={{
                                                color: (seller.deleted) && "gray"
                                            }}>
                                                {seller.name}
                                            </Col>
                                            <Col style={{
                                                color: (seller.deleted) && "gray"
                                            }}>
                                                {(seller.deleted) && "Deleted"}
                                            </Col>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <Container fluid>
                                                <Row>
                                                    <Col xs={6}>
                                                        <h4>{seller.name}</h4>
                                                    </Col>
                                                    <Col xs={3}>
                                                        <ImgViewer filename={seller.image}
                                                                   category={""}/>
                                                    </Col>
                                                    <Col xs={3}>
                                                        <Container fluid>
                                                            <Row>
                                                                <Col>
                                                                    <Button style={{width: "10vw"}} variant="danger"
                                                                            onClick={() => {
                                                                                setSellerSelected(seller);
                                                                                handleShowDelete()
                                                                            }} disabled={seller.deleted}>
                                                                        Delete
                                                                    </Button>
                                                                </Col>
                                                                <Col>
                                                                    <Button style={{width: "10vw", marginTop: "3%"}}
                                                                            variant="info" onClick={() => {
                                                                        setSellerSelected(seller);
                                                                        setName(seller.name);
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
                            Add Seller
                        </Button>
                    </Col>
                </Row>

                <Modal show={showEdit} onHide={handleShowEdit} data-bs-theme={(darkMode) ? "dark" : "light"}>
                    <Modal.Header closeButton>
                        <Modal.Title
                            style={{color: (darkMode) ? "white" : "black"}}>Edit {sellerSelected?.name}</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={updateSeller}>
                        <Modal.Body>
                            <Form.Group className={"mb-4"}>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    placeholder="Insert the name"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                />
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
                                Update Seller
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
                <Modal show={showDelete} onHide={handleShowDelete} data-bs-theme={(darkMode) ? "dark" : "light"}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{color: (darkMode) ? "white" : "black"}}>Are you sure?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{color: (darkMode) ? "white" : "black"}}>
                        Are you sure you want to delete {sellerSelected?.name}?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-secondary" onClick={handleShowDelete}>
                            Close
                        </Button>
                        <Button variant="danger" onClick={deleteSeller}>
                            Delete Seller
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={showAdd} onHide={handleShowAdd} data-bs-theme={(darkMode) ? "dark" : "light"}>
                    <Form onSubmit={addUser}>

                        <Modal.Header closeButton>
                            <Modal.Title style={{color: (darkMode) ? "white" : "black"}}>Add a User</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Group className={"mb-4"}>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    placeholder="Insert the name"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                />
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
                                Add Seller
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </Container>
        </Col>
    );
}
export default Sellers;