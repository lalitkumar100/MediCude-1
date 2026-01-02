import React, { useState, useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
  import { downloadAsExcel } from "@/lib/download-utils"

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Search, ChevronLeft, ChevronRight, ArrowLeft, Plus,FileSpreadsheet } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import WholesalerDetailsModal from "./WholesalerDetailsModal";
import AddWholesalerModal from "./AddWholesalerModal";

export default function WholesalerReportPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [error, setError] = useState(null);
  const [selectedWholesaler, setSelectedWholesaler] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sampleWholesalers, setSampleWholesalers] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleExcelReport = async () => {
    try{
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/admin/export/excel?table=wholesalers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      downloadAsExcel(res.data.data, "wholesalers");
    } catch (err) {
      console.error("Error fetching Excel report:", err);
    }
  };

  const handleAddWholesaler = () => {
    setIsAddModalOpen(true);
  }

  useEffect(() => {
    const fetchWholesalers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/admin/wholesalers`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSampleWholesalers(res.data.rows);
      } catch (err) {
        console.error(err);
        setError("Failed to load employees");
      } finally {
        setLoading(false);
      }
    };

    fetchWholesalers();
  }, []);

  // Filter and sort wholesalers
  const filteredWholesalers = sampleWholesalers.filter((wholesaler) => {
    if (!searchTerm) return true;
    const searchValue = searchTerm.toLowerCase();
    return (
      wholesaler.name.toLowerCase().includes(searchValue) ||
      wholesaler.gst_no.toLowerCase().includes(searchValue) ||
      wholesaler.contact.includes(searchValue)
    );
  });

  const sortedWholesalers = [...filteredWholesalers].sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "gst-asc":
        return a.gst_no.localeCompare(b.gst_no);
      case "gst-desc":
        return b.gst_no.localeCompare(a.gst_no);
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(sortedWholesalers.length / itemsPerPage)
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentWholesalers = sortedWholesalers.slice(startIndex, endIndex);

  const clearSearch = () => {
    setSearchTerm("");
  };

  const handlePrevPage = () => {
    setCurrentPage((p) => Math.max(1, p - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((p) => Math.min(totalPages, p + 1));
  };

  const handleViewWholesaler = (wholesaler) => {
    setSelectedWholesaler(wholesaler);
    setIsViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedWholesaler(null);
    setIsViewModalOpen(false);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[data-collapsible=icon]/sidebar-wrapper:h-12">
          <PageBreadcrumb
            items={[
              { label: "PharmaDesk", href: "/dashboard" },
              { label: "Reports", href: "/report" },
              { label: "wholesaler Reports", href: "/invoice" }
            ]} 
          />
        </header>

        {/* Main Content */}
        <div className="flex flex-1 flex-col">
          {/* Back Button and Title */}
          <div className="flex items-center gap-4 p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/report")}
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">
              Wholesaler List
            </h1>

            <Button
              onClick={handleExcelReport}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Export Excel
            </Button>
          </div>

          {/* Sticky Filter Bar */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
            <div className="grid grid-cols-1 gap-3 md:flex md:items-center md:gap-4">
              {/* Search Input */}
              <div className="relative w-full md:flex-1 md:max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search by name, GST, or contact..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10 border-cyan-200 focus:border-cyan-500 w-full"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="w-full md:w-48">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full border-cyan-200 focus:border-cyan-500">
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                    <SelectItem value="gst-asc">GST No (Asc)</SelectItem>
                    <SelectItem value="gst-desc">GST No (Desc)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full md:w-auto md:ml-auto">
                <Button 
                onClick={handleAddWholesaler}
                  className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Wholesaler
                </Button>
              </div>
            </div>
          </div>

          {/* Sticky Table Header */}
          <div className="sticky top-37 z-10 bg-linear-to-r from-cyan-50 to-teal-50 border-b border-cyan-200">
            <div className="hidden md:grid grid-cols-5 gap-4 p-4 font-semibold text-teal-800">
              <div className="text-center">S.No</div>
              <div>Wholesaler Name</div>
              <div>GST No</div>
              <div>Contact</div>
              <div className="text-center">Action</div>
            </div>
            {/* Mobile Header */}
            <div className="md:hidden p-4 font-semibold text-teal-800 text-center">
              Wholesaler List
            </div>
          </div>

          {loading && (
            <div className="text-center py-10 text-gray-500">
              Loading employees...
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="text-center py-10 text-red-500">{error}</div>
          )}

          {!loading && !error && (
            <div className="flex-1 max-h-[calc(100vh-250px)] overflow-y-auto">
              {currentWholesalers.length > 0 ? (
                currentWholesalers.map((wholesaler, index) => (
                  <div
                    key={wholesaler.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    {/* Desktop View */}
                    <div className="hidden md:grid grid-cols-5 gap-4 p-4">
                      <div className="text-center text-gray-600">
                        {startIndex + index + 1}
                      </div>
                      <div className="font-medium text-gray-800">
                        {wholesaler.name}
                      </div>
                      <div className="text-gray-600 font-mono text-sm">
                        {wholesaler.gst_no}
                      </div>
                      <div className="text-gray-600">{wholesaler.contact}</div>
                      <div className="text-center">
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-xs rounded"
                          onClick={() => handleViewWholesaler(wholesaler)}
                        >
                          View
                        </Button>
                      </div>
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-gray-800 text-sm">
                          {wholesaler.name}
                        </h3>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-xs rounded ml-2"
                          onClick={() => handleViewWholesaler(wholesaler)}
                        >
                          View
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">GST No:</span>
                          <span className="ml-1 font-mono">
                            {wholesaler.gst_no}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Contact:</span>
                          <span className="ml-1">{wholesaler.contact}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-32 text-gray-500">
                  No wholesalers found matching your criteria.
                </div>
              )}
            </div>
          )}
          
          {sampleWholesalers.length > itemsPerPage && (
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Prev
                </Button>

                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages} ({sortedWholesalers.length}{" "}
                  total items)
                </span>

                <Button
                  variant="outline"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 bg-transparent"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Wholesaler Details Modal */}
        <WholesalerDetailsModal
          isOpen={isViewModalOpen}
          onClose={handleCloseModal}
          wholesaler={selectedWholesaler}
        />

        <AddWholesalerModal
          isOpen={isAddModalOpen}
          onClose={handleCloseAddModal}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}