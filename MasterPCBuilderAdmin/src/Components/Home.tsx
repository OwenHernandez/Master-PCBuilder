import React, {useEffect, useState} from 'react';
import {Doughnut, Bar} from 'react-chartjs-2'; // Cambiado de Line a Bar
import {Chart, ArcElement, Tooltip, Legend, CategoryScale, BarElement, LinearScale, Title} from 'chart.js/auto'; // Asegúrate de registrar BarElement
import {Card, Col, Row, Button, Container} from 'react-bootstrap';
import CountUp from 'react-countup';
import axios from 'axios';
import {useAppContext} from '../Context/AppContextProvider';
import {gql, useQuery} from "@apollo/client";
import {UserType} from "../Type/User";
import {GET_BUILDS, GET_COMPONENTS, GET_SELLERS, GET_USERS} from "../Querys/Querys";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend); // Registra BarElement en lugar de LineElement
Chart.register(ArcElement, Tooltip, Legend);

export interface IPriceHistory {
    date: number;
    ebayPrice: number;
    amazonPrice: number;
    price: number;
}

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
    userNick: string;
    wished?: boolean;
    priceHistory: Array<IPriceHistory>;
    deleted: boolean
}

export interface IBuildComponent {
    dateCreated: string;
    priceAtTheTime: number;
    component: IComponentType;
}

export interface IBuild {
    name: string;
    category: string;
    id: number;
    notes: string;
    totalPrice: number;
    userNick: string;
    buildsComponents: IBuildComponent[];
    deleted: boolean;
}

