// import React, {useState, useEffect} from "react";
// import {
//   Phone,
//   Mail,
//   MapPin,
//   ShoppingCart,
//   Menu,
//   X,
//   Search,
//   User,
// } from "lucide-react";
// import Link from "next/link";
// interface HeroSlide {
//   title: string;
//   subtitle: string;
//   image: string;
// }

// interface ProductCategory {
//   name: string;
//   image: string;
//   featured: boolean;
// }

// const Navbar = () => {
//       const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

//   const handleMenuToggle = (): void => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   return (
//    <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-yellow-400 to-red-600 shadow-lg">
//   <div className="container mx-auto px-4 py-3">
//     <div className="flex items-center justify-between">
//       {/* Logo */}
//       <div className="flex items-center">
//         <Link href="/" className="flex items-center">
//         <div className="bg-red-600 text-white px-4 py-2 rounded-md font-bold text-xl tracking-wide shadow-md">
//           AGARBATI
//         </div>
//         <span className="ml-2 text-white font-semibold text-sm tracking-wider">
//           PREMIUM
//         </span>
//         </Link>

//       </div>

//       {/* Desktop Navigation */}
//       <nav className="hidden lg:flex space-x-6 text-white font-medium relative z-50">
//         {[
//           {
//             label: "Agarbatti",
//             items: ["Swarna Champa", "Sandalwood Bliss", "Night Bloom", "Festive Flora"],
//           },
//           {
//             label: "Dhoop",
//             items: ["Pure Guggal", "Loban Dhoop", "Charcoal Free Dhoop"],
//           },
//           {
//             label: "Chandan Tilak",
//             items: ["Premium Chandan Paste", "Sandalwood Powder", "Tilak Sticks"],
//           },
//           {
//             label: "Camphor",
//             items: ["Round Camphor", "Bhimseni Camphor", "Kapoor Tablets"],
//           },
//           {
//             label: "Hawan Samagri",
//             items: ["Panchmeva Mix", "Hawan Wood Pack", "Hawan Herbs"],
//           },
//           {
//             label: "Puja Oil",
//             items: ["Til Oil", "Castor Oil", "Cow Ghee Lamps"],
//           },
//           {
//             label: "Pooja Items",
//             items: ["Brass Diya", "Bell", "Incense Holders", "Kumkum Box"],
//           },
//           {
//             label: "Best Sellers",
//             items: ["Combo Pack 1", "Temple Fragrance", "Devotional Set"],
//           },
//           {
//             label: "Combos",
//             items: ["Starter Pack", "Gifting Combo", "Festive Bundle"],
//           },
//         ].map((menu, idx) => (
//           <div key={idx} className="relative group">
//             <button className="flex items-center gap-1 hover:text-yellow-200 transition">
//               {menu.label}
//             </button>
//             <div className="absolute top-full left-0 w-56 mt-2 bg-white text-gray-800 shadow-lg rounded-md opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transform transition-all duration-200 z-50">
//               <ul className="py-2 px-4 space-y-2">
//                 {menu.items.map((item, i) => (
//                   <li key={i}>
//                     <a
//                       href="#"
//                       className="block text-sm font-medium hover:text-red-600 transition"
//                     >
//                       {item}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         ))}
//       </nav>

//       {/* Right Side Icons */}
//       <div className="flex items-center space-x-4">
//         {[Search, User, ShoppingCart].map((Icon, i) => (
//           <Icon
//             key={i}
//             className="w-5 h-5 text-white cursor-pointer hover:text-yellow-200 transition"
//           />
//         ))}
//         <div className="hidden lg:flex items-center space-x-2">
//           <a
//             href="/login"
//             className="text-white font-medium border border-white px-3 py-1 rounded-md text-sm hover:text-yellow-200 transition"
//           >
//             Login
//           </a>
//           <a
//             href="/signup"
//             className="bg-white text-red-600 font-semibold px-4 py-1 rounded-md hover:bg-yellow-200 transition text-sm"
//           >
//             Sign Up
//           </a>
//         </div>
//         <button
//           onClick={() => setIsMenuOpen((prev) => !prev)}
//           className="lg:hidden text-white"
//         >
//           {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//         </button>
//       </div>
//     </div>

