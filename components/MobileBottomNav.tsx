// components/MobileBottomNav.tsx
import Link from 'next/link';
import { Home, Package, Store, Phone } from 'lucide-react'

export default function MobileBottomNav() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center py-2">

        {/* Home */}
        <Link href="/" className="flex flex-col items-center text-gray-700 hover:text-blue-600">
          <Home className="w-6 h-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>

        {/* Products */}
        <Link href="/products" className="flex flex-col items-center text-gray-700 hover:text-blue-600">
          <Package className="w-6 h-6" />
          <span className="text-xs mt-1">Products</span>
        </Link>

        {/* Stores */}
        <Link href="/stores" className="flex flex-col items-center text-gray-700 hover:text-blue-600">
          <Store className="w-6 h-6" />
          <span className="text-xs mt-1">Stores</span>
        </Link>

        {/* Contact */}
        <Link href="/contacts" className="flex flex-col items-center text-gray-700 hover:text-blue-600">
          <Phone className="w-6 h-6" />
          <span className="text-xs mt-1">Contact</span>
        </Link>

      </div>
    </div>
  );
}
