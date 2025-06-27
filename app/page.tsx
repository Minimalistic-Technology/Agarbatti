"use client";

import React, { useState, useEffect } from "react";
import {
  Phone,
  Mail,
  MapPin,
  ShoppingCart,
  Menu,
  X,
  Search,
  User,
} from "lucide-react";
import Navbar from "./components/Navbar";
interface HeroSlide {
  title: string;
  subtitle: string;
  image: string;
}

interface ProductCategory {
  name: string;
  image: string;
  featured: boolean;
}

interface Feature {
  title: string;
  icon: string;
}

const AgarbatiHomepage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const heroSlides: HeroSlide[] = [
    {
      title: "AGARBATI",
      subtitle: "Premium Quality Incense Sticks",
      image: "/agarbatti.jpg",
    },
    {
      title: "Puja Essentials Collection",
      subtitle: "Sacred Items for Divine Worship",
      image: "linear-gradient(135deg, #DC143C 0%, #B22222 100%)",
    },
    {
      title: "Temple-Grade Quality",
      subtitle: "Authentic Puja Products for Your Home",
      image: "linear-gradient(135deg, #32CD32 0%, #228B22 100%)",
    },
  ];

  const productCategories: ProductCategory[] = [
    {
      name: "Puja Agarbatti",
      image: "bg-gradient-to-br from-orange-400 to-red-500",
      featured: true,
    },
    {
      name: "Temple Dhoop Sticks",
      image: "bg-gradient-to-br from-yellow-400 to-orange-500",
      featured: true,
    },
    {
      name: "Sambrani Cups",
      image: "bg-gradient-to-br from-green-500 to-green-700",
      featured: false,
    },
    {
      name: "Camphor Tablets",
      image: "bg-gradient-to-br from-green-400 to-green-600",
      featured: false,
    },
    {
      name: "Sacred Diyas",
      image: "bg-gradient-to-br from-purple-500 to-indigo-600",
      featured: false,
    },
    {
      name: "Puja Thali Sets",
      image: "bg-gradient-to-br from-pink-500 to-red-500",
      featured: false,
    },
  ];

  const features: Feature[] = [
    {
      title: "100% Natural",
      icon: "🌿",
    },
    {
      title: "Handcrafted",
      icon: "👐",
    },
    {
      title: "Long Lasting",
      icon: "⏰",
    },
    {
      title: "Premium Quality",
      icon: "⭐",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const handleMenuToggle = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSlideChange = (index: number): void => {
    setCurrentSlide(index);
  };

  return (
    <div>
      {/* Header */}
      <Navbar></Navbar>
      <div className="min-h-screen bg-gray-50 absolute">
        {/* Hero Section */}
        <section
          id="home"
          className="relative h-screen flex items-center justify-center overflow-hidden"
        >
          {/* Background Slide */}
          <div
            className="absolute inset-0 transition-all duration-1000"
            style={{ background: heroSlides[currentSlide].image }}
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50" />

          {/* Hero Text */}
          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-4 drop-shadow-md tracking-wider">
              {heroSlides[currentSlide].title}
            </h1>
            <h2 className="text-xl md:text-3xl font-semibold mb-6 text-yellow-200">
              {heroSlides[currentSlide].subtitle}
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-md font-bold text-lg transition-transform duration-300 hover:scale-105 shadow-lg">
                SHOP NOW
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-md font-bold text-lg hover:bg-white hover:text-red-600 transition-all duration-300">
                VIEW CATALOG
              </button>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-white" : "bg-white bg-opacity-40"
                }`}
                onClick={() => handleSlideChange(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </section>

        {/* Product Categories Section */}
        <section id="products" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            {/* Section Heading */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Our <span className="text-red-600">Premium</span> Collection
              </h2>
            </div>

            {/* Featured Products Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {productCategories
                .filter((p) => p.featured)
                .map((product, index) => (
                  <div
                    key={`featured-${index}`}
                    className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-transform duration-500 transform hover:scale-105"
                  >
                    <div className={`h-96 ${product.image} relative`}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                        <h3 className="text-3xl font-bold mb-3">
                          {product.name}
                        </h3>
                        <button className="bg-white text-red-600 px-6 py-2 rounded-full font-semibold hover:bg-red-600 hover:text-white transition-all duration-300">
                          VIEW PRODUCTS
                        </button>
                      </div>

                      {/* AGARBATI Badge */}
                      <div className="absolute top-4 right-4 w-16 h-20 bg-white bg-opacity-20 rounded-md flex items-center justify-center shadow-inner">
                        <div className="text-white text-xs font-bold">
                          AGARBATI
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Other Product Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {productCategories
                .filter((p) => !p.featured)
                .map((product, index) => (
                  <div
                    key={`other-${index}`}
                    className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    <div className={`h-48 ${product.image} relative`}>
                      <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300" />
                      <div className="absolute top-3 right-3 w-12 h-16 bg-white bg-opacity-30 rounded-md flex items-center justify-center">
                        <div className="text-white text-xs font-bold">
                          AGARBATI
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-xl font-bold text-gray-800 mb-2">
                        {product.name}
                      </h4>
                      <button className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-2 px-4 rounded-md font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300">
                        EXPLORE
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-r from-red-500 to-red-600 text-white">
          <div className="container mx-auto px-4 text-center">
            {/* Section Heading */}
            <h3 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-wide">
              Experience{" "}
              <span className="text-yellow-300">Divine Fragrance</span> Today
            </h3>

            {/* Supporting Text */}
            <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto opacity-90 leading-relaxed">
              Join millions of satisfied customers who trust{" "}
              <span className="font-semibold">AGARBATI</span> for their
              spiritual rituals and aromatic serenity.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-red-600 px-8 py-4 rounded-md font-semibold text-lg hover:bg-yellow-100 transition-all duration-300 shadow-md hover:shadow-lg">
                SHOP COLLECTION
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-md font-semibold text-lg hover:bg-white hover:text-red-600 transition-all duration-300 shadow-md hover:shadow-lg">
                FIND RETAILER
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gradient-to-r from-yellow-50 to-red-50">
          <div className="container mx-auto px-4">
            {/* Section Heading */}
            <div className="text-center mb-16">
              <h3 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
                Why Choose <span className="text-red-600">AGARBATI</span>?
              </h3>
              <p className="text-gray-600 text-lg max-w-xl mx-auto">
                Our commitment to purity, craftsmanship, and spiritual bliss
                sets us apart.
              </p>
            </div>

            {/* Feature Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={`feature-${index}`}
                  className="text-center group transition-transform duration-300 transform hover:scale-105"
                >
                  <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="text-5xl mb-4">{feature.icon}</div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">
                      {feature.title}
                    </h4>
                    <div className="h-1 w-10 mx-auto bg-red-500 rounded-full mt-2 group-hover:w-16 transition-all duration-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <footer className="bg-gray-900 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
              {/* Brand Info */}
              <div>
                <div className="flex items-center mb-6">
                  <div className="bg-red-600 text-white px-4 py-2 rounded-md font-bold text-xl">
                    AGARBATI
                  </div>
                  <span className="ml-2 text-gray-300 font-medium tracking-wide">
                    PREMIUM
                  </span>
                </div>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Bringing divine fragrance and spiritual peace to your home for
                  decades. Experience the authentic essence of India with every
                  stick you light.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-lg font-bold mb-6 text-yellow-400 tracking-wide">
                  QUICK LINKS
                </h4>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li>
                    <a
                      href="#home"
                      className="hover:text-white transition-colors"
                    >
                      Home
                    </a>
                  </li>
                  <li>
                    <a
                      href="#about"
                      className="hover:text-white transition-colors"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#products"
                      className="hover:text-white transition-colors"
                    >
                      Products
                    </a>
                  </li>
                  <li>
                    <a
                      href="#contact"
                      className="hover:text-white transition-colors"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </div>

              {/* Product Links */}
              <div>
                <h4 className="text-lg font-bold mb-6 text-yellow-400 tracking-wide">
                  PRODUCTS
                </h4>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Swarna Champa
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Swarna Chandan
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Loban
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Premium Collection
                    </a>
                  </li>
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h4 className="text-lg font-bold mb-6 text-yellow-400 tracking-wide">
                  CONTACT INFO
                </h4>
                <div className="space-y-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-red-500" />
                    <span>+91 98765 43210</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-red-500" />
                    <span>info@agarbati.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-red-500" />
                    <span>Mumbai, Maharashtra, India</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Bottom */}
            <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-500 text-sm">
              <p>
                &copy; 2025{" "}
                <span className="text-yellow-400 font-semibold">
                  AGARBATI Premium
                </span>
                . All Rights Reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AgarbatiHomepage;
