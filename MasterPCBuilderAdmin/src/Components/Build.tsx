import {useAppContext} from "../Context/AppContextProvider";
import {useMutation, useQuery} from "@apollo/client";
import {
    DELETE_BUILD,
    DELETE_COMPONENT,
    GET_BUILDS,
    GET_COMPONENTS,
    GET_SELLERS, SAVE_BUILD,
    SAVE_COMPONENT, UPDATE_BUILD,
    UPDATE_COMPONENT
} from "../Querys/Querys";
import React, {useEffect, useState} from "react";
import {Accordion, Button, Col, Form, Modal, Row} from "react-bootstrap";
import {IComponentType, ISellerType} from "./Components";
import {IBuild, IBuildComponent} from "./Home";

type Props={}

export type BuildOuputType = {
    id: number;
    name: string;
    notes: string;
    totalPrice: number;
    category: string;
    userNick: string;
}

export type BuildInputType = {
    name: string;
    notes: string;
    category: string;
    componentsIds: number[];
}

const Build=(props: Props) => {
    const {token} = useAppContext();
    const [builds, setBuilds] = useState<Array<IBuild>>([])
    const { loading: loadingBuilds, error: errorBuilds, data: dataBuilds } = useQuery(GET_BUILDS);
    const { loading: loadingComponents, error: errorComponents, data: dataComponents } = useQuery(GET_COMPONENTS);
    const [saveBuildG] = useMutation(SAVE_BUILD);
    const [updateBuildG] = useMutation(UPDATE_BUILD);
    const [deleteBuildG] = useMutation(DELETE_BUILD);
    const [components, setComponents] = useState<Array<IComponentType>>([]);
    const [locura, setLocura] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [buildSelected, setBuildSelected] = useState<IBuild>();
    const [name, setName] = useState("");
    const [notes, setNotes] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [photoBase64, setphotoBase64] = useState("");
    const [nombrefichero, setNombrefichero] = useState("");
    const [componentsSelected, setComponentsSelected] = useState<Array<number>>([])
    const handleComponentChange = (componentId: number, isChecked: boolean) => {
        if (isChecked) {
            // Agregar el ID al estado si el checkbox está marcado
            setComponentsSelected(prev => [...prev, componentId]);
        } else {
            // Remover el ID del estado si el checkbox está desmarcado
            setComponentsSelected(prev => prev.filter(id => id !== componentId));
        }
    };
    useEffect(() => {
        async function getBuilds() {
            setBuilds(dataBuilds?.builds || []);
            setComponents(dataComponents?.components || [])
        }
        getBuilds()
    }, [locura || dataBuilds || loadingBuilds || errorBuilds]);
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
        try {
            const updateComponent: BuildInputType = {
                notes: notes,
                category: category,
                name: name,
                componentsIds: componentsSelected
            };
            const update = await updateBuildG({variables: {id: buildSelected?.id, build: updateComponent}});
            setLocura(!locura);
        } catch (error) {
            console.log(error);
        }
        handleShowEdit()
    }
    async function addUser(event:React.FormEvent<HTMLFormElement>){
        event.preventDefault();
        const newBuild={
            name: name,
            notes: notes,
            category: category,
            componentsIds: componentsSelected
        }
        try{
            const response = await saveBuildG({variables: {build: newBuild}});
            console.log(response);
        }catch (error){
            console.log(error)
        }
        setLocura(!locura);
        handleShowAdd();
    }
    async function deleteUser(){
        try{
            const response = await deleteBuildG({variables: {id: buildSelected?.id}});
            setLocura(!locura);
        }catch (error){
            console.log(error)
        }
        handleShowDelete()
    }
    if (loadingBuilds ) {
        return <div>Loading data...</div>;
    }

    if ( !builds ){
        return <div>Data is not fully loaded yet.</div>;
    }
    return (
        <div style={{width: "90vw", height: "100vh"}}>
            <Row style={{margin: "4%", marginBottom: "2%"}}>
                <h1>Builds</h1>
            </Row>
            <Row style={{margin: "5%", marginTop: "3%"}}>
                <Accordion>
                    {
                        builds.map((build: IBuild, index: number) => {
                            return (
                                !build.deleted &&
                                    <>
                                        {
                                            <Accordion.Item eventKey={"" + index}>
                                                <Accordion.Header>{build.name}</Accordion.Header>
                                                <Accordion.Body>
                                                    <Row>
                                                        <Col xs={6}>
                                                            <h3>{build.notes}</h3>
                                                            <h4>Category: {build.category}</h4>
                                                            <h4>Total Price: {build.totalPrice}€</h4>
                                                        </Col>
                                                        <Col xs={3}>
                                                            {
                                                                build.buildsComponents.map((component: IBuildComponent, index: number) => {
                                                                    return (
                                                                        <Row>
                                                                            <Col xs={12}>
                                                                                <h4>{component.component.name}</h4>
                                                                                <h5>{component.component.description}</h5>
                                                                                <h5>Price: {component.component.price}€</h5>
                                                                            </Col>
                                                                        </Row>
                                                                    )
                                                                })
                                                            }
                                                        </Col>
                                                        <Col xs={3}>
                                                            <Button style={{width: "10vw"}} className="btn-danger"
                                                                    onClick={() => {
                                                                        setBuildSelected(build);
                                                                        handleShowDelete();
                                                                    }}>
                                                                Delete
                                                            </Button>
                                                            <Button style={{width: "10vw", marginTop: "3%"}}
                                                                    className="btn-warning" onClick={() => {
                                                                setBuildSelected(build);
                                                                handleShowEdit();
                                                            }}>
                                                                Edit
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        }

                                    </>
                            )
                        })
                    }
                </Accordion>
            </Row>
            <Row>
                <Button style={{width: "10vw", marginLeft: "6%"}} className="btn-secondary" onClick={handleShowAdd}>
                    Add Build
                </Button>
            </Row>

            <Modal show={showEdit} onHide={handleShowEdit}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit {buildSelected?.name}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={updateComponent}>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                name="description"
                                placeholder="Put the builds description"
                                value={notes}
                                onChange={(event) => setNotes(event.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                name="price"
                                placeholder="Put the builds price"
                                value={price}
                                onChange={(event) => setPrice(event.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Type</Form.Label>
                            <Form.Control
                                type="text"
                                name="price"
                                placeholder="Put the builds category"
                                value={category}
                                onChange={(event) => setCategory(event.target.value)}
                            />
                        </Form.Group>
                                <h4>Choose Components</h4>
                            {components.map((component, index) => {
                                if (component.deleted === 1) {
                                    return null; // No renderiza nada si el componente está marcado como eliminado
                                }
                                return (
                                    <Form.Check
                                        key={component.id} // Usa un key único para cada checkbox basado en el ID del componente
                                        type="checkbox"
                                        label={component.name}
                                        value={component.id}
                                        onChange={e => handleComponentChange(component.id, e.target.checked)}
                                        checked={componentsSelected.includes(component.id)} // Marca el checkbox si el ID ya está en el estado
                                    />
                                );
                            })}

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
                <Modal.Body>Are you sure you want to delete {buildSelected?.name} ?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleShowDelete}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={deleteUser}>
                        Delete Build
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showAdd} onHide={handleShowAdd}>
                <Form onSubmit={addUser}>

                    <Modal.Header closeButton>
                        <Modal.Title>Add a Build</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="description"
                                placeholder="Put the builds description"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                name="description"
                                placeholder="Put the builds description"
                                value={notes}
                                onChange={(event) => setNotes(event.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                name="price"
                                placeholder="Put the builds price"
                                value={price}
                                onChange={(event) => setPrice(event.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                type="text"
                                name="category"
                                placeholder="Put the builds category"
                                value={category}
                                onChange={(event) => setCategory(event.target.value)}
                            />
                        </Form.Group>
                        <h4>Choose Components</h4>
                        {components.map((component, index) => {
                            if (component.deleted === 1) {
                                return null; // No renderiza nada si el componente está marcado como eliminado
                            }
                            return (
                                <Form.Check
                                    key={component.id} // Usa un key único para cada checkbox basado en el ID del componente
                                    type="checkbox"
                                    label={component.name}
                                    value={component.id}
                                    onChange={e => handleComponentChange(component.id, e.target.checked)}
                                    checked={componentsSelected.includes(component.id)} // Marca el checkbox si el ID ya está en el estado
                                />
                            );
                        })}
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleShowEdit}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit">
                            Create Build
                        </Button>
                    </Modal.Footer>
                </Form>

            </Modal>

        </div>
    )
}
export default Build;
