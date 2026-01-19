import React, { useState, useMemo } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  PlusCircle,
  Trash2,
  PackagePlus,
  AlertTriangle,
  Shell,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  RefreshCcw,
  Loader2,
  AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddMedicineModal from "./AddMedicineModal";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import SectionHeader from "@/components/SectionHeader";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function StockEntryPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // --- STATE MANAGEMENT ---
  const [wholesaler, setWholesaler] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [date, setDate] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [showAddMedicineModal, setShowAddMedicineModal] = useState(false);
  
  // validationError is for inline alerts (e.g., missing fields)
  const [validationError, setValidationError] = useState(null);

  // fileProcessing is for the blur effect during file upload
  const [fileProcessing, setFileProcessing] = useState(false);

  // submissionStatus handles the full screen white overlay logic
  // values: 'idle' | 'submitting' | 'success' | 'error'
  const [submissionStatus, setSubmissionStatus] = useState("idle");
  const [resultMessage, setResultMessage] = useState("");

  // --- CALCULATE TOTAL BILL ---
  const totalBill = useMemo(() => {
    return medicines
      .reduce((sum, med) => sum + (med.purchase_price * med.stock_quantity || 0), 0)
      .toFixed(2);
  }, [medicines]);

  // --- HANDLERS ---
  const handleAddMedicine = (medicine) => {
    setMedicines((prev) => [...prev, medicine]);
    setValidationError(null);
  };

  const handleDeleteMedicine = (idx) => {
    setMedicines((prev) => prev.filter((_, i) => i !== idx));
  };

  const clearForm = () => {
    setWholesaler("");
    setInvoiceNumber("");
    setDate("");
    setMedicines([]);
    setValidationError(null);
    setSubmissionStatus("idle");
  };

  const handleResetAfterSuccess = () => {
    clearForm();
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError(null);

    // Basic Validation
    if (!wholesaler || !invoiceNumber || !date) {
      setValidationError("Please fill in all invoice details before submitting.");
      return;
    }
    if (medicines.length === 0) {
      setValidationError("Please add at least one medicine to the list.");
      return;
    }

    // Start Submitting Process (Triggers White Screen)
    setSubmissionStatus("submitting");

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

      if (res.status === 201) {
        setResultMessage(res.data.message || "Stock entry added successfully!");
        setSubmissionStatus("success");
      } else {
        setResultMessage(res.data.message || "Failed to add stock entry.");
        setSubmissionStatus("error");
      }
    } catch (err) {
      setResultMessage(
        err.response?.data?.message || "A server error occurred. Please try again."
      );
      setSubmissionStatus("error");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleSubmitFile(file);
    }
  };

  const handleSubmitFile = async (file) => {
    setFileProcessing(true);
    setValidationError(null);

    const formData = new FormData();
    formData.append("invoice", file);

    try {
      const res = await axios.post(`${BASE_URL}/ai/process-invoice`, formData, {
        headers: {

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
          // Optional: Show a success toast or small alert
        } else {
          setValidationError("Invoice processed, but no medicine items were found.");
        }
      } else {
        setValidationError(res.data.message || "Failed to process invoice.");
      }
    } catch (err) {
      setValidationError(
        err.response?.data?.message || "Error occurred during file upload."
      );
    } finally {
      setFileProcessing(false);
    }
  };

  // --- RENDER: SUBMISSION OVERLAY (White Background) ---
  if (submissionStatus !== "idle") {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
        {/* LOADING STATE */}
        {submissionStatus === "submitting" && (
          <div className="flex flex-col items-center gap-4 animate-in fade-in duration-500">
            <Loader2 className="w-16 h-16 text-indigo-600 animate-spin" />
            <h2 className="text-2xl font-semibold text-gray-800">Processing Entry...</h2>
            <p className="text-gray-500">Updating medicine stock inventory</p>
          </div>
        )}

        {/* SUCCESS STATE */}
        {submissionStatus === "success" && (
          <div className="flex flex-col items-center gap-6 max-w-md text-center p-8 animate-in zoom-in-95 duration-300">
            <div className="rounded-full bg-green-100 p-4">
              <CheckCircle2 className="w-20 h-20 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
              <p className="text-gray-600">{resultMessage}</p>
            </div>
            <div className="flex flex-col w-full gap-3 sm:flex-row">
               <Button onClick={handleGoBack} variant="outline" className="flex-1 gap-2">
                 <ArrowLeft size={16} /> Go Back
               </Button>
               <Button onClick={handleResetAfterSuccess} className="flex-1 gap-2 bg-indigo-600 hover:bg-indigo-700">
                 <RefreshCcw size={16} /> Add Another
               </Button>
            </div>
          </div>
        )}

        {/* ERROR STATE */}
        {submissionStatus === "error" && (
          <div className="flex flex-col items-center gap-6 max-w-md text-center p-8 animate-in zoom-in-95 duration-300">
            <div className="rounded-full bg-red-100 p-4">
              <XCircle className="w-20 h-20 text-red-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
              <p className="text-gray-600">{resultMessage}</p>
            </div>
            <div className="flex gap-4 w-full">
               <Button onClick={() => setSubmissionStatus("idle")} variant="outline" className="w-full">
                 Close & Try Again
               </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- RENDER: MAIN PAGE ---
  return (
<>     
        {/* FILE UPLOAD OVERLAY (Blur Effect) */}
        {fileProcessing && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900/30 backdrop-blur-md">
            <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
              <p className="font-medium text-gray-700">Analyzing Invoice...</p>
            </div>
          </div>
        )}
        {/* Main Content */}
        <div className="flex flex-1 flex-col gap-6 p-2 pt-0 max-w-7xl mx-auto w-full">
          
          <SectionHeader
            title="Stock Entry"
            description="Enter wholesaler and invoice information manually or upload an invoice to auto-fill."
          />

          {/* Validation Error Alert */}
          {validationError && (
            <Alert variant="destructive" className="animate-in slide-in-from-top-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {validationError}
              </AlertDescription>
            </Alert>
          )}

          {/* --- TOP CARD: WHOLESALER DETAILS --- */}
          <Card className="shadow-md border-t-4 border-t-indigo-500">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                Wholesaler Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="wholesaler">Wholesaler Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="wholesaler"
                    value={wholesaler}
                    onChange={(e) => setWholesaler(e.target.value)}
                    placeholder="e.g. Apollo Pharma"
                    className="focus-visible:ring-indigo-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invoiceNumber">Invoice Number <span className="text-red-500">*</span></Label>
                  <Input
                    id="invoiceNumber"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    placeholder="e.g. INV-2024-001"
                    className="focus-visible:ring-indigo-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Invoice Date <span className="text-red-500">*</span></Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="focus-visible:ring-indigo-500"
                  />
                </div>

                <div className="flex items-end gap-3">
                  <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 flex-1 shadow-sm transition-all hover:shadow-md">
                    Submit Entry
                  </Button>
                  <Button type="button" variant="outline" onClick={clearForm} className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* --- BOTTOM CARD: MEDICINE LIST --- */}
          <Card className="shadow-md border-0">
            <CardHeader className="bg-gray-50/50 border-b pb-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-xl text-gray-800">Medicine Inventory</CardTitle>
                  <CardDescription className="mt-1">
                    Review items before saving to stock.
                  </CardDescription>
                </div>
                <div className="flex gap-3">
                   <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 h-10 px-4 py-2 gap-2 shadow-sm">
                      <Shell size={16} className="text-blue-600" />
                      Auto-Fill from Invoice
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
                    className="bg-emerald-600 hover:bg-emerald-700 shadow-sm"
                  >
                    <PlusCircle size={18} className="mr-2" />
                    Add Manually
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6">
               {/* Total Bill Summary */}
               {medicines.length > 0 && (
                 <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 border border-blue-100 rounded-lg flex justify-between items-center shadow-sm">
                   <span className="text-gray-700 font-medium">Total Purchase Value</span>
                   <span className="text-2xl font-bold text-indigo-700">₹{totalBill}</span>
                 </div>
               )}

               {/* Medicine Grid */}
               {medicines.length > 0 ? (
                 <div className="space-y-4">
                   {medicines.map((med, idx) => (
                      <div
                          key={idx}
                          className="group p-5 transition-all duration-300 bg-white border rounded-xl shadow-sm border-slate-200 hover:shadow-md hover:border-indigo-300 relative"
                        >
                          {/* Card Header */}
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-bold text-lg text-gray-800 group-hover:text-indigo-600 transition-colors">
                                {med.medicine_name}
                              </h3>
                              <p className="text-sm text-slate-500 font-medium">
                                {med.brand_name}
                              </p>
                            </div>
                            <button
                              type="button"
                              className="p-2 text-slate-400 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors"
                              onClick={() => handleDeleteMedicine(idx)}
                              title="Remove Item"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                          
                          {/* Card Details Grid */}
                          <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:grid-cols-4 lg:grid-cols-4">
                            <div>
                              <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Batch</span>
                              <span className="font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-xs">{med.batch_no}</span>
                            </div>
                            <div>
                              <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Qty</span>
                              <span className="font-semibold text-slate-700">{med.stock_quantity}</span>
                            </div>
                            <div>
                              <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Purchase</span>
                              <span className="font-semibold text-slate-700">₹{med.purchase_price}</span>
                            </div>
                             <div>
                              <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">MRP</span>
                              <span className="font-semibold text-slate-700">₹{med.mrp}</span>
                            </div>
                            <div>
                              <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Packed</span>
                              <span className="text-slate-700">{med.packed_type}</span>
                            </div>
                            <div>
                              <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">MFG</span>
                              <span className="text-slate-700">{med.mfg_date}</span>
                            </div>
                            <div className="col-span-2 sm:col-span-2">
                              <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Expiry</span>
                              <div className={`flex items-center gap-1 font-semibold ${new Date(med.expiry_date) < new Date() ? "text-red-600" : "text-emerald-600"}`}>
                                {med.expiry_date}
                                {new Date(med.expiry_date) < new Date() && (
                                  <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                                    <AlertTriangle size={10} /> Expired
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                   ))}
                 </div>
               ) : (
                 <div className="py-16 flex flex-col items-center justify-center border-2 border-dashed rounded-xl border-gray-200 bg-gray-50/30">
                   <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                     <PackagePlus className="w-10 h-10 text-indigo-200" />
                   </div>
                   <h3 className="font-semibold text-gray-900 text-lg">Inventory Empty</h3>
                   <p className="text-gray-500 mb-6 max-w-sm text-center">
                     Start by adding medicines manually or upload an invoice to populate this list automatically.
                   </p>
                   <Button 
                    variant="outline"
                    onClick={() => setShowAddMedicineModal(true)} 
                    className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                  >
                    Add Your First Item
                  </Button>
                 </div>
               )}
            </CardContent>
          </Card>
        </div>
 

      {showAddMedicineModal && (
        <AddMedicineModal
          onClose={() => setShowAddMedicineModal(false)}
          onAddMedicine={handleAddMedicine}
        />
      )}
</>

  );
}