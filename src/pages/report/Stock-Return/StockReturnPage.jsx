import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MedicineDetailsDialog } from "./MedicineDetailsDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  X, Search, ChevronLeft, ChevronRight, ArrowLeft,
  FileSpreadsheet, Package,
} from "lucide-react";
import { downloadAsExcel } from "@/lib/download-utils";

export default function StockPage() {
  const navigate = useNavigate();

  const [searchCriteria, setSearchCriteria] = useState("medicine_name");
  const debounceRef = useRef(null);
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("medicine_name-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15; // Changed to 15 items per page
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchMedicines = async (page = 1, term, criteria) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/admin/expiry_stock`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }  
        }
      );

      console.log(res.data);
      setMedicines(res.data.rows || []);
    } catch (err) {
      console.error("Error fetching medicines", err);
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchMedicines();
    };

    load();
  }, [sortBy, searchCriteria]);

  const handleSearchInputChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchMedicines(1, value, searchCriteria);
    }, 300);
  };

  // Filter medicines based on search term and criteria
  const filteredMedicines = medicines.filter((medicine) => {
    if (!searchTerm) return true;
    const searchValue = searchTerm.toLowerCase();

    switch (searchCriteria) {
      case "medicine_name":
        return medicine.medicine_name?.toLowerCase().includes(searchValue);
      case "brand_name":
        return medicine.brand_name?.toLowerCase().includes(searchValue);
      case "invoice_no":
        return medicine.invoice_no?.toLowerCase().includes(searchValue);
      case "wholesaler_name":
        return medicine.wholesaler_name?.toLowerCase().includes(searchValue);
      default:
        return true;
    }
  });

  // Sort medicines
  const sortedMedicines = [...filteredMedicines].sort((a, b) => {
    const [field, direction] = sortBy.split("-");
    
    let comparison = 0;
    if (field === "medicine_name" || field === "brand_name") {
      comparison = (a[field] || "").localeCompare(b[field] || "");
    } else if (field === "mrp" || field === "stock_quantity") {
      comparison = (a[field] || 0) - (b[field] || 0);
    }
    
    return direction === "asc" ? comparison : -comparison;
  });

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(sortedMedicines.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMedicines = sortedMedicines.slice(startIndex, endIndex);

  const handleExcelReport = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/admin/export/excel?table=expiry_stock`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      downloadAsExcel(res.data.data, "medicine_stock_report");
    } catch (err) {
      console.error("Error fetching Excel report:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleViewMedicine = (medicine) => {
    setSelectedMedicine(medicine);
    setIsViewModalOpen(true);
  };

  const handlePurchaseReturn = (medicine) => {
    console.log("Add to expiry:", medicine);
  };

  const handleUpdate = (medicineId) => {
    navigate(`/stock/update/${medicineId}`);
  };

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
              <ArrowLeft className="h-5 w-5 text-orange-800 font-weight-800" />
            </Button>
            <div className="flex items-center gap-3">
            
              <h1 className="text-2xl font-bold text-orange-800">Stock Return</h1>
            </div>
          </div>

          <Button
            onClick={handleExcelReport}
            disabled={loading}
            className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2"
          >
            <FileSpreadsheet className="h-4 w-4" />
            {loading ? "Exporting..." : "Export Excel"}
          </Button>
        </div>

        {/* Sticky Filter Bar */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
          <div className="grid grid-cols-1 gap-3 md:flex md:items-center md:gap-4">
            {/* Search Criteria Select */}
            <div className="w-full md:w-48">
              <Select
                value={searchCriteria}
                onValueChange={setSearchCriteria}
              >
                <SelectTrigger className="w-full border-orange-200 focus:border-orange-500">
                  <SelectValue placeholder="Search by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medicine_name">Medicine</SelectItem>
                  <SelectItem value="brand_name">Brand</SelectItem>
                  <SelectItem value="invoice_no">Invoice</SelectItem>
                  <SelectItem value="wholesaler_name">Wholesaler</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:flex-1 md:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder={`Search by ${searchCriteria.replace('_', ' ')}...`}
                value={searchTerm}
                onChange={(e) => handleSearchInputChange(e.target.value)}
                className="pl-10 pr-10 border-orange-200 focus:border-orange-500 w-full"
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
                <SelectTrigger className="w-full border-orange-200 focus:border-orange-500">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medicine_name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="medicine_name-desc">Name (Z-A)</SelectItem>
                  <SelectItem value="mrp-asc">Price Low to High</SelectItem>
                  <SelectItem value="mrp-desc">Price High to Low</SelectItem>
                  <SelectItem value="stock_quantity-asc">Quantity Low to High</SelectItem>
                  <SelectItem value="stock_quantity-desc">Quantity High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Sticky Table Header */}
        <div className="sticky top-[73px] z-10 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-200">
          <div className="hidden md:grid grid-cols-8 gap-4 p-4 font-semibold text-orange-800">
            <div className="text-center">S.No</div>
            <div>Medicine</div>
            <div>Brand</div>
            <div>Batch</div>
            <div className="text-center">Quantity</div>
            <div className="text-center">Expiry</div>
            <div className="text-center">Price</div>
            <div className="text-center">Action</div>
          </div>
          {/* Mobile Header */}
          <div className="md:hidden p-4 font-semibold text-orange-800 text-center">
            Stock Return List
          </div>
        </div>

        {/* Medicine List - No max-height, naturally scrollable */}
        <div className="flex-1 bg-white">
          {loading && (
            <div className="flex items-center justify-center h-32 text-gray-500">
              Loading medicines...
            </div>
          )}

          {!loading && currentMedicines.length > 0 ? (
            currentMedicines.map((medicine, index) => (
              <div
                key={medicine.id}
                className="border-b border-gray-100 hover:bg-orange-50 transition-colors"
              >
                {/* Desktop View */}
                <div className="hidden md:grid grid-cols-8 gap-4 p-4">
                  <div className="text-center text-gray-600">
                    {startIndex + index + 1}
                  </div>
                  <div className="font-medium text-gray-800">
                    {medicine.medicine_name}
                  </div>
                  <div className="text-gray-600">{medicine.brand_name}</div>
                  <div className="text-gray-600 font-mono text-sm">
                    {medicine.batch_no}
                  </div>
                  <div className="text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        medicine.quantity < 50
                          ? "bg-red-100 text-red-800"
                          : medicine.quantity < 100
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {medicine.quantity}
                    </span>
                  </div>
                  <div className="text-center text-gray-600 text-sm">
                    {new Date(medicine.expiry_date).toLocaleDateString()}
                  </div>
                  <div className="text-center font-semibold text-gray-800">
                    ₹{medicine.mrp}
                  </div>
                  <div className="text-center">
                    <Button
                      size="sm"
                      className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 text-xs rounded"
                      onClick={() => handleViewMedicine(medicine)}
                    >
                      View
                    </Button>
                  </div>
                </div>

                {/* Mobile View */}
                <div className="md:hidden p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-800 text-sm">
                        {medicine.medicine_name}
                      </h3>
                      <p className="text-xs text-gray-600">{medicine.brand_name}</p>
                    </div>
                    <Button
                      size="sm"
                      className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 text-xs rounded ml-2"
                      onClick={() => handleViewMedicine(medicine)}
                    >
                      View
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Batch:</span>
                      <span className="ml-1 font-mono">{medicine.batch_no}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Price:</span>
                      <span className="ml-1 font-semibold">₹{medicine.mrp}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Quantity:</span>
                      <span
                        className={`ml-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          medicine.quantity < 50
                            ? "bg-red-100 text-red-800"
                            : medicine.quantity < 100
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {medicine.quantity}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Expiry:</span>
                      <span className="ml-1">
                        {new Date(medicine.expiry_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : !loading ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500">
              <Package className="h-12 w-12 text-orange-300 mb-2" />
              <p className="text-sm">No medicines found matching your criteria.</p>
            </div>
          ) : null}
        </div>

        {/* Non-sticky Pagination Footer - Only show if there are multiple pages */}
        {sortedMedicines.length > itemsPerPage && (
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
                Page {currentPage} of {totalPages} ({sortedMedicines.length} total items)
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

      <MedicineDetailsDialog
        isOpen={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        medicine={selectedMedicine}
        onPurchaseReturn={handlePurchaseReturn}
        onUpdate={handleUpdate}
      />
    </>
  );
}