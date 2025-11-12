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
  navigationMenuTriggerStyle,
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
  const pathname = usePathname()

  // Stuff to do when Header component loads
  useEffect(() => {
    const fetchAndStructureData = async () => {
      // Loading screen(skeleton) to display as data is being loaded
      setIsLoading(true)
      
      try {
        const response = await fetch('/api/products')
        if (response.ok) {
          const products: Product[] = await response.json()
          const structuredData: { [key: string]: Set<string> } = {}

          // iterate over each product, check if brand and category exist
          products.forEach(product => {
            if (!product.brand || !product.category) return
            
            // check if product exists in the Set (structuredData), if not create new set
            (structuredData[product.brand] ||= new Set<string>()).add(product.category)
          })

          //convert {{ "Sedoso" : "haircare" },{..}} into [[ "Sedoso", "haircare" ], [...]]
          const menuArray = Object.entries(structuredData)
                                  .map(([brandName, categorySet]) => {
            // Dr. Mehos,Dr-Mehos, Dr Mehos -> dr-mehos
            const brandSlug = encodeURIComponent(
              brandName
                .toLowerCase()
                .replace(/[^\w\s-]/g, '') //Remove punctuations( full stops, commas,... )
                .replace(/\s+/g, '-')  //Spaces to dashes
            )
             //menuArray -> {name: Sedoso, categories: Haircare: { name: Curl: href: /products/sedoso/haircare },...}                     
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
          }).sort((a, b) => a.name.localeCompare(b.name)) //localeCompare -> Compares which brand comes first alphabetically
          setMenuData(menuArray)
        }
      } catch (error) {
        console.error('Error fetching menu data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAndStructureData()
  }, []) // [] -> executes only when hovering

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }  
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isMobileMenuOpen]) // [isMobileMenuOpen] -> executes when dropdown is on

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
      <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          {/* logo */}
          <div className="flex h-16 items-center justify-between">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center">
              <Image 
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.NEXT_PUBLIC_BUCKET_NAME}/1758702949667-sassy_logo_trans.webp`}
                alt="Sassy Products Logo" 
                width={160}
                height={160}
                className="h-10 w-auto sm:h-12 lg:h-14 transition-transform hover:scale-105"
                priority
              />
            </Link>

            {/* Header links ( hidden on small screens ie phones and tablets) */}
            <div className="hidden lg:flex items-center space-x-2">
              {/* Products */}
              <NavigationMenu>
                <NavigationMenuList className="flex gap-2">
                  <NavigationMenuItem>
                    {/* Display products when hovered or clicked */}
                    <NavigationMenuTrigger className="text-base font-medium text-gray-800 hover:text-green-600 bg-transparent hover:bg-green-50 transition-colors px-4 py-2">
                      Products
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      {/* 3 columns */}
                      <div className="grid w-[600px] grid-cols-3 gap-x-6 gap-y-4 p-4 bg-white rounded-lg shadow-lg">
                        {isLoading ? (
                          <div className="col-span-3 flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-green-600 border-t-transparent" />
                            <span className="ml-3 text-sm text-gray-500">Loading...</span>
                          </div>
                        ) : (
                          menuData.map((brand) => (
                            <div key={brand.name}>
                              {/* Column names */}
                              <h3 className="mb-3 font-semibold text-gray-900">{brand.name}</h3>
                              <ul className="space-y-2">
                                {/* Column children */}
                                {brand.categories.map((category) => (
                                  <li key={category.name}>
                                    <Link href={category.href} legacyBehavior passHref>
                                      <NavigationMenuLink 
                                        className="block rounded-md p-2 text-sm text-gray-600 hover:bg-green-50 hover:text-green-600 transition-colors"
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
                          className={`${navigationMenuTriggerStyle()} text-base font-medium text-gray-800 hover:text-green-600 hover:bg-green-50 transition-colors px-4 py-2 ${pathname === link.href ? 'bg-green-50 text-green-600' : ''}`}
                        >
                          {link.label}
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Hamburger Menu ( Visible on tablets, Hidden on phones and large screens) */}
            <div className="hidden md:block lg:hidden">
              <Button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                variant="ghost" 
                size="icon" 
                aria-label="Toggle menu"
                className="hover:bg-green-50 rounded-full"
              >
                <div className="relative w-6 h-6">
                  <Menu className={`h-6 w-6 transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`} />
                  <X className={`h-6 w-6 absolute top-0 left-0 transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`} />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu (Visible on tablets only) */}
      <div 
        aria-hidden={!isMobileMenuOpen} 
        className={`fixed inset-0 z-50 hidden md:block lg:hidden transition-opacity duration-500 ease-in-out ${
             isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop: Fills the entire screen(inset-0), closes the menu on click */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ease-in-out"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        <div 
          className={`absolute right-0 w-full max-w-xs h-full bg-white shadow-2xl flex flex-col transform transition-transform duration-500 ease-in-out ${
              isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header/Close Button */}
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
          
          {/* Scrollable Menu Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8"> 
              
              {/* Products Section */}
              <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">
                    Products
                  </h2>
                  {isLoading ? (
                      <div className="flex items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-6 w-6 border-2 border-green-600 border-t-transparent" />
                          <span className="ml-3 text-sm text-gray-500">Loading Categories...</span>
                      </div>
                  ) : (
                      // dedicated link to the main Products landing page
                      <>
                          <Link 
                              href="/products" 
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={getMobileLinkStyles(pathname === '/products')}
                          >
                              All Products
                          </Link>

                          <div className="mt-4 border-t pt-4 space-y-3">
                              {/* Accordions for specific brands */}
                              {menuData.map((brand, index) => (
                                  <div
                                      key={brand.name}
                                      className="opacity-0 animate-slide-in"
                                      style={{ animationDelay: `${index * 100}ms` }}
                                  >
                                      <Accordion type="single" collapsible>
                                          <AccordionItem value={brand.name}>
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
              
              {/* Static Navigation Links */}
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
