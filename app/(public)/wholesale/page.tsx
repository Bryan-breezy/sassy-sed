'use client'

import { Package, Users, TrendingUp, Award, CheckCircle, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// ========== Main Page Component ==========
export default function RetailWholesalePage() {
  const benefits = [
    {
       icon: Package, 
       title: "Bulk Pricing", 
       description: "Competitive wholesale prices with considerable discounts." 
    }, 
    { 
      icon: Users, 
      title: "Dedicated Support", 
      description: "Personal account manager and priority customer service for all wholesale partners." 
    }, 
    { 
      icon: TrendingUp, 
      title: "Marketing Support", 
      description: "Point-of-sale materials, and marketing resources to boost your sales." 
    }, 
    { 
      icon: Award, 
      title: "Quality Guarantee", 
      description: "100% satisfaction guarantee with easy returns and exchanges for defective products." 
    }
  ]

  const requirements = [
    "Valid business registration certificate", 
    "Tax compliance certificate (PIN)", 
    "Business bank account details", 
    "Physical business location", 
    "Minimum order commitment"
  ]

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <main>
        {/* Breadcrumb */}
        <div className="bg-gray-100 border-b border-gray-200">
          <div className="container mx-auto px-4 py-3">
            <nav className="text-sm font-medium text-gray-500 truncate">
              <Link href="/" className="hover:text-green-600">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium">Wholesale</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gradient-to-br from-green-50 to-white">
        <div className="container mx-auto max-w-5xl">
          <div className="max-w-4xl mx-auto text-center">
            {/* Heading */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Partner with{" "}
              <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                Sassy Products
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed sm:leading-loose max-w-3xl mx-auto mb-6 sm:mb-8 px-2 sm:px-0">
              Join Kenya's leading natural cosmetics brand as a retail or wholesale partner. 
              Offer your customers premium, skin-safe products while building a profitable business relationship with us.
            </p>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 sm:mb-10">
              <a 
                href="https://sassyproducts.co.ke/wp-content/uploads/2025/05/WIP_Sedoso-Catalog-09092024_compressed.pdf" 
                className="
                  inline-flex
                  items-center
                  justify-center
                  bg-green-600
                  text-white
                  px-8
                  py-4
                  text-base
                  font-semibold
                  rounded-lg
                  shadow-lg
                  transition-all duration-300
                  hover:bg-green-700
                  hover:shadow-xl
                  hover:-translate-y-1
                  w-full sm:w-auto
                  min-w-[200px]
                  text-center
                  border-2 border-green-600
                  h-[52px]
                "
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Catalogue
              </a>
              
              <Button 
                asChild
                variant="outline" 
                className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 rounded-lg font-semibold w-full sm:w-auto transition-all duration-300 text-base min-w-[200px] h-[52px]"
              >
                <Link href="/contacts">
                  Become a Partner
                </Link>
              </Button>
            </div>

            {/* Stats Section */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-12 lg:gap-16 mt-8 sm:mt-12">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600 mb-1">
                  200+
                </div>
                <div className="text-sm sm:text-base font-medium text-gray-600">
                  Wholesale Partners
                </div>
              </div>

              <div className="hidden sm:block w-px h-12 bg-green-200"></div>
              <div className="sm:hidden w-12 h-px bg-green-200"></div>

              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600 mb-1">
                  90+
                </div>
                <div className="text-sm sm:text-base font-medium text-gray-600">
                  Products Available
                </div>
              </div>

              <div className="hidden lg:flex items-center">
                <div className="w-px h-12 bg-green-200"></div>
              </div>
              
              <div className="hidden lg:block text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600 mb-1">
                  5+
                </div>
                <div className="text-sm sm:text-base font-medium text-gray-600">
                  Years Experience
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 sm:mt-12 flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>No Minimum Order</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Competitive Pricing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Marketing Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* Benefits */}
        <section className="py-20 md:py-24 px-4 bg-white">
          <div className="container mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Partner with Sassy Products?
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                Join a growing network of successful retailers 
                and enjoy the benefits of partnering with Kenya's most trusted natural cosmetics brand.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="text-center p-6 border-green-100 hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <benefit.icon className="w-8 h-8 text-green-600" />
                    </div>
                  <CardHeader>
                    <CardTitle className="text-xl mb-4">
                      {benefit.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {benefit.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* Requirements & Application */}
<section className="py-16 sm:py-20 px-4 sm:px-6 bg-gray-50">
  <div className="container mx-auto max-w-4xl">
    {/* Header */}
    <div className="text-center mb-10 sm:mb-12">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
        Partnership Requirements
      </h2>
      <p className="text-base sm:text-lg text-gray-700 leading-relaxed sm:leading-loose max-w-3xl mx-auto">
        To ensure successful partnerships, we have established the following requirements 
        for our retail and wholesale partners:
      </p>
    </div>

    {/* Requirements List */}
    <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-10">
      {requirements.map((req) => (
        <div key={req} className="flex items-start space-x-3 sm:space-x-4">
          <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 mt-0.5 flex-shrink-0" /> 
          <span className="text-sm sm:text-base text-gray-700 font-medium leading-relaxed">
            {req}
          </span>
        </div>
      ))}
    </div>

    {/* Benefits Card */}
    <div className="p-4 sm:p-6 bg-green-100 rounded-lg sm:rounded-xl border border-green-200">
      <div className="flex items-center space-x-2 mb-3 sm:mb-4">
        <h3 className="font-semibold text-green-800 text-base sm:text-lg">Additional Benefits</h3>
      </div>
      <ul className="text-xs sm:text-sm text-green-700 space-y-2 sm:space-y-3">
        <li className="flex items-start space-x-2">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
          <span>30-day payment terms for established partners</span>
        </li>
        <li className="flex items-start space-x-2">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
          <span>Seasonal promotional support</span>
        </li>
        <li className="flex items-start space-x-2">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
          <span>Product training for your staff</span>
        </li>
        <li className="flex items-start space-x-2">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
          <span>Exclusive access to new product launches</span>
        </li>
      </ul>
    </div>

    {/* CTA Section */}
    <div className="mt-12 sm:mt-16 text-center">
      <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-200">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Ready to Partner With Us?</h3>
        <p className="text-gray-600 mb-6 text-base sm:text-lg">
          Contact our partnership team to discuss opportunities and get started.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            asChild
            className="bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-3 text-base font-semibold rounded-lg transition-all duration-300"
          >
            <Link href="/contacts">
              Contact Partnership Team
            </Link>
          </Button>

        </div>
      </div>
    </div>
  </div>
</section>
      </main>

    </div>
  )
}