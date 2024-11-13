import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/logo.png";
import Input from "@mui/material/Input";
import Loading from "../../component/loading";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });



  // Handle input change
  const handleChange = (key, val) => {
    setData((prevData) => ({
      ...prevData,
      [key]: val,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8000/api/user/login/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setLoading(false);

      // Log the full response for debugging

      // Check if user data exists in the response
      if (response.data && response.data.user && response.data.user.id) {
        toast.success("Login successful!");
        localStorage.setItem("id", JSON.stringify(response.data.user.id));

        // Redirect to splash/loading screen
        navigate("/splashLoading");
      } else {
        toast.error("Login failed! No user data received.");
      }
    } catch (error) {
      setLoading(false);

      if (error.response) {
        console.error("Server Error Response:", error.response);
        toast.error(error.response.data.error || "Login failed!");
      } else if (error.request) {
        console.error("Request Error:", error.request);
        toast.error("Network error, please try again later.");
      } else {
        console.error("Unexpected Error:", error.message);
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="h-[100vh] flex justify-center items-center bg-gray-600">
      <ToastContainer position="bottom-right" />
      <div className="w-[35%] h-[80%] bg-slate-300 shadow-md rounded-lg flex flex-col items-center justify-center">
        <div className="logo flex justify-center items-center text-center">
          <img src={logo} alt="" className="w-20" />
        </div>
        <div className="heading">
          <h1 className="font-bold text-3xl">Log In</h1>
          <div className="w-12 ms-5 my-2 h-0.5 bg-zinc-700"></div>
        </div>
        <div className="flex justify-center mt-10 items-center text-center w-full">
          <form
            className="flex flex-col gap-10 justify-center items-center text-center w-full mx-16"
            onSubmit={handleLogin}
          >
            <Input
              name="email"
              type="email"
              placeholder="Enter Your Email ...."
              className="w-full"
              value={data.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            <Input
              type="password"
              name="password"
              className="w-full"
              placeholder="Enter Your Password ...."
              value={data.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
            <p className=" text-center text-sm text-gray-600 cursor-pointer">
              Don&apos;t have an account?
              <Link
                to="/signup"
                className="text-slate-800 hover:text-slate-600 font-medium transition-all duration-300 cursor-pointer"
              >
                Sign Up
              </Link>
            </p>
            <button className="bg-slate-500 px-10 py-3 rounded-lg font-bold hover:bg-slate-400 hover:text-sm">
              {loading ? <Loading /> : "Log In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
