"use client";
import React, { useState, useEffect } from "react";
import { Smartphone, CreditCard, Truck } from "lucide-react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useForm } from "react-hook-form";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
}

interface FormData {
  fullName: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  method: "card" | "upi" | "cod";
  upiId?: string;
  cardHolderName?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
}

export default function PaymentPage() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      method: "card",
    },
  });

  const [items, setItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [codAllowed, setCodAllowed] = useState(true);

  const method = watch("method");

  const countries: string[] = [
    "India",
    "United States",
    "Canada",
    "United Kingdom",
    "Australia",
  ];

  const states: string[] = [
    "Gujarat",
    "Maharashtra",
    "Delhi",
    "Karnataka",
    "Tamil Nadu",
  ];

  useEffect(() => {
    const data = localStorage.getItem("checkoutData");
    if (data) {
      const parsed = JSON.parse(data);
      setItems(parsed.items || []);
      setSubtotal(parsed.subtotal || 0);

      // Fetch all categories and determine if all items support COD
      axios
        .get("http://localhost:5000/api/categories")
        .then((res) => {
          const categories = res.data;
          const nonCod = parsed.items.filter((item: CartItem) => {
            const cat = categories.find((c: any) => c.name === item.category);
            return !cat?.codAvailable;
          });

          setCodAllowed(nonCod.length === 0);
        })
        .catch((err) => console.error("Failed to check COD availability", err));
    }
  }, []);

  const formatCardNumber = (value: string): string => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : v;
  };

  const formatExpiryDate = (value: string): string => {
    const v = value.replace(/\D/g, "");
    return v.length >= 2 ? v.substring(0, 2) + "/" + v.substring(2, 4) : v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.length <= 19) {
      setValue("cardNumber", formatted);
    }
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.length <= 5) {
      setValue("expiryDate", formatted);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 3) {
      setValue("cvv", value);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setValue("phone", value);
    }
  };

  const onSubmit = async (data: FormData) => {
    const formattedItems = items.map((item) => ({
      productId: item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    }));

    const orderData = {
      user: {
        fullName: data.fullName,
        contact: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
      },
      paymentMethod: data.method,
      paymentDetails:
        data.method === "card"
          ? {
              cardHolderName: data.cardHolderName,
              cardNumber: data.cardNumber?.replace(/\s+/g, ""),
              expiryDate: data.expiryDate,
              cvv: data.cvv,
            }
          : data.method === "upi"
          ? {
              upiId: data.upiId,
            }
          : "cod",
      items: formattedItems,
      subtotal,
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/order",
        orderData
      );
      if (res.status === 200 || res.status === 201) {
        alert("✅ Order placed successfully!");
        localStorage.removeItem("checkoutData");
      } else {
        alert("⚠️ Order creation failed");
      }
    } catch (error) {
      console.error("❌ Order error:", error);
      alert("Something went wrong while placing the order");
    }
  };
const validateCardNumber = (value: string | undefined) => {
  if (!value) return "Card number is required";
  const strippedValue = value.replace(/\s+/g, '');
  return /^\d{16}$/.test(strippedValue) || "Invalid card number (16 digits required)";
};

const validateExpiryDate = (value: string | undefined) => {
  if (!value) return "Expiry date is required";
  
  const [month, year] = value.split('/');
  if (!month || !year || month.length !== 2 || year.length !== 2) {
    return "Invalid format (MM/YY)";
  }

  const numericMonth = parseInt(month, 10);
  const numericYear = parseInt(year, 10);
  const currentYear = new Date().getFullYear() % 100;
  const currentMonth = new Date().getMonth() + 1;

  if (numericMonth < 1 || numericMonth > 12) {
    return "Invalid month (01-12)";
  }

  if (numericYear < currentYear || (numericYear === currentYear && numericMonth < currentMonth)) {
    return "Card has expired";
  }

  return true;
};

