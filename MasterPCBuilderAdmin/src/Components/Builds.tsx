import {useAppContext} from "../Context/AppContextProvider";
import {useMutation, useQuery} from "@apollo/client";
import {
    DELETE_BUILD,
    GET_BUILDS,
    UPDATE_BUILD
} from "../Querys/Querys";
import React, {useEffect, useState} from "react";
import {Accordion, Button, Col, Container, Form, Modal, Row} from "react-bootstrap";
import {IBuild, IBuildComponent} from "./Home";
import ImgViewer from "./ImgViewer";

type Props = {}

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

const Builds = (props: Props) => {
    const {token, darkMode} = useAppContext();
    const [builds, setBuilds] = useState<Array<IBuild>>([])
    const {loading: loadingBuilds, error: errorBuilds, data: dataBuilds, refetch} = useQuery(GET_BUILDS, {
        onCompleted: () => {
            setBuilds(dataBuilds?.builds);
        }
    });
    const [updateBuildG] = useMutation(UPDATE_BUILD);
    const [deleteBuildG] = useMutation(DELETE_BUILD);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showRemoveDeleted, setShowRemoveDeleted] = useState(false);
    const [buildSelected, setBuildSelected] = useState<IBuild>();
    const [name, setName] = useState("");
    const [notes, setNotes] = useState("");
    const [category, setCategory] = useState("");
    const [componentsSelected, setComponentsSelected] = useState<Array<number>>([]);
    const handleComponentChange = (componentId: number, isChecked: boolean) => {
        console.log(isChecked);
        if (isChecked) {
            console.log("Checked")
            // Agregar el ID al estado si el checkbox está marcado
            setComponentsSelected(prev => [...prev, componentId]);
        } else {
            console.log("UnChecked")
            // Remover el ID del estado si el checkbox está desmarcado
            setComponentsSelected(prev => prev.filter(id => id !== componentId));
        }
        console.log(componentsSelected);
    };

    useEffect(() => {
        refetch();
    }, []);

    function handleShowEdit() {
        setShowEdit(!showEdit)
    }

    function handleShowDelete() {
        setShowDelete(!showDelete);
    }

    function handleShowRemoveDeleted() {
        setShowRemoveDeleted(!showRemoveDeleted);
    }

    async function removeDeletedComponents() {
        try {
            const updateBuild: BuildInputType = {
                notes: buildSelected?.notes || notes,
                category: buildSelected?.category || category,
                name: buildSelected?.name || name,
                componentsIds: componentsSelected
            };
            await updateBuildG({variables: {id: buildSelected?.id, build: updateBuild}});
            setBuilds(prevBuild =>
                prevBuild.map(build => {
                    if (build.id === buildSelected?.id) {
                        let newBuild = {...build};
                        newBuild.buildsComponents = newBuild.buildsComponents.filter((buildComponent) => {
                            return !buildComponent.component.deleted;
                        });
                        newBuild.deleted = false;
                        let totalPrice = 0;
                        newBuild.buildsComponents.forEach((buildComponent) => {
                            totalPrice += buildComponent.component.price;
                        })
                        newBuild.totalPrice = totalPrice;
                        return newBuild;
                    }
                    return build;
                }));
        } catch (error) {
            console.log(error);
        }
        handleShowRemoveDeleted();
    }

    async function updateBuild(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            const updateBuild: BuildInputType = {
                notes: notes,
                category: category,
                name: name,
                componentsIds: componentsSelected
            };
            await updateBuildG({variables: {id: buildSelected?.id, build: updateBuild}});
            setBuilds(prevBuild =>
                prevBuild.map(build => {
                    if (build.id === buildSelected?.id) {
                        let newBuild = {...build};
                        if (name !== "") {
                            newBuild.name = name;
                        }
                        if (notes !== "") {
                            newBuild.notes = notes;
                        }
                        if (category !== "") {
                            newBuild.category = category;
                        }
                        if (componentsSelected.length !== 0) {
                            newBuild.buildsComponents = newBuild.buildsComponents.filter((buildComponent) => {
                                return componentsSelected.includes(buildComponent.component.id);
                            });
                        } else {
                            newBuild.buildsComponents = [];
                        }
                        newBuild.deleted = false;
                        let totalPrice = 0;
                        newBuild.buildsComponents.forEach((buildComponent) => {
                            totalPrice += buildComponent.component.price;
                        })
                        newBuild.totalPrice = totalPrice;
                        return newBuild;
                    }
                    return build;
                }));
        } catch (error) {
            console.log(error);
        }
        handleShowEdit()
    }

    async function deleteBuild() {
        try {
            await deleteBuildG({variables: {id: buildSelected?.id}});
            setBuilds([...builds.map((build) => {
                if (build.id === buildSelected?.id) {
                    return {...build, deleted: true};
                }
                return build;
            })]);
        } catch (error) {
            console.log(error)
        }
        handleShowDelete()
    }

    if (loadingBuilds) {
        return <div>Loading data...</div>;
    }

    if (errorBuilds) {
        return <div>Error: {errorBuilds.message}</div>;
    }

    if (!builds) {
        return <div>Data is not fully loaded yet.</div>;
    }

    const categoryList = [
        {label: "Gaming", value: "Gaming"},
        {label: "Budget", value: "Budget"},
        {label: "Work", value: "Work"}
    ];

    return (
        <Col>
            <Container fluid>
                <Row className="m-4 mb-2">
                    <Col>
                        <h1 style={{color: (darkMode) ? "white" : "black"}}>Builds</h1>
                    </Col>
                </Row>
                <Row className="m-5 mt-3">
                    <Accordion data-bs-theme={(darkMode) ? "dark" : "light"}>
                        {
                            builds.map((build: any, index: number) => {
                                return (
                                    <Accordion.Item eventKey={"" + index} style={{
                                        color: (build.deleted) && "gray"
                                    }}>
                                        <Accordion.Header>
                                            <Col style={{
                                                color: (build.deleted) && "gray"
                                            }}>
                                                {build.name}
                                            </Col>
                                            <Col style={{
                                                color: (build.deleted) && "gray"
                                            }}>
                                                {(build.deleted) && "Deleted"}
                                            </Col>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <Container fluid>
                                                <Row>
                                                    <Col xs={3}>
                                                        <Container fluid>
                                                            <Row className={"mb-3"}>
                                                                <Col style={{
                                                                    wordWrap: "break-word"
                                                                }}>
                                                                    <h3>{build.notes}</h3>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col>
                                                                    <h4>Category: {build.category}</h4>
                                                                </Col>
                                                            </Row>
                                                            <Row className={"mb-3"}>
                                                                <Col>
                                                                    <h4>Total Price: {build.totalPrice} €</h4>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col>
                                                                    <Button className={"mb-3"} style={{width: "10vw"}}
                                                                            variant="danger"
                                                                            onClick={() => {
                                                                                setBuildSelected(build);
                                                                                handleShowDelete()
                                                                            }} disabled={build.deleted}>
                                                                        Delete
                                                                    </Button>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col>
                                                                    <Button className={"mb-3"} style={{width: "10vw"}}
                                                                            variant="info" onClick={() => {
                                                                        setBuildSelected(build);
                                                                        setName(build.name);
                                                                        setNotes(build.notes);
                                                                        setCategory(build.category);
                                                                        setComponentsSelected(build.buildsComponents.map((buildComponent: IBuildComponent) => {
                                                                            return buildComponent.component.id;
                                                                        }));
                                                                        handleShowEdit();
                                                                    }}>
                                                                        Edit
                                                                    </Button>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col>
                                                                    <Button style={{width: "10vw"}}
                                                                            variant="warning"
                                                                            onClick={() => {
                                                                                setBuildSelected(build);
                                                                                setName(build.name);
                                                                                setNotes(build.notes);
                                                                                setCategory(build.category);
                                                                                setComponentsSelected(build.buildsComponents
                                                                                    .filter((buildComponent: IBuildComponent) => !buildComponent.component.deleted)
                                                                                    .map((buildComponent: IBuildComponent) => buildComponent.component.id)
                                                                                );
                                                                                handleShowRemoveDeleted();
                                                                            }} disabled={!build.buildsComponents.some((buildComponent: IBuildComponent) => buildComponent.component.deleted)}>
                                                                        Remove Deleted Components
                                                                    </Button>
                                                                </Col>
                                                            </Row>
                                                        </Container>
                                                    </Col>
                                                    <Col xs={9}>
                                                        <Container fluid>
                                                            <Row>
                                                                {
                                                                    build.buildsComponents?.map((buildComponent: IBuildComponent, index: number) => {
                                                                        return (
                                                                            <Col xs={4} className={"mb-3"} style={{
                                                                                color: (buildComponent.component.deleted) ? "gray" : (darkMode) ? "white" : "black"
                                                                            }}>
                                                                                <Container fluid>
                                                                                    <Row>
                                                                                        <Col>
                                                                                            <ImgViewer
                                                                                                filename={buildComponent.component.image}/>
                                                                                        </Col>
                                                                                        <Col>
                                                                                            <h4>{buildComponent.component.name}</h4>
                                                                                            <h5>{buildComponent.component.price} €</h5>
                                                                                            <h5>{buildComponent.component.description}</h5>
                                                                                        </Col>
                                                                                    </Row>
                                                                                </Container>
                                                                            </Col>
                                                                        )
                                                                    })
                                                                }
                                                            </Row>
                                                        </Container>
                                                    </Col>
                                                </Row>
                                            </Container>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                );
                            })
                        }
                    </Accordion>
                </Row>
                <Modal show={showEdit} onHide={handleShowEdit} data-bs-theme={(darkMode) ? "dark" : "light"}>
                    <Modal.Header closeButton>
                        <Modal.Title
                            style={{color: (darkMode) ? "white" : "black"}}>Edit {buildSelected?.name}</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={updateBuild}>
                        <Modal.Body>
                            <Form.Group className={"mb-4"}>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    placeholder="Insert the name"
                                    maxLength={20}
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className={"mb-4"}>
                                <Form.Control
                                    type="text"
                                    name="notes"
                                    placeholder="Insert the notes"
                                    maxLength={255}
                                    value={notes}
                                    onChange={(event) => setNotes(event.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className={"mb-4"}>
                                <Form.Select
                                    defaultValue={buildSelected !== undefined ? buildSelected.category : ""}
                                    aria-label="Category" value={category} onChange={(event) => {
                                    setCategory(event.target.value)
                                }}>
                                    <option>Choose Category</option>
                                    {
                                        categoryList.map((category) => {
                                            return (
                                                <option value={category.value}>{category.label}</option>
                                            )
                                        })
                                    }
                                </Form.Select>
                            </Form.Group>
                            <Form.Group style={{
                                color: (darkMode) ? "white" : "black"
                            }}>
                                <h4>Choose Components</h4>
                                {buildSelected?.buildsComponents.map((builComponent, index) => {
                                    if (builComponent.component.deleted) {
                                        return (
                                            <Form.Check
                                                key={builComponent.component.id} // Usa un key único para cada checkbox basado en el ID del componente
                                                type="checkbox"
                                                label={builComponent.component.name}
                                                value={builComponent.component.id}
                                                disabled={true} // Deshabilita el checkbox si el componente está marcado como eliminado
                                                onChange={e => handleComponentChange(builComponent.component.id, e.target.checked)}
                                                checked={componentsSelected.includes(builComponent.component.id)} // Marca el checkbox si el ID ya está en el estado
                                            />
                                        );
                                    }
                                    return (
                                        <Form.Check
                                            key={builComponent.component.id} // Usa un key único para cada checkbox basado en el ID del componente
                                            type="checkbox"
                                            label={builComponent.component.name}
                                            value={builComponent.component.id}
                                            onChange={e => handleComponentChange(builComponent.component.id, e.target.checked)}
                                            checked={componentsSelected.includes(builComponent.component.id)} // Marca el checkbox si el ID ya está en el estado
                                        />
                                    );
                                })}
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="outline-secondary" onClick={handleShowEdit}>
                                Close
                            </Button>
                            <Button variant="info" type="submit">
                                Update Build
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
                <Modal show={showDelete} onHide={handleShowDelete} data-bs-theme={(darkMode) ? "dark" : "light"}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{color: (darkMode) ? "white" : "black"}}>Are you sure?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{color: (darkMode) ? "white" : "black"}}>Are you sure you want to
                        delete {buildSelected?.name} ?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-secondary" onClick={handleShowDelete}>
                            Close
                        </Button>
                        <Button variant="danger" onClick={deleteBuild}>
                            Delete Build
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={showRemoveDeleted} onHide={handleShowRemoveDeleted} data-bs-theme={(darkMode) ? "dark" : "light"}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{color: (darkMode) ? "white" : "black"}}>Are you sure?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{color: (darkMode) ? "white" : "black"}}>Are you sure you want to
                        remove the deleted components from {buildSelected?.name}?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-secondary" onClick={handleShowDelete}>
                            Close
                        </Button>
                        <Button variant="warning" onClick={removeDeletedComponents}>
                            Remove Deleted Components
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </Col>
    );
    /*
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
                                                           <Col xs={12}>
                                                               <h4>{component.component.name}</h4>
                                                               <h5>{component.component.description}</h5>
                                                               <h5>Price: {component.component.price}€</h5>
                                                           </Col>
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
                           )
                       })
                   }
               </Accordion>
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
   */
}
export default Builds;
