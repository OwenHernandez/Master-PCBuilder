import React, {useEffect, useState} from 'react'
import {Accordion, Button, Col, Container, Form, Image, Modal, Row} from "react-bootstrap";
import {useAppContext} from "../Context/AppContextProvider";
import {UserType} from "../Type/User";
import {useMutation, useQuery} from "@apollo/client";
import {DELETE_USER, GET_USERS, SAVE_USER, UPDATE_USER} from "../Querys/Querys";
import ImgViewer from "./ImgViewer";
import {useNavigate} from "react-router-dom";

type Props = {}

const Users = (props: Props) => {
    const {token, darkMode} = useAppContext();
    const {loading, error, data: dataUsers, refetch} = useQuery(GET_USERS, {
        onCompleted: () => {
            setUsers(dataUsers.users);
        }
    });
    const [saveUser, {loading: loadingSave, error: errorSave}] = useMutation(SAVE_USER);
    const [updateUserG, {loading: loadingUpdate, error: errorUpdate}] = useMutation(UPDATE_USER);
    const [deleteUserG, {loading: loadingDelete, error: errorDelete}] = useMutation(DELETE_USER);
    const [users, setUsers] = useState([] as any[]);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [userSelected, setUserSelected] = useState<UserType>()
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [filename, setFilename] = useState("");
    const [photoBase64, setPhotoBase64] = useState("");
    const [showAdd, setShowAdd] = useState(false);
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        refetch();
    }, []);

    function handleShowEdit() {
        setPassword("");
        setPhotoBase64("");
        setFilename("");
        setShowEdit(!showEdit);
    }

    function handleShowDelete() {
        setShowDelete(!showDelete);
    }

    function handleShowAdd() {
        setNickname("");
        setEmail("");
        setPassword("");
        setPhotoBase64("");
        setFilename("");
        setShowAdd(!showAdd);
    }

    async function updateUser(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const cleanBase64 = photoBase64.replace(/^data:.+;base64,/, "");
        try {
            let userInput = {
                id: userSelected?.id,
                nick: userSelected?.nick,
                password: password,
                email: userSelected?.email,
                role: role === "" ? userSelected?.role : role,
                picture: filename,
                pictureBase64: cleanBase64,
                active: true,
                deleted: false
            };
            await updateUserG({variables: {id: userSelected?.id, user: userInput}});
            setUsers(users.map(user => {
                if (user.id === userSelected?.id) {
                    let newUser = {...user};
                    if (role !== "") {
                        newUser.role = role;
                    }
                    if (filename !== "") {
                        newUser.picture = user.nick + "_" + filename;
                    }
                    return newUser;
                }
                return user;
            }));
        } catch (e) {
            console.error('Error saving user:', e);
        }
        handleShowEdit()
    }

    async function addUser(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (nickname === "" || password === "" || email === "" || role === "" || photoBase64 === "") {
            alert("All fields are required");
            return;
        }
        if (!(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).test(email)) {
            alert("The email is not valid");
            return;
        }
        const cleanBase64 = photoBase64.replace(/^data:.+;base64,/, "");

        try {
            let userInput = {
                id: 0, //Un numero para que no se queje
                nick: nickname,
                password: password,
                email: email,
                role: role,
                picture: filename,
                pictureBase64: cleanBase64,
                active: true,
                deleted: false
            };
            await saveUser({variables: {user: userInput}});
            userInput.picture = userInput.nick + "_" + filename;
            setUsers([...users, userInput]);
        } catch (e) {
            console.error('Error saving user:', e);
        }
        handleShowAdd();
    }

    async function deleteUser() {
        try {
            await deleteUserG({variables: {id: userSelected?.id}});
            setUsers([...users.map((user) => {
                if (user.id === userSelected?.id) {
                    return {...user, deleted: true};
                }
                return user;
            })]);
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
                                    <Accordion.Item eventKey={"" + index} style={{
                                        color: (user.deleted) && "gray"
                                    }}>
                                        <Accordion.Header>
                                            <Col style={{
                                                color: (user.deleted) && "gray"
                                            }}>
                                                {user.nick}
                                            </Col>
                                            <Col style={{
                                                color: (user.deleted) && "gray"
                                            }}>
                                                {(user.deleted) && "Deleted"}
                                            </Col>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <Container fluid>
                                                <Row>
                                                    <Col xs={6}>
                                                        <h3>{user.nick}</h3>
                                                        <p>{user.email}</p>
                                                        <p>{user.role}</p>
                                                        <p>{(user.deleted) && "Deleted"}</p>
                                                    </Col>
                                                    <Col xs={3}>
                                                        <ImgViewer filename={user.picture}/>
                                                    </Col>
                                                    <Col xs={3}>
                                                        <Container fluid>
                                                            <Row>
                                                                <Col>
                                                                    <Button style={{width: "10vw"}} variant="danger"
                                                                            onClick={() => {
                                                                                setUserSelected(user);
                                                                                handleShowDelete()
                                                                            }} disabled={user.deleted}>
                                                                        Delete
                                                                    </Button>
                                                                </Col>
                                                                <Col>
                                                                    <Button style={{width: "10vw", marginTop: "3%"}}
                                                                            variant="info" onClick={() => {
                                                                        setUserSelected(user);
                                                                        setRole(user.role);
                                                                        handleShowEdit();
                                                                    }}>
                                                                        Edit
                                                                    </Button>
                                                                </Col>
                                                                <Col>
                                                                    <Button style={{width: "10vw", marginTop: "3%"}}
                                                                            variant="success" onClick={() => {
                                                                        navigate("/chat", { state: {userSelected: user}});
                                                                    }}>
                                                                        Chat
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
                                <Form.Select
                                    defaultValue={userSelected !== undefined ? userSelected.role : "ROLE_ADMIN"}
                                    aria-label="Rol" value={role} onChange={(event) => {
                                    setRole(event.target.value)
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
                                    inputMode={"email"}
                                    placeholder="Insert the email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className={"mb-4"}>
                                <Form.Select aria-label="Rol" value={role} onChange={(event) => {
                                    setRole(event.target.value)
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
                                Add User
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </Container>
        </Col>
    )
}
export default Users;
