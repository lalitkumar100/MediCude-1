import React, { useState } from "react"; // Added useState import
import AnimatedReportCard from "@/components/AnimatedReportCard";
import SectionHeader from "@/components/SectionHeader"
import { Factory, ReceiptText, CalendarX, LineChart, Shell } from "lucide-react"


export default function ReportPage() {
  return (
    <>
      {/* Main Content */}
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <SectionHeader
          title="Reports Overview"
          description="Access various reports to gain insights into your pharmacy operations."
        />

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">

          <AnimatedReportCard
            title="Wholesaler Reports"
            subtitle="Supplier Insights"
            description="Track purchases by wholesaler"
            icon={Factory}
            navigateTo="/admin/report/wholesaler"
            hoverBg="hover:bg-cyan-100"
            textColor="text-cyan-600"
            iconColor="text-cyan-600"
          />

          <AnimatedReportCard
            title="Invoice Reports"
            subtitle="Transaction Details"
            description="View and manage invoices"
            icon={ReceiptText}
            navigateTo="/admin/report/invoice"
            hoverBg="hover:bg-purple-100"
            textColor="text-purple-600"
            iconColor="text-purple-600"
          />

          <AnimatedReportCard
            title="Purchase Return Reports"
            subtitle="Return Stock"
            description="Monitor upcoming purchase returns"
            icon={CalendarX}
            navigateTo="/admin/report/stock-return"
            hoverBg="hover:bg-red-100"
            textColor="text-red-600"
            iconColor="text-red-600"
          />

          <AnimatedReportCard
            title="Sales Reports"
            subtitle="Revenue & Trends"
            description="Analyze sales performance"
            icon={LineChart}
            navigateTo="/admin/report/sales"
            hoverBg="hover:bg-green-100"
            textColor="text-green-600"
            iconColor="text-green-600"
          />

        </div>


      </div>
    </>
  )
}