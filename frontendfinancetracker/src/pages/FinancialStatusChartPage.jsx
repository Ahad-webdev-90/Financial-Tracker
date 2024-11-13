// In your FinancialStatusChartPage.js
import React from "react";
import FinancialCharts from "../components/financialcharts"; // Update the path if needed

const FinancialStatusChartPage = () => {
  // Sample data for the charts
  const total_income = 5000;
  const total_expense = 3000;
  const balance = total_income - total_expense;

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center">
      <header className="bg-gray-800 w-full p-4">
        <h1 className="text-3xl font-bold text-center">Financial Overview</h1>
      </header>

      <main className="container mx-auto py-10">
        <div className="flex flex-col md:flex-row justify-center gap-6">
          <FinancialCharts
            total_income={total_income}
            total_expense={total_expense}
            balance={balance}
          />
        </div>
      </main>
    </div>
  );
};

export default FinancialStatusChartPage;
