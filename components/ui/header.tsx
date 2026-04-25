"use client"

import { useState, useEffect } from 'react'
import Link from "next/link"
import Image from "next/image"
import { usePathname } from 'next/navigation'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

type Product = { 
  brand: string
  category: string
}

type MenuBrand = {
  name: string
  categories: { 
    name: string
    href: string 
  }[]
}

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [menuData, setMenuData] = useState<MenuBrand[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  // Handle scroll effect for the header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // Fetch and structure product data for the menu
  useEffect(() => {
    const fetchAndStructureData = async () => {
      setIsLoading(true)
      
      try {
        const response = await fetch('/api/products')
        if (response.ok) {
          const products: Product[] = await response.json()
          
          if (Array.isArray(products)) {
            // FIX: Removed duplicate const declaration here
            const structuredData: { [key: string]: Set<string> } = {}

            products.forEach(product => {
              if (!product.brand || !product.category) return
              (structuredData[product.brand] ||= new Set<string>()).add(product.category)
            })
            
            const menuArray = Object.entries(structuredData)
              .map(([brandName, categorySet]) => {
                const brandSlug = encodeURIComponent(
                  brandName
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, '') 
                    .replace(/\s+/g, '-')  
                )
                     
                return {
                  name: brandName,
                  categories: Array.from(categorySet).sort().map(categoryName => {
                    const categorySlug = encodeURIComponent(categoryName.toLowerCase().replace(/\s+/g, '-'))
                    return { 
                      name: categoryName, 
                      href: `/products/${brandSlug}/${categorySlug}` 
                    }
                  })
                }
              }).sort((a, b) => a.name.localeCompare(b.name)) 

            setMenuData(menuArray)
          }
        }
      } catch (error) {
        console.error('Error fetching menu data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAndStructureData()
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }  
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isMobileMenuOpen])

  const staticNavLinks = [
    { href: "/about", label: "About us" },
    { href: "/wholesale", label: "Wholesale" },
    { href: "/stores", label: "Stores" },
    { href: "/contacts", label: "Contacts" },
  ]

  const getMobileLinkStyles = (isActive: boolean) => `
    block py-3 px-4 text-base font-medium rounded-lg transition-colors duration-200 
    ${isActive 
        ? "text-green-600 bg-green-50" 
        : "text-gray-800 hover:text-green-600 hover:bg-green-50"
    }`
  
  return (
    <>
      <header className={`
          /* Positioning */
          fixed top-0 left-0 right-0 z-50 
          /* Transitions */
          transition-all duration-500 ease-in-out
          /* Conditional Styling */
          ${scrolled 
            ? 'bg-white/70 backdrop-blur-md border-b border-zinc-200/50 py-3 shadow-sm' 
            : 'bg-transparent py-6 border-b border-transparent'
          }
        `}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-12 items-center justify-between">
            {/* Logo */}
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center relative z-50">
              <Image 
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.NEXT_PUBLIC_BUCKET_NAME}/1758702949667-sassy_logo_trans.webp`}
                alt="Sassy Products Logo" 
                width={160}
                height={160}
                className="h-8 w-auto sm:h-9 transition-transform hover:scale-105"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center">
              <NavigationMenu>
                <NavigationMenuList className="flex gap-1">
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent hover:bg-zinc-50 text-[13px] font-medium tracking-wide text-zinc-600 hover:text-emerald-600 transition-colors h-9 px-4 uppercase">
                      Products
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-[600px] grid-cols-3 gap-8 p-8 bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-zinc-100/50">
                        {isLoading ? (
                          <div className="col-span-3 flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-emerald-600 border-t-transparent" />
                          </div>
                        ) : (
                          menuData.map((brand) => (
                            <div key={brand.name}>
                              <h3 className="mb-4 text-[10px] font-bold tracking-[0.2em] text-emerald-600 uppercase">{brand.name}</h3>
                              <ul className="space-y-3">
                                {brand.categories.map((category) => (
                                  <li key={category.name}>
                                    <Link href={category.href} legacyBehavior passHref>
                                      <NavigationMenuLink 
                                        className="block text-[13px] text-zinc-500 hover:text-emerald-600 transition-colors"
                                      >
                                        {category.name}
                                      </NavigationMenuLink>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))
                        )}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  {staticNavLinks.map(link => (
                    <NavigationMenuItem key={link.href}>
                      <Link href={link.href} legacyBehavior passHref>
                        <NavigationMenuLink 
                          className={`bg-transparent hover:bg-zinc-50 text-[13px] font-medium tracking-wide text-zinc-600 hover:text-emerald-600 transition-colors h-9 px-4 uppercase flex items-center rounded-md ${
                            pathname === link.href ? 'text-emerald-600 font-bold' : ''
                          }`}
                        >
                          {link.label}
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* FIX: Mobile Menu Trigger (Hamburger Icon) */}
            <div className="lg:hidden flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open mobile menu"
                className="hover:bg-zinc-100 rounded-full text-zinc-800"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>

          </div>
        </div>
      </header>

      {/* FIX: Unified Mobile Menu Drawer */}
      <div 
        aria-hidden={!isMobileMenuOpen} 
        className={`fixed inset-0 z-[60] lg:hidden transition-opacity duration-500 ease-in-out ${
             isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop overlay */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ease-in-out"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Drawer content */}
        <div 
          className={`absolute right-0 w-full max-w-xs h-full bg-white shadow-2xl flex flex-col transform transition-transform duration-500 ease-in-out ${
              isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b px-6 py-4 bg-green-50">
              <Image
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.NEXT_PUBLIC_BUCKET_NAME}/1758702949667-sassy_logo_trans.webp`}
                  alt="Sassy Logo"
                  width={120}
                  height={48}
                  className="h-10 w-auto"
              />
              <Button
                  onClick={() => setIsMobileMenuOpen(false)}
                  variant="ghost"
                  size="icon"
                  aria-label="Close menu"
                  className="hover:bg-green-100 rounded-full"
              >
                  <X className="h-6 w-6 text-gray-700" />
              </Button>
          </div>
          
          {/* Drawer Links */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8"> 
              <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">
                    Products
                  </h2>
                  {isLoading ? (
                      <div className="flex items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-6 w-6 border-2 border-green-600 border-t-transparent" />
                          <span className="ml-3 text-sm text-gray-500">Loading...</span>
                      </div>
                  ) : (
                      <>
                          <Link 
                              href="/products" 
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={getMobileLinkStyles(pathname === '/products')}
                          >
                              All Products
                          </Link>

                          <div className="mt-4 border-t pt-4 space-y-3">
                              {menuData.map((brand, index) => (
                                  <div
                                      key={brand.name}
                                      className="opacity-0 animate-slide-in"
                                      style={{ animationDelay: `${index * 100}ms` }}
                                  >
                                      <Accordion type="single" collapsible>
                                          <AccordionItem value={brand.name} className="border-b-0">
                                              <AccordionTrigger className="w-full text-left py-3 font-medium text-gray-800 hover:text-green-600">
                                                  {brand.name}
                                              </AccordionTrigger>
                                              <AccordionContent className="pl-4 pt-2">
                                                  <div className="space-y-1">
                                                      {brand.categories.map((category) => (
                                                          <Link
                                                              key={category.name}
                                                              href={category.href}
                                                              onClick={() => setIsMobileMenuOpen(false)}
                                                              className="block py-2 px-3 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors duration-200"
                                                          >
                                                              {category.name}
                                                          </Link>
                                                      ))}
                                                  </div>
                                              </AccordionContent>
                                          </AccordionItem>
                                      </Accordion>
                                  </div>
                              ))}
                          </div>
                      </>
                  )}
              </div>
              
              <div className="space-y-2 border-t pt-6">
                  {staticNavLinks.map((link, index) => (
                      <div
                          key={link.href}
                          className="opacity-0 animate-slide-in"
                          style={{ animationDelay: `${(menuData.length + index) * 100}ms` }}
                      >
                          <Link
                              href={link.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={getMobileLinkStyles(pathname === link.href)}
                          >
                              {link.label}
                          </Link>
                      </div>
                  ))}
              </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </>
  )
}
