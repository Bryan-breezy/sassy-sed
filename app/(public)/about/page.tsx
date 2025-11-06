"use client"

import { Leaf, Heart, Award, Shield, BadgeCheck, ThumbsUp, ArrowUp, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { supabase } from '@/lib/supabase-client'

const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME || "uploads"

// Helper function to get image URL
const getImageUrl = (imagePath: string) => {
  const { data } = supabase.storage.from(bucketName).getPublicUrl(imagePath)
  return data.publicUrl
}

const values = [
    { 
      icon: Shield, 
      title: "Skin-Safe Promise", 
      description: "Every product is dermatologically tested to ensure it's safe for all skin types." 
    },
    { 
      icon: Heart, 
      title: "Made with Love", 
      description: "Each product is crafted with care and attention to detail in our Kenyan facilities." 
    },
    { 
      icon: Award, 
      title: "Quality Assured", 
      description: "We maintain the highest quality standards in manufacturing and testing." 
    },
]

const team = [
    { 
  name: "Sarah Wanjiku", 
  role: "Founder & CEO", 
  image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400", 
  bio: "Sarah founded Sassy Products with a vision to create natural, skin-safe cosmetics that celebrate African beauty." 
},
    { name: "Dr. James Mwangi", role: "Head of Product Development", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400", bio: "With 15 years in cosmetic chemistry, James ensures all our products meet the highest safety standards." },
    { name: "Grace Akinyi", role: "Head of Operations", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400", bio: "Grace oversees our manufacturing processes and ensures consistent quality across all product lines." },
    { name: "Michael Ochieng", role: "Marketing Director", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400", bio: "Michael leads our mission to educate customers about natural beauty and skin-safe cosmetics." },
];

const milestones = [
    { 
      year: "2019", 
      title: "Company Founded", 
      description: "Sassy Products was established with a mission to create natural, skin-safe cosmetics in Kenya." 
    },
    { 
      year: "2020", 
      title: "First Product Launch", 
      description: "Launched our first products, that includes shower gels, hand wash, curl activator and shampoos." 
    },
    { 
      year: "2021", 
      title: "Wholesale Expansion", 
      description: "Partnered with our first wholesale stores." 
    },
    { 
      year: "2022", 
      title: "Product Line Growth", 
      description: "Expanded to over 50 products across skincare, cleaning and body care products." 
    },
    { 
      year: "2023", 
      title: "Regional Expansion", 
      description: "Extended operations to Uganda and Tanzania, serving the East African market." 
    },
    {
      year: "2025",
      title: "Brand Expansion",
      description: "Dr. Mehos was launched for premium, specialty in production of luxurious skin and haircare products."
    }
]

const items = [
    {
      icon: <Award className="w-10 h-10 text-green-600" />,
      title: "Two factories & R&D lab outside Nairobi",
      description:
        "Recognized for our outstanding contribution to the beauty industry with innovative product lines.",
    },
    {
      icon: <BadgeCheck className="w-10 h-10 text-green-600" />,
      title: "Our Brands",
      description: (
        <>
          <strong>Sedoso®, Saa® & Dr. Mehos®</strong> are not your average
          brands—they’re bold, unapologetic, and built for those who dare to
          stand out.
        </>
      ),
    },
    {
      icon: <ThumbsUp className="w-10 h-10 text-green-600" />,
      title: "Customer Choice Award",
      description:
        "Focus on natural extracts, customer care, and constant innovation.",
    },
]
const testimonials = [
    {
      text: "Sassy Products has transformed my skincare routine. Their products are a staple in my daily regimen!",
    },
    {
      text: "Partnering with Sassy Products has been a game-changer for our salon. Our clients love their range!",
    },
    {
      text: "I’ve never felt more confident in my skin. Sassy Products delivers on their promise of quality.",
    },
]

export default function AboutPage() {
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <div className="min-h-screen bg-white">

      {/* Breadcrumb */}
      <div className="bg-green-50 border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="text-sm text-gray-600">
            <Link href="/" className="hover:text-green-600">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">About Us</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 sm:py-20 px-4 bg-gradient-to-br from-green-50 to-white">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge className="mb-4 sm:mb-6 bg-green-100 text-green-800 border-green-200 text-sm">
            PROUDLY KENYAN
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            Our Story of 
            <span className="block sm:inline bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent sm:ml-2">
              Natural Beauty
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto px-2">
            Founded in 2019, Sassy Products was born from a simple belief: 
            everyone deserves access to natural, skin-safe cosmetics that celebrate their unique beauty.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          {/* Mission Section */}
          <div className="text-center mb-12 sm:mb-16">
            <Badge className="mb-4 bg-green-100 text-green-800 border-green-200 text-sm font-medium">
              Our Mission
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Creating Natural & Skin-Safe Cosmetics
            </h2>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed sm:leading-loose max-w-3xl mx-auto">
              To create only natural and skin-safe cosmetics 
              using superior ingredients and internationally recognized production standards.
            </p>
          </div>

          {/* Story Section */}
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center justify-center">
              <span className="w-8 h-0.5 bg-green-500 mr-3"></span>
              Our Story
              <span className="w-8 h-0.5 bg-green-500 ml-3"></span>
            </h3>
            <div className="space-y-4 sm:space-y-6 max-w-3xl mx-auto">
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed sm:leading-loose">
                Sassy Cosmetics & Beauty Products (K) Ltd is a proudly Kenyan manufacturer dedicated to creating 
                affordable, high-quality beauty and home care solutions.
              </p>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed sm:leading-loose">
                With over 5 years of expertise, we blend science, tradition, and innovation 
                to bring you safe and effective products for hair, skin, and home.
              </p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 sm:mt-16 flex flex-wrap justify-center gap-6 sm:gap-8">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">5+</div>
              <div className="text-sm font-medium text-gray-700">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">100%</div>
              <div className="text-sm font-medium text-gray-700">Locally Manufactured</div>
            </div>
          </div>

          <div className="mt-12 sm:mt-16 text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">
                <Link href="/products">
                  Discover Our Products
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 rounded-full font-semibold transition-all duration-300">
                <Link href="/about">
                  Learn More About Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-green-50">
        <div className="container mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Our Core Values
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2 sm:px-0 leading-relaxed">
              These values guide everything we do, from product development to customer service.
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {values.map((value) => (
              <Card 
                key={value.title} 
                className="text-center p-5 sm:p-6 bg-white hover:shadow-lg transition-all duration-300 border border-green-100/50 hover:border-green-200 hover:-translate-y-1"
              >
                {/* Icon Container */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-green-200 transition-colors">
                  <value.icon className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 group-hover:scale-110 transition-transform" />
                </div>
                
                {/* Content */}
                <CardHeader className="p-0">
                  <CardTitle className="text-lg sm:text-xl mb-3 sm:mb-4 text-gray-900 font-bold">
                    {value.title}
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base text-gray-600 leading-relaxed sm:leading-loose">
                    {value.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* Optional: Add a decorative element for visual interest */}
          <div className="mt-12 sm:mt-16 text-center">
            <div className="inline-flex items-center justify-center space-x-2 text-green-700">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="container mx-auto">
          {/* Heading */}
          <div className="text-center mb-12 sm:mb-16">
            <Badge className="mb-4 bg-green-100 text-green-800 border-green-200 text-sm font-medium">
              Our Timeline
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Our Journey
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From a small startup to Kenya&apos;s leading natural cosmetics brand.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative max-w-4xl mx-auto">
            {/* Vertical line - Hidden on mobile, visible on tablet+ */}
            <div
              className="hidden sm:block absolute left-4 sm:left-8 top-0 h-full w-0.5 bg-green-200"
              aria-hidden="true"
            />
            
            <div className="space-y-8 sm:space-y-12">
              {milestones.map((milestone, index) => (
                <div key={milestone.year} className="relative pl-0 sm:pl-20">
                  {/* Year bubble - Mobile: above content, Desktop: left aligned */}
                  <div className="flex sm:absolute sm:left-0 sm:top-1.5 items-center mb-4 sm:mb-0">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg text-sm sm:text-base">
                      {milestone.year}
                    </div>
                    {/* Connector line for mobile */}
                    <div className="hidden sm:block w-4 h-0.5 bg-green-300 ml-2"></div>
                  </div>

                  {/* Content */}
                  <div className="bg-green-50/50 sm:bg-transparent rounded-xl sm:rounded-none p-4 sm:p-0">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                      {milestone.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed sm:leading-loose">
                      {milestone.description}
                    </p>
                  </div>

                  {/* Mobile separator between items */}
                  {index < milestones.length - 1 && (
                    <div className="sm:hidden w-full h-px bg-green-100 mt-6"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Optional: Progress indicator */}
          <div className="mt-12 sm:mt-16 text-center">
            <div className="inline-flex items-center space-x-2 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Continuing our journey...</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          {/* Heading */}
          <div className="text-center mb-10 sm:mb-12">
            <Badge className="mb-4 bg-green-100 text-green-800 border-green-200 text-sm font-medium">
              Why Choose Us
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Our Edge
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Discover what makes Sassy Products stand out in the world of natural cosmetics.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {items.map((item, index) => (
              <div
                key={index}
                className="group text-center p-5 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200 hover:-translate-y-1"
              >
                {/* Icon Container */}
                <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 bg-green-100 rounded-full group-hover:bg-green-200 group-hover:scale-110 transition-all duration-300">
                  <div className="text-green-600 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                </div>

                {/* Content */}
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 leading-tight">
                  {item.title}
                </h4>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed sm:leading-loose">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Optional: Bottom CTA */}
          <div className="mt-12 sm:mt-16 text-center">
            <div className="inline-flex items-center space-x-2 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">Quality you can trust</span>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

    <section className="py-12 sm:py-16 px-4 bg-green-50">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-base sm:text-lg text-gray-600">
            Real experiences from our valued customers
          </p>
        </div>

        {/* Mobile: Horizontal scroll */}
        <div className="sm:hidden flex overflow-x-auto pb-4 -mx-4 px-4 space-x-4 snap-x snap-mandatory scrollbar-hide">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="flex-none w-[280px] snap-start bg-white rounded-xl p-5 shadow-sm border border-gray-100"
            >
              <Quote className="w-6 h-6 text-green-600 mb-3" />
              <p className="text-sm text-gray-700 leading-relaxed mb-4">“{item.text}”</p>
            </div>
          ))}
        </div>

        {/* Desktop: Grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <Quote className="w-8 h-8 text-green-600 mb-4" />
              <p className="text-gray-700 leading-relaxed mb-6">“{item.text}”</p>
            </div>
          ))}
        </div>
      </div>
    </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-500 to-green-500">
        <div className="container mx-auto text-center max-w-3xl text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join the Sassy Family</h2>
          <p className="text-green-100 mb-8 text-lg leading-relaxed">
            Experience the difference of natural, skin-safe cosmetics. Discover products that love your skin as much as you do.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-white text-green-600 hover:bg-green-600 hover:text-white font-semibold px-8 py-3 h-auto text-base">
                <Link href="/products">Shop Our Products</Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-green-600 bg-transparent font-semibold px-8 py-3 h-auto text-base"
            >
                <Link href="/stores">Find a Store</Link>
            </Button>

          </div>
        </div>
      </section>
      

      {showBackToTop && (
        <Button 
          onClick={scrollToTop} 
          className="fixed bottom-8 right-8 h-12 w-12 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg z-50" 
          aria-label="Back to top"
        >
          <ArrowUp className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}