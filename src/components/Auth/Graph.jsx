import React from 'react';
import { Bar } from 'react-chartjs-2';  // Si decides usar una librería de gráficos como Chart.js

const Graph = () => {
  const data = {
    labels: ['Enero', 'Febrero', 'Marzo'],  // Meses del año
    datasets: [
      {
        label: 'Ingresos',
        data: [5000, 4000, 4500],  // Datos de ingresos
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Gastos',
        data: [2500, 3000, 2700],  // Datos de gastos
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      }
    ]
  };

  return (
    <div>
      <Bar data={data} />
    </div>
  );
};

export default Graph;
