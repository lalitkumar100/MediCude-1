import React, { useState, useMemo } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  PlusCircle,
  Trash2,
  Loader2,
  PackagePlus,
  AlertTriangle,
  Shell,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddMedicineModal from "./AddMedicineModal";
import {  LoaderCircle } from "lucide-react";
import PageBreadcrumb from "@/components/PageBreadcrumb";
 import SectionHeader from "@/components/SectionHeader";

 
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
export default function StockEntryPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("lalitkumar_choudhary");

  // --- STATE MANAGEMENT ---
  const [wholesaler, setWholesaler] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [date, setDate] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [showAddMedicineModal, setShowAddMedicineModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileProcessing, setFileProcessing] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // --- CALCULATE TOTAL BILL ---
  const totalBill = useMemo(() => {
    return medicines
      .reduce((sum, med) => sum + (med.purchase_price * med.stock_quantity || 0), 0)
      .toFixed(2);
  }, [medicines]);

  // --- HANDLERS ---
  const handleAddMedicine = (medicine) => {
    setMedicines((prev) => [...prev, medicine]);
  };

  const handleDeleteMedicine = (idx) => {
    setMedicines((prev) => prev.filter((_, i) => i !== idx));
  };

  const clearForm = () => {
    setWholesaler("");
    setInvoiceNumber("");
    setDate("");
    setMedicines([]);
    setError(null);
    setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!wholesaler || !invoiceNumber || !date) {
      setError("Please fill in all invoice details.");
      return;
    }
    if (medicines.length === 0) {
      setError("Please add at least one medicine to the list.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/admin/medicine_stock`,
        {
          wholesaler,
          invoiceNumber,
          date,
          medicine: medicines,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        setMessage(res.data.message || "Stock entry added successfully!");
        clearForm();
      } else {
        setError(res.data.message || "Failed to add stock entry.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "A server error occurred. Please try again later."
      );
    } finally {
      setLoading(false);
      setTimeout(() => {
        setMessage(null);
        setError(null);
      }, 5000);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      handleSubmitFile(file);
    }
  };

  const handleSubmitFile = async (file) => {
    setFileProcessing(true);
    setError(null);
    setMessage(null);

    const formData = new FormData();
    formData.append("invoice", file);

    try {
      const res = await axios.post(`${BASE_URL}/admin/api/process-invoice`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        const { wholesaler, invoiceNumber, date, medicines: apiMedicines } = res.data;

        if (apiMedicines && apiMedicines.length > 0) {
          setWholesaler(wholesaler);
          setInvoiceNumber(invoiceNumber);
          setDate(date);
          setMedicines(apiMedicines);
          setMessage("Invoice processed successfully! Details have been filled.");
        } else {
          setError(
            "Invoice processed, but no medicine items were found. Please add them manually."
          );
          clearForm();
        }
      } else {
        setError(res.data.message || "Failed to process invoice.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "A server error occurred during file upload."
      );
    } finally {
      setFileProcessing(false);
      setTimeout(() => {
        setMessage(null);
        setError(null);
      }, 5000);
    }
  };

  return (
    <SidebarProvider>
  <AppSidebar />
  <SidebarInset>
    {/* File processing loader overlay */}
    {fileProcessing && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 backdrop-blur-sm">
        <LoaderCircle className="h-6 w-6 animate-spin text-white" />
      </div>
    )}

    {/* Header */}
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[data-collapsible=icon]/sidebar-wrapper:h-12">
      <PageBreadcrumb
        items={[
          { label: "PharmaDesk", href: "/dashboard" },
          { label: "Stock Entry" },
        ]}
      />
    </header>

    {/* Main Content - Changed to flex-col gap-4 to stack cards */}
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      
      {/* Title Section */}
      <SectionHeader
            title="Stock Entry"
            description="Enter wholesaler and invoice information to update your inventory."
          />
     

      {/* --- TOP CARD: WHOLESALER DETAILS (Full Width) --- */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Wholesaler Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="wholesaler">Wholesaler <span className="text-red-500">*</span></Label>
              <Input
                id="wholesaler"
                value={wholesaler}
                onChange={(e) => setWholesaler(e.target.value)}
                placeholder="Name"
                className="h-9"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="invoiceNumber">Invoice No <span className="text-red-500">*</span></Label>
              <Input
                id="invoiceNumber"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="No."
                className="h-9"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="date">Date <span className="text-red-500">*</span></Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-9"
                required
              />
            </div>

            <div className="flex items-end gap-2">
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 h-9 flex-1" disabled={loading}>
                {loading ? "Saving..." : "Submit Entry"}
              </Button>
              <Button type="button" variant="outline" onClick={clearForm} className="h-9 border-orange-500 text-orange-600">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* --- BOTTOM CARD: MEDICINE LIST (Full Width) --- */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-xl">Medicine Items</CardTitle>
              <CardDescription>
                {medicines.length} item{medicines.length !== 1 ? "s" : ""} added
              </CardDescription>
            </div>
            <div className="flex gap-2">
               <label htmlFor="file-upload" className="cursor-pointer">
                <div className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white h-9 px-4 py-2 gap-2">
                  <Shell size={18} />
                  Upload Invoice
                </div>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*, application/pdf"
                />
              </label>
              
              <Button 
                onClick={() => setShowAddMedicineModal(true)} 
                className="bg-emerald-600 hover:bg-emerald-700 h-9"
              >
                <PlusCircle size={18} className="mr-2" />
                Add Medicine
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
           {/* Medicine Items List (The same mapping logic you have) */}
           {medicines.length > 0 ? (
             <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-cyan-200 to-teal-200 rounded-lg flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-700">Total Purchase Value</span>
                  <span className="text-xl font-bold text-indigo-600">₹{totalBill}</span>
                </div>
                
                {medicines.map((med, idx) => (
                  <div key={idx} className="p-4 border rounded-lg bg-white shadow-sm">
                     {/* ... your existing medicine card content ... */}
                  </div>
                ))}
             </div>
           ) : (
             <div className="py-12 text-center border-2 border-dashed rounded-lg border-gray-200">
                <PackagePlus className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p className="font-medium text-gray-500">No medicines added yet.</p>
             </div>
           )}
        </CardContent>
      </Card>
    </div>
  </SidebarInset>

  {showAddMedicineModal && (
    <AddMedicineModal
      onClose={() => setShowAddMedicineModal(false)}
      onAddMedicine={handleAddMedicine}
    />
  )}
</SidebarProvider>
  );
}