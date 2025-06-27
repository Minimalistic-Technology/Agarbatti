"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import api from "@/utils/api";
const SignUpPage = () => {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [contactError, setContactError] = useState("");
  const [error, setError] = useState("");

  // Validation functions
  const validateFirstName = (value: string) => {
    if (!value) setFirstNameError("First name is required.");
    else if (!/^[A-Za-z]+$/.test(value)) setFirstNameError("Only letters allowed.");
    else setFirstNameError("");
    setFirstName(value);
  };

  const validateLastName = (value: string) => {
    if (!value) setLastNameError("Last name is required.");
    else if (!/^[A-Za-z]+$/.test(value)) setLastNameError("Only letters allowed.");
    else setLastNameError("");
    setLastName(value);
  };

  const validateEmail = (value: string) => {
    if (!value) setEmailError("Email is required.");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      setEmailError("Invalid email address.");
    else setEmailError("");
    setEmail(value);
  };

  const validateContact = (value: string) => {
    if (!value) setContactError("Contact number is required.");
    else if (!/^\d+$/.test(value)) setContactError("Only numbers allowed.");
    else setContactError("");
    setContact(value);
  };

  const validatePassword = (value: string) => {
    const strongRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/;

    if (!value) setError("Password is required.");
    else if (!strongRegex.test(value))
      setError("Password must be 12+ characters with A-Z, a-z, 0-9, and symbol.");
    else setError("");
    setPassword(value);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !firstNameError &&
      !lastNameError &&
      !emailError &&
      !contactError &&
      !error &&
      firstName &&
      lastName &&
      email &&
      contact &&
      password
    ) {
      try {
        // First, attempt signup
        await api.post("/api/v1/auth/signup", {
          name: `${firstName} ${lastName}`,
          email,
          password,
        });
        console.log("Signup successful");
        
        router.push("/login");
      } catch (err: any) {
        if (err.response?.status === 400) {
          toast.error(
            err.response?.data?.error || "User already exists, please log in"
          );
          router.push("/login");
        } else {
          setError(err.response?.data?.error || "Failed to create account");
          toast.error(err.response?.data?.error || "Failed to create account");
        }
      }
    } else {
      toast.error(
        "Please fix the errors and complete all fields before proceeding."
      );
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!otp) {
      setError("OTP is required.");
      toast.error("Please enter the OTP.");
      return;
    }
    try {
      // Verify OTP
      //await axios.post('http://localhost:5000/api/otp/verify-otp', { email, otp });
      toast.success("Account created successfully!");
      router.push("/login");
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Invalid OTP"
      );
      toast.error(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Invalid OTP"
      );
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-[#f9f1dd] to-[#fceac4]">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border-4 border-yellow-200 overflow-hidden transition-all duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#d6a243] to-red-700  p-6 text-white text-center">
          <h1 className="text-3xl font-bold tracking-wider">
            {step === 1 ? "Create Your Sacred Account" : "Verify Your Divine OTP"}
          </h1>
          <p className="text-yellow-100 mt-1 text-sm italic">
            {step === 1
              ? "Step into the fragrant journey"
              : "Check your inbox for blessings (OTP)"}
          </p>
        </div>

        {/* Form */}
        <div className="p-8 bg-[#fffdf6]">
          {step === 1 ? (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-800 mb-1 block">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => validateFirstName(e.target.value)}
                    className="w-full p-3 border rounded-lg border-yellow-300 focus:ring-2 focus:ring-yellow-500 focus:outline-none bg-white text-gray-900"
                    required
                  />
                  {firstNameError && (
                    <p className="text-red-500 text-xs mt-1">{firstNameError}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-800 mb-1 block">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => validateLastName(e.target.value)}
                    className="w-full p-3 border rounded-lg border-yellow-300 focus:ring-2 focus:ring-yellow-500 focus:outline-none bg-white text-gray-900"
                    required
                  />
                  {lastNameError && (
                    <p className="text-red-500 text-xs mt-1">{lastNameError}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-800 mb-1 block">
                  Contact Number
                </label>
                <input
                  type="tel"
                  value={contact}
                  onChange={(e) => validateContact(e.target.value)}
                  className="w-full p-3 border rounded-lg border-yellow-300 focus:ring-2 focus:ring-yellow-500 focus:outline-none bg-white text-gray-900"
                  required
                />
                {contactError && (
                  <p className="text-red-500 text-xs mt-1">{contactError}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-800 mb-1 block">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => validateEmail(e.target.value)}
                  className="w-full p-3 border rounded-lg border-yellow-300 focus:ring-2 focus:ring-yellow-500 focus:outline-none bg-white text-gray-900"
                  required
                />
                {emailError && (
                  <p className="text-red-500 text-xs mt-1">{emailError}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-800 mb-1 block">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => validatePassword(e.target.value)}
                    className="w-full p-3 border rounded-lg border-yellow-300 focus:ring-2 focus:ring-yellow-500 focus:outline-none bg-white text-gray-900"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-yellow-700"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#d6a243] to-[#a22c29] text-white font-bold p-3 rounded-lg hover:brightness-110 transition transform hover:scale-105"
              >
                Create Account
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">
                  OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="w-full p-3 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none text-gray-900"
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#d6a243] to-[#a22c29] text-white font-bold p-3 rounded-lg hover:brightness-110 transition transform hover:scale-105"
              >
                Verify OTP
              </button>
            </form>
          )}

          <div className="text-center mt-6">
            <Link
              href="/login"
              className="text-yellow-700 font-medium hover:underline"
            >
              Already have an account? Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
