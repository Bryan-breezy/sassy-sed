"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowUp } from 'lucide-react'

export function BackToTopButton() {
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  if (!showBackToTop) {
    return null
  }

  return (
    <Button onClick={scrollToTop} className="fixed bottom-8 right-8 h-12 w-12 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg z-50" aria-label="Back to top">
      <ArrowUp className="h-6 w-6" />
    </Button>
  )
}