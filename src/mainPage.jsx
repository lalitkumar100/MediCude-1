import React, { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import { Shell } from "lucide-react";
import { MainPanel } from "@/components/panels/main-panel";

/**
 * MainPage Layout Component
 * Wraps all pages with consistent sidebar, header, and panel functionality
 * 
 * @param {Object} props
 * @param {Array} props.breadcrumbItems - Array of breadcrumb items [{ label, href }]
 * @param {string} props.currentPage - Current page name for breadcrumb
 * @param {React.ReactNode} props.children - Page content
 * @param {boolean} props.showShellButton - Whether to show the floating shell button (default: true)
 * @param {string} props.maxWidth - Max width class for content (default: "max-w-7xl")
 * @param {string} props.className - Additional classes for the content wrapper
 */
export default function MainPage({
  breadcrumbItems = [{ label: "PharmaDesk", href: "/dashboard" }],
  currentPage,
  children,
  showShellButton = true,
  maxWidth = "max-w-7xl",
  className = "",
}) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-white-100 transition-colors duration-500">
        <Toaster position="top-right" richColors />
        
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 bg-white/80 backdrop-blur-sm sticky top-0 z-10 border-b px-4">
          <PageBreadcrumb
            items={breadcrumbItems}
            currentPage={currentPage}
          />
        </header>

        {/* Main Content */}
        <div className={`flex flex-1 flex-col gap-6 p-6 ${maxWidth} mx-auto w-full ${className}`}>
          {children}
        </div>

        {/* Floating Shell Button */}
        {showShellButton && (
          <button
            className="fixed bottom-8 right-8 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all active:scale-95 z-50 flex items-center justify-center"
            onClick={() => setIsPanelOpen(true)}
            aria-label="Open main panel"
          >
            <Shell className="h-6 w-6" />
          </button>
        )}

        {/* Main Panel */}
        <MainPanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
      </SidebarInset>
    </SidebarProvider>
  );
}