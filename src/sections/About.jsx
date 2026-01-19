export default function About() {
  return (
    <section className="w-full py-20 sm:py-32 bg-gradient-to-b from-white to-cyan-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text content */}
          <div className="space-y-6">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight">About MediQB</h2>
            <div className="space-y-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
              <p>
                MediQB is an AI-driven pharmacy management system designed by engineers and pharmacists for the modern
                pharmacy.
              </p>
              <p>
                We combine artificial intelligence with medical-grade security to solve the real problems pharmacies
                face: inventory accuracy, expiry management, and financial tracking.
              </p>
              <p>Every feature is built with precision. Every interaction is secure. Every decision is data-driven.</p>
            </div>

            <div className="flex flex-wrap gap-6 pt-4">
              <div>
                <div className="text-2xl font-bold text-primary">500+</div>
                <p className="text-sm text-muted-foreground">Pharmacies Worldwide</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">99.9%</div>
                <p className="text-sm text-muted-foreground">Uptime Guarantee</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">24/7</div>
                <p className="text-sm text-muted-foreground">Customer Support</p>
              </div>
            </div>
          </div>

          {/* Illustration area */}
          <div className="relative">
            <div className="relative w-full aspect-square rounded-2xl bg-gradient-to-br from-cyan-100 via-blue-50 to-teal-100 flex items-center justify-center overflow-hidden">
              {/* Abstract AI/Pharmacy illustration with shapes */}
              <svg className="w-full h-full p-8" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
                {/* Medical cross */}
                <g opacity="0.1">
                  <rect x="130" y="50" width="40" height="200" fill="#0891b2" />
                  <rect x="50" y="130" width="200" height="40" fill="#0891b2" />
                </g>

                {/* AI nodes and connections */}
                <circle cx="100" cy="80" r="12" fill="#0ea5e9" opacity="0.6" />
                <circle cx="200" cy="100" r="12" fill="#06b6d4" opacity="0.6" />
                <circle cx="150" cy="200" r="12" fill="#0891b2" opacity="0.6" />
                <circle cx="80" cy="180" r="12" fill="#06b6d4" opacity="0.6" />
                <circle cx="220" cy="180" r="12" fill="#0ea5e9" opacity="0.6" />

                {/* Connecting lines */}
                <line x1="100" y1="80" x2="150" y2="200" stroke="#0ea5e9" strokeWidth="1.5" opacity="0.4" />
                <line x1="200" y1="100" x2="150" y2="200" stroke="#06b6d4" strokeWidth="1.5" opacity="0.4" />
                <line x1="100" y1="80" x2="200" y2="100" stroke="#0891b2" strokeWidth="1.5" opacity="0.4" />
                <line x1="80" y1="180" x2="220" y2="180" stroke="#0ea5e9" strokeWidth="1.5" opacity="0.4" />
              </svg>

              <div className="absolute inset-0 rounded-2xl border border-cyan-200"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
