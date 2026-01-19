"use client"

import { useEffect, useRef, useState } from "react"

const features = [
  {
    id: "stock",
    title: "Automated Stock Entry",
    subtitle: "From bill to inventory instantly",
    description:
      "Transform paper bills and receipts into real-time inventory updates. Our AI reads supplier invoices and syncs stock automatically, eliminating manual entry errors.",
    icon: "📦",
  },
  {
    id: "ai",
    title: "AI Assistant",
    subtitle: "Smart guidance in real time",
    description:
      "Get intelligent recommendations for stock ordering, pricing adjustments, and inventory optimization. Your AI pharmacist is always available.",
    icon: "🤖",
  },
  {
    id: "inventory",
    title: "Smart Inventory",
    subtitle: "Always accurate, always synced",
    description:
      "Real-time stock levels across all counters and locations. Instant alerts when stock drops below thresholds. Perfect accuracy, zero discrepancies.",
    icon: "📊",
  },
  {
    id: "expiry",
    title: "Expiry Alerts",
    subtitle: "Prevent loss before it happens",
    description:
      "Automated expiry tracking with actionable alerts. Never lose profit to expired medications. Track batch numbers and expiry dates effortlessly.",
    icon: "⏰",
  },
  {
    id: "finance",
    title: "FinTrack",
    subtitle: "Clear financial insight",
    description:
      "Comprehensive financial dashboard. Track revenue, margins, discounts, and profitability. Make data-driven decisions with detailed analytics.",
    icon: "💰",
  },
  {
    id: "backup",
    title: "Secure Backup",
    subtitle: "Medical-grade data safety",
    description:
      "Enterprise-grade encryption and automatic backups. HIPAA-compliant security. Your pharmacy data is protected 24/7 with redundant systems.",
    icon: "🔒",
  },
  {
    id: "todo",
    title: "Todo List",
    subtitle: "Personal and public tasks",
    description:
      "Organize daily operations with smart todo management. Assign tasks to team members, track progress, and ensure nothing is missed.",
    icon: "✓",
  },
  {
    id: "access",
    title: "Role-Based Access",
    subtitle: "Worker · Manager · Admin",
    description:
      "Customize permissions per role. Workers handle billing and stock. Managers oversee operations. Admins control security and integrations.",
    icon: "👥",
  },
]

export default function Features() {
  const containerRef = useRef(null)
  const [visibleFeatures, setVisibleFeatures] = useState(new Set())

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleFeatures((prev) => new Set(prev).add(entry.target.id))
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = containerRef.current?.querySelectorAll("[data-feature]")
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <section id="features" className="w-full py-20 sm:py-32 bg-white relative overflow-hidden">
      {/* Animated connector line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-cyan-300 to-transparent opacity-40"></div>

      <div ref={containerRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground">One Intelligent System</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            All features connected through our AI engine for seamless pharmacy operations
          </p>
        </div>

        {features.map((feature, index) => (
          <div
            key={feature.id}
            data-feature
            id={`feature-${feature.id}`}
            className={`flex flex-col ${
              index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
            } gap-12 lg:gap-16 items-center transition-opacity duration-700 ${
              visibleFeatures.has(`feature-${feature.id}`) ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Icon/Image placeholder */}
            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-2xl bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-100 flex items-center justify-center shadow-lg">
                <div className="text-8xl opacity-80">{feature.icon}</div>
                <div className="absolute inset-0 rounded-2xl border border-accent/30"></div>
              </div>
            </div>

            {/* Text content */}
            <div className="flex-1 space-y-4">
              <div className="inline-block px-3 py-1 bg-accent/10 rounded-full">
                <p className="text-sm font-medium text-accent">{feature.subtitle}</p>
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">{feature.title}</h3>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
