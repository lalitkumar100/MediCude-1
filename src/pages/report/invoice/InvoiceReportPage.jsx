import React, { useEffect, useState } from "react";
import { InvoiceDetailsDialog } from "./InvoiceDetailsDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import loaderGif from "@/components/logoloader.gif";;

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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { downloadAsExcel } from "@/lib/download-utils"

export default function InvoiceReportPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [Invoices, setInvoices] = useState([]);
  const [sortBy, setSortBy] = useState("date-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalInvoice, setTotalInvoice] = useState(0);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [loadingDownload, setLoadingDownload] = useState(false);
  const token = localStorage.getItem("token");

  // Fetch all invoices for the list
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setIsLoading(true);

        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/admin/invoices`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setInvoices(res.data.invoices);
        setTotalInvoice(res.data.no_of_invoices);
      } catch (error) {
        console.log("Failed to Fetch Invoice Data", error);
        
        // Handle 401 - redirect to login
        if (error.response?.status === 401) {
          navigate("/login");
        }
      }
      finally{
      setTimeout(() => setIsLoading(false), 2000) // simulate loading delay for better UX
 
      }
    };

    fetchInvoice();
  }, []);

  // Filter invoices based on search term
  const filteredInvoices = Invoices.filter((invoice) => {
    if (!searchTerm) return true;
    const searchValue = searchTerm?.toLowerCase();

    return (
      invoice.invoice_no.toLowerCase().includes(searchValue) ||
      invoice.name.toLowerCase().includes(searchValue)
    );
  });

  // Handle Excel export
  const handleExcelReport = async () => {
    try {
      setLoadingDownload(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/admin/export/excel?table=invoices`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      downloadAsExcel(res.data.data, "invoices_report");
    } catch (err) {
      console.error("Error fetching Excel report:", err);
      
      // Handle 401 - redirect to login
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoadingDownload(false);
    }
  };

  // Sort invoices
  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    switch (sortBy) {
      case "total-amount-asc":
      case "total-amount-low":
        return a.total_amount - b.total_amount;
      case "total-amount-desc":
      case "total-amount-high":
        return b.total_amount - a.total_amount;
      case "date-desc":
        return (
          new Date(b.invoice_date).getTime() -
          new Date(a.invoice_date).getTime()
        );
      case "date-asc":
        return (
          new Date(a.invoice_date).getTime() -
          new Date(b.invoice_date).getTime()
        );
      default:
        return 0;
    }
  });

  // Pagination calculations
  const totalPages = Math.max(
    1,
    Math.ceil(sortedInvoices.length / itemsPerPage)
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInvoices = sortedInvoices.slice(startIndex, endIndex);

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

  const handleViewInvoice = (invoice) => {
    console.log("Opening invoice:", invoice.invoice_id);
    setSelectedInvoiceId(invoice.invoice_id);
    setIsViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedInvoiceId(null);
    setIsViewModalOpen(false);
  };

  const handleDeleteInvoice = async (invoice) => {
    if (!confirm(`Are you sure you want to delete invoice ${invoice.invoice_no}?`)) {
      return;
    }

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/admin/invoice/${invoice.invoice_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Refresh the invoice list
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/admin/invoices`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setInvoices(res.data.invoices);
      setTotalInvoice(res.data.no_of_invoices);
      
      alert(`Invoice ${invoice.invoice_no} deleted successfully!`);
    } catch (error) {
      console.error("Failed to delete invoice:", error);
      
      // Handle 401 - redirect to login
      if (error.response?.status === 401) {
        navigate("/login");
      } else {
        alert("Failed to delete invoice. Please try again.");
      }
    }
  };

  const handlePaymentSuccess = async () => {
    // Refresh the invoice list after successful payment update
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/admin/invoices`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setInvoices(res.data.invoices);
      setTotalInvoice(res.data.no_of_invoices);
    } catch (error) {
      console.error("Failed to refresh invoices:", error);
    }
  };


   // Loading state
    if (isLoading) {
      return (
        <div className="flex flex-1  bg-purple-50 items-center justify-center">
    <div className="text-center ">
      <img
        src={loaderGif}
        alt="Loading"
        className="h-36 w-36 mx-auto"
      />
       <p className="mt-3 text-sm font-semibold tracking-wide text-purple-800 animate-pulse">
        Loading invoice Report, please wait…
      </p>
    </div>
  </div>
      );
    }

  return (
    <>
      {/* Main Content */}
      <div className="flex flex-1 flex-col min-h-screen bg-gray-50">
        {/* Back Button and Title */}
        <div className="flex items-center justify-between gap-4 p-4 bg-white border-b">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/admin/report")}
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5 text-purple-800 font-weight-800" />
            </Button>
            <h1 className="text-2xl font-bold text-purple-800">Invoice List</h1>
          </div>

          <Button
            onClick={handleExcelReport}
            disabled={loadingDownload}
            className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
          >
            <FileSpreadsheet className="h-4 w-4" />
            {loadingDownload ? "Exporting..." : "Export Excel"}
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
                placeholder="Search by invoice no or wholesaler..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10 border-purple-200 focus:border-purple-500 w-full"
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
                <SelectTrigger className="w-full border-purple-200 focus:border-purple-500">
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
        <div className="sticky top-[65px] z-10 bg-gradient-to-r from-purple-50 to-violet-50 border-b border-purple-200">
          <div className="hidden md:grid grid-cols-6 gap-4 p-4 font-semibold text-purple-800">
            <div className="text-center">S.No</div>
            <div>Invoice No</div>
            <div>Wholesaler</div>
            <div className="text-center">Total Amount</div>
            <div className="text-center">Paid</div>
            <div className="text-center">Action</div>
          </div>
          {/* Mobile Header */}
          <div className="md:hidden p-4 font-semibold text-purple-800 text-center">
            Invoice List
          </div>
        </div>


        {/* Scrollable Invoice List */}
        <div className="flex-1 bg-white">
          {currentInvoices.length > 0 ? (
            currentInvoices.map((invoice, index) => (
              <div
                key={invoice.invoice_id}
                className="border-b border-gray-100 hover:bg-purple-50 transition-colors"
              >
                {/* Desktop View */}
                <div className="hidden md:grid grid-cols-6 gap-4 p-4">
                  <div className="text-center text-gray-600">
                    {startIndex + index + 1}
                  </div>
                  <div className="font-medium text-gray-800">
                    {invoice.invoice_no}
                  </div>
                  <div className="text-gray-600">{invoice.name}</div>
                  <div className="text-center font-semibold text-gray-800">
                    ₹{invoice.total_amount}
                  </div>
                  <div className="text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        invoice.payment_status === "Paid"
                          ? "bg-green-100 text-green-800"
                          : invoice.payment_status === "Partial"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {invoice.payment_status}
                    </span>
                  </div>
                  <div className="text-center">
                    <Button
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 text-xs rounded"
                      onClick={() => handleViewInvoice(invoice)}
                    >
                      View
                    </Button>
                  </div>
                </div>

                {/* Mobile View */}
                <div className="md:hidden p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-800 text-sm">
                      {invoice.invoice_no}
                    </h3>
                    <Button
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 text-xs rounded ml-2"
                      onClick={() => handleViewInvoice(invoice)}
                    >
                      View
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600">{invoice.name}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Total:</span>
                      <span className="ml-1 font-semibold">
                        ₹{invoice.total_amount}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span
                        className={`ml-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          invoice.payment_status === "Paid"
                            ? "bg-green-100 text-green-800"
                            : invoice.payment_status === "Partial"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {invoice.payment_status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-32 text-gray-500">
              No invoices found matching your criteria.
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        <div className="bg-white border-t border-gray-200 p-4">
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
              Page {currentPage} of {totalPages} ({totalInvoice} total items)
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

      {/* Invoice Details Dialog - Now handles its own data fetching */}
      <InvoiceDetailsDialog
        isOpen={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        invoiceId={selectedInvoiceId}
        onDelete={handleDeleteInvoice}
        onClose={handleCloseModal}
        onPaymentSuccess={handlePaymentSuccess}
        onNavigateToLogin={() => navigate("/login")}
      />
    </>
  );
}