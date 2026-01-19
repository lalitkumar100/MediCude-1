export default function Reviews() {
  const reviews = [
    {
      title: "Faster Billing",
      description: "Reduced checkout time by 40%. Our billing system is lightning-fast.",
    },
    {
      title: "Fewer Errors",
      description: "Eliminated manual entry mistakes. AI verification catches discrepancies instantly.",
    },
    {
      title: "Expiry Loss Reduced",
      description: "Prevented 95% of expired medication losses with proactive alerts.",
    },
    {
      title: "Inventory Fully Automated",
      description: "Real-time sync across all locations. Zero stock discrepancies reported.",
    },
  ]

  return (
    <section className="w-full py-20 sm:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground">Pharmacy Insights</h2>
          <p className="text-lg text-muted-foreground">Real results from pharmacies using MediQB</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className="group p-8 rounded-2xl bg-gradient-to-br from-white to-blue-50 border border-cyan-100 hover:border-accent/50 transition-all"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {review.title}
                </h3>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed">{review.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
