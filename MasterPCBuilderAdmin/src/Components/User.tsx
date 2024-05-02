import React, {useEffect, useState} from 'react'
import {Accordion, Button, Col, Container, Form, Modal, Row} from "react-bootstrap";
import axios from "axios";
import {useAppContext} from "../Context/AppContextProvider";
import {UserType} from "../Type/User";
import {useMutation, useQuery} from "@apollo/client";
import {SAVE_USER, GET_USERS, UPDATE_USER, DELETE_USER} from "../Querys/Querys";
import ImgViewer from "./ImgViewer";

type Props = {}

const User = (props: Props) => {
    const {token, darkMode} = useAppContext();
    const {loading, error, data: dataUsers, refetch} = useQuery(GET_USERS, {
        onCompleted: () => {
            setUsers([...dataUsers.users]);
        }
    });
    const [saveUser, {loading: loadingSave, error: errorSave}] = useMutation(SAVE_USER, {
        onCompleted: () => {
            refetch();
        }
    });
    const [updateUserG, {loading: loadingUpdate, error: errorUpdate}] = useMutation(UPDATE_USER);
    const [deleteUserG, {loading: loadingDelete, error: errorDelete}] = useMutation(DELETE_USER);
    const [users, setUsers] = useState([] as any[]);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [userSelected, setUserSelected] = useState<UserType>()
    const [password, setPassword] = useState("");
    const [rol, setRol] = useState("");
    const [nombrefichero, setnombrefichero] = useState("");
    const [photoBase64, setphotoBase64] = useState("");
    const [locura, setLocura] = useState(false)
    const [showAdd, setShowAdd] = useState(false)
    const [nickname, setNickname] = useState("")
    const [email, setEmail] = useState("")

    function handleShowEdit() {
        setShowEdit(!showEdit)
    }

    function handleShowDelete() {
        setShowDelete(!showDelete);
    }

    function handleShowAdd() {
        setShowAdd(!showAdd);
    }

    async function updateUser(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const cleanBase64 = photoBase64.replace(/^data:image\/png;base64,/, "");

        try {
            const userInput = {
                nick: userSelected?.nick,
                password: password === "" ? userSelected?.password : password,
                email: userSelected?.email,
                role: rol === "" ? userSelected?.role : rol,
                picture: nombrefichero,
                pictureBase64: cleanBase64,
                active: 1,
                deleted: 0
            };
            await updateUserG({variables: {id: userSelected?.id, user: userInput}});
        } catch (e) {
            console.error('Error saving user:', e);
        }
        handleShowEdit()
    }

    async function addUser(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const cleanBase64 = photoBase64.replace(/^data:image\/png;base64,/, "");
        console.log("NICKNAME:" + nickname)
        console.log("PASSWORD:" + password)
        console.log("EMAIL:" + email)
        console.log("ROL:" + rol)
        console.log("PICTURE:" + nombrefichero)
        console.log("PICTURE:" + cleanBase64)


        try {
            const userInput = {
                nick: nickname,
                password: password,
                email: email,
                role: "ROLE_" + rol, // Assuming you need to prepend "ROLE_"
                picture: nombrefichero,
                pictureBase64: cleanBase64,
                active: 1,
                deleted: 0
            };
            await saveUser({variables: {user: userInput}});
        } catch (e) {
            console.error('Error saving user:', e);
        }
        handleShowAdd();
    }

    async function deleteUser() {
        console.log("USER SELECTED:" + userSelected?.id)
        try {
            const isDelete = await deleteUserG({variables: {id: userSelected?.id}});
            console.log("IS DELETE:" + isDelete)
            console.log("OWEN HAZME FELIZ");
        } catch (e) {
            console.error('Error deleting user:', e);
        }
        handleShowDelete()
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
                            users.map((user: any, index: number) => {
                                return (
                                    !user.deleted && <Accordion.Item eventKey={"" + index}>
                                        <Accordion.Header>{user.nick}</Accordion.Header>
                                        <Accordion.Body>
                                            <Container fluid>
                                                <Row>
                                                    <Col xs={6}>
                                                        <h3>{user.nick}</h3>
                                                        <p>{user.email}</p>
                                                        <p>{user.role}</p>
                                                    </Col>
                                                    <Col xs={3}>
                                                        <ImgViewer filename={user.picture} />
                                                    </Col>
                                                    <Col xs={3}>
                                                        <Container fluid>
                                                            <Row>
                                                                <Col>
                                                                    <Button style={{width: "10vw"}}
                                                                            variant="danger"
                                                                            onClick={() => {
                                                                                setUserSelected(user);
                                                                                handleShowDelete()
                                                                            }}>
                                                                        Delete
                                                                    </Button>
                                                                </Col>
                                                                <Col>
                                                                    <Button style={{width: "10vw", marginTop: "3%"}}
                                                                            variant="info" onClick={() => {
                                                                        setUserSelected(user);
                                                                        handleShowEdit()
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
                            style={{color: (darkMode) ? "white" : "black"}}>Edit {userSelected?.nick}</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={updateUser}>
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
                                <Form.Select defaultValue={userSelected !== undefined ? userSelected.role : "ROLE_ADMIN" } aria-label="Rol" value={rol} onChange={(event) => {
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
                                            setnombrefichero(file.name);
                                            setphotoBase64(fileReader.result as string);
                                        };
                                    }
                                }}/>
                            </Form.Group>
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
                        delete {userSelected?.nick} ?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-secondary" onClick={handleShowDelete}>
                            Close
                        </Button>
                        <Button variant="danger" onClick={deleteUser}>
                            Delete User
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
                                <Form.Select defaultValue="ADMIN" aria-label="Rol" value={rol} onChange={(event) => {
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
                                            setnombrefichero(file.name);
                                            setphotoBase64(fileReader.result as string);
                                        };
                                    }
                                }} style={{borderRadius: "0"}}/>
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="outline-secondary" onClick={handleShowAdd} style={{borderRadius: "0"}}>
                                Close
                            </Button>
                            <Button variant="success" type="submit" style={{borderRadius: "0"}}>
                                Add User
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </Container>
        </Col>
    )
}
export default User;