const validateCVV = (value: string | undefined) => {
  if (!value) return "CVV is required";
  return /^\d{3,4}$/.test(value) || "CVV must be 3 or 4 digits";
};

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-yellow-50 flex items-center justify-center p-20">
        <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full flex overflow-hidden">
          <div className="w-2/3 p-8">
            <h2 className="text-2xl font-semibold text-gray-800">
              Confirm order and pay
            </h2>
            <p className="text-gray-500 mt-2">
              Please make the payment, so that you can receive your product
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
              <section className="mt-8">
                <h3 className="text-gray-700 font-medium mb-4 uppercase text-sm">
                  Billing Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-600 mb-1 text-sm">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Tushar Shukla"
                      {...register("fullName", {
                        required: "Full name is required",
                      })}
                      className="w-full border-b border-gray-300 focus:border-yellow-400 outline-none py-2 text-amber-800"
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1 text-sm">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      placeholder="9876543210"
                      {...register("phone", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: "Invalid phone number",
                        },
                      })}
                      onChange={handlePhoneChange}
                      className="w-full border-b border-gray-300 focus:border-yellow-400 outline-none py-2 text-amber-800"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-600 mb-1 text-sm">
                      Address
                    </label>
                    <input
                      type="text"
                      placeholder="123 MG Road, Flat 201"
                      {...register("address", {
                        required: "Address is required",
                      })}
                      className="w-full border-b border-gray-300 focus:border-yellow-400 outline-none py-2 text-amber-800"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.address.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1 text-sm">
                      Country
                    </label>
                    <select
                      {...register("country", {
                        required: "Country is required",
                      })}
                      className="w-full border-b border-gray-300 focus:border-yellow-400 outline-none py-2 bg-transparent text-amber-800"
                    >
                      <option value="">Select Country</option>
                      {countries.map((country) => (
                        <option
                          key={country}
                          value={country}
                          className="text-amber-800"
                        >
                          {country}
                        </option>
                      ))}
                    </select>
                    {errors.country && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.country.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1 text-sm">
                      State
                    </label>
                    <select
                      {...register("state", { required: "State is required" })}
                      className="w-full border-b border-gray-300 focus:border-yellow-400 outline-none py-2 bg-transparent text-amber-800"
                    >
                      <option value="">Select State</option>
                      {states.map((state) => (
                        <option
                          key={state}
                          value={state}
                          className="text-amber-800"
                        >
                          {state}
                        </option>
                      ))}
                    </select>
                    {errors.state && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.state.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1 text-sm">
                      City
                    </label>
                    <input
                      type="text"
                      placeholder="Mumbai"
                      {...register("city", { required: "City is required" })}
                      className="w-full border-b border-gray-300 focus:border-yellow-400 outline-none py-2 text-amber-800"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              <section className="mt-8">
                <h3 className="text-gray-700 font-medium mb-4 uppercase text-sm">
                  Payment Methods
                </h3>
                <div className="flex space-x-4 text-amber-800">
                  <button
                    type="button"
                    onClick={() => setValue("method", "card")}
                    className={`flex items-center px-4 py-2 border rounded-lg transition ${
                      method === "card"
                        ? "bg-yellow-100 border-yellow-400"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <CreditCard size={18} className="mr-2 text-gray-600" /> Bank
                    card
                  </button>
                  <button
                    type="button"
                    onClick={() => codAllowed && setValue("method", "cod")}
                    className={`flex items-center px-4 py-2 border rounded-lg transition ${
                      method === "cod"
                        ? "bg-yellow-100 border-yellow-400"
                        : "border-gray-200 hover:border-gray-300"
                    } ${!codAllowed ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={!codAllowed}
                  >
                    <Truck size={18} className="mr-2 text-gray-600" /> Cash on
                    Delivery
                  </button>

                  <button
                    type="button"
                    onClick={() => setValue("method", "upi")}
                    className={`flex items-center px-4 py-2 border rounded-lg transition ${
                      method === "upi"
                        ? "bg-yellow-100 border-yellow-400"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Smartphone size={18} className="mr-2 text-gray-600" /> UPI
                  </button>
                </div>
              </section>

              {method !== "cod" && (
                <section className="mt-8">
                  <h3 className="text-gray-700 font-medium mb-4 uppercase text-sm">
                    Payment Details
                  </h3>
                  <div className="space-y-4">
                    {method === "card" && (
                      <>
                        <div>
                          <label className="block text-gray-600 mb-1 text-sm">
                            Cardholder name
                          </label>
                          <input
                            type="text"
                            placeholder="Tushar Shukla"
                            {...register("cardHolderName", {
                              required: "Cardholder name is required",
                              pattern: {
                                value: /^[a-zA-Z\s]+$/,
                                message: "Only letters and spaces allowed",
                              },
                            })}
                            className="w-full border-b border-gray-300 focus:border-yellow-400 outline-none py-2 text-amber-800"
                          />
                          {errors.cardHolderName && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.cardHolderName.message}
                            </p>
                          )}
                        </div>
                        <div className="flex space-x-4">
                          <div className="flex-1">
                            <label className="block text-gray-600 mb-1 text-sm">
                              Card number
                            </label>
                            <input
                              type="text"
                              placeholder="•••• •••• •••• ••••"
                              {...register("cardNumber", {
                                required: "Card number is required",
                                validate: validateCardNumber,
                                onChange: handleCardNumberChange,
                              })}
                              className="w-full border-b border-gray-300 focus:border-yellow-400 outline-none py-2 text-amber-800"
                            />
                            {errors.cardNumber && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors.cardNumber.message}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-gray-600 mb-1 text-sm">
                              Expiry date
                            </label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              {...register("expiryDate", {
                                required: "Expiry date is required",
                                validate: validateExpiryDate,
                                onChange: handleExpiryDateChange,
                              })}
                              className="w-24 border-b border-gray-300 focus:border-yellow-400 outline-none py-2 text-amber-800"
                            />
                            {errors.expiryDate && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors.expiryDate.message}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-gray-600 mb-1 text-sm">
                              CVV
                            </label>
                            <input
                              type="text"
                              placeholder="•••"
                              {...register("cvv", {
                                required: "CVV is required",
                                validate: validateCVV,
                                onChange: handleCvvChange,
                              })}
                              className="w-20 border-b border-gray-300 focus:border-yellow-400 outline-none py-2 text-amber-800"
                            />
                            {errors.cvv && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors.cvv.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                    {method === "upi" && (
                      <div>
                        <label className="block text-gray-600 mb-1 text-sm">
                          UPI ID
                        </label>
                        <input
                          type="text"
                          placeholder="vyommehta@upi"
                          {...register("upiId", {
                            required:
                              method === "upi" ? "UPI ID is required" : false,
                            pattern: {
                              value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/,
                              message: "Invalid UPI ID",
                            },
                          })}
                          className="w-full border-b border-gray-300 focus:border-yellow-400 outline-none py-2 text-amber-800"
                        />
                        {errors.upiId && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.upiId.message}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </section>
              )}

              <div className="mt-8">
                <button
                  type="submit"
                  className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                >
                  {method === "cod" ? "Place Order" : "Pay"}
                </button>
              </div>
            </form>
          </div>

          <div className="w-1/3 bg-yellow-500 text-white p-8 flex flex-col justify-between">
            <div>
              <p className="text-sm">You have to pay</p>
              <h1 className="text-4xl font-bold mt-2">
                {subtotal}
                <span className="text-lg"> Rupees</span>
              </h1>
            </div>
            <div className="space-y-3 max-h-60 overflow-y-auto mt-6">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="text-sm border-b border-white/30 pb-2"
                >
                  <p className="font-medium">{item.name}</p>
                  <p>
                    ₹{item.price} × {item.quantity} = ₹
                    {item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
