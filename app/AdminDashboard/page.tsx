"use client";

import { useState } from "react";

const tabs = ["Dashboard", "Products", "Orders", "Users"];

const sampleProducts = [
  { name: "Swarna Champa", price: "₹120", stock: 50 },
  { name: "Loban Dhoop", price: "₹90", stock: 30 },
  { name: "Camphor Tablets", price: "₹70", stock: 80 },
  { name: "Puja Thali Set", price: "₹250", stock: 15 },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = sampleProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f9f1dd] text-gray-900 font-sans p-4">
      {/* Header */}
      <header className="bg-gradient-to-r from-yellow-400 to-red-500 text-white px-6 py-4 rounded-md shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wide">AGARBATI Admin</h1>
        <nav className="flex space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1 rounded-md font-medium transition ${
                activeTab === tab
                  ? "bg-white text-red-600"
                  : "hover:bg-white hover:text-red-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </header>

      {/* Main Content */}
      <main className="mt-8">
        {activeTab === "Dashboard" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardCard title="Total Products" value={sampleProducts.length} />
            <DashboardCard title="Pending Orders" value="8" />
            <DashboardCard title="Total Users" value="127" />
            <DashboardCard title="Revenue (This Month)" value="₹14,500" />
          </div>
        )}

        {activeTab === "Products" && (
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Product Management</h2>
              <input
                type="text"
                placeholder="Search products..."
                className="px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredProducts.map((product, idx) => (
                <div key={idx} className="bg-white rounded-xl p-4 shadow-md">
                  <h3 className="text-lg font-semibold text-red-600">{product.name}</h3>
                  <p className="text-sm text-gray-700">Price: {product.price}</p>
                  <p className="text-sm text-gray-700">Stock: {product.stock}</p>
                  <div className="flex gap-2 mt-3">
                    <button className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-3 py-1 rounded-md">
                      Edit
                    </button>
                    <button className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded-md">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "Orders" && (
          <section>
            <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold">Order ID</th>
                    <th className="px-4 py-2 text-left font-semibold">Customer</th>
                    <th className="px-4 py-2 text-left font-semibold">Amount</th>
                    <th className="px-4 py-2 text-left font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="px-4 py-2">ORD12345</td>
                    <td className="px-4 py-2">Rahul Sharma</td>
                    <td className="px-4 py-2">₹420</td>
                    <td className="px-4 py-2 text-green-600 font-medium">Shipped</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2">ORD12346</td>
                    <td className="px-4 py-2">Meena K.</td>
                    <td className="px-4 py-2">₹650</td>
                    <td className="px-4 py-2 text-yellow-600 font-medium">Pending</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === "Users" && (
          <section>
            <h2 className="text-xl font-bold mb-4">User List</h2>
            <div className="bg-white rounded-lg shadow-md p-4">
              <ul className="space-y-2">
                <li className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">Anjali Verma</span>
                  <span className="text-sm text-gray-600">anjali@email.com</span>
                </li>
                <li className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">Rakesh Singh</span>
                  <span className="text-sm text-gray-600">rakesh@email.com</span>
                </li>
              </ul>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

const DashboardCard = ({ title, value }: { title: string; value: string | number }) => (
  <div className="bg-white rounded-xl p-6 shadow-md">
    <h2 className="text-lg font-semibold text-gray-700 mb-2">{title}</h2>
    <p className="text-3xl font-bold text-red-600">{value}</p>
  </div>
);

export default AdminDashboard;