const Home = () => {
    const {token, darkMode} = useAppContext();
    const [users, setUsers] = useState([]);
    const [builds, setBuilds] = useState([]);
    const [components, setComponents] = useState<Array<IComponentType>>([]);
    const {loading, error, data: dataUsers} = useQuery(GET_USERS, {
        onCompleted: () => {
            setUsers(dataUsers?.users);
        }
    });
    const {loading: loadingComponents, error: errorComponents, data: dataComponents} = useQuery(GET_COMPONENTS, {
        onCompleted: () => {
            setBuilds(dataComponents?.components);
        }
    });
    const {loading: loadingBuilds, error: errorBuilds, data: dataBuilds} = useQuery(GET_BUILDS, {
        onCompleted: () => {
            setBuilds(dataBuilds?.builds);
        }
    });
    const {loading: loadingSeller, error: errorSeller, data: dataSeller} = useQuery(GET_SELLERS);
    const [compType, setCompType] = useState<Array<string>>([]);
    const [selectedCompType, setSelectedCompType] = useState("All");
    const [dataLine, setDataLine] = useState({
        labels: [] as string[],
        datasets: [
            {
                label: 'eBay Prices',
                data: [] as number[],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
            },
            {
                label: 'Amazon Prices',
                data: [] as number[],
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
            },
            {
                label: 'App Prices',
                data: [] as number[],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            }
        ]
    });
    const [sellersData, setSellersData] = useState<{
        labels: string[],
        datasets: { label: string, data: number[], backgroundColor: string[], hoverBackgroundColor: string[] }[]
    }>({
        labels: [],
        datasets: [{
            label: 'Components per Seller',
            data: [],
            backgroundColor: [],
            hoverBackgroundColor: []
        }]
    });
    const [locura, setLocura] = useState(false)

    useEffect(() => {
        setComponents(dataComponents?.components || []);
        if (Array.isArray(components)) {
            let auxCompType: any[] = [];
            let priceData = {
                labels: [] as string[],
                ebay: [] as { max: number, min: number }[],
                amazon: [] as { max: number, min: number }[],
                app: [] as { max: number, min: number }[]
            };

            if (components && Array.isArray(components)) {  // Check if components is truly an array
                components.forEach(component => {
                    priceData.labels.push(component.name);
                    let ebayMax = Number.MIN_VALUE;
                    let amazonMax = Number.MIN_VALUE;
                    let appMax = Number.MIN_VALUE;
                    let ebayMin = Number.MAX_VALUE;
                    let amazonMin = Number.MAX_VALUE;
                    let appMin = Number.MAX_VALUE;

                    component.priceHistory.forEach(({ebayPrice, amazonPrice, price}) => {
                        ebayMax = Math.max(ebayMax, ebayPrice);
                        amazonMax = Math.max(amazonMax, amazonPrice);
                        appMax = Math.max(appMax, price);
                        ebayMin = Math.min(ebayMin, ebayPrice);
                        amazonMin = Math.min(amazonMin, amazonPrice);
                        appMin = Math.min(appMin, price);
                    });

                    priceData.ebay.push({max: ebayMax, min: ebayMin});
                    priceData.amazon.push({max: amazonMax, min: amazonMin});
                    priceData.app.push({max: appMax, min: appMin});

                    if (!auxCompType.includes(component.type)) {
                        auxCompType.push(component.type);
                    }
                });

                setCompType(auxCompType);
                setDataLine({
                    labels: priceData.labels as string[],
                    datasets: [
                        {
                            label: 'Max eBay Prices',
                            data: priceData.ebay.map((e: { max: number }) => e.max) as number[],
                            borderColor: 'rgba(255, 99, 132, 1)',
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        },
                        {
                            label: 'Max Amazon Prices',
                            data: priceData.amazon.map((a: { max: number }) => a.max) as number[],
                            borderColor: 'rgba(54, 162, 235, 1)',
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        },
                        {
                            label: 'Max App Prices',
                            data: priceData.app.map((p: { max: number }) => p.max) as number[],
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        }
                    ]
                });
                const sellerCounts: Record<string, number> = {}; // Defining the type of sellerCounts
                components.forEach(component => {
                    sellerCounts[component.sellerName] = (sellerCounts[component.sellerName] || 0) + 1;
                });

                const labels: string[] = Object.keys(sellerCounts);
                const data = Object.values(sellerCounts);
                const backgroundColors = labels.map(() => `hsla(${Math.random() * 360}, 100%, 75%, 0.7)`);

                setSellersData({
                    labels,
                    datasets: [{
                        label: 'Components per Seller',
                        data,
                        backgroundColor: backgroundColors,
                        hoverBackgroundColor: backgroundColors.map(color => color.replace('0.7', '1.0'))
                    }]
                });
            } else {
                console.error('Components data is not available or not an array');
            }
        } else {
            console.error('Expected components to be an array, received:', components);
        }
        setLocura(!locura)

    }, [components]);  // Dependency array ensures useEffect runs when components data changes

    function changeGraphics(type: string | null) {
        let filteredComponents = type ? components?.filter(component => component.type === type) : components;

        let priceData: any = {
            labels: [],
            ebay: [],
            amazon: [],
            app: []
        };

        filteredComponents?.forEach(component => {
            // Solo agregamos el componente una vez al label
            priceData.labels.push(component.name);
            let ebayMax = Number.MIN_VALUE;
            let amazonMax = Number.MIN_VALUE;
            let appMax = Number.MIN_VALUE;
            let ebayMin = Number.MAX_VALUE;
            let amazonMin = Number.MAX_VALUE;
            let appMin = Number.MAX_VALUE;

            component.priceHistory.forEach(({ebayPrice, amazonPrice, price}) => {
                ebayMax = Math.max(ebayMax, ebayPrice);
                amazonMax = Math.max(amazonMax, amazonPrice);
                appMax = Math.max(appMax, price);
                ebayMin = Math.min(ebayMin, ebayPrice);
                amazonMin = Math.min(amazonMin, amazonPrice);
                appMin = Math.min(appMin, price);
            });

            priceData.ebay.push({max: ebayMax, min: ebayMin});
            priceData.amazon.push({max: amazonMax, min: amazonMin});
            priceData.app.push({max: appMax, min: appMin});
        });

        // Update chart data
        setDataLine({
            labels: priceData.labels,
            datasets: [
                {
                    label: 'Max eBay Prices',
                    data: priceData.ebay.map((e: { max: number }) => e.max),
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                },
                {
                    label: 'Max Amazon Prices',
                    data: priceData.amazon.map((a: { max: number }) => a.max),
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                },
                {
                    label: 'Max App Prices',
                    data: priceData.app.map((p: { max: number }) => p.max),
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                }
            ]
        });
    }

    if (loading || loadingComponents || loadingBuilds) {
        return <div>Loading data...</div>;
    }

    if (!users || !components || !builds) {
        return <div>Data is not fully loaded yet.</div>;
    }

    return (
        <Col>
            <Container fluid>
                <Row className="d-flex justify-content-around mt-3"
                     style={{marginBottom: "2%"}}>
                    <Col md={3} className={"mb-md-2"}>
                        <Card data-bs-theme={(darkMode) ? "dark" : "light"}>
                            <Card.Body>
                                <Card.Title>Total Users</Card.Title>
                                <Card.Text>
                                    <CountUp start={0} end={(users?.length || 0) as number}/>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3} className={"mb-md-2"}>
                        <Card data-bs-theme={(darkMode) ? "dark" : "light"}>
                            <Card.Body>
                                <Card.Title>Total Builds</Card.Title>
                                <Card.Text>
                                    <CountUp start={0} end={(builds?.length || 0) as number}/>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3} className={"mb-md-2"}>
                        <Card data-bs-theme={(darkMode) ? "dark" : "light"}>
                            <Card.Body>
                                <Card.Title>Total Components</Card.Title>
                                <Card.Text>
                                    <CountUp start={0} end={(components?.length || 0) as number}/>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row className="mb-2">
                    <Col md={9} className={"mb-2"}>
                        <Bar data={dataLine} options={{maintainAspectRatio: true, responsive: true}} data-bs-theme={(darkMode) ? "dark" : "light"}/>
                    </Col>
                    <Col md={3} className={"mb-2"}>
                        <Doughnut data={sellersData} options={{maintainAspectRatio: true, responsive: true}} data-bs-theme={(darkMode) ? "dark" : "light"}/>
                    </Col>
                </Row>
                <Row className="mb-2">
                    <Col>
                        <Button variant={(selectedCompType === "All") ? "success" : (darkMode) ? "outline-light" : "outline-dark"} style={{width: '60%'}} onClick={() => {
                            changeGraphics(null);
                            setSelectedCompType("All");
                        }}>All</Button>
                    </Col>
                    {
                        compType.map((type, index) => (
                            <Col>
                                <Button key={index} variant={(selectedCompType === type) ? "success" : (darkMode) ? "outline-light" : "outline-dark"} style={{width: '60%'}} onClick={() => {
                                    changeGraphics(type);
                                    setSelectedCompType(type);
                                }}>{type}</Button>
                            </Col>
                        ))
                    }
                </Row>
            </Container>
        </Col>
    );
}

export default Home;
