import React, { useState } from "react";
import axios from "axios";
import logo from "../../assets/logo.png";
import Loading from "../../component/loading";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddIncomeForm = () => {
  const userId = JSON.parse(localStorage.getItem("id"));
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    userId: userId,
    amount: "",
    category: "",
  });
  const handleChange = (key, val) => {
    setData((prevData) => ({
      ...prevData,
      [key]: val,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("amount", data.amount);
    console.log("userId :" + userId);
    console.log("amount :" + formData.get("amount"));
    console.log("category :" + formData.get("category"));
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8000/api/addincome/",
        formData
      );
      setLoading(false);
      toast.success("Income added successfully");
      navigate("/");
    } catch (error) {
      console.log("error: ", error);
      setLoading(false);
      if (error.response) {
        toast.error(error.response.data.error || "Entry failed!");
      } else if (error.request) {
        toast.error("Network error, please try again later.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="bg-gray-600 min-h-screen flex items-center justify-center">
      <div className="bg-slate-300 w-[35%] h-[80%] p-8 rounded-lg shadow-lg">
        <div className="logo flex justify-center items-center text-center">
          <img src={logo} alt="" className="w-20" />
        </div>
        <h2 className="text-2xl font-semibold text-center mb-6">Add Income</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="number"
              placeholder="Enter Amount"
              onChange={(e) => handleChange("amount", e.target.value)}
              className="w-full px-4 py-2 border-b-2 border-gray-400 focus:outline-none bg-transparent"
              required
            />
          </div>
          <div>
            {loading ? (
              <button
                type="submit"
                className="w-full bg-gray-700 text-white py-2 rounded-md hover:bg-gray-600"
                aria-label="Loading"
              >
                <Loading />
              </button>
            ) : (
              <button
                type="submit"
                className="w-full bg-gray-700 text-white py-2 rounded-md hover:bg-gray-600"
                onClick={handleSubmit}
              >
                Add Income
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddIncomeForm;
