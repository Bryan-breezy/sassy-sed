'use client'

import React, { useState, useEffect } from 'react'
import { 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  ArrowUp 
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { 
  Card, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"

import Link from "next/link"

export default function ContactsPage() {
  const [showBackToTop, setShowBackToTop] = useState(false)

  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    subject: '',
    message: '',
    status: 'idle', 
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  }
    
  const handleSelectChange = (value: string) => {
    setFormState(prevState => ({ ...prevState, department: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormState(prevState => ({ ...prevState, status: 'loading' }))
    console.log("Form data submitted:", formState)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setFormState(prevState => ({ ...prevState, status: 'success' }))
    setTimeout(() => {
        setFormState({
            firstName: '', lastName: '', email: '', phone: '',
            department: '', subject: '', message: '', status: 'idle'
        })
    }, 4000)
  }

  useEffect(() => {
    const checkScroll = () => {
      if (window.scrollY > 300) setShowBackToTop(true)
      else setShowBackToTop(false)
    }
    window.addEventListener("scroll", checkScroll)
    return () => window.removeEventListener("scroll", checkScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const contactInfo = [
    { 
      icon: Phone, 
      title: "Phone", 
      details: [<a href="tel:+254 706 238 579" key="phone-link">Call us at +254 706 238 579</a>], 
      description: "Call us during business hours" 
    },
    { 
      icon: Mail, 
      title: "Email", 
      details: [<a href="mailto:info@sassyproducts.co.ke" key="email-link">info@sassyproducts.co.ke</a>],
      description: "We'll respond within 24 hours" 
    },
    { 
      icon: Clock, 
      title: "Business Hours", 
      details: ["Mon - Fri: 8:00 AM - 4:00 PM", "Sat: 8:00 AM - 1:00 PM"], 
      description: "Sunday: Closed" 
    },
  ]

  const departments = [
    { value: "general", label: "General Inquiry" },
    { value: "products", label: "Product Information" },
    { value: "wholesale", label: "Wholesale & Retail" },
    { value: "support", label: "Customer Support" },
    { value: "careers", label: "Careers" },
    { value: "media", label: "Media & Press" },
  ]

  return (
    <div className="min-h-screen bg-white">

      {/* Breadcrumb */}
      <div className="bg-green-50 border-b">
        <div className="container mx-auto px-4 max-w-7xl py-3">
          <nav className="text-sm text-gray-600">
            <Link href="/" className="hover:text-green-600">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Contacts</span>
          </nav>
        </div>
      </div>
      
      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 bg-gradient-to-br from-green-50 to-white">
        <div className="container mx-auto max-w-5xl text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Get in Touch
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We'd love to hear from you! Whether you have questions about our products, 
            need support, or want to explore business opportunities, our team is here to help.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow border-green-100">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <info.icon className="w-8 h-8 text-green-600" />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl mb-4">{info.title}</CardTitle>
                  <div className="space-y-2 mb-4">
                    {info.details.map((detail, detailIndex) => (
                      <p key={detailIndex} className="text-gray-900 font-medium">{detail}</p>
                    ))}
                  </div>
                  <CardDescription className="text-gray-600">{info.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact Form */}
      {/* <section className="py-12 sm:py-16 lg:py-24 px-4 bg-green-50">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl flex items-center">
                  <MessageCircle className="w-6 h-6 mr-3 text-green-600" /> Send us a Message
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <Input 
                        id="firstName" 
                        name="firstName" 
                        value={formState.firstName} 
                        onChange={handleInputChange} 
                        placeholder="Your first name" 
                        className="w-full border-green-200 focus:border-green-400" 
                        required 
                      />
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <Input 
                        id="lastName" 
                        name="lastName" 
                        value={formState.lastName} 
                        onChange={handleInputChange} 
                        placeholder="Your last name" 
                        className="w-full border-green-200 focus:border-green-400" 
                        required 
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={formState.email} 
                      onChange={handleInputChange} 
                      placeholder="your.email@example.com" 
                      className="w-full border-green-200 focus:border-green-400" 
                      required 
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      value={formState.phone} 
                      onChange={handleInputChange} 
                      placeholder="+254 700 000 000" 
                      className="w-full border-green-200 focus:border-green-400" 
                    />
                  </div>

                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <Select name="department" onValueChange={handleSelectChange} value={formState.department}>
                      <SelectTrigger id="department" className="w-full border-green-200 focus:border-green-400">
                        <SelectValue placeholder="Select a department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.value} value={dept.value}>{dept.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                    <Input id="subject" name="subject" value={formState.subject} onChange={handleInputChange} placeholder="Brief subject of your message" className="w-full border-green-200 focus:border-green-400" required />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                    <Textarea id="message" name="message" value={formState.message} onChange={handleInputChange} placeholder="Tell us how we can help you..." rows={6} className="w-full border-green-200 focus:border-green-400" required />
                  </div>

                  <Button type="submit" disabled={formState.status === 'loading'} className="w-full bg-gradient-to-r from-green-500 to-green-500 hover:from-lime-600 hover:to-lime-600 text-white py-3 disabled:opacity-50">
                    {formState.status === 'loading' ? 'Sending...' : <><Send className="w-4 h-4 mr-2" /> Send Message</>}
                  </Button>

                  {formState.status === 'success' && <p className="text-center text-green-600">Message sent successfully! We'll be in touch soon.</p>}
                  {formState.status === 'error' && <p className="text-center text-red-600">Something went wrong. Please try again.</p>}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section> */}

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Find quick answers to common questions.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-6 border-green-100">
              <h3 className="font-semibold text-gray-900 mb-3">Are your products locally made or imported?</h3>
              <p className="text-gray-600">
                Yes! All our products are all locally made and packaged. 
              </p>
            </Card>

            <Card className="p-6 border-green-100">
              <h3 className="font-semibold text-gray-900 mb-3">Do you offer wholesale pricing?</h3>
              <p className="text-gray-600">
                We offer competitive wholesale pricing. 
                Contact our team using the contact provided.
              </p>
            </Card>

            <Card className="p-6 border-green-100">
              <h3 className="font-semibold text-gray-900 mb-3">Where can I buy your products?</h3>
              <p className="text-gray-600">
                Our products are available in our listed partnership stores, and other beauty and cosmetics outlets. 
                Check our store locator for the nearest location.
              </p>
            </Card>

            <Card className="p-6 border-green-100">
              <h3 className="font-semibold text-gray-900 mb-3">Do you ship internationally?</h3>
              <p className="text-gray-600">
                We are currently shipping to our neighbouring countries and looking forward to expanding soon.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 h-12 w-12 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg transition-opacity"
          aria-label="Back to top"
        >
          <ArrowUp className="h-6 w-6" />
        </Button>
      )}
    </div>
  )
}
