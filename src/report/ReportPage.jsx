import React from "react"
import { AppSidebar } from "@/components/AppSidebar"
import PageBreadcrumb from "@/components/PageBreadcrumb"
import SectionHeader from "@/components/SectionHeader"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Factory, ReceiptText, CalendarX, LineChart } from "lucide-react"
import { useNavigate, Link } from "react-router-dom";

export default function ReportPage() {
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[data-collapsible=icon]/sidebar-wrapper:h-12">
                      <PageBreadcrumb
                               items={[
                 { label: "PharmaDesk", href: "/dashboard" },
                 { label: "Reports" , href: "/report"}]} />
        </header>

        {/* Main Content */}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Welcome Section */}
          <SectionHeader
            title="Reports Overview"
            description="Access various reports to gain insights into your pharmacy operations."
          />
          {/* Report Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card
              className="cursor-pointer hover:shadow-lg hover:bg-cyan-100 transition-shadow duration-200"
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

            <Card
              className="cursor-pointer hover:shadow-lg  hover:bg-purple-100 transition-shadow duration-200"
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

            <Card className="cursor-pointer hover:shadow-lg hover:bg-red-100 transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expiry Reports</CardTitle>
                <CalendarX className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-red-600">Expiring Stock</div>
                <p className="text-xs text-muted-foreground">Monitor upcoming expirations</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg hover:bg-green-100 transition-shadow duration-200"
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
      </SidebarInset>
    </SidebarProvider>
  )
}
