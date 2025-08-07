"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

interface ProductCategory {
  _id: string;
  name: string;
  image: string;
  featured: boolean;
}

interface Feature {
  title: string;
  icon: string;
}

interface HeroSlide {
  _id: string;
  title: string;
  subtitle: string;
  image: string;
}

const AgarbatiHomepage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [productCategories, setProductCategories] = useState<ProductCategory[]>(
    []
  );
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/upcoming");
        setProductCategories(res.data);
        console.log("Fetched categories:", res.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchHeroSlides = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/heroslides");
        setHeroSlides(res.data);
        console.log("Fetched hero slides:", res.data);
      } catch (error) {
        console.error("Failed to fetch hero slides:", error);
      }
    };

    fetchHeroSlides();
  }, []);

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
        {heroSlides.length > 0 && (
          <section
            id="home"
            className="relative h-screen flex items-center justify-center overflow-hidden"
          >
            {/* Background Slide */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
              style={{
                backgroundImage: `url(${heroSlides[currentSlide].image})`,
              }}
            />

            {/* Dark Overlay */}
            {/* <div className="absolute inset-0 bg-black bg-opacity-50" /> */}

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
                    index === currentSlide
                      ? "bg-white"
                      : "bg-white bg-opacity-40"
                  }`}
                  onClick={() => handleSlideChange(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </section>
        )}

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
                    <div
                      className="h-96 bg-cover bg-center relative"
                      style={{ backgroundImage: `url(${product.image})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                        <h3 className="text-3xl font-bold mb-3">
                          {product.name}
                        </h3>
                        <button className="bg-white text-red-600 px-6 py-2 rounded-full font-semibold hover:bg-red-600 hover:text-white transition-all duration-300">
                          VIEW PRODUCTS
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Other Product Grid */}
            {/* Upcoming Products Section */}
            <section id="upcoming" className="py-20 bg-white">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                    Our <span className="text-red-600">Upcoming</span> Products
                  </h2>
                  <p className="text-gray-600 max-w-xl mx-auto text-lg">
                    Sneak peek at our divine innovations coming soon to elevate
                    your rituals.
                  </p>
                </div>

                <div className="flex justify-center flex-wrap gap-8">
                  {productCategories
                    .filter((p) => !p.featured)
                    .map((product, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 overflow-hidden border w-72"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-52 object-cover"
                        />

                        <div className="p-4 flex flex-col items-center text-center space-y-2">
                          <h4 className="text-lg font-semibold text-gray-800">
                            {product.name}
                          </h4>

                          <span className="text-sm text-red-500 font-medium bg-red-100 px-3 py-1 rounded-full">
                            Coming Soon
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </section>
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
        <section
          id="faq"
          className="py-24 bg-gradient-to-br from-yellow-50 via-red-50 to-yellow-100"
        >
          <h3 className="text-4xl md:text-5xl font-extrabold text-red-600 mb-12 text-center">
            Frequently Asked <span className="text-yellow-600">Questions</span>
          </h3>
          <div className="container mx-auto px-6 lg:px-16 flex flex-col md:flex-row items-center gap-12">
            {/* Left Image */}
            <div className="w-full md:w-1/2">
              <img
                src="/divine.png"
                alt="Divine FAQs"
                className="w-full max-w-md mx-auto rounded-xl shadow-xl border border-yellow-200"
              />
            </div>

            {/* Right FAQs */}
            <div className="w-full md:w-1/2">
              <div className="space-y-4">
                {[
                  {
                    question: "What makes AGARBATI products divine?",
                    answer:
                      "Our incense sticks are handcrafted using natural ingredients, spiritual intent, and ancient blending techniques rooted in Indian traditions.",
                  },
                  {
                    question: "Are your incense sticks 100% natural?",
                    answer:
                      "Yes, we use no harmful chemicals—only herbs, essential oils, and sacred resins to maintain purity and authenticity.",
                  },
                  {
                    question: "How can I order AGARBATI products?",
                    answer:
                      "You can explore our product catalog and place orders directly through our website or visit nearby retailers listed under “Find Retailer.”",
                  },
                  {
                    question: "Do you offer bulk or custom orders?",
                    answer:
                      "Absolutely! We serve temples, event organizers, and spiritual centers. Please contact us for special requests and bulk pricing.",
                  },
                ].map((faq, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <details className="group">
                      <summary className="flex items-center justify-between cursor-pointer text-lg font-semibold text-gray-800 mb-2">
                        {faq.question}
                        <svg
                          className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform duration-300"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </summary>
                      <p className="text-gray-600 text-sm mt-2">{faq.answer}</p>
                    </details>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Footer></Footer>
      </div>
    </div>
  );
};

export default AgarbatiHomepage;
