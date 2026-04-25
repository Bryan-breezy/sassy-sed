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

type Product = { brand: string; category: string }
type MenuBrand = { name: string; categories: { name: string; href: string }[] }

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [menuData, setMenuData] = useState<MenuBrand[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  // Scroll Listener
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Data Fetching & Structuring
  useEffect(() => {
    const fetchAndStructureData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/products')
        if (response.ok) {
          const products: Product[] = await response.json()
          if (Array.isArray(products)) {
            const structuredData: { [key: string]: Set<string> } = {}
            products.forEach(p => {
              if (!p.brand || !p.category) return
              (structuredData[p.brand] ||= new Set<string>()).add(p.category)
            })
            const menuArray = Object.entries(structuredData).map(([brandName, categorySet]) => {
              const brandSlug = encodeURIComponent(brandName.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'))
              return {
                name: brandName,
                categories: Array.from(categorySet).sort().map(cat => ({
                  name: cat,
                  href: `/products/${brandSlug}/${encodeURIComponent(cat.toLowerCase().replace(/\s+/g, '-'))}`
                }))
              }
            }).sort((a, b) => a.name.localeCompare(b.name))
            setMenuData(menuArray)
          }
        }
      } catch (e) { console.error('Menu Error:', e) }
      finally { setIsLoading(false) }
    }
    fetchAndStructureData()
  }, [])

  // Body Scroll Lock
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'auto'
    return () => { document.body.style.overflow = 'auto' }
  }, [isMobileMenuOpen])

  const staticNavLinks = [
    { href: "/about", label: "About us" },
    { href: "/wholesale", label: "Wholesale" },
    { href: "/stores", label: "Stores" },
    { href: "/contacts", label: "Contacts" },
  ]

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        scrolled ? 'bg-white/90 backdrop-blur-md border-b border-zinc-200/50 py-2 shadow-sm' : 'bg-transparent py-4'
      }`}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex h-12 items-center">
            
            {/* LEFT: Logo Section */}
            <div className="flex-1 flex justify-start">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="z-50">
                <Image 
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.NEXT_PUBLIC_BUCKET_NAME}/1758702949667-sassy_logo_trans.webp`}
                  alt="Sassy Logo" width={110} height={110} className="h-7 w-auto" priority 
                />
              </Link>
            </div>

            {/* CENTER: Desktop Menu */}
            <div className="hidden lg:flex flex-[2] justify-center">
              <NavigationMenu>
                <NavigationMenuList className="flex gap-2">
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent text-[12px] font-bold uppercase tracking-widest text-zinc-700 hover:text-emerald-600">
                      Products
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-[700px] grid-cols-3 gap-6 p-6 bg-white rounded-xl shadow-xl border border-zinc-100">
                        {isLoading ? <div className="col-span-3 py-4 text-center">Loading...</div> : 
                          menuData.map(brand => (
                            <div key={brand.name}>
                              <h3 className="mb-2 text-[10px] font-black text-emerald-600 uppercase tracking-tighter">{brand.name}</h3>
                              <ul className="space-y-1">
                                {brand.categories.map(cat => (
                                  <li key={cat.name}>
                                    <Link href={cat.href} className="text-xs text-zinc-500 hover:text-emerald-600 transition-colors">{cat.name}</Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  {staticNavLinks.map(link => (
                    <NavigationMenuItem key={link.href}>
                      <Link href={link.href} className={`px-3 py-2 text-[12px] font-bold uppercase tracking-widest transition-colors ${
                        pathname === link.href ? 'text-emerald-600' : 'text-zinc-700 hover:text-emerald-600'
                      }`}>
                        {link.label}
                      </Link>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* RIGHT: Mobile Toggle / CTA */}
            <div className="flex-1 flex justify-end items-center">
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      <div className={`fixed inset-0 z-[60] transition-opacity duration-300 lg:hidden ${
        isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
        <div className={`absolute right-0 w-[80%] max-w-sm h-full bg-white transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="p-6 flex flex-col h-full">
            <div className="flex justify-between items-center mb-8">
              <span className="font-bold text-emerald-600">MENU</span>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}><X /></Button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-6">
              <Accordion type="single" collapsible>
                <AccordionItem value="products">
                  <AccordionTrigger className="text-xl font-bold uppercase tracking-tighter">Products</AccordionTrigger>
                  <AccordionContent>
                    {menuData.map(brand => (
                      <div key={brand.name} className="py-2 ml-4">
                        <p className="text-[10px] font-bold text-emerald-500 uppercase mb-2">{brand.name}</p>
                        {brand.categories.map(cat => (
                          <Link key={cat.name} href={cat.href} onClick={() => setIsMobileMenuOpen(false)} className="block py-1 text-zinc-600">{cat.name}</Link>
                        ))}
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              {staticNavLinks.map(link => (
                <Link key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="block text-xl font-bold uppercase tracking-tighter">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
