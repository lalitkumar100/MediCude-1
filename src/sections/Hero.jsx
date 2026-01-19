"use client"

import { useState, useEffect } from "react"
import Button from "../ui/Button"

export default function Hero() {
  const features = [
    "Automate stock entry",
    "Smart AI guidance",
    "Sync inventory",
    "Prevent expiry loss",
    "Track finances",
  ]

  const [currentFeature, setCurrentFeature] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const feature = features[currentFeature]
    let timeout

    if (!isDeleting && displayText !== feature) {
      timeout = setTimeout(() => {
        setDisplayText(feature.slice(0, displayText.length + 1))
      }, 80)
    } else if (isDeleting && displayText !== "") {
      timeout = setTimeout(() => {
        setDisplayText(displayText.slice(0, -1))
      }, 60)
    } else if (displayText === feature && !isDeleting) {
      timeout = setTimeout(() => {
        setIsDeleting(true)
      }, 2000)
    } else if (displayText === "" && isDeleting) {
      setIsDeleting(false)
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, currentFeature, features])

  return (
    <section className="relative min-h-screen w-full flex flex-col bg-white overflow-hidden">
      <header className="relative z-20 w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12">
            <img
              src="/images/screenshot-202026-01-04-20200018.png"
              alt="MediQB Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">MediQB</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">Pharmacy AI Intelligence</p>
          </div>
        </div>
      </header>

      {/* Background with gradient overlay */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50 opacity-60"></div>
        <svg className="absolute w-full h-full opacity-10" viewBox="0 0 1200 600" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0891b2" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="1200" height="600" fill="url(#grid)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full flex items-center justify-center">
        <div className="space-y-8 animate-flow-in text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground">
            AI for Smarter Pharmacies
          </h1>

          <div className="h-24 flex items-center justify-center">
            <p className="text-xl sm:text-2xl text-secondary font-medium min-h-8">
              {displayText}
              <span className="animate-pulse-glow">|</span>
            </p>
          </div>


          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              className="px-8 py-6 text-base font-semibold rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all"
            >
              View System
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <div className="text-accent text-xs font-medium mb-2">Scroll to explore</div>
        <svg className="w-5 h-5 text-accent mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}
