import React from 'react';
//import FinancialSummary from './FinancialSummary';
//import BudgetProgressBar from './BudgetProgressBar';
//import Graph from './Graph';
import { Container, Row, Col, Button } from 'react-bootstrap';

const Homepage = () => {
  return (
    <Container className="mt-4">
      <Row>
        <Col md={3}>
          <h3>Resumen Financiero</h3>
          <FinancialSummary />
        </Col>
        <Col md={6}>
          <h3>Gráfico de Balance</h3>
          <Graph />
        </Col>
        <Col md={3}>
          <h3>Presupuesto Mensual</h3>
          <BudgetProgressBar />
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <Button variant="primary" className="w-100">
            Agregar Ingreso
          </Button>
        </Col>
        <Col>
          <Button variant="danger" className="w-100">
            Agregar Gasto
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Homepage;
