import React, { useState, useEffect } from "react";
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
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import axios from "axios";
// Register necessary Chart.js components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const FinancialDashboard = ({
  total_income,
  total_expense,
  balance,
  recentTransactions,
  handleAddIncome,
  handleAddExpense,
  handleProfile,
  handleDelete,
  handleEdit,
}) => {
  // Set color for positive or negative balance
  const balanceColor = balance >= 0 ? "#4caf50" : "#f44336";

  // Bar chart data
  const barChartData = {
    labels: ["Total Income", "Total Expense", "Balance"],
    datasets: [
      {
        label: "Financial Status",
        data: [total_income, total_expense, balance],
        backgroundColor: ["#4CAF50", "#F44336", balanceColor],
        borderColor: ["#4CAF50", "#F44336", balanceColor],
        borderWidth: 1,
      },
    ],
  };
  const userId = JSON.parse(localStorage.getItem("id"));
  const [userEntries, setUserEntries] = useState([]);

  // Fetch User Entries
  useEffect(() => {
    const fetchUserEntries = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/getentry/${userId}`
        );
        console.log(response.data); // Check the full response structure
        if (response.data.entries) {
          setUserEntries(response.data.entries);
        } else {
          setUserEntries([]); // If no entries, set empty array
        }
      } catch (error) {
        console.error("Error fetching user entries:", error);
      }
    };

    fetchUserEntries();
  }, [userId]);

  // Pie chart data
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
    <div className="bg-gray-800 text-white min-h-screen">
      <header className="bg-gray-900 p-6 text-center">
        <h1 className="text-3xl font-bold">Financial Dashboard</h1>
      </header>

      {/* Buttons Section */}
      <div className="flex justify-center gap-4 my-4">
        <Button variant="contained" color="primary" onClick={handleAddIncome}>
          <AddCircleOutlineIcon />
          Add Income
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleAddExpense}
        >
          <AddCircleOutlineIcon />
          Add Expense
        </Button>
        <Button variant="contained" color="default" onClick={handleProfile}>
          <PersonIcon />
          Profile
        </Button>
      </div>

      <main className="container mx-auto py-10">
        {/* Top Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-gray-700 p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-center">Total Income</h3>
            <p className="text-2xl text-center">{total_income}</p>
          </div>
          <div className="bg-gray-700 p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-center">Total Expense</h3>
            <p className="text-2xl text-center">{total_expense}</p>
          </div>
          <div className="bg-gray-700 p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-center">Balance</h3>
            <p
              className={`text-2xl text-center ${
                balance >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {balance}
            </p>
          </div>
        </div>

        {/* Recent Transactions Section */}
        <div className="mt-10">
          <h3 className="text-2xl font-semibold text-center mb-6">
            Recent Transactions
          </h3>
          <div className="overflow-x-auto">
            <table className="table-auto w-full text-center mb-12 text-sm">
              <thead>
                <tr>
                  <th className="px-4 py-2 bg-gray-700">Type</th>
                  <th className="px-4 py-2 bg-gray-700">Amount</th>
                  <th className="px-4 py-2 bg-gray-700">Category</th>
                  <th className="px-4 py-2 bg-gray-700">Date</th>
                  <th className="px-4 py-2 bg-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {userEntries.length > 0 ? (
                  userEntries.map((transaction) => (
                    <tr key={transaction.entry_id}>
                      <td className="px-4 py-2 bg-gray-600">
                        {transaction.entry_type}
                      </td>
                      <td className="px-4 py-2 bg-gray-600">
                        {transaction.amount}
                      </td>
                      <td className="px-4 py-2 bg-gray-600">
                        {transaction.category ? transaction.category : "null"}
                      </td>

                      <td className="px-4 py-2 bg-gray-600">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 bg-gray-600">
                        <button
                          onClick={() => handleDelete(transaction.entry_id)}
                          className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => handleEdit(transaction)}
                          className="bg-blue-500 text-white px-2 py-1 rounded ml-2"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-2 bg-gray-600 text-center"
                    >
                      No recent transactions available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Charts Section */}
        <div className="flex flex-wrap gap-6 justify-center">
          {/* Bar Chart */}
          <div className="w-full sm:w-[48%]">
            <h3 className="text-xl font-semibold mb-2 text-center">
              Bar Chart - Financial Overview
            </h3>
            <Bar data={barChartData} options={{ responsive: true }} />
          </div>

          {/* Pie Chart */}
          <div className="w-full sm:w-[48%]">
            <h3 className="text-xl font-semibold mb-2 text-center">
              Pie Chart - Financial Breakdown
            </h3>
            <Pie data={pieChartData} options={{ responsive: true }} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default FinancialDashboard;