//     {/* Mobile Nav */}
//     {isMenuOpen && (
//       <nav className="lg:hidden mt-4 pb-4 border-t border-white border-opacity-20 pt-4">
//         <div className="flex flex-col space-y-3 text-white text-sm font-medium">
//           {[
//             "Agarbatti",
//             "Dhoop",
//             "Chandan Tilak",
//             "Camphor",
//             "Hawan Samagri",
//             "Puja Oil",
//             "Pooja Items",
//             "Best Sellers",
//             "Combos",
//             "Login",
//             "Sign Up",
//           ].map((label, idx) => (
//             <a
//               key={idx}
//               href={
//                 label === "Login"
//                   ? "/login"
//                   : label === "Sign Up"
//                   ? "/signup"
//                   : `#${label.toLowerCase().replace(/\s+/g, "")}`
//               }
//               className="hover:text-yellow-200 transition"
//             >
//               {label}
//             </a>
//           ))}
//         </div>
//       </nav>
//     )}
//   </div>
// </header>

//   );
// };

// export default Navbar;

"use client";

import React, { useState, useEffect } from "react";
import { ShoppingCart, Menu, X, Search, User } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { useCart } from "../context/CartContext"; 


interface Product {
  _id: string;
  name: string;
  category: string;
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Record<string, Product[]>>({});

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get<Product[]>(
          "http://localhost:5000/api/agarbatti",
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const grouped: Record<string, Product[]> = {};
        res.data.forEach((product) => {
          if (!grouped[product.category]) grouped[product.category] = [];
          grouped[product.category].push(product);
        });
        setCategories(grouped);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-yellow-400 to-red-600 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="bg-red-600 text-white px-4 py-2 rounded-md font-bold text-xl tracking-wide shadow-md">
              AGARBATI
            </div>
            <span className="ml-2 text-white font-semibold text-sm tracking-wider">
              PREMIUM
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-6 text-white font-medium relative z-50">
            {Object.entries(categories).map(([label, products], idx) => (
              <div key={idx} className="relative group">
                <button className="flex items-center gap-1 hover:text-yellow-200 transition">
                  {label}
                </button>
                <div className="absolute top-full left-0 w-56 mt-2 bg-white text-gray-800 shadow-lg rounded-md opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transform transition-all duration-200 z-50">
                  <ul className="py-2 px-4 space-y-2">
                    {products.map((product) => (
                      <li key={product._id}>
                        <Link
                          href={`/products/${product._id}`}
                          className="block text-sm font-medium hover:text-red-600 transition"
                        >
                          {product.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            <Link href="/cart" className="text-white">
            <ShoppingCart className="w-5 h-5 text-white cursor-pointer hover:text-yellow-200 transition" />
            </Link>
            

            <div className="hidden lg:flex items-center space-x-2">
              <Link
                href="/login"
                className="text-white font-medium border border-white px-3 py-1 rounded-md text-sm hover:text-yellow-200 transition"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-white text-red-600 font-semibold px-4 py-1 rounded-md hover:bg-yellow-200 transition text-sm"
              >
                Sign Up
              </Link>
            </div>
            <button onClick={handleMenuToggle} className="lg:hidden text-white">
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t border-white border-opacity-20 pt-4">
            <div className="flex flex-col space-y-4 text-white text-sm font-medium">
              {Object.entries(categories).map(([label, products], idx) => (
                <div key={idx}>
                  <div className="font-bold uppercase mb-1">{label}</div>
                  {products.map((product) => (
                    <Link
                      key={product._id}
                      href={`/products/${product._id}`}
                      className="ml-2 block hover:text-yellow-200 transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {product.name}
                    </Link>
                  ))}
                </div>
              ))}
              <hr className="border-white border-opacity-30 my-2" />
              <Link href="/login" className="hover:text-yellow-200 transition">
                Login
              </Link>
              <Link href="/signup" className="hover:text-yellow-200 transition">
                Sign Up
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
