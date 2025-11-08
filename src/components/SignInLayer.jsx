import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import loginApiProvider from "../apiProvider/loginApi";
import userApiProvider from "../apiProvider/userApi";
import { setCurrentUser } from "../utils/auth";

const SignInLayer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    mobileNumber: "",
    pin: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Validate mobile number (only digits, max 10 characters)
    if (name === "mobileNumber" && !/^\d{0,10}$/.test(value)) {
      return;
    }

    // Validate PIN (only digits, max 4 characters)
    if (name === "pin" && !/^\d{0,4}$/.test(value)) {
      return;
    }

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const togglePinVisibility = () => {
    setShowPin(!showPin);
  };

  const fetchUserOnLoad = async (userId) => {
  
    try {
      if (userId) {
        const response = await userApiProvider.getUserById(userId);
        // console.log(response, "responsefghj");
        if (response.status) {
          setCurrentUser(response.response);
        }
      }
    } catch (error) {
      console.error("Failed to refresh user data on application load:", error);
    }

  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate mobile number
    if (!/^\d{10}$/.test(formData.mobileNumber)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    // Validate PIN
    if (!/^\d{4}$/.test(formData.pin)) {
      toast.error("PIN must be 4 digits");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        mobileNumber: formData.mobileNumber,
        pin: formData.pin
      };

      const response = await loginApiProvider.login(payload);
      console.log(response, "responseresponse");

      if (response && response.status) {
        const token = response.response.token;
        const user = response.response.user;

        // Store token based on remember me selection
        if (token && user) {
          sessionStorage.setItem("authToken", token);
          sessionStorage.setItem("userData", JSON.stringify(user));
          fetchUserOnLoad(user?.id);
        }

        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        console.log('Login successful, navigating to dashboard');
        // Use window.location.href for more reliable navigation
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      } else {
        toast.error(response?.response?.message || "Login failed. Please try again.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth mainpage bg-base d-flex flex-wrap">
      <div className="auth-left d-lg-block d-none">
        <div className="d-flex d-none align-items-center flex-column h-100 justify-content-center">
          <img src="assets/images/auth/auth-img.jpg" alt="" />
        </div>
      </div>
      <div className="auth-right py-32 px-24 d-flex flex-column justify-content-center">
        <div className="insidebox max-w-464-px mx-auto w-100">
          <div>
            {/* <Link to="/" className="mb-40 max-w-150-px">
             */}
            <Link to="/" className="max-w-150-px">
              <img src="assets/images/logo.png" alt="" />
            </Link>
            <h4 className="mb-12">Welcome back! GRIP Business Forum</h4>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="icon-field mb-16">
              <span className="icon top-50 translate-middle-y">
                <Icon icon="mdi:cellphone" />
              </span>
              <input
                type="tel"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                className="form-control h-56-px bg-neutral-50 radius-12"
                placeholder="Mobile Number"
                maxLength="10"
                pattern="[0-9]{10}"
                required
              />
            </div>
            <div className="position-relative mb-20">
              <div className="icon-field">
                <span className="icon top-50 translate-middle-y">
                  <Icon icon="mdi:lock" />
                </span>
                <input
                  type={showPin ? "text" : "password"}
                  name="pin"
                  value={formData.pin}
                  onChange={handleInputChange}
                  className="form-control h-56-px bg-neutral-50 radius-12"
                  placeholder="PIN"
                  maxLength="4"
                  pattern="[0-9]{4}"
                  required
                />
              </div>
              <span
                className="toggle-password ri-eye-line cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light"
                onClick={togglePinVisibility}
              >
                {/* <Icon icon={showPin ? "mdi:eye-off" : "mdi:eye"} /> */}
              </span>
            </div>
            <div className="">
              <div className="d-flex justify-content-between gap-2">
                <div className="form-check style-check d-flex align-items-center">
                  <input
                    className="form-check-input border border-neutral-300"
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    id="remember"
                  />
                  <label className="form-check-label" htmlFor="remember">
                    Remember me
                  </label>
                </div>
                <Link to="/forgot-pin" className="text-primary-600 fw-medium">
                  Forgot PIN?
                </Link>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary grip text-sm btn-sm px-12 py-16 w-100 radius-12 mt-32"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

            <div className="mt-32 text-center text-sm">
              <p className="mb-0">
                Let's grow together! Join the GRIP Business Forum{" "}
                {/* <Link to="/sign-up" className="text-primary-600 fw-semibold">
                  Register today!
                </Link> */}
              </p>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </section>
  );
};

export default SignInLayer;