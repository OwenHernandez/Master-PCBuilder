import React, { useEffect, useState } from 'react'
import { Doughnut, Line } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LineElement, LinearScale, PointElement, Title } from 'chart.js/auto';
import "../Styles/Home.css"
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import CountUp from 'react-countup';
import axios from 'axios';
import { useAppContext } from '../Context/AppContextProvider';


Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
Chart.register(ArcElement, Tooltip, Legend);



type Props = {}
const data = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1,
    },
  ],
};
const dataLine = {
  labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
  datasets: [
    {
      label: 'Ventas en 2024 (en miles)',
      data: [65, 59, 80, 81, 56],
      fill: false,
      backgroundColor: 'rgb(75,192,192)',
      borderColor: 'rgba(75,192,192,0.2)',
    },
  ],
};

const options = {
  scales: {
    y: {
      beginAtZero: true
    }
  },
  maintainAspectRatio: false
};

const Home = (props: Props) => {
  const { token } = useAppContext();
  const [users, setUsers] = useState([]);
  const [builds, setBuilds] = useState([]);
  const [components, setComponents] = useState([]);
  useEffect(() => {
    async function getData() {
      const responseUsers = await axios.get('http://localhost:8080/api/v2/users', { headers: { "Authorization": "Bearer " + token } })
      const responseBuilds = await axios.get('http://localhost:8080/api/v3/builds', { headers: { "Authorization": "Bearer " + token } })
      const responseComponents = await axios.get('http://localhost:8080/api/v2/components', { headers: { "Authorization": "Bearer " + token } })
      setUsers(responseUsers.data);
      setBuilds(responseBuilds.data);
      setComponents(responseComponents.data);
    }
    getData();
  }, [])
  return (
    <div style={{ width: "100%" }}>
      <Row >
        <Row style={{ justifyContent: "space-around", marginTop: "2%", marginBottom: "5%  " }}> {/* Modificado aquí */}
          <Col xs={12} md={3}> {/* Ajuste de ancho de columna */}
            <Card style={{ width: '100%' }}> {/* Ajuste de ancho de Card */}
              <Card.Body>
                <Card.Title>Total Users</Card.Title>
                <Card.Text>
                  <CountUp start={0} end={users.length} />
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={3}>
            <Card style={{ width: '100%' }}>
              <Card.Body>
                <Card.Title>Total Builds</Card.Title>
                <Card.Text>
                  <CountUp start={0} end={builds.length} />
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={3}>
            <Card style={{ width: '100%' }}>
              <Card.Body>
                <Card.Title>Total Components</Card.Title>
                <Card.Text>
                  <CountUp start={0} end={components.length} />
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row style={{ justifyContent: "space-around" }}>
          <Col xs={12} md={3} style={{ width: "60%" }}><Line data={dataLine} options={options} /></Col>
          <Col xs={12} md={9} className='doughnut'><Doughnut data={data} /></Col>
        </Row>
      </Row>
    </div>
  )
}

export default Home