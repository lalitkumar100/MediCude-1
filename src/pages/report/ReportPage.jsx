import React, { useState } from "react"; // Added useState import
import { AppSidebar } from "@/components/AppSidebar"
import PageBreadcrumb from "@/components/PageBreadcrumb"
import SectionHeader from "@/components/SectionHeader"

import { MainPanel } from "@/components/panels/main-panel"

import { ThemeProvider } from "@/components/theme-provider"


import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// Added Shell icon here
import { Factory, ReceiptText, CalendarX, LineChart, Shell } from "lucide-react" 
import { useNavigate, Link } from "react-router-dom";

export default function ReportPage() {
  const navigate = useNavigate();
   const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <ThemeProvider>
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="relative"> {/* Added relative to ensure button positioning context */}
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[data-collapsible=icon]/sidebar-wrapper:h-12">
          <PageBreadcrumb
            items={[
              { label: "PharmaDesk", href: "/dashboard" },
              { label: "Reports", href: "/report" }
            ]} />
        </header>

        {/* Main Content */}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <SectionHeader
            title="Reports Overview"
            description="Access various reports to gain insights into your pharmacy operations."
          />
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Wholesaler Card */}
            <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:bg-cyan-100  active:bg-cyan-100 active:shadow-lg"
              onClick={() => navigate("/report/wholesaler")}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Wholesaler Reports</CardTitle>
                <Factory className="h-4 w-4 text-cyan-600" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-cyan-600">Supplier Insights</div>
                <p className="text-xs text-muted-foreground">Track purchases by wholesaler</p>
              </CardContent>
            </Card>

            {/* Invoice Card */}
            <Card
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:bg-purple-100  active:bg-purple-100 active:shadow-lg"
              onClick={() => navigate("/report/invoice")}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Invoice Reports</CardTitle>
                <ReceiptText className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent >
                <div className="text-xl font-bold text-purple-600">Transaction Details</div>
                <p className="text-xs text-muted-foreground">View and manage invoices</p>
              </CardContent>
            </Card>

            {/* Expiry Card */}
            <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:bg-red-100  active:bg-red-100 active:shadow-lg"
             onClick={() => navigate("/report/stock-return")}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Purchase Return Reports</CardTitle>
                <CalendarX className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-red-600">Return Stock</div>
                <p className="text-xs text-muted-foreground">Monitor upcoming purchase returns</p>
              </CardContent>
            </Card>

            {/* Sales Card */}
            <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:bg-green-100  active:bg-green-100 active:shadow-lg"
            onClick={() => navigate("/report/sales")}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sales Reports</CardTitle>
                <LineChart className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-green-600">Revenue & Trends</div>
                <p className="text-xs text-muted-foreground">Analyze sales performance</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* --- Floating Round Shell Button --- */}
        <button 
          className="fixed bottom-8 right-8 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all active:scale-95 z-50 flex items-center justify-center"
         onClick={() => setIsPanelOpen(true)}>
        
          <Shell className="h-6 w-6" />
        </button>
   <MainPanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
      </SidebarInset>
    </SidebarProvider>
     </ThemeProvider>
  )
}