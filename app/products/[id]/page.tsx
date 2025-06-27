"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import { FaWhatsapp } from "react-icons/fa";
import { useCart } from "@/app/context/CartContext";
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  related: string[];
}

export default function ProductPage() {
  const params = useParams();
  const productId = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
    });
    alert("Added to cart!");
  };

  useEffect(() => {
    if (!productId) return;

    const fetchProductAndRelated = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/agarbatti/${productId}`
        );
        const currentProduct = res.data;
        setProduct(currentProduct);

        const allRes = await axios.get(`http://localhost:5000/api/agarbatti`);
        const allProducts: Product[] = allRes.data;

        const related = allProducts
          .filter(
            (p) =>
              p.category === currentProduct.category &&
              p._id !== currentProduct._id
          )
          .slice(0, 3); // Get up to 3 related products

        setRelatedProducts(related);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      }
    };

    fetchProductAndRelated();
  }, [productId]);

  if (!product)
    return (
      <div className="p-10 text-center text-lg font-medium text-gray-700">
        Loading product...
      </div>
    );

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-red-50 min-h-screen">
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full z-50 shadow-sm bg-white">
        <Navbar />
      </div>

      <div className="pt-28 max-w-6xl mx-auto px-4 md:px-8 pb-16">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-red-600">
            Home
          </Link>{" "}
          / <span className="text-gray-700 font-medium">{product.name}</span>
        </div>

        {/* Main Product Section */}
        <div className="grid md:grid-cols-2 gap-10 bg-white p-6 rounded-xl shadow-xl">
          <img
            src={product.image}
            alt={product.name}
            className="rounded-xl w-full h-[400px] object-cover border"
          />

          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-red-700">{product.name}</h1>
            <p className="text-gray-700 text-lg leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center gap-3 mt-2">
              <span className="text-green-600 font-bold text-2xl">
                ₹{product.price}
              </span>
              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
                Best Seller
              </span>
            </div>

            <p className="text-sm text-gray-500">
              Category: <span className="font-medium">{product.category}</span>
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mt-4">
              <label
                htmlFor="qty"
                className="text-sm font-medium text-gray-600"
              >
                Quantity:
              </label>
              <input
                type="number"
                id="qty"
                min={1}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value)))
                }
                className="w-16 px-2 py-1 border rounded-md text-center text-amber-700 font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* CTA Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                onClick={handleAddToCart}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold shadow-sm transition"
              >
                🛒 Add to Cart
              </button>
              <a
                href={`https://wa.me/?text=Check out this incense product: ${product.name} for ₹${product.price}`}
                target="_blank"
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg transition"
              >
                <FaWhatsapp className="w-5 h-5" />
                Share
              </a>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <Link
                  key={p._id}
                  href={`/products/${p._id}`}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 duration-300 overflow-hidden"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {p.name}
                    </h3>
                    <p className="text-red-600 font-bold mt-1">₹{p.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
