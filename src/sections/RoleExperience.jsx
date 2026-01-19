"use client"

import { useState } from "react"
import Button from "../ui/Button"

const roles = [
  {
    id: "worker",
    label: "Worker",
    features: ["Fast billing & checkout", "Stock entry", "AI guidance", "Personal todo list", "Customer management"],
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "manager",
    label: "Manager",
    features: ["Inventory overview", "Financial analytics", "Sales reports", "Team management", "Public todo list"],
    color: "from-teal-500 to-cyan-500",
  },
  {
    id: "admin",
    label: "Admin",
    features: ["System control", "User access", "Security settings", "Backups & recovery", "Integration setup"],
    color: "from-sky-500 to-blue-500",
  },
]

export default function RoleExperience() {
  const [activeRole, setActiveRole] = useState("worker")

  const activeRoleData = roles.find((r) => r.id === activeRole)

  return (
    <section className="w-full py-20 sm:py-32 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground">Built for Every Role</h2>
          <p className="text-lg text-muted-foreground">
            Tailored experiences for workers, managers, and administrators
          </p>
        </div>

        {/* Role tabs */}
        <div className="flex justify-center gap-4 mb-12">
          {roles.map((role) => (
            <Button
              key={role.id}
              onClick={() => setActiveRole(role.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                activeRole === role.id
                  ? `bg-gradient-to-r ${role.color} text-white shadow-lg`
                  : "bg-white border-2 border-border text-foreground hover:border-accent"
              }`}
            >
              {role.label}
            </Button>
          ))}
        </div>

        {/* Active role display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 order-2 lg:order-1">
            <h3 className="text-3xl font-bold text-foreground">{activeRoleData?.label} Experience</h3>

            <ul className="space-y-3">
              {activeRoleData?.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent"></div>
                  <span className="text-base text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="order-1 lg:order-2">
            <div
              className={`relative w-full aspect-square rounded-2xl bg-gradient-to-br ${
                activeRoleData?.color
              } opacity-20 flex items-center justify-center`}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">
                  {activeRole === "worker" && "🏪"}
                  {activeRole === "manager" && "📈"}
                  {activeRole === "admin" && "⚙️"}
                </div>
                <p className="text-xl font-semibold text-foreground">{activeRoleData?.label}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
