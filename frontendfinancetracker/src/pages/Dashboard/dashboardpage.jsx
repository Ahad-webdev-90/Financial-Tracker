import React, { useEffect, useState } from "react";
import FinancialDashboard from "../../component/FinancialDashboard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [totalIncome, setTotalIncome] = useState(5000);
  const [totalExpense, setTotalExpense] = useState(3000);
  const [balance, setBalance] = useState(totalIncome - totalExpense);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [UserData, setUserData] = React.useState({});
  const [userEntries, setUserEntries] = React.useState([]);
  const [summary, setSummary] = React.useState({});
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const userId = JSON.parse(localStorage.getItem("id"));
  const incomeEntries = userEntries.filter((e) => e.entry_type === "income");
  const expenseEntries = userEntries.filter((e) => e.entry_type === "expense");

  const handleEdit = (transaction) => {
    navigate("/editentry", { state: { entry: transaction } });
  };
  const handleDelete = async (entry_id) => {
    const originalTransactions = [...recentTransactions];
    setRecentTransactions((prevTransactions) =>
      prevTransactions.filter(
        (transaction) => transaction.entry_id !== entry_id
      )
    );

    try {
      await axios.delete(`http://localhost:8000/api/deletentry/${entry_id}`);
      toast.success("Entry deleted successfully!");
    } catch (err) {
      console.error(err);
      setRecentTransactions(originalTransactions); // Revert changes on failure
      toast.error("Failed to delete entry. Please try again.");
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("id")) {
      navigate("/login");
    }
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/getuser/${userId}`
        );
        setUserData({ ...response.data.user }); // Handle the response here
      } catch (error) {
        console.error("Error fetching user data:", error); // Handle errors
      }
    };
    const fetchUserEntries = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/getentry/${userId}`
        );
        setUserEntries([...response.data.entries]);
      } catch (error) {
        console.error("Error fetching user entries:", error);
      }
    };
    const getSummary = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/getsummary/${userId}`
        );
        setSummary({ ...response.data.summary });
      } catch (error) {
        console.error("Error fetching summary:", error);
      }
    };
    fetchUserData();
    fetchUserEntries();
    getSummary();
  }, [userId]);

  // Add Income
  const handleAddIncome = () => {
    navigate("/addincome");
  };

  // Add Expense
  const handleAddExpense = () => {
    navigate("/addexpense");
  };

  // Profile
  const handleProfile = () => {
    navigate("/profile");
  };

  return (
    <div>
      <FinancialDashboard
        total_income={summary.total_income}
        total_expense={summary.total_expenses}
        balance={summary.balance}
        recentTransactions={recentTransactions}
        handleAddIncome={handleAddIncome}
        handleAddExpense={handleAddExpense}
        handleProfile={handleProfile}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />
    </div>
  );
};

export default DashboardPage;
