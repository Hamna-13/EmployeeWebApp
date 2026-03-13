import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/admin/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      Swal.fire({
        icon: "success",
        title: "Admin Login Successful",
        text: "Welcome back, Admin!",
        timer: 1500,
        showConfirmButton: false,
      });

      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1600);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: err.response?.data?.message || "An error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center overflow-hidden">
      {/* Outer container (same as Login/Signup) */}
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        
        {/* Left form section */}
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          {/* Logo same as Login/Signup */}
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-sky-600 grid place-items-center text-white font-bold">
                CH
              </div>
              <span className="text-lg sm:text-xl font-semibold text-gray-900">
                Core<span className="text-sky-600">Hours</span>
              </span>
            </div>
          </div>

          {/* Form */}
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">Admin Login</h1>

            <div className="w-full flex-1 mt-8">
              <form className="mx-auto max-w-xs" onSubmit={handleLogin}>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-8 py-4 rounded-lg bg-gray-100 border border-gray-200 
                             placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="mt-5 w-full px-8 py-4 rounded-lg bg-gray-100 border border-gray-200 
                             placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="mt-5 tracking-wide font-semibold bg-sky-600 text-white w-full py-4 
                             rounded-lg hover:bg-amber-500 flex items-center justify-center"
                >
                  <span className="ml-3">Log In</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right side background image */}
        <div className="flex-1 hidden lg:flex">
          <div
            className="w-full bg-cover bg-center"
            style={{
              backgroundImage: "url('/images/forlogin2.jpg')",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
