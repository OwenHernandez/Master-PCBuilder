import React, {useEffect, useState} from 'react'
import {useAppContext} from '../Context/AppContextProvider';
import {Form, Button, Container, Row, Col, Accordion, Modal, Image, Dropdown} from 'react-bootstrap';
import {useMutation, useQuery} from "@apollo/client";
import {
    DELETE_POST,
    GET_POSTS,
    UPDATE_POST
} from "../Querys/Querys";
import ImgViewer from "./ImgViewer";
import {IBuild} from "./Home";
import {IUserType} from "./AdminChat";

type Props = {}

export interface IPostType {
    id: number;
    title: string;
    build: IBuild;
    image: string;
    description: string;
    user: IUserType;
    usersWhoLiked: IUserType[];
    deleted: boolean;
}

const Components = (props: Props) => {
    const {token, darkMode} = useAppContext();
    const {loading, error, data: dataPosts, refetch: refetchPosts} = useQuery(GET_POSTS,{
        onCompleted: () => {
            setPosts(dataPosts.posts);
        }
    });
    const [updatePostG] = useMutation(UPDATE_POST);
    const [deletePostG] = useMutation(DELETE_POST);
    const [posts, setPosts] = useState([] as any[]);
    const [postSelected, setPostSelected] = useState<IPostType>();
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [filename, setFilename] = useState("");
    const [photoBase64, setPhotoBase64] = useState("");
    const [description, setDescription] = useState("");
    const [title, setTitle] = useState("");

    useEffect(() => {
        refetchPosts();
    }, [refetchPosts]);

    function handleShowEdit() {
        setFilename("");
        setPhotoBase64("");
        setShowEdit(!showEdit)
    }

    function handleShowDelete() {
        setShowDelete(!showDelete);
    }

    async function updatePost(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const cleanBase64 = photoBase64.replace(/^data:.+;base64,/, "");

        try {
            const updatePost = {
                title: title,
                description: description,
                image: filename,
                image64: cleanBase64,
                buildId: postSelected?.build.id,
                deleted: false
            };
            await updatePostG({variables: {id: postSelected?.id, post: updatePost}});
            setPosts(prevPosts =>
                prevPosts.map(post => {
                    if (post.id === postSelected?.id) {
                        let newPost = {...post};
                        if (title !== "") {
                            newPost.title = title;
                        }
                        if (description !== "") {
                            newPost.description = description;
                        }
                        if (filename !== "") {
                            newPost.image = post.title + "_" + filename;
                        }
                        newPost.deleted = false;
                        return newPost;
                    }
                    return post;
                }));
        } catch (error) {
            console.log(error);
        }
        handleShowEdit();
    }

    async function deletePost() {
        try {
            await deletePostG({variables: {id: postSelected?.id}});
            setPosts([...posts.map((comp) => {
                if (comp.id === postSelected?.id) {
                    return {...comp, deleted: true};
                }
                return comp;
            })]);
        } catch (error) {
            console.log(error)
        }
        handleShowDelete()
    }

    if (!posts) {
        return <div>Data is not fully loaded yet.</div>;
    }

    return (
        <Col>
            <Container fluid>
                <Row className="m-4 mb-2">
                    <h1 style={{color: (darkMode) ? "white" : "black"}}>Posts</h1>
                </Row>
                <Row className="m-5 mt-3">
                    <Accordion data-bs-theme={(darkMode) ? "dark" : "light"}>
                        {
                            posts.map((post: any, index: number) => {
                                return (
                                    <Accordion.Item eventKey={"" + index} style={{
                                        color: (post.deleted) && "gray"
                                    }}>
                                        <Accordion.Header>
                                            <Col style={{
                                                color: (post.deleted) && "gray"
                                            }}>
                                                {post.title}
                                            </Col>
                                            <Col style={{
                                                color: (post.deleted) && "gray"
                                            }}>
                                                {(post.deleted) && "Deleted"}
                                            </Col>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <Container fluid>
                                                <Row>
                                                    <Col xs={6}>
                                                        <h3>{post.description}</h3>
                                                        <h4>Build: {post.build.name}</h4>
                                                        <h4>Created by: {post.user.nick}</h4>
                                                        <p>{(post.deleted) && "Deleted"}</p>
                                                    </Col>
                                                    <Col xs={3}>
                                                        <ImgViewer filename={post.image} category={post.build.category}/>
                                                    </Col>
                                                    <Col xs={3}>
                                                        <Container fluid>
                                                            <Row>
                                                                <Col>
                                                                    <Button style={{width: "10vw"}} variant="danger"
                                                                            onClick={() => {
                                                                                setPostSelected(post);
                                                                                handleShowDelete()
                                                                            }} disabled={post.deleted}>
                                                                        Delete
                                                                    </Button>
                                                                </Col>
                                                                <Col>
                                                                    <Button style={{width: "10vw", marginTop: "3%"}}
                                                                            variant="info" onClick={() => {
                                                                        setPostSelected(post);
                                                                        setTitle(post.title);
                                                                        setDescription(post.description);
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
                            style={{color: (darkMode) ? "white" : "black"}}>Edit {postSelected?.title}</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={updatePost}>
                        <Modal.Body>
                            <Form.Group className={"mb-4"}>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    placeholder="Insert the title"
                                    value={title}
                                    onChange={(event) => setTitle(event.target.value)}
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
                                Update Post
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
                <Modal show={showDelete} onHide={handleShowDelete} data-bs-theme={(darkMode) ? "dark" : "light"}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{color: (darkMode) ? "white" : "black"}}>Are you sure?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{color: (darkMode) ? "white" : "black"}}>Are you sure you want to
                        delete {postSelected?.title}?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-secondary" onClick={handleShowDelete}>
                            Close
                        </Button>
                        <Button variant="danger" onClick={deletePost}>
                            Delete Post
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </Col>
    );
}
export default Components;