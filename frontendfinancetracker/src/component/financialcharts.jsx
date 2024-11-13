// components/financialcharts.jsx
import React from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

// Registering the necessary Chart.js components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const FinancialCharts = ({ total_income, total_expense, balance }) => {
  // Color coding for balance
  const balanceColor = balance >= 0 ? "#4caf50" : "#f44336";

  // Data for the Bar chart
  const barChartData = {
    labels: ["Total Income", "Total Expense", "Balance"],
    datasets: [
      {
        label: "Financial Status Overview",
        data: [total_income, total_expense, balance],
        backgroundColor: ["#231c4a", "#8486f5", balanceColor],
        borderColor: ["#231c4a", "#8486f5", balanceColor],
        borderWidth: 1,
      },
    ],
  };

  // Data for the Pie chart
  const pieChartData = {
    labels: ["Total Income", "Total Expense", "Balance"],
    datasets: [
      {
        data: [total_income, total_expense, balance],
        backgroundColor: ["#231c4a", "#8486f5", balanceColor],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-[#4a5568]">
        Financial Status
      </h2>

      {/* Bar Chart */}
      <div className="mb-8 w-full sm:w-[48%] mx-auto">
        <h3 className="text-xl font-semibold mb-2 text-center">
          Bar Chart - Financial Overview
        </h3>
        <Bar
          data={barChartData}
          options={{ responsive: true, maintainAspectRatio: false }}
        />
      </div>

      {/* Pie Chart */}
      <div className="w-full sm:w-[48%] mx-auto">
        <h3 className="text-xl font-semibold mb-2 text-center">
          Pie Chart - Financial Breakdown
        </h3>
        <Pie
          data={pieChartData}
          options={{ responsive: true, maintainAspectRatio: false }}
        />
      </div>
    </div>
  );
};

export default FinancialCharts;
