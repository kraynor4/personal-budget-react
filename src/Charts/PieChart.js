import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js elements
ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart() {
  const [chartData, setChartData] = useState({
    datasets: [
      {
        data: [], // Initially empty
        backgroundColor: [], // Initially empty for colors
      }
    ],
    labels: [] // Initially empty
  });

  const [loading, setLoading] = useState(true); // To manage the loading state
  const [error, setError] = useState(null);     // To manage errors

  useEffect(() => {
    axios.get('http://localhost:3000/budget')
      .then(response => {
        const fetchedData = response.data.myBudget; // Access the 'myBudget' array from the response

        // Extract labels (titles), values (budgets), and colors
        const labels = fetchedData.map(item => item.title);
        const values = fetchedData.map(item => item.budget);
        const colors = fetchedData.map(item => item.color);

        setChartData({
          datasets: [
            {
              data: values, // Budgets for the Pie Chart data
              backgroundColor: colors, // Colors for each segment
            }
          ],
          labels: labels // Titles as labels for the Pie Chart
        });
      })
      .catch(error => {
        console.error("Error fetching chart data:", error);
        setError('Error fetching chart data');
      })
      .finally(() => {
        setLoading(false); // Stop loading state after data is fetched or error occurs
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Budget Pie Chart</h2>
      <Pie data={chartData} />
    </div>
  );
}

export default PieChart;
