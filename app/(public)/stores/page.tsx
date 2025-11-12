'use client'

import { useState, useEffect } from 'react'
import { MapPin, Phone, Clock, Navigation, Search, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

// --- Constant data defined outside the component ---
const allStores = [
    { 
      id: 1, 
      name: "Panda Mart", 
      address: "Garden City Mall, Thika Road, Nairobi", 
      phone: "0202 311 166", 
      image: "https://sassyproducts.co.ke/wp-content/uploads/2025/05/Panda-Mart-logo.jpg", 
      location: "Panda Mart", 
      hours: "9:00 AM - 9:00 PM", 
      featured: true, 
      coords: { lat: -1.2248, lng: 36.8859 } 
    },
    { 
      id: 2, 
      name: "Magunas", 
      address: "All Outlets", 
      image: "https://sassyproducts.co.ke/wp-content/uploads/2025/05/magunas.png", 
      location: "Magunas", 
      hours: "Varies by location" 
    },
    { 
      id: 3, 
      name: "Best Lady", 
      address: "All Outlets", 
      image: "https://sassyproducts.co.ke/wp-content/uploads/2025/05/bestlady.jpeg", 
      location: "Bestlady", 
      hours: "Varies by location" 
    },
    { 
      id: 4, 
      name: "Mathais Supermarket", 
      address: "Multiple locations in Central Kenya", 
      image: "https://sassyproducts.co.ke/wp-content/uploads/2025/05/mathais-logo.jpeg", 
      location: "Mathais supermarkets", 
      hours: "8:00 AM - 8:00 PM" 
    },
    { 
      id: 5, 
      name: "Powerstar Supermarket", 
      address: "Eastlands, Nairobi", 
      image: "https://sassyproducts.co.ke/wp-content/uploads/2025/05/powerstar.png", 
      location: "Powerstar Supermarket", 
      hours: "8:30 AM - 9:00 PM" 
    },
    { 
      id: 6, 
      name: "Jamaa Supermarket", 
      address: "Downtown, Nakuru", 
      phone: "0722 123 456", 
      image: "https://sassyproducts.co.ke/wp-content/uploads/2025/05/jamaa.jpeg", 
      location: "Jamaa supermarket", 
      hours: "8:00 AM - 8:00 PM", 
    },
]

export default function StoresPage() {
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [locationFilter, setLocationFilter] = useState('all')
  const [filteredStores, setFilteredStores] = useState(allStores)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)

    const delay = setTimeout(() => {
      const filtered = allStores.filter(store => {
        const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLocation = locationFilter === 'all' || store.location === locationFilter;
        return matchesSearch && matchesLocation;
      })
      setFilteredStores(filtered)
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(delay)
  }, [searchTerm, locationFilter])

  useEffect(() => {
    const checkScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true)
      } else {
        setShowBackToTop(false)
      }
    }
    window.addEventListener("scroll", checkScroll)
    return () => window.removeEventListener("scroll", checkScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Breadcrumb */}
      <div className="bg-green-50 border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="text-sm text-gray-600">
            <Link href="/" className="hover:text-green-600">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Stores</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 px-4 bg-green-50 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Find a Store Near You
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our products in person at stores across Kenya.
          </p>
      </section>

      {/* Stores Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Our Trusted Partners</h2>
              <p className="text-gray-600">Showing {filteredStores.length} of {allStores.length} stores.</p>
            </div>
            {isLoading ? (
              <div className="text-center py-12 text-gray-500">Loading stores...</div>
            ) : filteredStores.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredStores.map((store) => (
                  <Card 
                    key={store.id} 
                    className="hover:shadow-lg transition-shadow flex flex-col flex-grow"
                  >
                    <div className="relative">
                      <Image 
                        src={store.image || "/placeholder.svg"} 
                        alt={store.name} 
                        width={400} 
                        height={250} 
                        className="w-full h-48 object-contain bg-gray-100 p-2"
                      />
                      {store.featured && 
                        <Badge className="absolute top-2 right-2 bg-gradient-to-r from-green-500 to-green-500 text-white">
                          Featured
                        </Badge>}
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl text-gray-900">
                        {store.name}
                      </CardTitle>
                      {/* <Badge 
                        variant="secondary" 
                        className="bg-green-100 text-green-800 border-green-200 w-fit"
                      >
                        {store.location}
                      </Badge> */}
                    </CardHeader>

                    <CardContent className="space-y-3 flex-grow">
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                          <p className="text-gray-600">
                            {store.address}
                          </p>
                      </div>

                      {store.phone && 
                        <div className="flex items-start space-x-3">
                          <Phone className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                            <p className="text-gray-600">{store.phone}</p>
                        </div>
                      }

                      <div className="flex items-start space-x-3">
                        <Clock className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                          <p className="text-gray-600">
                            {store.hours}
                          </p>
                      </div>

                    </CardContent>
                    <div className="p-4 bg-gray-50 rounded-b-lg grid grid-cols-2 gap-2 mt-auto">
                        <Button 
                          variant="outline" 
                          asChild
                        >
                          <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.location)}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <MapPin className="w-4 h-4 mr-2"/>
                              View Map
                          </a>
                        </Button>
                        {store.coords && 
                          <Button asChild>
                            <a 
                              href={`https://www.google.com/maps/dir/?api=1&destination=${store.coords.lat},${store.coords.lng}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              <Navigation className="w-4 h-4 mr-2"/>
                              Directions
                            </a>
                          </Button>
                        }
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <h3 className="text-xl font-semibold">No Stores Found</h3>
                <p>Try adjusting your search or filter criteria.</p>
              </div>
            )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-500 to-green-500">
        <div className="container mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Interested in Wholesale?</h2>
          <p className="max-w-2xl mx-auto mb-8">
            Partner with us to bring Sassy Products to your customers. 
            Contact us for our wholesale catalog and pricing.
          </p>
          <Button 
            asChild 
            variant="outline" 
            className="border-white text-white hover:bg-white hover:text-green-600 bg-transparent px-8 py-3"
          >
            <Link href="/contacts">Become a Partner</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
