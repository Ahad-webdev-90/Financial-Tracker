import React, { useState, useEffect } from "react";
import logo from "../../assets/logo.png";
import { toast, ToastContainer } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../../component/loading";

const Editentry = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Safely extract entry from location.state
  const entry = location.state?.entry || null;

  useEffect(() => {
    if (!entry) {
      toast.error("No entry data found. Redirecting...");
      navigate("/"); // Redirect to a fallback route
    }
  }, [entry, navigate]);

  const [expenseData, setExpenseData] = useState({
    amount: "",
    category: "",
  });

  const [incomeData, setIncomeData] = useState({
    amount: "",
  });

  const handleExpenseChange = (key, val) => {
    setExpenseData((prevData) => ({
      ...prevData,
      [key]: val,
    }));
  };

  const handleIncomeChange = (key, val) => {
    setIncomeData((prevData) => ({
      ...prevData,
      [key]: val,
    }));
  };

  const handleUpdate = async (isExpense) => {
    setLoading(true);
    const formData = new FormData();
    formData.append(
      "amount",
      isExpense ? expenseData.amount : incomeData.amount
    );
    if (isExpense) formData.append("category", expenseData.category);

    try {
      const endpoint = isExpense
        ? `http://localhost:8000/api/modifyexpensentry/${entry.entry_id}`
        : `http://localhost:8000/api/modifyincomentry/${entry.entry_id}`;

      await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setLoading(false);
      toast.success("Entry updated successfully!");
      navigate("/");
    } catch (error) {
      setLoading(false);
      if (error.response) {
        toast.error(error.response.data.error || "Update failed!");
      } else if (error.request) {
        toast.error("Network error, please try again later.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  if (!entry) return null;

  return (
    <div>
      <ToastContainer position="bottom-right" />
      <div className="bg-gray-600 min-h-screen flex items-center justify-center">
        <div className="bg-slate-300 w-[35%] h-[80%] p-8 rounded-lg shadow-lg">
          <div className="logo flex justify-center items-center text-center">
            <img src={logo} alt="" className="w-20" />
          </div>
          <h2 className="text-2xl font-semibold text-center mb-6">
            Edit Entry
          </h2>
          <form
            className="mt-8 space-y-2"
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate(entry.entry_type === "expense");
            }}
          >
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="py-1">
                <input
                  type="number"
                  placeholder="Enter Amount"
                  className="w-full px-4 py-2 border-b-2 border-gray-400 focus:outline-none bg-transparent"
                  required
                  onChange={
                    entry.entry_type === "expense"
                      ? (e) => handleExpenseChange("amount", e.target.value)
                      : (e) => handleIncomeChange("amount", e.target.value)
                  }
                />
              </div>
              {entry.entry_type === "expense" && (
                <div className="py-1">
                  <input
                    type="text"
                    placeholder="Enter Category"
                    className="w-full px-4 py-2 border-b-2 border-gray-400 focus:outline-none bg-transparent"
                    required
                    onChange={(e) =>
                      handleExpenseChange("category", e.target.value)
                    }
                  />
                </div>
              )}
            </div>
            <div>
              {loading ? (
                <button
                  type="submit"
                  className="w-full bg-gray-700 text-white py-2 rounded-md hover:bg-gray-600"
                >
                  <Loading />
                </button>
              ) : (
                <button
                  type="submit"
                  className="w-full bg-gray-700 text-white py-2 rounded-md hover:bg-gray-600"
                >
                  Edit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Editentry;
