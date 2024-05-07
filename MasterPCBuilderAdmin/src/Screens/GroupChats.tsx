import React, {useEffect, useState} from 'react'
import {useAppContext} from '../Contexts/AppContextProvider';
import {Form, Button, Container, Row, Col, Accordion, Modal, Image, Dropdown} from 'react-bootstrap';
import {useMutation, useQuery} from "@apollo/client";
import {
    ADD_REMOVE_ADMIN_GROUP,
    ADD_REMOVE_USER_GROUP,
    DELETE_GROUP,
    GET_GROUPS,
    UPDATE_GROUP,
} from "../Querys/Querys";
import ImgViewer from "../Components/ImgViewer";
import {IBuild} from "./Home";
import {IUserType} from "./AdminChat";

type Props = {}

export interface IGroupType {
    id: number;
    name: string;
    picture: string;
    description: string;
    dateOfCreation: string;
    users: IUserType[];
    admin: IUserType;
    deleted: boolean;
}

const GroupChats = (props: Props) => {
    const {token, darkMode} = useAppContext();
    const {loading, error, data: dataGroups, refetch: refetchGroups} = useQuery(GET_GROUPS, {
        onCompleted: () => {
            setGroups(dataGroups?.groupChats);
        }
    });
    const [updateGroupG] = useMutation(UPDATE_GROUP);
    const [deleteGroupG] = useMutation(DELETE_GROUP);
    const [addRemoveUserG] = useMutation(ADD_REMOVE_USER_GROUP);
    const [addRemoveAdminG] = useMutation(ADD_REMOVE_ADMIN_GROUP);
    const [groups, setGroups] = useState([] as any[]);
    const [userSelected, setUserSelected] = useState<IUserType>();
    const [groupSelected, setGroupSelected] = useState<IGroupType>();
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showAddRemoveUser, setShowAddRemoveUser] = useState(false);
    const [showAddRemoveAdmin, setShowAddRemoveAdmin] = useState(false);
    const [filename, setFilename] = useState("");
    const [photoBase64, setPhotoBase64] = useState("");
    const [description, setDescription] = useState("");
    const [name, setName] = useState("");

    useEffect(() => {
        refetchGroups();
    }, [refetchGroups]);

    function handleShowEdit() {
        setFilename("");
        setPhotoBase64("");
        setShowEdit(!showEdit)
    }

    function handleShowDelete() {
        setShowDelete(!showDelete);
    }

    function handleAddRemoveUser() {
        setShowAddRemoveUser(!showAddRemoveUser);
    }

    function handleAddRemoveAdmin() {
        setShowAddRemoveAdmin(!showAddRemoveAdmin);
    }

    async function updateGroup(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const cleanBase64 = photoBase64.replace(/^data:.+;base64,/, "");

        try {
            const updateGroup = {
                name: name,
                description: description,
                picture: filename,
                pictureBase64: cleanBase64,
                deleted: false
            };
            await updateGroupG({variables: {id: groupSelected?.id, groupChat: updateGroup}});
            setGroups(prevGroups =>
                prevGroups.map(group => {
                    if (group.id === groupSelected?.id) {
                        let newGroup = {...group};
                        if (name !== "") {
                            newGroup.name = name;
                        }
                        if (description !== "") {
                            newGroup.description = description;
                        }
                        if (filename !== "") {
                            newGroup.picture = name + "_" + filename;
                        }
                        newGroup.deleted = false;
                        return newGroup;
                    }
                    return group;
                }));
        } catch (error) {
            console.log(error);
        }
        handleShowEdit();
    }

    async function deleteGroup() {
        try {
            await deleteGroupG({variables: {id: groupSelected?.id}});
            setGroups([...groups.map((group) => {
                if (group.id === groupSelected?.id) {
                    return {...group, deleted: true};
                }
                return group;
            })]);
        } catch (error) {
            console.log(error)
        }
        handleShowDelete()
    }

    async function addRemoveUser() {
        try {
            await addRemoveUserG({variables: {groupId: groupSelected?.id, userId: userSelected?.id}});
            setGroups([...groups.map((group) => {
                if (group.id === groupSelected?.id) {
                    return {...group, users: group.users.filter((user: IUserType) => user.id !== userSelected?.id)};
                }
                return group;
            })]);
        } catch (error) {
            console.log(error)
        }
        handleAddRemoveUser()
    }

    async function addRemoveAdmin() {
        try {
            await addRemoveAdminG({variables: {groupId: groupSelected?.id, userId: userSelected?.id}});
            setGroups([...groups.map((group) => {
                if (group.id === groupSelected?.id) {
                    return {...group, admin: group.users.filter((user: IUserType) => user.id === userSelected?.id)[0]};
                }
                return group;
            })]);
        } catch (error) {
            console.log(error)
        }
        handleAddRemoveAdmin()
    }

    if (!groups) {
        return <div>Data is not fully loaded yet.</div>;
    }

    return (
        <Col>
            <Container fluid>
                <Row className="m-4 mb-2">
                    <h1 style={{color: (darkMode) ? "white" : "black"}}>Groups</h1>
                </Row>
                <Row className="m-5 mt-3">
                    <Accordion data-bs-theme={(darkMode) ? "dark" : "light"}>
                        {
                            groups.map((group: any, index: number) => {
                                return (
                                    <Accordion.Item eventKey={"" + index} style={{
                                        color: (group.deleted) && "gray"
                                    }}>
                                        <Accordion.Header>
                                            <Col style={{
                                                color: (group.deleted) && "gray"
                                            }}>
                                                {group.name}
                                            </Col>
                                            <Col style={{
                                                color: (group.deleted) && "gray"
                                            }}>
                                                {(group.deleted) && "Deleted"}
                                            </Col>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <Container fluid>
                                                <Row>
                                                    <Col xs={6}>
                                                        <h3>{group.description}</h3>
                                                        <h4>Admin: {group.admin.nick}</h4>
                                                        <h4>Members: {group.users.length === 1 && "There aren't any members in this group"}</h4>
                                                        <ul>
                                                            {
                                                                group.users
                                                                    .filter((user: IUserType) => user.id !== group.admin.id)
                                                                    .map((user: IUserType) => {
                                                                        return (
                                                                            <li>
                                                                                <Dropdown>
                                                                                    <Dropdown.Toggle
                                                                                        variant={(!darkMode) ? "light" : "dark"}
                                                                                        id="dropdown-basic"
                                                                                        disabled={(group.deleted)}
                                                                                    >
                                                                                        {user.nick}
                                                                                    </Dropdown.Toggle>
                                                                                    <Dropdown.Menu>
                                                                                        <Dropdown.Item
                                                                                            onClick={() => {
                                                                                                setUserSelected(user);
                                                                                                setGroupSelected(group);
                                                                                                handleAddRemoveUser();
                                                                                            }}>
                                                                                            Remove User
                                                                                        </Dropdown.Item>
                                                                                        <Dropdown.Item
                                                                                            onClick={() => {
                                                                                                setUserSelected(user);
                                                                                                setGroupSelected(group);
                                                                                                handleAddRemoveAdmin();
                                                                                            }}>
                                                                                            Make Admin
                                                                                        </Dropdown.Item>
                                                                                    </Dropdown.Menu>
                                                                                </Dropdown>
                                                                            </li>
                                                                        )
                                                                    })
                                                            }
                                                        </ul>
                                                        <p>{(group.deleted) && "Deleted"}</p>
                                                    </Col>
                                                    <Col xs={3}>
                                                        <ImgViewer filename={group.picture}
                                                                   category={"groupChat"}/>
                                                    </Col>
                                                    <Col xs={3}>
                                                        <Container fluid>
                                                            <Row>
                                                                <Col>
                                                                    <Button style={{width: "10vw"}} variant="danger"
                                                                            onClick={() => {
                                                                                setGroupSelected(group);
                                                                                handleShowDelete()
                                                                            }} disabled={group.deleted}>
                                                                        Delete
                                                                    </Button>
                                                                </Col>
                                                                <Col>
                                                                    <Button style={{width: "10vw", marginTop: "3%"}}
                                                                            variant="info" onClick={() => {
                                                                        setGroupSelected(group);
                                                                        setName(group.name);
                                                                        setDescription(group.description);
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
                            style={{color: (darkMode) ? "white" : "black"}}>Edit {groupSelected?.name}</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={updateGroup}>
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
                            <Form.Group className={"mb-4"}>
                                <Form.Control
                                    type="text"
                                    name="description"
                                    placeholder="Insert the description"
                                    value={description}
                                    onChange={(event) => setDescription(event.target.value)}
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
                                Update Group
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
                <Modal show={showDelete} onHide={handleShowDelete} data-bs-theme={(darkMode) ? "dark" : "light"}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{color: (darkMode) ? "white" : "black"}}>Are you sure?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{color: (darkMode) ? "white" : "black"}}>
                        Are you sure you want to delete {groupSelected?.name}?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-secondary" onClick={handleShowDelete}>
                            Close
                        </Button>
                        <Button variant="danger" onClick={deleteGroup}>
                            Delete Group
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={showAddRemoveUser} onHide={handleAddRemoveUser} data-bs-theme={(darkMode) ? "dark" : "light"}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{color: (darkMode) ? "white" : "black"}}>Are you sure?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{color: (darkMode) ? "white" : "black"}}>
                        Are you sure you want to Remove {userSelected?.nick} from {groupSelected?.name}?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-secondary" onClick={handleAddRemoveUser}>
                            Close
                        </Button>
                        <Button variant="warning" onClick={addRemoveUser}>
                            {(groupSelected?.users.includes(userSelected!) ? "Remove" : "Add")} User
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={showAddRemoveAdmin} onHide={handleAddRemoveAdmin} data-bs-theme={(darkMode) ? "dark" : "light"}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{color: (darkMode) ? "white" : "black"}}>Are you sure?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{color: (darkMode) ? "white" : "black"}}>
                        Are you sure you want to Make {userSelected?.nick} Admin of {groupSelected?.name}?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-secondary" onClick={handleAddRemoveAdmin}>
                            Close
                        </Button>
                        <Button variant="warning" onClick={addRemoveAdmin}>
                            Make Admin
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </Col>
    );
}
export default GroupChats;