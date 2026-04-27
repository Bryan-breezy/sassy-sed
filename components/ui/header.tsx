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
import { Menu, X, ChevronDown } from "lucide-react"

type Product   = { brand: string; category: string }
type MenuBrand = { name: string; categories: { name: string; href: string }[] }

const LOGO_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.NEXT_PUBLIC_BUCKET_NAME}/1758702949667-sassy_logo_trans.webp`

const staticNavLinks = [
  { href: "/about",     label: "About"     },
  { href: "/wholesale", label: "Wholesale" },
  { href: "/stores",    label: "Stores"    },
  { href: "/contacts",  label: "Contact"   },
]

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ')
}

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [menuData, setMenuData]                 = useState<MenuBrand[]>([])
  const [isLoading, setIsLoading]               = useState(true)
  const [scrolled, setScrolled]                 = useState(false)
  const [productsOpen, setProductsOpen]         = useState(false)
  const pathname = usePathname()

  /* ── Scroll listener ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ── Data fetch ── */
  useEffect(() => {
    const fetchMenu = async () => {
      setIsLoading(true)
      try {
        const res = await fetch('/api/products')
        if (res.ok) {
          const products: Product[] = await res.json()
          if (Array.isArray(products)) {
            const map: Record<string, Set<string>> = {}
            products.forEach(p => {
              if (!p.brand || !p.category) return
              ;(map[p.brand] ||= new Set()).add(p.category)
            })
            setMenuData(
              Object.entries(map)
                .map(([brand, cats]) => ({
                  name: brand,
                  categories: Array.from(cats).sort().map(cat => ({
                    name: cat,
                    href: `/products/${encodeURIComponent(brand.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'))}/${encodeURIComponent(cat.toLowerCase().replace(/\s+/g, '-'))}`
                  }))
                }))
                .sort((a, b) => a.name.localeCompare(b.name))
            )
          }
        }
      } catch (e) { console.error('Menu error:', e) }
      finally { setIsLoading(false) }
    }
    fetchMenu()
  }, [])

  /* ── Body scroll lock ── */
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMobileMenuOpen])

  const closeMobile = () => {
    setIsMobileMenuOpen(false)
    setProductsOpen(false)
  }

  return (
    <>
      <header
        id="site-header"
        className={cn(
          "sticky top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          scrolled
            ? "bg-[#F5F2ED]/95 backdrop-blur-md border-b border-stone-200/60 py-1.5 shadow-[0_1px_16px_rgba(0,0,0,0.05)]"
            : "bg-[#F5F2ED] py-2.5"
        )}
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex h-10 items-center">

            {/* Logo */}
            <div className="flex-1">
              <Link href="/" onClick={closeMobile} className="inline-block">
                <Image
                  src={LOGO_URL}
                  alt="Sassy Products Kenya"
                  width={90} height={32}
                  className="h-6 w-auto"
                  priority
                />
              </Link>
            </div>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-0.5">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="h-auto bg-transparent px-2.5 py-1 text-[11px] font-medium tracking-wide text-stone-600 hover:text-emerald-700 data-[state=open]:text-emerald-700 transition-colors duration-200">
                      Products
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="w-[680px] p-6 bg-[#FDFCFB] rounded-2xl shadow-2xl shadow-stone-900/10 border border-stone-100">
                        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-stone-100">
                          <span className="inline-block w-4 h-[1.5px] bg-emerald-600" />
                          <p className="text-[9px] font-bold tracking-[0.24em] text-emerald-600 uppercase">Our Collection</p>
                        </div>
                        {isLoading ? (
                          <div className="grid grid-cols-3 gap-4">
                            {[...Array(6)].map((_, i) => (
                              <div key={i} className="space-y-2">
                                <div className="h-2.5 w-16 bg-stone-100 rounded animate-pulse" />
                                <div className="h-2 w-24 bg-stone-100 rounded animate-pulse" />
                                <div className="h-2 w-20 bg-stone-100 rounded animate-pulse" />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="grid grid-cols-3 gap-x-8 gap-y-5">
                            {menuData.map(brand => (
                              <div key={brand.name}>
                                <h3 className="mb-2.5 text-[9px] font-black uppercase tracking-[0.18em] text-emerald-700">
                                  {brand.name}
                                </h3>
                                <ul className="space-y-1.5">
                                  {brand.categories.map(cat => (
                                    <li key={cat.name}>
                                      <NavigationMenuLink asChild>
                                        <Link
                                          href={cat.href}
                                          className="group flex items-center gap-1.5 text-[12px] text-stone-500 hover:text-stone-900 transition-colors duration-150"
                                        >
                                          <span className="inline-block w-0 group-hover:w-2.5 h-[1px] bg-emerald-500 transition-all duration-200 ease-out" />
                                          {cat.name}
                                        </Link>
                                      </NavigationMenuLink>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="mt-5 pt-4 border-t border-stone-100">
                          <Link href="/products" className="text-[10px] font-semibold tracking-[0.16em] uppercase text-stone-400 hover:text-emerald-600 transition-colors duration-200">
                            View all products →
                          </Link>
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              {staticNavLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-2.5 py-1 text-[11px] font-medium tracking-wide transition-colors duration-200",
                    pathname === link.href ? "text-emerald-700" : "text-stone-600 hover:text-emerald-700"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile hamburger */}
            <div className="flex-1 flex justify-end lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
                className="flex items-center justify-center w-8 h-8 rounded-full border border-stone-200 bg-white/70 backdrop-blur-sm text-stone-700 hover:border-emerald-300 hover:text-emerald-700 transition-colors duration-200"
              >
                <Menu className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════
          MOBILE DRAWER
      ══════════════════════════════════════════════════════════ */}
      <div
        className={cn(
          "fixed inset-0 z-[60] lg:hidden transition-opacity duration-300",
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="absolute inset-0 bg-stone-900/30 backdrop-blur-sm" onClick={closeMobile} />

        <div
          className={cn(
            "absolute right-0 top-0 h-full w-[82%] max-w-[360px] bg-[#F5F2ED] flex flex-col shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200/60">
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-[1.5px] bg-emerald-600" />
              <span className="text-[9px] font-black tracking-[0.22em] text-emerald-600 uppercase">Menu</span>
            </div>
            <button
              onClick={closeMobile}
              aria-label="Close menu"
              className="flex items-center justify-center w-8 h-8 rounded-full border border-stone-200 text-stone-500 hover:border-stone-300 hover:text-stone-800 transition-colors duration-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Drawer body */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-1">
            <div className="border-b border-stone-200/60 pb-4 mb-2">
              <button
                onClick={() => setProductsOpen(o => !o)}
                className="flex items-center justify-between w-full py-2 text-left"
              >
                <span className="text-2xl font-serif font-semibold text-stone-800 leading-none">Products</span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-stone-400 transition-transform duration-300",
                    productsOpen ? "rotate-180" : ""
                  )}
                />
              </button>

              <div
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  productsOpen ? "max-h-[60vh] opacity-100 mt-4" : "max-h-0 opacity-0"
                )}
              >
                <div className="space-y-5 pl-1">
                  {menuData.map(brand => (
                    <div key={brand.name}>
                      <p className="text-[9px] font-black tracking-[0.18em] text-emerald-600 uppercase mb-2">
                        {brand.name}
                      </p>
                      <div className="space-y-2">
                        {brand.categories.map(cat => (
                          <Link
                            key={cat.name}
                            href={cat.href}
                            onClick={closeMobile}
                            className="block text-sm text-stone-500 hover:text-stone-900 transition-colors duration-150"
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {staticNavLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobile}
                className={cn(
                  "block py-2 text-2xl font-serif font-semibold leading-none transition-colors duration-150",
                  pathname === link.href ? "text-emerald-700" : "text-stone-800 hover:text-emerald-700"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Drawer footer */}
          <div className="px-6 py-5 border-t border-stone-200/60">
            <p className="text-[9px] font-semibold tracking-[0.18em] text-stone-400 uppercase">
              Proudly Kenyan · Natural Cosmetics
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
