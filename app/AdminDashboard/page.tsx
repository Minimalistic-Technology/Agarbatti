"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Product {
  _id: string;
  productId: string;
  name: string;
  description: string;
  image: string;
  category: string;
  price: number;
  quantity: number;
  discountPercent?: number;
  gram: number;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  createdAt: string;
}
interface Category {
  _id: string;
  name: string;
  codAvailable: boolean;
}

interface Order {
  _id: string;
  user: {
    fullName: string;
    contact: string;
    address: string;
    city: string;
    state: string;
    country: string;
  };
  paymentMethod: string;
  paymentDetails: any;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  subtotal: number;
  status: string;
  createdAt: string;
}

interface HeroSlide {
  _id: string;
  title: string;
  subtitle: string;
  image: string;
}

type NewProduct = Omit<Product, "_id">;

const tabs = ["Dashboard", "Products", "Categories", "Orders", "Users"];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("Dashboard"); // for tab switching
  const [searchQuery, setSearchQuery] = useState(""); // product search
  const [orders, setOrders] = useState<Order[]>([]);

  const [products, setProducts] = useState<Product[]>([]); // all products
  const [editingProduct, setEditingProduct] = useState<Product | null>(null); // for edit form
  const [addingProduct, setAddingProduct] = useState(false); // toggle Add Product form
  const [edit, setEdit] = useState(false); // toggle Edit Product form
  const [newProduct, setNewProduct] = useState<NewProduct>({
    productId: "",
    name: "",
    description: "",
    image: "",
    category: "",
    price: 0,
    quantity: 0,
    discountPercent: 0,
    gram: 0,
  });

  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const [categories, setCategories] = useState<Category[]>([]);

  const totalPages = Math.ceil(users.length / usersPerPage);
  const lowStock = products.filter((p) => p.quantity < 10).length;
  const outOfStock = products.filter((p) => p.quantity === 0).length;
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const [newCategory, setNewCategory] = useState({ name: "", image: "" });
  const [editCategory, setEditCategory] = useState<Category | null>(null);

  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [formData, setFormData] = useState<Omit<HeroSlide, "_id">>({
    title: "",
    subtitle: "",
    image: "",
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const toggleOrderStatus = async (orderId: string, currentStatus: string) => {
    const isShipped = currentStatus === "shipped";
    const confirmMsg = isShipped
      ? "Mark this order as Pending again?"
      : "Is the order Shipped?";

    if (!confirm(confirmMsg)) return;

    const newStatus = isShipped ? "pending" : "shipped";

    try {
      const res = await axios.put(
        `http://localhost:5000/api/order/${orderId}`,
        {
          status: newStatus,
        }
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Failed to update order status", error);
      alert("Status update failed.");
    }
  };
  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/heroslides");
      setSlides(res.data);
    } catch (error) {
      console.error("Error fetching slides", error);
    }
  };

  const handleDeleteSlide = async (id: string) => {
    await axios.delete(`http://localhost:5000/api/heroslides/${id}`);
    fetchSlides();
  };

  const handleSubmitSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) return alert("Image upload is required");

    try {
      if (editId) {
        await axios.put(
          `http://localhost:5000/api/heroslides/${editId}`,
          formData
        );
        setEditId(null);
      } else {
        await axios.post("http://localhost:5000/api/heroslides", formData);
      }

      setFormData({ title: "", subtitle: "", image: "" });
      fetchSlides();
    } catch (err) {
      console.error("Failed to submit", err);
    }
  };

  const handleEditSlide = (slide: HeroSlide) => {
    setEditId(slide._id);
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle,
      image: slide.image,
    });
  };
  const paymentCounts = {
    cod: 0,
    card: 0,
    upi: 0,
  };
  const toggleCod = async (categoryId: string, value: boolean) => {
    try {
      await axios.put(`http://localhost:5000/api/categories/${categoryId}`, {
        codAvailable: value,
      });
      setCategories((prev) =>
        prev.map((cat) =>
          cat._id === categoryId ? { ...cat, codAvailable: value } : cat
        )
      );
    } catch (err) {
      alert("Failed to update COD status");
      console.error(err);
    }
  };
  const toggleCodForMultiple = async (ids: string[], value: boolean) => {
    try {
      await axios.put(`http://localhost:5000/api/categories/bulk-cod`, {
        categoryIds: ids,
        codAvailable: value,
      });

      // Update state locally
      setCategories((prev) =>
        prev.map((cat) =>
          ids.includes(cat._id) ? { ...cat, codAvailable: value } : cat
        )
      );
      alert(`COD ${value ? "enabled" : "disabled"} for selected categories.`);
    } catch (err) {
      console.error("Bulk COD update failed", err);
      alert("Failed to update COD in bulk.");
    }
  };

  orders.forEach((order) => {
    const method = order.paymentMethod as keyof typeof paymentCounts;
    if (paymentCounts[method] !== undefined) {
      paymentCounts[method]++;
    }
  });
  const paymentMethodData = {
    labels: ["Cash on Delivery", "Card", "UPI"],
    datasets: [
      {
        label: "Payment Methods",
        data: [paymentCounts.cod, paymentCounts.card, paymentCounts.upi],
        backgroundColor: ["#facc15", "#60a5fa", "#4ade80"], // yellow, blue, green
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/agarbatti")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Failed to fetch products", err));

    axios
      .get("http://localhost:5000/api/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Failed to fetch categories", err));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/order")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Failed to fetch orders", err));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/registered-users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Failed to fetch users", err));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/agarbatti")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Failed to fetch products", err));
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/registered-users/${id}`);
      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (err) {
      console.error("User delete failed", err);
      alert("Failed to delete user.");
    }
  };
  const handleCancelOrder = async (orderId: string) => {
    const confirmed = confirm("Are you sure you want to cancel this order?");
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:5000/api/order/${orderId}`);

      // Remove order from state
      setOrders((prev) => prev.filter((order) => order._id !== orderId));
      alert("Order cancelled successfully.");
    } catch (err) {
      console.error("Order cancellation failed", err);
      alert("Failed to cancel order.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/agarbatti/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Delete failed", error);
      alert("Failed to delete product.");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setEdit(true);
  };

  const handleCreateCategory = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/categories",
        newCategory
      );
      setCategories((prev) => [...prev, res.data]);
      setNewCategory({ name: "", image: "" });
    } catch (err) {
      alert("Failed to create category.");
      console.error(err);
    }
  };

  const handleUpdateCategory = async (id: string) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/categories/${id}`,
        editCategory
      );
      setCategories((prev) =>
        prev.map((cat) => (cat._id === id ? res.data : cat))
      );
      setEditCategory(null);
    } catch (err) {
      alert("Failed to update category.");
      console.error(err);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/categories/${id}`);
      setCategories((prev) => prev.filter((cat) => cat._id !== id));
    } catch (err) {
      alert("Failed to delete category.");
      console.error(err);
    }
  };

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
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <DashboardCard title="Total Products" value={products.length} />
              <DashboardCard title="Pending Orders" value="8" />
              <DashboardCard title="Total Users" value={users.length} />
              <DashboardCard title="Revenue (This Month)" value="₹14,500" />
              <DashboardCard title="Low Stock Items" value={lowStock} />
              <DashboardCard title="Out of Stock" value={outOfStock} />
            </div>
            <div className="mt-8 bg-white shadow-md rounded-lg p-4">
              <h2 className="text-xl font-semibold text-red-700 mb-4">
                Recent Orders
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-gradient-to-r from-yellow-100 to-red-50 border-b">
                    <tr>
                      <th className="px-4 py-2 font-semibold text-gray-700">
                        Customer
                      </th>
                      <th className="px-4 py-2 font-semibold text-gray-700">
                        Amount
                      </th>
                      <th className="px-4 py-2 font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="px-4 py-2 font-semibold text-gray-700">
                        Placed On
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orders
                      .slice(-5)
                      .reverse()
                      .map((order) => (
                        <tr key={order._id} className="hover:bg-yellow-50">
                          <td className="px-4 py-2 text-gray-800">
                            {order.user.fullName}
                          </td>
                          <td className="px-4 py-2 text-gray-800">
                            ₹{order.subtotal}
                          </td>
                          <td className="px-4 py-2">
                            <span
                              className={`text-xs font-bold px-2 py-1 rounded-full ${
                                order.status === "shipped"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-8">
              {/* Pie Chart Section */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-center text-red-700 mb-4">
                  Payment Method Distribution
                </h2>

                <div className="flex justify-center">
                  <div className="w-60 h-60">
                    {" "}
                    {/* Adjust size as needed */}
                    <Pie data={paymentMethodData} />
                  </div>
                </div>
              </div>

              {/* Category Overview Section */}
              <div>
                <h2 className="text-xl font-bold text-red-700 mb-4 text-center lg:text-left">
                  Category Overview
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {categories.map((category) => {
                    const count = products.filter(
                      (p) => p.category === category.name
                    ).length;
                    return (
                      <div
                        key={category._id}
                        className="bg-gradient-to-r from-yellow-100 to-red-50 p-4 rounded-lg shadow hover:shadow-md transition"
                      >
                        <h3 className="text-lg font-semibold text-red-700 capitalize">
                          {category.name}
                        </h3>
                        <p className="text-gray-700 mt-2 text-sm">
                          Products: {count}
                        </p>
                        <label className="flex items-center mt-2 space-x-2 text-sm">
                          <span>COD Allowed:</span>
                          <input
                            type="checkbox"
                            checked={category.codAvailable}
                            onChange={() =>
                              toggleCod(category._id, !category.codAvailable)
                            }
                          />
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="p-8 shadow-md">
                <h2 className="text-3xl font-bold mb-6 text-red-600">
                  Manage Hero Slides
                </h2>

                {/* Form */}
                {/* Slide List */}
                <div className="grid grid-cols-3 gap-6 mt-10">
                  <form
                  onSubmit={handleSubmitSlide}
                  className="bg-white shadow p-6 rounded space-y-4"
                >
                  <input
                    type="text"
                    placeholder="Title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full p-3 border rounded"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Subtitle"
                    value={formData.subtitle}
                    onChange={(e) =>
                      setFormData({ ...formData, subtitle: e.target.value })
                    }
                    className="w-full p-3 border rounded"
                    required
                  />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFormData({
                          ...formData,
                          image: reader.result as string,
                        });
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="w-full p-3 border rounded"
                    required={!editId}
                  />

                  {uploading && (
                    <p className="text-sm text-yellow-600">
                      Uploading image...
                    </p>
                  )}
                  {formData.image && (
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded border"
                    />
                  )}

                  <button
                    type="submit"
                    className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
                  >
                    {editId ? "Update Slide" : "Add Slide"}
                  </button>
                </form>
                  {slides.map((slide) => (
                    <div key={slide._id} className="border rounded p-4 shadow border-amber-700">
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-40 object-cover rounded mb-2"
                      />
                      <h3 className="font-bold text-xl">{slide.title}</h3>
                      <p className="text-gray-600">{slide.subtitle}</p>
                      <div className="mt-4 flex gap-2">
                        <button
                          className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600"
                          onClick={() => handleEditSlide(slide)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                          onClick={() => handleDeleteSlide(slide._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
          </div>
        )}

        {activeTab === "Categories" && (
          <div>
            <h2 className="text-xl font-bold text-red-700 mb-4 text-center lg:text-left">
              Category Management
            </h2>

            {/* CREATE CATEGORY */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-8">
              <h3 className="text-2xl font-bold mb-4 text-red-700">
                Manage Categories
              </h3>

              {/* Add Category Section */}
              <div className="flex flex-col md:flex-row items-center md:items-end gap-4 mb-6">
                <div className="flex flex-col w-full md:w-1/2">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Category Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Floral, Divine"
                    className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    value={newCategory.name}
                    onChange={(e) =>
                      setNewCategory((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </div>
                <button
                  className="w-full md:w-auto px-6 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition"
                  onClick={handleCreateCategory}
                >
                  + Add Category
                </button>
              </div>

              {/* Bulk COD Toggle */}
              <div className="flex flex-col sm:flex-row justify-start items-center gap-4">
                <div className="text-sm text-gray-700 font-medium">
                  Toggle COD availability for all categories:
                </div>
                <div className="flex space-x-3">
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    onClick={() => {
                      const allIds = categories.map((cat) => cat._id);
                      toggleCodForMultiple(allIds, true);
                    }}
                  >
                    Enable COD for All
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => {
                      const allIds = categories.map((cat) => cat._id);
                      toggleCodForMultiple(allIds, false);
                    }}
                  >
                    Disable COD for All
                  </button>
                </div>
              </div>
            </div>

            {/* CATEGORY LIST */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => {
                const count = products.filter(
                  (p) => p.category === category.name
                ).length;
                const isEditing = editCategory?._id === category._id;
                return (
                  <div
                    key={category._id}
                    className="bg-gradient-to-r from-yellow-100 to-red-50 p-4 rounded-lg shadow hover:shadow-md transition"
                  >
                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          className="border px-2 py-1 w-full rounded"
                          value={editCategory.name}
                          onChange={(e) =>
                            setEditCategory((prev) =>
                              prev ? { ...prev, name: e.target.value } : null
                            )
                          }
                        />
                        <div className="flex space-x-2">
                          <button
                            className="px-2 py-1 bg-blue-500 text-white rounded"
                            onClick={() => handleUpdateCategory(category._id)}
                          >
                            Save
                          </button>
                          <button
                            className="px-2 py-1 bg-gray-400 text-white rounded"
                            onClick={() => setEditCategory(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-lg font-semibold text-red-700 capitalize">
                          {category.name}
                        </h3>
                        <p className="text-gray-700 mt-2 text-sm">
                          Products: {count}
                        </p>
                        <label className="flex items-center mt-2 space-x-2 text-sm">
                          <span>COD Allowed:</span>
                          <input
                            type="checkbox"
                            checked={category.codAvailable}
                            onChange={() =>
                              toggleCod(category._id, !category.codAvailable)
                            }
                          />
                        </label>
                        <div className="mt-3 flex space-x-2">
                          <button
                            className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                            onClick={() => setEditCategory(category)}
                          >
                            Edit
                          </button>
                          <button
                            className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                            onClick={() => handleDeleteCategory(category._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "Products" && (
          <section>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 sm:gap-0 bg-gradient-to-r from-yellow-50 to-red-50 px-4 py-3 rounded-md shadow-sm border border-red-100">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-red-700 tracking-wide">
                  Product Management
                </h2>
                <button
                  onClick={() => setAddingProduct(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full text-lg font-bold shadow-md"
                  title="Add Product"
                >
                  +
                </button>
              </div>

              <input
                type="text"
                placeholder="Search products..."
                className="px-4 py-2 border border-yellow-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {editingProduct && edit && (
              <div className="mt-8 mb-8 bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-red-600">
                  Edit Product
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <label className="flex flex-col text-sm font-medium text-gray-700">
                    {" "}
                    Product Name
                    <input
                      type="text"
                      value={editingProduct.name}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          name: e.target.value,
                        })
                      }
                      className="border px-3 py-2 rounded"
                      placeholder="Product Name"
                    />{" "}
                  </label>
                  <label className="flex flex-col text-sm font-medium text-gray-700">
                    {" "}
                    Description
                    <input
                      type="text"
                      value={editingProduct.description}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          description: e.target.value,
                        })
                      }
                      className="border px-3 py-2 rounded"
                      placeholder="Description"
                    />{" "}
                  </label>
                  <label className="flex flex-col text-sm font-medium text-gray-700">
                    {" "}
                    Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setEditingProduct({
                              ...editingProduct,
                              image: reader.result as string,
                            });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="border px-3 py-2 rounded"
                    />
                    {editingProduct.image && (
                      <img
                        src={editingProduct.image}
                        alt="Preview"
                        className="mt-3 w-32 h-32 object-cover rounded-md shadow border"
                      />
                    )}
                  </label>
                  <label className="flex flex-col text-sm font-medium text-gray-700">
                    {" "}
                    Category
                    <input
                      type="text"
                      value={editingProduct.category}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          category: e.target.value,
                        })
                      }
                      className="border px-3 py-2 rounded"
                      placeholder="Category"
                    />{" "}
                  </label>
                  <label className="flex flex-col text-sm font-medium text-gray-700">
                    {" "}
                    Price
                    <input
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          price: Number(e.target.value),
                        })
                      }
                      className="border px-3 py-2 rounded"
                      placeholder="Category"
                    />{" "}
                  </label>
                  <label className="flex flex-col text-sm font-medium text-gray-700">
                    {" "}
                    Weight (in grams)
                    <input
                      type="number"
                      value={editingProduct.gram}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          gram: Number(e.target.value),
                        })
                      }
                      className="border px-3 py-2 rounded"
                      placeholder="Weight (in grams)"
                    />{" "}
                  </label>
                  <label className="flex flex-col text-sm font-medium text-gray-700">
                    {" "}
                    Quantity
                    <input
                      type="number"
                      value={editingProduct.quantity}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          quantity: Number(e.target.value),
                        })
                      }
                      className="border px-3 py-2 rounded"
                      placeholder="Quantity"
                    />{" "}
                  </label>
                  <label className="flex flex-col text-sm font-medium text-gray-700">
                    {" "}
                    Discount Percent
                    <input
                      type="number"
                      value={editingProduct.discountPercent}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          discountPercent: Number(e.target.value),
                        })
                      }
                      className="border px-3 py-2 rounded"
                      placeholder="Discount %"
                    />
                  </label>
                  <button
                    onClick={async () => {
                      try {
                        await axios.put(
                          `http://localhost:5000/api/agarbatti/${editingProduct._id}`,
                          editingProduct
                        );
                        setProducts((prev) =>
                          prev.map((p) =>
                            p._id === editingProduct._id ? editingProduct : p
                          )
                        );
                        setEditingProduct(null);
                      } catch (error) {
                        console.error("Update failed", error);
                        alert("Failed to update product.");
                      }
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md mt-2 mx-auto block text-lg"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEdit(false)}
                    className="text-gray-600 border border-gray-300  px-3 py-1 rounded-md mt-2 mx-auto block text-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            {addingProduct && (
              <div className="mt-8 mb-8 bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-green-600">
                  Add New Product
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <input
                    type="text"
                    value={newProduct.productId}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        productId: e.target.value,
                      })
                    }
                    className="border px-3 py-2 rounded"
                    placeholder="Product Id"
                  />
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    className="border px-3 py-2 rounded"
                    placeholder="Product Name"
                  />
                  <input
                    type="text"
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description: e.target.value,
                      })
                    }
                    className="border px-3 py-2 rounded"
                    placeholder="Description"
                  />
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setNewProduct({
                              ...newProduct,
                              image: reader.result as string,
                            });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="border px-3 py-2 rounded w-full"
                    />
                    {/* Image Preview */}
                    {newProduct.image && (
                      <img
                        src={newProduct.image}
                        alt="Preview"
                        className="mt-3 w-32 h-32 object-cover rounded-md shadow border"
                      />
                    )}
                  </div>

                  <select
                    value={newProduct.category}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, category: e.target.value })
                    }
                    className="border px-3 py-2 rounded"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>

                  <label className="flex flex-col">
                    Price
                    <input
                      type="number"
                      value={newProduct.price}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          price: Number(e.target.value),
                        })
                      }
                      className="border px-3 py-2 rounded"
                      placeholder="Price"
                    />
                  </label>
                  <label className="flex flex-col">
                    Weight (in grams)
                    <input
                      type="number"
                      value={newProduct.gram}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          gram: Number(e.target.value),
                        })
                      }
                      className="border px-3 py-2 rounded"
                      placeholder="Weight (in grams)"
                    />
                  </label>
                  <label className="flex flex-col">
                    Discount Percent
                    <input
                      type="number"
                      value={newProduct.discountPercent}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          discountPercent: Number(e.target.value),
                        })
                      }
                      className="border px-3 py-2 rounded"
                      placeholder="Discount %"
                    />
                  </label>
                  <label className="flex flex-col">
                    Quantity
                    <input
                      type="number"
                      value={newProduct.quantity}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          quantity: Number(e.target.value),
                        })
                      }
                      className="border px-3 py-2 rounded"
                      placeholder="Quantity"
                    />
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={async () => {
                        try {
                          const res = await axios.post(
                            "http://localhost:5000/api/agarbatti",
                            newProduct
                          );
                          setProducts((prev) => [...prev, res.data]);
                          setNewProduct({
                            productId: "",
                            name: "",
                            description: "",
                            image: "",
                            category: "",
                            price: 0,
                            quantity: 0,
                            discountPercent: 0,
                            gram: 0,
                          });
                          setAddingProduct(false);
                        } catch (error) {
                          console.error("Create failed", error);
                          alert("Failed to create product.");
                        }
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md mt-2"
                    >
                      Add Product
                    </button>
                    <button
                      onClick={() => setAddingProduct(false)}
                      className="text-gray-600 border border-gray-300 px-4 py-2 rounded-md mt-2"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredProducts.map((product, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-yellow-50 to-red-50 border border-red-200 rounded-xl p-4 shadow-sm hover:shadow-lg hover:scale-[1.01] transition duration-300"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-lg mb-3 border border-red-100 shadow-sm"
                    loading="lazy"
                  />
                  <h3 className="text-xl font-bold text-red-700 tracking-wide mb-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-700 mb-1">
                    <span className="font-medium text-gray-800">
                      Product ID:
                    </span>{" "}
                    {product.productId}
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    <span className="font-medium text-gray-800">Category:</span>{" "}
                    {product.category}
                  </p>
                  <p className="text-sm text-gray-500 mb-1 line-clamp-2">
                    <span className="font-medium text-gray-800">
                      Description:
                    </span>{" "}
                    {product.description}
                  </p>
                  <div className="flex gap-2">
                    <p className="text-sm text-gray-800 mb-1">
                      <span className="font-medium text-gray-800">Price:</span>{" "}
                      ₹{product.price}
                    </p>
                    <p className="text-sm text-gray-800 mb-1">
                      <span className="font-medium text-gray-800">
                        Weight:{" "}
                      </span>{" "}
                      {product.gram} gm
                    </p>
                    <p className="text-sm text-gray-800 mb-1">
                      <span className="font-medium text-gray-800">
                        Quantity:
                      </span>{" "}
                      {product.quantity}
                    </p>

                    {product.quantity <= 10 && (
                      <p className="text-xs font-bold text-red-700 bg-red-100 px-2 py-1 rounded inline-block">
                        ⚠ Low Stock Alert!
                      </p>
                    )}

                    {product.discountPercent && product.discountPercent > 0 && (
                      <p className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded inline-block">
                        Discounted Price: ₹
                        {(
                          product.price -
                          (product.price * product.discountPercent) / 100
                        ).toFixed(2)}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-semibold text-sm px-4 py-2 rounded-full shadow transition-all duration-300"
                    >
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() => handleDelete(product._id)}
                      className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold text-sm px-4 py-2 rounded-full shadow-md transition-all duration-300"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        {activeTab === "Orders" && (
          <section>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Recent Orders
            </h2>
            <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gradient-to-r from-yellow-100 to-red-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-gray-700 font-semibold">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-gray-700 font-semibold">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-gray-700 font-semibold">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-gray-700 font-semibold">
                      Status
                    </th>
                    <th className="px-6 py-4 text-gray-700 font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => {
                    const isShipped = order.status.toLowerCase() === "shipped";
                    const isExpanded = expandedOrderId === order._id;

                    return (
                      <>
                        <tr
                          key={order._id}
                          className="hover:bg-yellow-50 transition-colors duration-200"
                        >
                          <td className="px-6 py-4 font-medium text-gray-800">
                            {order._id}
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                            {order.user.fullName}
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                            ₹{order.subtotal}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() =>
                                toggleOrderStatus(order._id, order.status)
                              }
                              className={`text-sm px-3 py-1 rounded-full font-medium text-white transition duration-300 shadow-md ${
                                isShipped
                                  ? "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:to-yellow-700"
                                  : "bg-gradient-to-r from-green-500 to-green-600 hover:to-green-700"
                              }`}
                            >
                              {isShipped ? "Mark Pending" : "Mark Shipped"}
                            </button>
                          </td>
                          <td className="px-6 py-4 space-x-2">
                            <button
                              onClick={() =>
                                setExpandedOrderId(
                                  isExpanded ? null : order._id
                                )
                              }
                              className="inline-flex items-center gap-1 text-sm px-3 py-1 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-sm transition"
                            >
                              👁️ {isExpanded ? "Hide" : "View"}
                            </button>

                            <button
                              onClick={() => handleCancelOrder(order._id)}
                              className="inline-flex items-center gap-1 text-sm px-3 py-1 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-sm transition"
                            >
                              Cancel
                            </button>
                          </td>
                        </tr>

                        {isExpanded && (
                          <tr>
                            <td
                              colSpan={5}
                              className="bg-red-50 px-6 py-3 text-sm text-gray-700 border-t"
                            >
                              <div className="grid gap-2 sm:grid-cols-2">
                                <div>
                                  <p>
                                    <span className="font-semibold text-gray-800">
                                      Contact:
                                    </span>{" "}
                                    {order.user.contact}
                                  </p>
                                  <p>
                                    <span className="font-semibold text-gray-800">
                                      Address:
                                    </span>{" "}
                                    {order.user.address}, {order.user.city},{" "}
                                    {order.user.state}, {order.user.country}
                                  </p>
                                  <p>
                                    <span className="font-semibold text-gray-800">
                                      Payment:
                                    </span>{" "}
                                    {order.paymentMethod}
                                  </p>
                                  <p>
                                    <span className="font-semibold text-gray-800">
                                      Status:
                                    </span>{" "}
                                    {order.status}
                                  </p>
                                </div>

                                <div>
                                  <p className="font-semibold text-gray-800 mb-1">
                                    Items:
                                  </p>
                                  <ul className="ml-4 list-disc text-gray-700 text-sm">
                                    {order.items.map((item, idx) => (
                                      <li key={idx}>
                                        {item.name} - ₹{item.price} ×{" "}
                                        {item.quantity}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>

                              <p className="mt-3 text-xs text-gray-500">
                                Placed on:{" "}
                                {new Date(order.createdAt).toLocaleString()}
                              </p>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === "Users" && (
          <section>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Registered Users
            </h2>

            <div className="overflow-x-auto bg-white shadow rounded-xl">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gradient-to-r from-yellow-100 to-red-50">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-yellow-50 transition"
                    >
                      <td className="px-6 py-3 font-medium text-gray-800">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="px-6 py-3 text-gray-700">{user.email}</td>
                      <td className="px-6 py-3">
                        <button
                          onClick={() => handleUserDelete(user._id)}
                          className="inline-flex items-center gap-1 text-xs bg-gradient-to-r from-red-500 to-red-600 hover:to-red-700 text-white px-3 py-1 rounded-full shadow-sm transition"
                        >
                          ❌ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination Controls */}
              {users.length > usersPerPage && (
                <div className="flex justify-center items-center mt-4 mb-8 gap-3">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className="px-4 py-1 rounded-md bg-yellow-400 hover:bg-yellow-500 text-white font-medium transition disabled:opacity-50"
                    disabled={currentPage === 1}
                  >
                    Prev
                  </button>
                  <span className="text-gray-800 font-semibold">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className="px-4 py-1 rounded-md bg-yellow-400 hover:bg-yellow-500 text-white font-medium transition disabled:opacity-50"
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
const DashboardCard = ({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) => (
  <div className="rounded-2xl p-6 shadow-lg bg-gradient-to-br from-yellow-100 via-orange-50 to-red-100 border border-orange-700">
    <h2 className="text-lg font-semibold text-red-700 mb-2">{title}</h2>
    <p className="text-3xl font-bold text-red-600 drop-shadow-sm">{value}</p>
  </div>
);
export default AdminDashboard;
