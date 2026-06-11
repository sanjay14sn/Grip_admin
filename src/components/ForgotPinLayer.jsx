import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import loginApiProvider from "../apiProvider/loginApi";
import Lottie from "lottie-react";
import forgotPinAnimation from "../assets/lottie/forgot-pin.json";

const ForgotPinLayer = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Request OTP, 2: Verify OTP, 3: Reset PIN
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    mobileNumber: "",
    otp: "",
    pin: "",
    repin: "",
  });

  const [showPin, setShowPin] = useState(false);
  const [showRepin, setShowRepin] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validate mobile number: only digits, max 10 characters
    if (name === "mobileNumber" && !/^\d{0,10}$/.test(value)) {
      return;
    }

    // Validate OTP: only digits, max 6 characters
    if (name === "otp" && !/^\d{0,6}$/.test(value)) {
      return;
    }

    // Validate PIN & Repin: only digits, max 4 characters
    if ((name === "pin" || name === "repin") && !/^\d{0,4}$/.test(value)) {
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(formData.mobileNumber)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    try {
      const response = await loginApiProvider.forgotPinRequest({
        mobileNumber: formData.mobileNumber,
      });

      if (response && response.status) {
        toast.success(response.response?.message || "OTP sent to your registered email successfully!");
        setStep(2);
      } else {
        toast.error(response?.message || "Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("OTP send error:", error);
      toast.error(error.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(formData.otp)) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const response = await loginApiProvider.forgotPinVerify({
        mobileNumber: formData.mobileNumber,
        otp: formData.otp,
      });

      if (response && response.status) {
        toast.success(response.response?.message || "OTP verified successfully!");
        setStep(3);
      } else {
        toast.error(response?.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("OTP verify error:", error);
      toast.error(error.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPin = async (e) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(formData.pin)) {
      toast.error("PIN must be exactly 4 digits");
      return;
    }
    if (!/^\d{4}$/.test(formData.repin)) {
      toast.error("Confirm PIN must be exactly 4 digits");
      return;
    }
    if (formData.pin !== formData.repin) {
      toast.error("PINs do not match. Please verify.");
      return;
    }

    setLoading(true);
    try {
      const response = await loginApiProvider.forgotPinReset({
        mobileNumber: formData.mobileNumber,
        otp: formData.otp,
        pin: formData.pin,
      });

      if (response && response.status) {
        toast.success(response.response?.message || "PIN reset successful! Redirecting to Sign In...");
        setTimeout(() => {
          navigate("/sign-in");
        }, 2000);
      } else {
        toast.error(response?.message || "Failed to reset PIN. Please try again.");
      }
    } catch (error) {
      console.error("PIN reset error:", error);
      toast.error(error.message || "Failed to reset PIN. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth mainpage bg-base d-flex flex-wrap" style={{ backgroundImage: "none", backgroundColor: "#c02221" }}>
      <div className="auth-left d-lg-block d-none">
        <div className="d-flex align-items-center flex-column h-100 justify-content-center">
          <Lottie 
            animationData={forgotPinAnimation} 
            loop={true} 
            style={{ width: "80%", maxWidth: "500px" }} 
          />
        </div>
      </div>
      <div className="auth-right py-32 px-24 d-flex flex-column justify-content-center">
        <div className="insidebox max-w-464-px mx-auto w-100">
          
          {/* Logo */}
          <div className="mb-24 text-start">
            <Link to="/" className="max-w-150-px d-block mb-16">
              <img src="assets/images/logo.png" alt="" />
            </Link>
          </div>

          {/* Back Link */}
          <div className="mb-24">
            <Link to="/sign-in" className="text-secondary-light d-inline-flex align-items-center gap-2 text-sm fw-medium">
              <Icon icon="mdi:arrow-left" className="text-lg" /> Back to Sign In
            </Link>
          </div>

          {/* Stepper Header Indicator */}
          <div className="d-flex align-items-center justify-content-between mb-32 p-16 bg-neutral-50 radius-12 border border-neutral-100">
            <div className={`d-flex align-items-center gap-2 ${step >= 1 ? "text-primary-600 fw-semibold" : "text-secondary-light"}`}>
              <span className={`d-flex align-items-center justify-content-center radius-circle text-xs`} style={{ width: "24px", height: "24px", background: step >= 1 ? "var(--primary-50)" : "var(--neutral-100)", border: `1px solid ${step >= 1 ? "var(--primary-500)" : "var(--neutral-300)"}` }}>1</span>
              <span>Request</span>
            </div>
            <div className="h-1-px bg-neutral-200 flex-grow-1 mx-8" />
            <div className={`d-flex align-items-center gap-2 ${step >= 2 ? "text-primary-600 fw-semibold" : "text-secondary-light"}`}>
              <span className={`d-flex align-items-center justify-content-center radius-circle text-xs`} style={{ width: "24px", height: "24px", background: step >= 2 ? "var(--primary-50)" : "var(--neutral-100)", border: `1px solid ${step >= 2 ? "var(--primary-500)" : "var(--neutral-300)"}` }}>2</span>
              <span>Verify</span>
            </div>
            <div className="h-1-px bg-neutral-200 flex-grow-1 mx-8" />
            <div className={`d-flex align-items-center gap-2 ${step >= 3 ? "text-primary-600 fw-semibold" : "text-secondary-light"}`}>
              <span className={`d-flex align-items-center justify-content-center radius-circle text-xs`} style={{ width: "24px", height: "24px", background: step >= 3 ? "var(--primary-50)" : "var(--neutral-100)", border: `1px solid ${step >= 3 ? "var(--primary-500)" : "var(--neutral-300)"}` }}>3</span>
              <span>Reset</span>
            </div>
          </div>

          {step === 1 && (
            <div>
              <h4 className="mb-12">Forgot PIN</h4>
              <p className="mb-32 text-secondary-light text-lg">
                Enter your registered mobile number below, and we will send a 6-digit OTP code to your associated email.
              </p>
              <form onSubmit={handleSendOtp}>
                <div className="icon-field mb-24">
                  <span className="icon top-50 translate-middle-y">
                    <Icon icon="mdi:cellphone" />
                  </span>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    className="form-control h-56-px bg-neutral-50 radius-12"
                    placeholder="Enter Registered Mobile Number"
                    maxLength="10"
                    pattern="[0-9]{10}"
                    required
                    disabled={loading}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary grip text-sm btn-sm px-12 py-16 w-100 radius-12"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="d-flex align-items-center justify-content-center gap-2">
                      <Icon icon="line-md:loading-twotone-loop" className="text-xl" /> Sending OTP...
                    </span>
                  ) : (
                    "Send OTP Code"
                  )}
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div>
              <h4 className="mb-12">Verify OTP</h4>
              <p className="mb-32 text-secondary-light text-lg">
                An OTP has been successfully sent to the email associated with mobile number <span className="fw-semibold text-neutral-800">{formData.mobileNumber}</span>. Please enter it below.
              </p>
              <form onSubmit={handleVerifyOtp}>
                <div className="icon-field mb-24">
                  <span className="icon top-50 translate-middle-y">
                    <Icon icon="mdi:numeric" />
                  </span>
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleInputChange}
                    className="form-control h-56-px bg-neutral-50 radius-12"
                    placeholder="Enter 6-digit OTP Code"
                    maxLength="6"
                    pattern="[0-9]{6}"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="d-flex gap-16 mb-24">
                  <button
                    type="button"
                    className="btn btn-outline-secondary w-50 radius-12 py-12"
                    onClick={() => setStep(1)}
                    disabled={loading}
                  >
                    Change Number
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary grip w-50 radius-12 py-12"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="d-flex align-items-center justify-content-center gap-2">
                        <Icon icon="line-md:loading-twotone-loop" className="text-xl" /> Verifying...
                      </span>
                    ) : (
                      "Verify OTP"
                    )}
                  </button>
                </div>
                <div className="text-center">
                  <span className="text-sm text-secondary-light">
                    Didn't receive the OTP?{" "}
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="btn btn-link text-primary-600 fw-semibold p-0 text-sm align-baseline"
                      disabled={loading}
                    >
                      Resend OTP
                    </button>
                  </span>
                </div>
              </form>
            </div>
          )}

          {step === 3 && (
            <div>
              <h4 className="mb-12">Reset PIN</h4>
              <p className="mb-32 text-secondary-light text-lg">
                Create a new secure 4-digit PIN to login to your dashboard.
              </p>
              <form onSubmit={handleResetPin}>
                
                {/* New PIN field */}
                <div className="position-relative mb-20">
                  <div className="icon-field">
                    <span className="icon top-50 translate-middle-y">
                      <Icon icon="mdi:lock-open-outline" />
                    </span>
                    <input
                      type={showPin ? "text" : "password"}
                      name="pin"
                      value={formData.pin}
                      onChange={handleInputChange}
                      className="form-control h-56-px bg-neutral-50 radius-12"
                      placeholder="Enter New 4-digit PIN"
                      maxLength="4"
                      pattern="[0-9]{4}"
                      required
                      disabled={loading}
                    />
                  </div>
                  <span
                    className="cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light d-flex align-items-center"
                    onClick={() => setShowPin(!showPin)}
                  >
                    <Icon icon={showPin ? "mdi:eye-off" : "mdi:eye"} className="text-lg" />
                  </span>
                </div>

                {/* Confirm PIN field */}
                <div className="position-relative mb-32">
                  <div className="icon-field">
                    <span className="icon top-50 translate-middle-y">
                      <Icon icon="mdi:lock-check" />
                    </span>
                    <input
                      type={showRepin ? "text" : "password"}
                      name="repin"
                      value={formData.repin}
                      onChange={handleInputChange}
                      className="form-control h-56-px bg-neutral-50 radius-12"
                      placeholder="Confirm New 4-digit PIN"
                      maxLength="4"
                      pattern="[0-9]{4}"
                      required
                      disabled={loading}
                    />
                  </div>
                  <span
                    className="cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light d-flex align-items-center"
                    onClick={() => setShowRepin(!showRepin)}
                  >
                    <Icon icon={showRepin ? "mdi:eye-off" : "mdi:eye"} className="text-lg" />
                  </span>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary grip text-sm btn-sm px-12 py-16 w-100 radius-12"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="d-flex align-items-center justify-content-center gap-2">
                      <Icon icon="line-md:loading-twotone-loop" className="text-xl" /> Resetting PIN...
                    </span>
                  ) : (
                    "Reset PIN"
                  )}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </section>
  );
};

export default ForgotPinLayer;
