
    import React, {useEffect, useState} from 'react'
    import {Accordion, Button, Col, Form, Modal, Row} from "react-bootstrap";
    import axios from "axios";
    import {useAppContext} from "../Context/AppContextProvider";
    import {UserType} from "../Type/User";
    import {useMutation, useQuery} from "@apollo/client";
    import {SAVE_USER, GET_USERS, UPDATE_USER, DELETE_USER} from "../Querys/Querys";
    type Props = {}

    const User = (props: Props) => {
        const {token} = useAppContext();
        const { loading, error, data:dataUsers,refetch } = useQuery(GET_USERS,{pollInterval: 5000,});
        const [saveUser, { loading:loadingSave, error:errorSave }] = useMutation(SAVE_USER);
        const [updateUserG, { loading:loadingUpdate, error:errorUpdate }] = useMutation(UPDATE_USER);
        const [deleteUserG, { loading:loadingDelete, error:errorDelete }] = useMutation(DELETE_USER);
        const [users, setUsers] = useState([]);
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
        async function updateUser(event:React.FormEvent<HTMLFormElement>){
            event.preventDefault();
            console.log("PASSWORD:"+password);
            console.log("ROL:"+rol);
            console.log("PICTURE:"+nombrefichero);
            const cleanBase64 = photoBase64.replace(/^data:image\/png;base64,/, "");
            console.log("PICTURE:"+cleanBase64);
            const response = await axios.put("http://localhost:8080/api/v3/users/"+userSelected?.id, {
                password: password,
                role: "ROL_"+rol,
                picture: nombrefichero,
                pictureBase64: cleanBase64
            },{headers: {"Authorization": "Bearer " + token}});
            try {
                const userInput = {
                    nick: userSelected?.nick,
                    password: password,
                    email: userSelected?.email,
                    role: "ROLE_" + rol, // Assuming you need to prepend "ROLE_"
                    picture: nombrefichero,
                    pictureBase64: cleanBase64,
                    active: 1,
                    deleted: 0
                };
                await updateUserG({ variables: { id: userSelected?.id, user:userInput } });
            } catch (e) {
                console.error('Error saving user:', e);
            }
            setLocura(!locura);
            handleShowEdit()
        }
        async function addUser(event:React.FormEvent<HTMLFormElement>){
            event.preventDefault();
            const cleanBase64 = photoBase64.replace(/^data:image\/png;base64,/, "");
            console.log("NICKNAME:"+nickname)
            console.log("PASSWORD:"+password)
            console.log("EMAIL:"+email)
            console.log("ROL:"+rol)
            console.log("PICTURE:"+nombrefichero)
            console.log("PICTURE:"+cleanBase64)


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
                await saveUser({ variables: { user:userInput } });
            } catch (e) {
                console.error('Error saving user:', e);
            }
            setLocura(!locura);
            handleShowAdd();
        }
        async function deleteUser(){
            console.log("USER SELECTED:"+userSelected?.id)
            try{
                const isDelete = await deleteUserG({ variables: { id: userSelected?.id } });
                console.log("IS DELETE:"+isDelete)
                    console.log("OWEN HAZME FELIZ");
            }catch (e) {
                console.error('Error deleting user:', e);
            }
            setLocura(!locura);
            handleShowDelete()
        }
        useEffect(() => {
            async function fetchData() {
                setUsers(dataUsers?.users);

            }
            fetchData();
        }, [locura ]);
        return(
            <div style={{width: "90vw", height: "100vh"}}>
                <Row style={{margin:"4%",marginBottom:"2%"}}>
                    <h1>Users</h1>
                </Row>
                <Row style={{margin:"5%", marginTop:"3%"}}>
                    <Accordion>
                    {
                        users.map((user: any,index:number) => {
                            return (
                                <>
                                    {
                                        !user.deleted?<Accordion.Item eventKey={""+index}>
                                            <Accordion.Header>{user.nick}</Accordion.Header>
                                            <Accordion.Body>
                                                <Row>
                                                    <Col xs={6}>
                                                        <h3>{user.nick}</h3>
                                                        <p>{user.email}</p>
                                                        <p>{user.role}</p>
                                                    </Col>
                                                    <Col xs={3}>
                                                        <img src={user.picture} alt={user.nick} style={{width: "100%"}}/>
                                                    </Col>
                                                    <Col xs={3} >
                                                        <Button style={{width:"10vw"}} className="btn-danger" onClick={()=>{
                                                            setUserSelected(user);
                                                            handleShowDelete()
                                                        }}>
                                                            Delete
                                                        </Button>
                                                        <Button style={{width:"10vw", marginTop:"3%"}} className="btn-warning" onClick={()=>{
                                                            setUserSelected(user);
                                                            handleShowEdit()
                                                        }}>
                                                            Edit
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </Accordion.Body>
                                        </Accordion.Item>:<></>
                                    }

                                </>
                            )
                        })
                    }
                    </Accordion>
                </Row>
                <Row >
                    <Button style={{width:"10vw", marginLeft:"6%"}} className="btn-secondary" onClick={handleShowAdd}>
                        Add User
                    </Button>
                </Row>

                <Modal show={showEdit} onHide={handleShowEdit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit {userSelected?.nick}</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={updateUser}>
                    <Modal.Body>
                            <Form.Group >
                                <Form.Label>Contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    placeholder="Put the users password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Select defaultValue="ADMIN" aria-label="Rol" value={rol} onChange={(event) => {
                                    setRol(event.target.value)
                                }}>
                                    <option>Choose Role</option>
                                    <option value="ADMIN">Admin</option>
                                    <option value="USER">User</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Profile Picture</Form.Label>
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
                        <Button variant="secondary" onClick={handleShowEdit}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit">
                            Update User
                        </Button>
                    </Modal.Footer>
                    </Form>
                </Modal>
                <Modal show={showDelete} onHide={handleShowDelete}>
                    <Modal.Header closeButton>
                        <Modal.Title>Are you sure?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete {userSelected?.nick} ?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleShowDelete}>
                            Close
                        </Button>
                        <Button variant="danger" onClick={deleteUser}>
                            Delete User
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={showAdd} onHide={handleShowAdd}>
                        <Form onSubmit={addUser}>

                        <Modal.Header closeButton>
                            <Modal.Title>Add a User</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Group >
                                <Form.Label>Nick</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nickname"
                                    placeholder="Put the users nickname"
                                    value={nickname}
                                    onChange={(event) => setNickname(event.target.value)}
                                />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    placeholder="Put the users password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="email"
                                    placeholder="Put the users password"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Select defaultValue="ADMIN" aria-label="Rol" value={rol} onChange={(event) => {
                                    setRol(event.target.value)
                                }}>
                                    <option>Choose Role</option>
                                    <option value="ADMIN">Admin</option>
                                    <option value="USER">User</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Profile Picture</Form.Label>
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
                            <Button variant="secondary" onClick={handleShowAdd}>
                                Close
                            </Button>
                            <Button variant="primary" type="submit" >
                                Add User
                            </Button>
                        </Modal.Footer>
                        </Form>

                    </Modal>
            </div>
        )
    }
    export default User;
