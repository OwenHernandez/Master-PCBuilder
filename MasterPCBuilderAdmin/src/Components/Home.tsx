import React, { useEffect, useState } from 'react';
import { Doughnut, Line } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LineElement, LinearScale, PointElement, Title } from 'chart.js/auto';
import { Card, Col, Row, Button } from 'react-bootstrap';
import CountUp from 'react-countup';
import axios from 'axios';
import { useAppContext } from '../Context/AppContextProvider';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
Chart.register(ArcElement, Tooltip, Legend);

const Home = () => {
  const { token } = useAppContext();
  const [users, setUsers] = useState([]);
  const [builds, setBuilds] = useState([]);
  const [components, setComponents] = useState([]);
  const [compType, setCompType] = useState([]);
  const [priceHistory, setPriceHistory] = useState([]);
  const [dataLine, setDataLine] = useState({
    labels: [],
    datasets: [
      {
        label: 'eBay Prices',
        data: [],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
      {
        label: 'Amazon Prices',
        data: [],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
      },
      {
        label: 'App Prices',
        data: [],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      }
    ]
  });

  useEffect(() => {
    const fetchData = async () => {
      const responseUsers = await axios.get('http://localhost:8080/api/v2/users', { headers: { "Authorization": "Bearer " + token } });
      const responseBuilds = await axios.get('http://localhost:8080/api/v3/builds', { headers: { "Authorization": "Bearer " + token } });
      const responseComponents = await axios.get('http://localhost:8080/api/v2/components', { headers: { "Authorization": "Bearer " + token } });
      setUsers(responseUsers.data);
      setBuilds(responseBuilds.data);
      setComponents(responseComponents.data);
    };
    fetchData();
  }, [token]);

  useEffect(() => {
    let auxCompType:any[] = [];
    let priceData:any = {
      labels: [],
      ebay: [],
      amazon: [],
      app: []
    };
    components.forEach(component => {
      component.priceHistory.forEach(({ date, ebayPrice, amazonPrice, price }) => {
        const dateStr = new Date(date * 1000).toLocaleDateString();
        if (!priceData.labels.includes(dateStr)) {
          priceData.labels.push(dateStr);
          priceData.ebay.push({ max: ebayPrice, min: ebayPrice });
          priceData.amazon.push({ max: amazonPrice, min: amazonPrice });
          priceData.app.push({ max: price, min: price });
        } else {
          const index = priceData.labels.indexOf(dateStr);
          priceData.ebay[index].max = Math.max(priceData.ebay[index].max, ebayPrice);
          priceData.ebay[index].min = Math.min(priceData.ebay[index].min, ebayPrice);
          priceData.amazon[index].max = Math.max(priceData.amazon[index].max, amazonPrice);
          priceData.amazon[index].min = Math.min(priceData.amazon[index].min, amazonPrice);
          priceData.app[index].max = Math.max(priceData.app[index].max, price);
          priceData.app[index].min = Math.min(priceData.app[index].min, price);
        }
      });
      if (!auxCompType.includes(component.type)) {
        auxCompType.push(component.type);
      }
    });
    setCompType(auxCompType);
    // Update chart data
    setDataLine({
      labels: priceData.labels,
      datasets: [
        {
          label: 'Max eBay Prices',
          data: priceData.ebay.map(e => e.max),
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
        },
        {
          label: 'Max Amazon Prices',
          data: priceData.amazon.map(a => a.max),
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
        },
        {
          label: 'Max App Prices',
          data: priceData.app.map(p => p.max),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
        }
      ]
    });
  }, [components]);

  return (
      <div style={{ width: "100%", height: "100%" }}>
        <Row>
          {/* Layout for stats cards */}
          <Col xs={12} className="mb-4">
            <Row className="d-flex justify-content-around mt-3">
              <Col md={3}><Card><Card.Body><Card.Title>Total Users</Card.Title><Card.Text><CountUp start={0} end={users.length}/></Card.Text></Card.Body></Card></Col>
              <Col md={3}><Card><Card.Body><Card.Title>Total Builds</Card.Title><Card.Text><CountUp start={0} end={builds.length}/></Card.Text></Card.Body></Card></Col>
              <Col md={3}><Card><Card.Body><Card.Title>Total Components</Card.Title><Card.Text><CountUp start={0} end={components.length}/></Card.Text></Card.Body></Card></Col>
            </Row>
          </Col>
          {/* Layout for charts */}
          <Col xs={12}>
            <Row>
              <Col md={9}><Line data={dataLine} /></Col>
              <Col md={3}><Doughnut data={data} /></Col>
            </Row>
          </Col>
          {/* Layout for buttons based on component types */}
          <Col xs={12}>
            <Row>
              {compType.map((tipo) => (
                  <Col md={3} className="d-flex justify-content-around align-content-around mt-5">
                    <Button variant="secondary" size="lg">{tipo}</Button>
                  </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </div>
  );
}

export default Home;
