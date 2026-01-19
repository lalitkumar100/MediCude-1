import React, { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar"
import PageBreadcrumb from "@/components/PageBreadcrumb"
import SectionHeader from "@/components/SectionHeader"
import { MainPanel } from "@/components/panels/main-panel"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Pill, 
  ShoppingCart, 
  Receipt, 
  ClipboardList, 
  Shell 
} from "lucide-react" 
import { useNavigate } from "react-router-dom";

export default function WorkerDashboard() {
  const navigate = useNavigate();
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (


      
<>
 
       

          {/* Main Content */}
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <SectionHeader
              title="Worker Operations"
              description="Manage inventory, process sales, and track your daily tasks."
            />
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              
              {/* Medicine Stock Card */}
              <Card
                className="cursor-pointer hover:shadow-lg hover:bg-blue-50 transition-all duration-200 border-l-4 border-l-blue-500"
                onClick={() => navigate("/worker/stock")}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Medicine Stock</CardTitle>
                  <Pill className="h-5 w-5 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-blue-700">Inventory</div>
                  <p className="text-xs text-muted-foreground">Check availability & shelf locations</p>
                </CardContent>
              </Card>

              {/* Sales Card */}
              <Card
                className="cursor-pointer hover:shadow-lg hover:bg-emerald-50 transition-all duration-200 border-l-4 border-l-emerald-500"
                onClick={() => navigate("/worker/billing")}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sales Counter</CardTitle>
                  <ShoppingCart className="h-5 w-5 text-emerald-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-emerald-700">New Sale</div>
                  <p className="text-xs text-muted-foreground">Process customer purchases</p>
                </CardContent>
              </Card>

              {/* Billing Card */}
              <Card 
                className="cursor-pointer hover:shadow-lg hover:bg-amber-50 transition-all duration-200 border-l-4 border-l-amber-500"
                onClick={() => navigate("/worker/sales")}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sales Report</CardTitle>
                  <Receipt className="h-5 w-5 text-amber-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-amber-700">Sales</div>
                  <p className="text-xs text-muted-foreground">your Sales History</p>
                </CardContent>
              </Card>

              {/* Todo List Card */}
              <Card 
                className="cursor-pointer hover:shadow-lg hover:bg-indigo-50 transition-all duration-200 border-l-4 border-l-indigo-500"
                onClick={() => navigate("/worker/todo")}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Todo List</CardTitle>
                  <ClipboardList className="h-5 w-5 text-indigo-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-indigo-700">Daily Tasks</div>
                  <p className="text-xs text-muted-foreground">View assigned duties & refills</p>
                </CardContent>
              </Card>
            </div>

            {/* You could add a 'Recent Activity' or 'Live Clock' section here for workers */}
          </div>

    
  
</>


  )
}