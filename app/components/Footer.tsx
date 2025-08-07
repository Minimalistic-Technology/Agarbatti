"use client";
import React from 'react'
import {
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
const Footer = () => {
  return (
    <div>
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
  )
}

export default Footer
