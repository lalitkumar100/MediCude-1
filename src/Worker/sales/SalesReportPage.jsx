import React, { useEffect, useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SalesDetailsDialog } from "./SalesDetailsDialog";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  FileSpreadsheet,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { downloadAsExcel } from "@/lib/download-utils"

export default function SalesReportPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sales, setSales] = useState([]);
  const [sortBy, setSortBy] = useState("date-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalSales, setTotalSales] = useState(0);
  const [selectedSale, setSelectedSale] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  // 1. Fetch Main List
  useEffect(() => {
    const fetchSales = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/admin/sales`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.data && res.data.status === "success") {
          const formattedSales = res.data.data.map((sale, index) => ({
            ...sale,
            sale_id: sale.sale_id || index + 1,
          }));
          setSales(formattedSales);
          setTotalSales(formattedSales.length);
        }
      } catch (error) {
        console.log("Failed to Fetch Sales Data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  const handleExcelReport = async () => {
    try{
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/admin/export/excel?table=sales`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      downloadAsExcel(res.data.data, "sales_report");
    } catch (err) {
      console.error("Error fetching Excel report:", err);
    }
  };

  const filteredSales = sales.filter((sale) => {
    if (!searchTerm) return true;
    const searchValue = searchTerm?.toLowerCase();

    return (
      sale.sale_no.toLowerCase().includes(searchValue) ||
      sale.employee_name.toLowerCase().includes(searchValue) ||
      (sale.customer_name && sale.customer_name.toLowerCase().includes(searchValue))
    );
  });

  const sortedSales = [...filteredSales].sort((a, b) => {
    switch (sortBy) {
      case "total-amount-asc":
      case "total-amount-low":
        return parseFloat(a.total_amount) - parseFloat(b.total_amount);
      case "total-amount-desc":
      case "total-amount-high":
        return parseFloat(b.total_amount) - parseFloat(a.total_amount);
      case "date-desc":
        return (
          new Date(b.sale_date).getTime() - new Date(a.sale_date).getTime()
        );
      case "date-asc":
        return (
          new Date(a.sale_date).getTime() - new Date(b.sale_date).getTime()
        );
      default:
        return 0;
    }
  });

  const totalPages = Math.max(1, Math.ceil(sortedSales.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSales = sortedSales.slice(startIndex, endIndex);

  const clearSearch = () => {
    setSearchTerm("");
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((p) => p - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((p) => p + 1);
    }
  };

  const handleViewSale = (sale) => {
    setSelectedSale(sale);
    setIsViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedSale(null);
    setIsViewModalOpen(false);
  };

  const handleDeleteSale = async (sale) => {
    if (!window.confirm("Are you sure you want to delete this sale?")) {
      return;
    }

    setLoading(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/admin/sales/${sale.sale_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh the sales list
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/admin/sales`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data && res.data.status === "success") {
        const formattedSales = res.data.data.map((sale, index) => ({
          ...sale,
          sale_id: sale.sale_id || index + 1,
        }));
        setSales(formattedSales);
        setTotalSales(formattedSales.length);
      }
    } catch (error) {
      console.error("Failed to delete sale:", error);
      alert("Failed to delete sale. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getPaymentMethodColor = (method) => {
    const colors = {
      Cash: "bg-yellow-100 text-yellow-800",
      UPI: "bg-blue-100 text-blue-800",
      Credit: "bg-green-100 text-green-800",
      "Credit Card": "bg-green-100 text-green-800",
    };
    return colors[method] || "bg-gray-100 text-gray-800";
  };

  return (
    <>
        {/* Main Content */}
        <div className="flex flex-1 flex-col">
          {/* Back Button and Title */}
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/worker")}
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5 text-green-800 font-weight-bold" />
              </Button>
              <h1 className="text-2xl font-bold text-green-800">Sales List</h1>
            </div>
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
                  placeholder="Search by sale no, employee, or customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10 border-green-200 focus:border-green-500 w-full"
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
                  <SelectTrigger className="w-full border-green-200 focus:border-green-500">
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Recent to Oldest</SelectItem>
                    <SelectItem value="date-asc">Oldest to Recent</SelectItem>
                    <SelectItem value="total-amount-low">
                      Total Amount Low to High
                    </SelectItem>
                    <SelectItem value="total-amount-high">
                      Total Amount High to Low
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Sticky Table Header */}
          <div className="sticky top-37 z-10 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200">
            <div className="hidden md:grid grid-cols-7 gap-4 p-4 font-semibold text-green-800">
              <div className="text-center">S.No</div>
              <div>Sale No</div>
              <div>Employee</div>
              <div className="text-center">Total Amount</div>
              <div className="text-center">Payment</div>
              <div className="text-center">Action</div>
              <div className="text-center">Delete</div>
            </div>
            {/* Mobile Header */}
            <div className="md:hidden p-4 font-semibold text-green-800 text-center">
              Sales List
            </div>
          </div>

          {/* Scrollable Sales List */}
          <div className="flex-1 max-h-[calc(100vh-250px)] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-32 text-gray-500">
                Loading...
              </div>
            ) : currentSales.length > 0 ? (
              currentSales.map((sale, index) => (
                <div
                  key={sale.sale_id}
                  className="border-b border-gray-100 hover:bg-green-50 transition-colors"
                >
                  {/* Desktop View */}
                  <div className="hidden md:grid grid-cols-7 gap-4 p-4">
                    <div className="text-center text-gray-600">
                      {startIndex + index + 1}
                    </div>
                    <div className="font-medium text-gray-800">
                      {sale.sale_no}
                    </div>
                    <div className="text-gray-600">{sale.employee_name}</div>
                    <div className="text-center font-semibold text-gray-800">
                      ₹{parseFloat(sale.total_amount).toLocaleString("en-IN")}
                    </div>
                    <div className="text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentMethodColor(
                          sale.payment_method
                        )}`}
                      >
                        {sale.payment_method}
                      </span>
                    </div>
                    <div className="text-center">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-xs rounded"
                        onClick={() => handleViewSale(sale)}
                      >
                        View
                      </Button>
                    </div>
                    <div className="text-center">
                      <Button
                        size="sm"
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700 text-white p-2"
                        onClick={() => handleDeleteSale(sale)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Mobile View */}
                  <div className="md:hidden p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-gray-800 text-sm">
                        {sale.sale_no}
                      </h3>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-xs rounded"
                          onClick={() => handleViewSale(sale)}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="bg-red-600 hover:bg-red-700 text-white p-1"
                          onClick={() => handleDeleteSale(sale)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">{sale.employee_name}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">Total:</span>
                        <span className="ml-1 font-semibold">
                          ₹{parseFloat(sale.total_amount).toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Payment:</span>
                        <span
                          className={`ml-1 px-2 py-0.5 rounded-full text-xs font-medium ${getPaymentMethodColor(
                            sale.payment_method
                          )}`}
                        >
                          {sale.payment_method}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-500">
                No sales found matching your criteria.
              </div>
            )}
          </div>

          {/* Pagination Footer */}
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
                Page {currentPage} of {totalPages} ({totalSales} total items)
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
        </div>

        <SalesDetailsDialog
          isOpen={isViewModalOpen}
          onOpenChange={setIsViewModalOpen}
          sale={selectedSale}
          onDelete={handleDeleteSale}
          onClose={handleCloseModal}
        />
    </>
  );
}