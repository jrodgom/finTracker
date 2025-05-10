import React from 'react';
import { ProgressBar } from 'react-bootstrap';

const BudgetProgressBar = () => {
  const totalIncome = 5000;
  const totalExpenses = 2500;
  const percentageUsed = (totalExpenses / totalIncome) * 100;

  return (
    <div>
      <ProgressBar now={percentageUsed} label={`${Math.round(percentageUsed)}%`} />
    </div>
  );
};

export default BudgetProgressBar;
