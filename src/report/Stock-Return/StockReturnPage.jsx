import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { MedicineDetailsDialog } from "./MedicineDetailsDialog";
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
  X, Search, ChevronLeft, ChevronRight, ArrowLeft,
  FileSpreadsheet, Package,
} from "lucide-react";
import { downloadAsExcel } from "@/lib/download-utils"

export default function StockPage() {
  const navigate = useNavigate();

  const [searchCriteria, setSearchCriteria] = useState("medicine_name");
  const debounceRef = useRef(null);
  const [medicines, setMedicines] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalitems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("medicine_name-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchMedicines = async (page = 1, term, criteria) => {
    try {
      const offset = (page - 1) * itemsPerPage;
      const token = localStorage.getItem("token");
      console.log(term);
      console.log(criteria);

      const order_by = sortBy.split("-")[0];
      const order_dir = sortBy.split("-")[1];

      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/admin/expiry_stock`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }  
        }
      );

      console.log(res.data);
      setMedicines(res.data.rows);
      setTotalPages(res.data.data.pagination.total_pages);
      setTotalItems(res.data.no_medicine);
    } catch (err) {
      console.error("Error fetching medicines", err);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchMedicines();
    };

    load();
  }, [currentPage, sortBy, searchCriteria]);

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

  const startIndex = (currentPage - 1) * itemsPerPage;

  const handleExcelReport = async () => {
    try {
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
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    fetchMedicines(1, searchTerm, searchCriteria);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
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
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear border-b border-orange-100">
          <PageBreadcrumb
            items={[
              { label: "PharmaDesk", href: "/worker" },
              { label: "Stock Management", href: "/worker/stock" },
            ]}
          />
        </header>

        <div className="flex flex-1 flex-col bg-gradient-to-br from-orange-50 via-white to-amber-50">

          {/* Header Section */}
          <div className="bg-gradient-to-r shadow-lg">
            <div className="flex items-center gap-4 p-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/worker")}
                aria-label="Go back"
                className="text-orange-500 hover:bg-orange-700 hover:text-orange-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              
              <div className="flex items-center gap-3">
                <Package className="h-7 w-7 text-orange-500" />
                <h1 className="text-3xl font-bold text-orange-500">Stock Return</h1>
              </div>

              <div className="flex justify-end w-full">
                <Button
                  onClick={handleExcelReport}
                  disabled={loading}
                  className="bg-white text-orange-600 hover:bg-orange-50 flex items-center gap-2 font-semibold shadow-md"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  Export Excel
                </Button>
              </div>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="sticky top-0 z-10 bg-white border-b-2 border-orange-200 shadow-sm p-6">
            <div className="grid grid-cols-2 gap-3 md:flex md:items-center md:gap-4">

              {/* Search Criteria Select */}
              <div className="col-span-1 order-2 md:order-1 md:w-48">
                <Select
                  value={searchCriteria}
                  onValueChange={(e) => setSearchCriteria(e)}
                >
                  <SelectTrigger className="w-full border-2 border-orange-200 focus:border-orange-500 bg-white hover:border-orange-300 transition-colors">
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
              <div className="col-span-2 order-1 md:order-2 md:flex-1 relative max-w-full md:max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder={`Search by ${searchCriteria}...`}
                  value={searchTerm}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                  className="pl-11 pr-10 w-full h-11 border-2 border-orange-200 focus:border-orange-500 bg-white rounded-lg shadow-sm transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-400 hover:text-red-600 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Sort Select */}
              <div className="col-span-1 order-3 md:order-3 md:w-48">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full border-2 border-orange-200 focus:border-orange-500 bg-white hover:border-orange-300 transition-colors">
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medicine_name-asc">A-Z</SelectItem>
                    <SelectItem value="medicine_name-desc">Z-A</SelectItem>
                    <SelectItem value="mrp-asc">Price Low to High</SelectItem>
                    <SelectItem value="mrp-desc">Price High to Low</SelectItem>
                    <SelectItem value="stock_quantity-asc">
                      Quantity Low to High
                    </SelectItem>
                    <SelectItem value="stock_quantity-desc">
                      Quantity High to Low
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>
          </div>

          {/* Table Header */}
          <div className="sticky top-22 z-10 bg-gradient-to-r from-orange-100 to-amber-100 border-b-2 border-orange-300 shadow-sm">
            <div className="hidden md:grid grid-cols-8 gap-4 p-4 font-bold text-orange-900">
              <div className="text-center">S.No</div>
              <div>Medicine</div>
              <div>Brand</div>
              <div>Batch</div>
              <div className="text-center">Quantity</div>
              <div className="text-center">Expiry</div>
              <div className="text-center">Price</div>
              <div className="text-center">Action</div>
            </div>
            <div className="md:hidden p-4 font-bold text-orange-900 text-center text-lg">
              Medicine List
            </div>
          </div>

          {/* Scrollable Medicine List */}
          <div className="flex-1 max-h-125 overflow-y-auto">
            {medicines.length > 0 ? (
              medicines.map((medicine, index) => (
                <div
                  key={medicine.id}
                  className="border-b border-orange-100 hover:bg-orange-50 transition-colors"
                >
                  {/* Desktop View */}
                  <div className="hidden md:grid grid-cols-8 gap-4 p-4 items-center">
                    <div className="text-center text-gray-700 font-semibold">
                      {startIndex + index + 1}
                    </div>
                    <div className="font-bold text-gray-900">
                      {medicine.medicine_name}
                    </div>
                    <div className="text-gray-700">{medicine.brand_name}</div>
                    <div className="text-gray-700 font-mono text-sm bg-orange-50 px-2 py-1 rounded">
                      {medicine.batch_no}
                    </div>
                    <div className="text-center">
                      <span
                        className={`px-3 py-1.5 rounded-full text-sm font-bold shadow-sm ${
                          medicine.stock_quantity < 50
                            ? "bg-red-500 text-white"
                            : medicine.stock_quantity < 100
                            ? "bg-amber-400 text-amber-900"
                            : "bg-green-500 text-white"
                        }`}
                      >
                        {medicine.stock_quantity}
                      </span>
                    </div>
                    <div className="text-center text-gray-700 font-mono text-sm">
                      {new Date(medicine.expiry_date).toLocaleDateString()}
                    </div>
                    <div className="text-center font-bold text-orange-600 text-lg">
                      ₹{medicine.mrp}
                    </div>
                    <div className="text-center">
                      <Button
                        size="sm"
                        className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 text-sm rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
                        onClick={() => handleViewMedicine(medicine)}
                      >
                        View
                      </Button>
                    </div>
                  </div>

                  {/* Mobile View */}
                  <div className="md:hidden p-4 space-y-3 bg-white">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-base">
                          {medicine.medicine_name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {medicine.brand_name}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 text-sm rounded-lg font-semibold ml-2 shadow-md"
                        onClick={() => handleViewMedicine(medicine)}
                      >
                        View
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-orange-50 p-2 rounded">
                        <span className="text-gray-600 font-medium">Batch:</span>
                        <span className="ml-1 font-mono font-bold text-gray-900">
                          {medicine.batch_no}
                        </span>
                      </div>
                      <div className="bg-orange-50 p-2 rounded">
                        <span className="text-gray-600 font-medium">Price:</span>
                        <span className="ml-1 font-bold text-orange-600">
                          ₹{medicine.mrp}
                        </span>
                      </div>
                      <div className="bg-orange-50 p-2 rounded">
                        <span className="text-gray-600 font-medium">Quantity:</span>
                        <span
                          className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${
                            medicine.stock_quantity < 50
                              ? "bg-red-500 text-white"
                              : medicine.stock_quantity < 100
                              ? "bg-amber-400 text-amber-900"
                              : "bg-green-500 text-white"
                          }`}
                        >
                          {medicine.stock_quantity}
                        </span>
                      </div>
                      <div className="bg-orange-50 p-2 rounded">
                        <span className="text-gray-600 font-medium">Expiry:</span>
                        <span className="ml-1 font-mono text-gray-900 font-semibold">
                          {new Date(medicine.expiry_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Package className="h-16 w-16 text-orange-300 mb-4" />
                <p className="text-lg font-semibold text-gray-700">No medicines found</p>
                <p className="text-sm text-gray-500 mt-1">Try adjusting your search criteria</p>
              </div>
            )}
          </div>

          {/* Pagination Footer */}
          <div className="sticky bottom-0 bg-gradient-to-r from-orange-50 to-amber-50 border-t-2 border-orange-300 p-5 shadow-lg">
            <div className="flex items-center justify-center gap-6">
              <Button
                variant="outline"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="flex items-center gap-2 bg-white border-2 border-orange-300 text-orange-700 hover:bg-orange-50 hover:border-orange-500 font-semibold disabled:opacity-50 px-6 py-2"
              >
                <ChevronLeft className="h-5 w-5" />
                Previous
              </Button>

              <span className="text-base font-bold text-orange-900 bg-white px-6 py-2 rounded-lg shadow-sm border-2 border-orange-200">
                Page {currentPage} of {totalPages} ({totalitems} items)
              </span>

              <Button
                variant="outline"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 bg-white border-2 border-orange-300 text-orange-700 hover:bg-orange-50 hover:border-orange-500 font-semibold disabled:opacity-50 px-6 py-2"
              >
                Next
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <MedicineDetailsDialog
          isOpen={isViewModalOpen}
          onOpenChange={setIsViewModalOpen}
          medicine={selectedMedicine}
          onPurchaseReturn={handlePurchaseReturn}
          onUpdate={handleUpdate}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}