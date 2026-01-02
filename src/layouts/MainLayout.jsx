import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import { Shell } from "lucide-react";
import { MainPanel } from "@/components/panels/main-panel";

// Breadcrumb configuration for each admin route
const BREADCRUMB_CONFIG = {
  "/dashboard": {
    items: [{ label: "PharmaDesk", href: "/dashboard" }],
    currentPage: "Dashboard"
  },
  "/addstock": {
    items: [
      { label: "PharmaDesk", href: "/dashboard" },
      { label: "Inventory", href: "/stock" }
    ],
    currentPage: "Add Stock"
  },
  "/stock": {
    items: [
      { label: "PharmaDesk", href: "/dashboard" },
      { label: "Inventory", href: "/stock" }
    ],
    currentPage: "Stock Management"
  },
  "/report": {
    items: [
      { label: "PharmaDesk", href: "/dashboard" },
      { label: "Reports", href: "/report" }
    ],
    currentPage: "Reports"
  },
  "/report/wholesaler": {
    items: [
      { label: "PharmaDesk", href: "/dashboard" },
      { label: "Reports", href: "/report" }
    ],
    currentPage: "Wholesaler Report"
  },
  "/report/invoice": {
    items: [
      { label: "PharmaDesk", href: "/dashboard" },
      { label: "Reports", href: "/report" }
    ],
    currentPage: "Invoice Report"
  },
  "/report/stock-return": {
    items: [
      { label: "PharmaDesk", href: "/dashboard" },
      { label: "Reports", href: "/report" }
    ],
    currentPage: "Stock Return"
  },
  "/report/sales": {
    items: [
      { label: "PharmaDesk", href: "/dashboard" },
      { label: "Reports", href: "/report" }
    ],
    currentPage: "Sales Report"
  },
  "/staff": {
    items: [
      { label: "PharmaDesk", href: "/dashboard" },
      { label: "Staff", href: "/staff" }
    ],
    currentPage: "Staff Management"
  },
  "/staff/add-employee": {
    items: [
      { label: "PharmaDesk", href: "/dashboard" },
      { label: "Staff", href: "/staff" }
    ],
    currentPage: "Add Employee"
  },
  "/todo": {
    items: [
      { label: "PharmaDesk", href: "/dashboard" },
      { label: "Todo", href: "/todo" }
    ],
    currentPage: "Tasks"
  },
  "/billing": {
    items: [
      { label: "PharmaDesk", href: "/dashboard" },
      { label: "Billing", href: "/billing" }
    ],
    currentPage: "New Sale"
  },
  "/profile": {
    items: [
      { label: "PharmaDesk", href: "/dashboard" },
      { label: "Profile", href: "/profile" }
    ],
    currentPage: "My Profile"
  }
};

export default function MainLayout() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Authentication check
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // Get breadcrumb config for current route
  const getBreadcrumbConfig = () => {
    // Check for dynamic routes (e.g., /stock/update/:Id)
    if (location.pathname.startsWith("/stock/update/")) {
      return {
        items: [
          { label: "PharmaDesk", href: "/dashboard" },
          { label: "Inventory", href: "/stock" }
        ],
        currentPage: "Update Medicine"
      };
    }

    // Return config for static routes
    return BREADCRUMB_CONFIG[location.pathname] || {
      items: [{ label: "PharmaDesk", href: "/dashboard" }],
      currentPage: "Page"
    };
  };

  const breadcrumbConfig = getBreadcrumbConfig();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-white-100 transition-colors duration-500">
        <Toaster position="top-right" richColors />
        
        {/* Header - Renders once, stays mounted */}
        <header className="flex h-16 shrink-0 items-center gap-2 bg-white/80 backdrop-blur-sm sticky top-0 z-999 border-b px-4">
          <PageBreadcrumb
            items={breadcrumbConfig.items}
            currentPage={breadcrumbConfig.currentPage}
          />
        </header>

        {/* Main Content - Child routes render here via <Outlet /> */}
        <div className="flex flex-1 flex-col gap-6 p-2 max-w-7xl mx-auto w-full">
          <Outlet />
        </div>

        {/* Floating Shell Button */}
        <button
          className="fixed bottom-8 right-8 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all active:scale-95 z-50 flex items-center justify-center"
          onClick={() => setIsPanelOpen(true)}
          aria-label="Open main panel"
        >
          <Shell className="h-6 w-6" />
        </button>

        {/* Main Panel */}
        <MainPanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
      </SidebarInset>
    </SidebarProvider>
  );
}