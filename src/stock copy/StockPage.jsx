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
  FileSpreadsheet,
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
        `${import.meta.env.VITE_BACKEND_URL}/admin/medicines/search`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            limit: itemsPerPage,
            offset,
            [criteria]: term,
            order_by,
            order_dir,
          },
        }
      );

      console.log(res.data.data.medicines);
      setMedicines(res.data.data.medicines);
      setTotalPages(res.data.data.pagination.total_pages);
      setTotalItems(res.data.data.pagination.total_items);
    } catch (err) {
      console.error("Error fetching medicines", err);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchMedicines(currentPage, searchTerm, searchCriteria);
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
        `${import.meta.env.VITE_BACKEND_URL}/admin/export/excel?table=medicine_stock`,
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
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear">
          <PageBreadcrumb
            items={[
              { label: "PharmaDesk", href: "/dashboard" },
              { label: "Stock Management", href: "/stock" },
            ]}
          />
        </header>

        <div className="flex flex-1 flex-col">

          <div className="flex items-center gap-4 p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-800"> Stock</h1>

            <div className="flex justify-end w-full">
              <Button
                onClick={handleExcelReport}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Export Excel
              </Button>
            </div>
          </div>

          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
            {/* Container: Grid on mobile, Flex on Desktop */}
            <div className="grid grid-cols-2 gap-3 md:flex md:items-center md:gap-4">

              {/* 1. Search Criteria Select */}
              {/* Mobile: Order 2 (Bottom Left), Half Width (col-span-1) */}
              {/* Desktop: Order 1 (Far Left), Fixed Width */}
              <div className="col-span-1 order-2 md:order-1 md:w-48">
                <Select
                  value={searchCriteria}
                  onValueChange={(e) => setSearchCriteria(e)}
                >
                  <SelectTrigger className="w-full border-cyan-200 focus:border-cyan-500">
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

              {/* 2. Search Input */}
              {/* Mobile: Order 1 (Top), Full Width (col-span-2) */}
              {/* Desktop: Order 2 (Middle), Flexible Width */}
              <div className="col-span-2 order-1 md:order-2 md:flex-1 relative max-w-full md:max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder={`Search by ${searchCriteria}...`}
                  value={searchTerm}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                  className="pl-10 pr-10 w-full border-cyan-200 focus:border-cyan-500"
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

              {/* 3. Sort Select */}
              {/* Mobile: Order 3 (Bottom Right), Half Width (col-span-1) */}
              {/* Desktop: Order 3 (Far Right), Fixed Width */}
              <div className="col-span-1 order-3 md:order-3 md:w-48">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full border-cyan-200 focus:border-cyan-500">
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

          {/* Sticky Table Header */}
          <div className="sticky top-22 z-10 bg-linear-to-r from-cyan-50 to-teal-50 border-b border-cyan-200">
            <div className="hidden md:grid grid-cols-8 gap-4 p-4 font-semibold text-teal-800">
              <div className="text-center">S.No</div>
              <div>Medicine</div>
              <div>Brand</div>
              <div>Batch</div>
              <div className="text-center">Quantity</div>
              <div className="text-center">Expiry</div>
              <div className="text-center">Price</div>
              <div className="text-center">Action</div>
            </div>
            <div className="md:hidden p-4 font-semibold text-teal-800 text-center">
              Medicine List
            </div>
          </div>

          {/* Scrollable Medicine List */}
          <div className="flex-1 max-h-125 overflow-y-auto">
            {medicines.length > 0 ? (
              medicines.map((medicine, index) => (
                <div
                  key={medicine.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
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
                        className={`px-2 py-1 rounded-full text-xs font-medium ${medicine.stock_quantity < 50
                          ? "bg-red-100 text-red-800"
                          : medicine.stock_quantity < 100
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                          }`}
                      >
                        {medicine.stock_quantity}
                      </span>
                    </div>
                    <div className="text-center text-gray-600 font-mono text-sm">
                      {new Date(medicine.expiry_date).toLocaleDateString()}
                    </div>
                    <div className="text-center font-semibold text-gray-800">
                      ₹{medicine.mrp}
                    </div>
                    <div className="text-center">
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-xs rounded"
                        onClick={() => handleViewMedicine(medicine)}
                      >
                        View
                      </Button>
                    </div>
                  </div>

                  {/* Mobile View */}
                  <div className="md:hidden p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 text-sm">
                          {medicine.medicine_name}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {medicine.brand_name}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-xs rounded ml-2"
                        onClick={() => handleViewMedicine(medicine)}
                      >
                        View
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">Batch:</span>
                        <span className="ml-1 font-mono">
                          {medicine.batch_no}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Price:</span>
                        <span className="ml-1 font-semibold">
                          ₹{medicine.mrp}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Quantity:</span>
                        <span
                          className={`ml-1 px-2 py-0.5 rounded-full text-xs font-medium ${medicine.stock_quantity < 50
                            ? "bg-red-100 text-red-800"
                            : medicine.stock_quantity < 100
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                            }`}
                        >
                          {medicine.stock_quantity}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Expiry:</span>
                        <span className="ml-1 font-mono">
                          {new Date(medicine.expiry_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-500">
                No medicines found matching your search criteria.
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
                Page {currentPage} of {totalPages} ({totalitems} total items)
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