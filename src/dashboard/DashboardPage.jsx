import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AppSidebar } from "@/components/AppSidebar"
import PageBreadcrumb from "@/components/PageBreadcrumb"
import SectionHeader from "@/components/SectionHeader"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Warehouse, TrendingUp, Users } from "lucide-react"

export default function DashboardPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      navigate("/login", { replace: true })
    }
  }, [navigate])


  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[data-collapsible=icon]/sidebar-wrapper:h-12">
                  <PageBreadcrumb
                           items={[
             { label: "PharmaDesk", href: "/dashboard" },
             { label: "dashboard" , href: "/dashboard"},
             
                           ]} />
        </header>

        {/* Main Content */}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Welcome Section */}
          <SectionHeader
            title="Dashboard Overview"
            description="Monitor key metrics and recent activities in your pharmacy."
          />

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Stock Items</CardTitle>
                <Package className="h-4 w-4 text-cyan-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-cyan-600">1,234</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
                <Warehouse className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">23</div>
                <p className="text-xs text-muted-foreground">Requires attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">$45,231</div>
                <p className="text-xs text-muted-foreground">+12.5% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">12</div>
                <p className="text-xs text-muted-foreground">Currently on duty</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Stock Updates</CardTitle>
                <CardDescription>Latest inventory changes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Paracetamol 500mg</p>
                    <p className="text-sm text-muted-foreground">Added 100 units</p>
                  </div>
                  <span className="text-sm text-green-600">+100</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Amoxicillin 250mg</p>
                    <p className="text-sm text-muted-foreground">Sold 25 units</p>
                  </div>
                  <span className="text-sm text-red-600">-25</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Vitamin C Tablets</p>
                    <p className="text-sm text-muted-foreground">Added 50 units</p>
                  </div>
                  <span className="text-sm text-green-600">+50</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg border border-cyan-200 hover:bg-cyan-50 transition-colors">
                  <div className="font-medium text-cyan-700">Add New Stock Item</div>
                  <div className="text-sm text-gray-600">Quickly add inventory</div>
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-teal-200 hover:bg-teal-50 transition-colors">
                  <div className="font-medium text-teal-700">Generate Report</div>
                  <div className="text-sm text-gray-600">Create sales or inventory report</div>
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors">
                  <div className="font-medium text-blue-700">Manage Staff</div>
                  <div className="text-sm text-gray-600">View and edit staff information</div>
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
