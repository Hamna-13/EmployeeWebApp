import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../index.css";

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    });

    if (password !== confirmPassword) {
      Toast.fire({
        icon: "error",
        title: "Passwords do not match",
      });
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/signup", {
        firstName,
        lastName,
        companyName,
        email,
        password,
      });

      Toast.fire({
        icon: "success",
        title: "Signup successful",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1600);
    } catch (err) {
      Toast.fire({
        icon: "error",
        title: err.response?.data?.message || "Signup failed. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        
        {/* Left form section with scroll */}
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12 overflow-y-auto max-h-screen">
          {/* Logo */}
          <div className="flex items-center gap-3 justify-center">
            <div className="h-9 w-9 rounded-xl bg-sky-600 grid place-items-center text-white font-bold">
              CH
            </div>
            <span className="text-lg sm:text-xl font-semibold text-gray-900">
              Core<span className="text-sky-600">Hours</span>
            </span>
          </div>

          {/* Form */}
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">Sign up</h1>

            <div className="w-full flex-1 mt-8">
              <form className="mx-auto max-w-xs" onSubmit={handleSignup}>
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full px-8 py-4 mb-4 rounded-lg bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full px-8 py-4 mb-4 rounded-lg bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Company Name"
                  className="w-full px-8 py-4 mb-4 rounded-lg bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-8 py-4 mb-4 rounded-lg bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-8 py-4 mb-4 rounded-lg bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full px-8 py-4 mb-4 rounded-lg bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="mt-2 tracking-wide font-semibold bg-sky-600 text-white w-full py-4 rounded-lg hover:bg-amber-500 flex items-center justify-center"
                >
                  <span className="ml-3">Sign Up</span>
                </button>
                <p className="mt-6 text-sm text-gray-600 text-center">
                  Already have an account?{" "}
                  <span
                    onClick={() => navigate("/login")}
                    className="text-sky-600 hover:underline cursor-pointer"
                  >
                    Login
                  </span>
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* Right side background image (unchanged) */}
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

export default Signup;
