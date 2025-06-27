"use client";
import React, { useState, ChangeEvent } from "react";
import { Smartphone, CreditCard, Truck } from "lucide-react";

export default function PaymentPage() {
  const [method, setMethod] = useState<string>("card");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [cvv, setCvv] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

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

  const handleCardNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.length <= 19) {
      setCardNumber(formatted);
    }
  };

  const handleExpiryDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.length <= 5) {
      setExpiryDate(formatted);
    }
  };

  const handleCvvChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 3) {
      setCvv(value);
    }
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setPhone(value);
    }
  };

  const handleSubmit = () => {
    alert("payment successfull,order created");
  };

  return (
    <div className="min-h-screen bg-yellow-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full flex overflow-hidden">
        <div className="w-2/3 p-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            Confirm order and pay
          </h2>
          <p className="text-gray-500 mt-2">
            Please make the payment, so that you can receive your product
          </p>

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
                  placeholder="Vyom Mehta"
                  className="w-full border-b border-gray-300 focus:border-yellow-400 outline-none py-2"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1 text-sm">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="9876543210"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="w-full border-b border-gray-300 focus:border-yellow-400 outline-none py-2"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-600 mb-1 text-sm">
                  Address
                </label>
                <input
                  type="text"
                  placeholder="123 MG Road, Flat 201"
                  className="w-full border-b border-gray-300 focus:border-yellow-400 outline-none py-2"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1 text-sm">
                  Country
                </label>
                <select className="w-full border-b border-gray-300 focus:border-yellow-400 outline-none py-2 bg-transparent">
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-600 mb-1 text-sm">
                  State
                </label>
                <select className="w-full border-b border-gray-300 focus:border-yellow-400 outline-none py-2 bg-transparent">
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-600 mb-1 text-sm">City</label>
                <input
                  type="text"
                  placeholder="Mumbai"
                  className="w-full border-b border-gray-300 focus:border-yellow-400 outline-none py-2"
                />
              </div>
            </div>
          </section>

          <section className="mt-8">
            <h3 className="text-gray-700 font-medium mb-4 uppercase text-sm">
              Payment Methods
            </h3>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setMethod("card")}
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
                onClick={() => setMethod("cod")}
                className={`flex items-center px-4 py-2 border rounded-lg transition ${
                  method === "cod"
                    ? "bg-yellow-100 border-yellow-400"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Truck size={18} className="mr-2 text-gray-600" /> Cash on
                Delivery
              </button>
              <button
                type="button"
                onClick={() => setMethod("upi")}
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
                        placeholder="Vyom Mehta"
                        className="w-full border-b border-gray-300 focus:border-yellow-400 outline-none py-2"
                      />
                    </div>
                    <div className="flex space-x-4">
                      <div className="flex-1">
                        <label className="block text-gray-600 mb-1 text-sm">
                          Card number
                        </label>
                        <input
                          type="text"
                          placeholder="•••• •••• •••• ••••"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          className="w-full border-b border-gray-300 focus:border-yellow-400 outline-none py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-600 mb-1 text-sm">
                          Expiry date
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={expiryDate}
                          onChange={handleExpiryDateChange}
                          className="w-24 border-b border-gray-300 focus:border-yellow-400 outline-none py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-600 mb-1 text-sm">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="•••"
                          value={cvv}
                          onChange={handleCvvChange}
                          className="w-20 border-b border-gray-300 focus:border-yellow-400 outline-none py-2"
                        />
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
                      className="w-full border-b border-gray-300 focus:border-yellow-400 outline-none py-2"
                    />
                  </div>
                )}
              </div>
            </section>
          )}

          <div className="mt-8">
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
            >
              {method === "cod" ? "Place Order - 549 Rupees" : "Pay 549 Rupees"}
            </button>
          </div>
        </div>

        <div className="w-1/3 bg-yellow-500 text-white p-8 flex flex-col justify-between">
          <div>
            <p className="text-sm">You have to pay</p>
            <h1 className="text-4xl font-bold mt-2">
              549<span className="text-lg"> Rupees</span>
            </h1>
          </div>
          <div className="mt-6 space-y-4 text-sm">
            <div>
              <p className="uppercase opacity-75">Company</p>
              <p className="font-medium">xyz</p>
            </div>
            <div>
              <p className="uppercase opacity-75">Order number</p>
              <p className="font-medium">1266201</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
