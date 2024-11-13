import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../assets/logo.png";
import Input from "@mui/material/Input";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate(); // FIX: Call useNavigate as a function
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    profileimage: null,
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataObj = new FormData();
    formDataObj.append("username", formData.username);
    formDataObj.append("email", formData.email);
    formDataObj.append("password", formData.password);
    if (formData.profileimage) {
      formDataObj.append("profileimage", formData.profileimage);
    }

    try {
      const response = await fetch("http://localhost:8000/api/user/signup/", {
        method: "POST",
        body: formDataObj,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        // Clear form after successful signup
        setFormData({
          username: "",
          email: "",
          password: "",
          profileimage: null,
        });
        navigate("/login"); // Use navigate here
      } else {
        toast.error(result.error || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="h-[100vh] flex justify-center items-center bg-gray-600">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
      <div className="w-[35%] h-[90%] bg-slate-300 shadow-md rounded-lg flex flex-col items-center justify-center">
        <div className="logo flex justify-center items-center text-center">
          <img src={logo} alt="logo" className="w-20" />
        </div>
        <div className="heading">
          <h1 className="font-bold text-3xl">Sign Up</h1>
          <div className="w-16 ms-5 my-2 h-0.5 bg-zinc-700"></div>
        </div>
        <div className="flex justify-center mt-10 items-center text-center w-full">
          <form
            className="flex flex-col gap-7 justify-center items-center text-center w-full mx-16"
            onSubmit={handleSubmit}
          >
            <Input
              name="username"
              type="text"
              placeholder="Enter Your Name ...."
              value={formData.username}
              onChange={handleInputChange}
              className="w-full"
            />
            <Input
              name="email"
              type="email"
              placeholder="Enter Your Email ...."
              value={formData.email}
              onChange={handleInputChange}
              className="w-full"
            />
            <Input
              name="password"
              type="password"
              placeholder="Enter Your password ...."
              value={formData.password}
              onChange={handleInputChange}
              className="w-full"
            />
            <Input
              type="file"
              name="profileimage"
              onChange={handleInputChange}
              className="w-full"
            />
            <p className=" text-center text-sm text-gray-600 cursor-pointer">
              Already have an account?
              <Link
                to="/Login"
                className="text-slate-800 hover:text-slate-600 font-medium transition-all duration-300 cursor-pointer"
              >
                Log in
              </Link>
            </p>
            <button
              type="submit"
              className="bg-slate-500 px-10 py-3 rounded-lg font-bold hover:bg-slate-400 hover:text-sm"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
