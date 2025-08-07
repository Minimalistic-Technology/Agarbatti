"use client";

import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import Link from "next/link";
import api from "@/utils/api";
import Image from "next/image";
import Navbar from "../components/Navbar";
import { useRouter } from "next/navigation";
import Footer from "../components/Footer";
interface ProductDetails {
  _id: string;
  name: string;
  price: number;
  image: string;
}

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const [productDetails, setProductDetails] = useState<
    Record<string, ProductDetails>
  >({});
  const router = useRouter();

  const handleProceedToCheckout = () => {
    const orderData = {
      items: cart.map((item) => ({
        ...item,
        ...productDetails[item._id],
      })),
      subtotal,
    };
    localStorage.setItem("checkoutData", JSON.stringify(orderData));
    router.push("/payment");
  };
  const subtotal = cart.reduce((sum, item) => {
    const product = productDetails[item._id];
    return product ? sum + product.price * item.quantity : sum;
  }, 0);

  useEffect(() => {
    const fetchDetails = async () => {
      const fetched: Record<string, ProductDetails> = {};
      await Promise.all(
        cart.map(async (item) => {
          try {
            const res = await api.get(`/products/${item._id}`);
            fetched[item._id] = res.data;
          } catch {
            fetched[item._id] = {
              _id: item._id,
              name: item.name,
              price: item.price,
              image: item.image,
            };
          }
        })
      );
      setProductDetails(fetched);
    };
    if (cart.length > 0) fetchDetails();
  }, [cart]);

  if (cart.length === 0)
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 to-red-50 px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Your cart is currently empty
          </h2>
          <p className="text-gray-600 mb-6 text-center max-w-md">
            Browse our premium collection to find the perfect additions to your
            puja rituals.
          </p>
          <Link
            href="/"
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-lg shadow transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-red-50 py-20 px-4">
        <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8">
          <h1 className="text-4xl font-bold text-red-700 mb-6">
            Your Shopping Cart
          </h1>

          <div className="space-y-6">
            {cart.map((item) => {
              const product = productDetails[item._id];
              return (
                <div
                  key={item._id}
                  className="flex items-center gap-6 border-b pb-4"
                >
                  {product && (
                    <Image
                      src={product.image || "/placeholder.jpg"}
                      alt={product.name || "Product Image"}
                      width={100}
                      height={100}
                      className="rounded-lg object-cover border w-24 h-24"
                    />
                  )}

                  <div className="flex-1">
                    {product ? (
                      <>
                        <h2 className="text-lg font-semibold text-gray-800">
                          {product.name}
                        </h2>
                        <p className="text-gray-600">
                          ₹{product.price} × {item.quantity} ={" "}
                          <span className="text-red-600 font-bold">
                            ₹{product.price * item.quantity}
                          </span>
                        </p>
                      </>
                    ) : (
                      <p className="text-gray-500">Loading product...</p>
                    )}
                  </div>

                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Remove item
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex justify-between items-center text-lg font-semibold">
            <span className="text-gray-700">Subtotal:</span>
            <span className="text-green-600 text-2xl">₹{subtotal}</span>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-end">
            <button
              onClick={clearCart}
              className="bg-gray-300 text-gray-800 px-5 py-2 rounded-md hover:bg-gray-400 transition"
            >
              Clear Cart
            </button>
            <button
              onClick={handleProceedToCheckout}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-lg transition font-medium"
            >
              Continue to Secure Checkout
            </button>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}
