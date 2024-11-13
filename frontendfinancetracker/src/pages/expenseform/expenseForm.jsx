// // pages/AddExpenseForm.jsx
// import React, { useState } from "react";
// import axios from "axios";
// import logo from "../../assets/logo.png";
// import Loading from "../../component/loading";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// const AddExpenseForm = () => {
//   const userId = JSON.parse(localStorage.getItem("id"));
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState({
//     userId: userId,
//     amount: "",
//     category: "",
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     const formData = new FormData();
//     formData.append("userId", userId);
//     formData.append("amount", data.amount);
//     formData.append("category", data.category);
//     try {
//       setLoading(true);
//       const response = await axios.post(
//         "http://localhost:8000/api/addexpence/",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       setLoading(false);
//       toast.success("Expense added successfully");
//       navigate("/dashboard");
//     } catch (error) {
//       setLoading(false);
//       if (error.response) {
//         toast.error(error.response.data.error || "Entry failed!");
//       } else if (error.request) {
//         toast.error("Network error, please try again later.");
//       } else {
//         toast.error("An unexpected error occurred.");
//       }
//     }
//   };
//   const handleChange = (key, val) => {
//     setData((prevData) => ({
//       ...prevData,
//       [key]: val,
//     }));
//   };

//   return (
//     <div className="bg-gray-600 min-h-screen flex items-center justify-center">
//       <div className="bg-slate-300 w-[35%] h-[80%] p-8 rounded-lg shadow-lg">
//         <div className="logo flex justify-center items-center text-center">
//           <img src={logo} alt="Logo" className="w-20" />
//         </div>
//         <h2 className="text-2xl font-semibold text-center mb-6">Add Expense</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <input
//               type="number"
//               placeholder="Enter Amount"
//               onChange={(e) => handleChange("amount", e.target.value)}
//               className="w-full px-4 py-2 border-b-2 border-gray-400 focus:outline-none bg-transparent"
//               required
//             />
//           </div>
//           <div className="mb-6">
//             <input
//               type="text"
//               placeholder="Enter Category"
//               onChange={(e) => handleChange("amount", e.target.value)}
//               className="w-full px-4 py-2 border-b-2 border-gray-400 focus:outline-none bg-transparent"
//               required
//             />
//           </div>

//           {loading ? (
//             <button
//               type="submit"
//               className="w-full bg-gray-700 text-white py-2 rounded-md hover:bg-gray-600"
//               aria-label="Loading"
//             >
//               <Loading />
//             </button>
//           ) : (
//             <button
//               type="submit"
//               className="w-full bg-gray-700 text-white py-2 rounded-md hover:bg-gray-600"
//               onClick={handleSubmit}
//             >
//               Add Expense
//             </button>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// };
// export default AddExpenseForm;

import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import logo from "../../assets/logo.png";
import Loading from "../../component/loading";
import { TextField } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const AddExpenseForm = () => {
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
    formData.append("category", data.category);
    console.log("userId :" + userId);
    console.log("amount :" + formData.get("amount"));
    console.log("category :" + formData.get("category"));
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8000/api/addexpence/",
        formData
      );
      setLoading(false);
      toast.success("Expense added successfully");
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
    <div>
      <div>
        <ToastContainer position="bottom-right" />
        <div className="bg-gray-600 min-h-screen flex items-center justify-center">
          <div className="bg-slate-300 w-[35%] h-[80%] p-8 rounded-lg shadow-lg">
            <div className="logo flex justify-center items-center text-center">
              <img src={logo} alt="" className="w-20" />
            </div>
            <h2 className="text-2xl font-semibold text-center mb-6">
              Add Income
            </h2>
            <form className="mt-8 space-y-2">
              <div className="rounded-md shadow-sm -space-y-px">
                <div className="py-1">
                  <input
                    type="number"
                    placeholder="Enter Amount"
                    className="w-full px-4 py-2 border-b-2 border-gray-400 focus:outline-none bg-transparent"
                    onChange={(e) => handleChange("amount", e.target.value)}
                  />
                </div>
                <div className="py-1">
                  <input
                    type="text"
                    placeholder="Enter Category"
                    className="w-full px-4 py-2 border-b-2 border-gray-400 focus:outline-none bg-transparent"
                    onChange={(e) => handleChange("category", e.target.value)}
                  />
                </div>
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
                    Add Expense
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddExpenseForm;
