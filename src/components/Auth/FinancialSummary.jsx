import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';

const FinancialSummary = () => {
  const totalIncome = 5000;  // Aquí podrías obtener los datos de Firebase o de un backend
  const totalExpenses = 2500; 
  const remainingBudget = totalIncome - totalExpenses;

  return (
    <Card>
      <Card.Body>
        <Card.Title>Resumen Financiero</Card.Title>
        <ListGroup variant="flush">
          <ListGroup.Item>Ingresos: ${totalIncome}</ListGroup.Item>
          <ListGroup.Item>Gastos: ${totalExpenses}</ListGroup.Item>
          <ListGroup.Item>Saldo Restante: ${remainingBudget}</ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default FinancialSummary;
