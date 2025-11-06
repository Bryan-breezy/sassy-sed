import Link from "next/link"
import Image from "next/image"
import { FaInstagram, FaWhatsapp, FaYoutube, FaTiktok } from "react-icons/fa"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
            {/* <Link href="/" className="mb-4 inline-block">
              <Image 
                src="https://sassyproducts.co.ke/wp-content/uploads/2025/05/sassy-full-980x1164.png" 
                alt="Sassy Products Logo" 
                width={140} 
                height={140} 
                className="w-auto h-16 sm:h-20"
              />
            </Link> */}

            {/* Socials */}
            <div className="flex flex-col items-center md:items-start ">
              <h3 className="font-semibold mb-4 text-lg">Follow Us</h3>
              <div className="flex space-x-3">
              <a 
                href="https://instagram.com/sassy_products"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 bg-pink-500 rounded-full hover:bg-pink-600 transition-colors"
              >
                <FaInstagram size={24} className="text-lg" />
              </a>
              <a 
                href="https://tiktok.com/@sedoso_cosmetics"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 bg-black-500 rounded-full hover:bg-gray-600 transition-colors"
              >
                <FaTiktok size={24} className="text-lg" />
              </a>
              <a 
                href="https://youtube.com/@sassycosmetics"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 bg-red-600 rounded-full hover:bg-red-700 transition-colors"
              >
                <FaYoutube size={24} className="text-lg" />
              </a>
              <a 
                href="https://wa.me/254706238579"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-full hover:bg-green-600 transition-colors"
              >
                <FaWhatsapp size={24} className="text-lg" />
              </a>
            </div>
         
          </div>
          
          {/* Column 2: Products */}
          <div className="md:text-right lg:text-left">
            <h3 className="font-semibold mb-4 text-lg">Products</h3>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="/categories/sedoso" className="hover:text-green-400 transition-colors">Sedoso</Link></li>
              <li><Link href="/categories/saa" className="hover:text-green-400 transition-colors">Saa</Link></li>
              <li><Link href="/categories/dr. mehos" className="hover:text-green-400 transition-colors">Dr Mehos</Link></li>
              <li><Link href="/products" className="hover:text-green-400 transition-colors">All Products</Link></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="md:text-left lg:text-left">
            <h3 className="font-semibold mb-4 text-lg">Company</h3>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="/about" className="hover:text-green-400 transition-colors">About Us</Link></li>
              <li><Link href="/stores" className="hover:text-green-400 transition-colors">Our Stores</Link></li>
              <li><Link href="/wholesale" className="hover:text-green-400 transition-colors">Wholesale</Link></li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div className="md:text-left lg:text-left">
            <h3 className="font-semibold mb-4 text-lg">Support</h3>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="/contacts" className="hover:text-green-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Sassy Products. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
