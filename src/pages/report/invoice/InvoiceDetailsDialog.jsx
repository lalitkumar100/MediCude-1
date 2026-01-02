import React, { useState, useEffect } from "react"
import axios from "axios"
import { 
  Trash2, 
  FileText, 
  Calendar, 
  Building2, 
  CreditCard, 
  Package, 
  IndianRupee,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCcw,
  PlusCircle,
  RotateCcw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs" // Assuming you have Tabs, otherwise I'll use buttons

const BASE_URL = import.meta.env.VITE_BACKEND_URL; 
const token = localStorage.getItem("token");

export function InvoiceDetailsDialog({ 
  isOpen, 
  onOpenChange, 
  invoice,
  onDelete,
  onClose,
  onPaymentSuccess,
  invoiceId

}) {
  // --- STATE FOR PAYMENT MODAL ---
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMode, setPaymentMode] = useState("add"); // 'add' or 'reset'
  const [payAmount, setPayAmount] = useState("");
  const [payStatus, setPayStatus] = useState("idle"); // idle | loading | success | error
  const [payError, setPayError] = useState("");

  // Reset payment state when modal opens
  useEffect(() => {
    if (showPaymentModal && invoice) {
        setPayAmount("");
        setPaymentMode("add");
        setPayStatus("idle");
        setPayError("");
    }
  }, [showPaymentModal, invoice]);

  if (!invoice) return null

  // --- HANDLERS ---
  const handlePaymentSubmit = async () => {
    setPayError("");
    const amountNum = parseFloat(payAmount);
    const totalBill = parseFloat(invoice.total_amount);
    const currentPaid = parseFloat(invoice.paid_amount);

    // 1. Basic Number Validation
    if (isNaN(amountNum) || payAmount === "") {
        setPayError("Please enter a valid number.");
        setPayStatus("idle"); // Keep input visible
        return;
    }

    // 2. Specific Logic Validation
    if (paymentMode === "add") {
        // Logic: 0 < amount 
        if (amountNum <= 0) {
            setPayError("Amount to add must be greater than 0.");
            return;
        }
        // Logic: amount + currentPaid <= totalBill
        if (amountNum + currentPaid > totalBill) {
            const remaining = totalBill - currentPaid;
            setPayError(`Cannot add ₹${amountNum}. Remaining due is only ₹${remaining}.`);
            return;
        }
    } else {
        // Logic (Reset): 0 <= amount <= totalBill
        if (amountNum < 0) {
            setPayError("Amount cannot be negative.");
            return;
        }
        if (amountNum > totalBill) {
            setPayError(`Amount cannot exceed the total bill (₹${totalBill}).`);
            return;
        }
    }

    // 3. API Call
    setPayStatus("loading");
    try {
       
        console.log("invoice", invoice);
        console.log("Updating payment for Invoice ID:", invoiceId, "with amount:", amountNum, "mode:", paymentMode);
        // Using PUT method as requested
        const res = await axios.put(
            `${BASE_URL}/admin/invoice/${invoiceId}/update_payment`, 
            { 
                amount: amountNum,
                onlyadd: paymentMode === "add" // true if Add, false if Reset
            },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        if (res.status === 200 || res.status === 201) {
            setPayStatus("success");
            if(onPaymentSuccess) onPaymentSuccess(); 
        } else {
            setPayError(res.data.message || "Payment update failed.");
            setPayStatus("error");
        }
    } catch (err) {
        setPayError(err.response?.data?.message || "Server connection failed.");
        setPayStatus("error");
    }
  };

  // --- HELPERS FOR STYLING ---
  const getStatusStyle = (status) => {
    const s = status?.toLowerCase() || "";
    if (s === "paid") return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (s === "unpaid" || s === "due") return "bg-rose-100 text-rose-700 border-rose-200";
    return "bg-slate-100 text-slate-700 border-slate-200";
  }

  const getStatusIcon = (status) => {
    const s = status?.toLowerCase() || "";
    if (s === "paid") return <CheckCircle2 className="w-3.5 h-3.5 mr-1" />;
    return <AlertCircle className="w-3.5 h-3.5 mr-1" />;
  }

  return (
    <>
      {/* --- MAIN DETAILS DIALOG --- */}
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-xl w-full max-w-[95vw] h-[85vh] sm:h-[600px] p-0 gap-0 border-0 shadow-2xl flex flex-col overflow-hidden bg-white">
          
          {/* Header */}
          <DialogHeader className="px-6 py-5 bg-gradient-to-r from-indigo-50 to-white border-b border-indigo-100 shrink-0">
            <div className="flex items-center gap-3">
               <div className="p-2.5 bg-white border border-indigo-100 rounded-lg shadow-sm">
                  <FileText className="w-6 h-6 text-indigo-600" />
               </div>
               <div>
                  <DialogTitle className="text-xl text-indigo-950">
                    Invoice Details
                  </DialogTitle>
                  <DialogDescription className="text-slate-500 mt-1">
                    View transaction summary and items.
                  </DialogDescription>
               </div>
            </div>
          </DialogHeader>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            {/* Meta Data Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {/* Invoice No */}
               <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 flex flex-col gap-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase flex items-center gap-1.5">
                     <FileText className="w-3 h-3" /> Invoice No
                  </span>
                  <span className="text-sm font-mono font-medium text-slate-700">
                     {invoice.invoice_no}
                  </span>
               </div>
               {/* Wholesaler */}
               <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 flex flex-col gap-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase flex items-center gap-1.5">
                     <Building2 className="w-3 h-3" /> Wholesaler
                  </span>
                  <span className="text-sm font-medium text-slate-700 truncate">
                     {invoice.name || invoice.wholesaler}
                  </span>
               </div>
               {/* Date */}
               <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 flex flex-col gap-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase flex items-center gap-1.5">
                     <Calendar className="w-3 h-3" /> Date
                  </span>
                  <span className="text-sm font-medium text-slate-700">
                     {new Date(invoice.created_at || invoice.createdAt).toLocaleDateString()}
                  </span>
               </div>
                {/* Status */}
               <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 flex flex-col gap-1 justify-center">
                   <span className="text-xs font-semibold text-slate-400 uppercase mb-1">Status</span>
                   <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border w-fit ${getStatusStyle(invoice.payment_status)}`}>
                      {getStatusIcon(invoice.payment_status)}
                      {invoice.payment_status}
                   </div>
               </div>
            </div>

            {/* Financial Cards */}
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
                    <div className="flex items-center gap-2 text-indigo-600 mb-1">
                        <IndianRupee className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Total Bill</span>
                    </div>
                    <div className="text-2xl font-bold text-indigo-900">
                        ₹{invoice.total_amount}
                    </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                    <div className="flex items-center gap-2 text-emerald-600 mb-1">
                        <CreditCard className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Amount Paid</span>
                    </div>
                    <div className="text-2xl font-bold text-emerald-900">
                        ₹{invoice.paid_amount}
                    </div>
                </div>
            </div>

            {/* Medicine Table */}
            <div>
               <div className="flex items-center gap-2 mb-3">
                  <Package className="w-4 h-4 text-slate-500" />
                  <h3 className="text-sm font-semibold text-slate-700">Medicine Items</h3>
               </div>
               <div className="border border-slate-200 rounded-lg overflow-hidden">
                  {invoice.medicines && invoice.medicines.length > 0 ? (
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
                        <tr>
                          <th className="px-4 py-2.5 font-medium text-slate-500 text-xs uppercase">Item Name</th>
                          <th className="px-4 py-2.5 font-medium text-slate-500 text-xs uppercase text-center">Qty</th>
                          <th className="px-4 py-2.5 font-medium text-slate-500 text-xs uppercase text-right">Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {invoice.medicines.map((med, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-4 py-3 font-medium text-slate-700">{med.medicine}</td>
                            <td className="px-4 py-3 text-center text-slate-600 bg-slate-50/30">{med.qty}</td>
                            <td className="px-4 py-3 text-right text-slate-600">₹{med.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-8 text-center text-slate-400 bg-slate-50">
                       <Package className="w-10 h-10 mx-auto mb-2 opacity-20" />
                       <p className="text-sm">No medicine items found.</p>
                    </div>
                  )}
               </div>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="px-6 py-4 bg-slate-50 border-t flex-col sm:flex-row gap-3 shrink-0">
            <Button
              variant="outline"
              onClick={() => { onClose(); onOpenChange(false); }}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
            
            <Button
               onClick={() => setShowPaymentModal(true)}
               className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white"
               // Allow update even if paid to let user "Reset" it if needed
            >
               <CreditCard className="w-4 h-4 mr-2" />
               Update Payment
            </Button>

            <Button
              onClick={() => { onDelete(invoice); onOpenChange(false); }}
              variant="destructive"
              className="w-full sm:w-auto"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- PAYMENT SMALL DIALOG --- */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
         <DialogContent className="sm:max-w-xs w-[90vw] rounded-xl p-0 overflow-hidden">
            <div className="bg-slate-50 p-4 border-b">
                <DialogTitle className="text-center text-lg">Update Payment</DialogTitle>
            </div>
            
            <div className="p-4">
                {/* IDLE & LOADING STATE */}
                {(payStatus === 'idle' || payStatus === 'loading') && (
                    <div className="space-y-4">
                        
                         {/* Toggle Tabs */}
                         <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-lg">
                            <button
                                onClick={() => { setPaymentMode("add"); setPayError(""); }}
                                className={`text-sm font-medium py-1.5 rounded-md transition-all ${
                                    paymentMode === "add" 
                                    ? "bg-white text-indigo-600 shadow-sm" 
                                    : "text-gray-500 hover:text-gray-700"
                                }`}
                                disabled={payStatus === 'loading'}
                            >
                                <div className="flex items-center justify-center gap-1">
                                    <PlusCircle size={14} /> Add
                                </div>
                            </button>
                            <button
                                onClick={() => { setPaymentMode("reset"); setPayError(""); }}
                                className={`text-sm font-medium py-1.5 rounded-md transition-all ${
                                    paymentMode === "reset" 
                                    ? "bg-white text-rose-600 shadow-sm" 
                                    : "text-gray-500 hover:text-gray-700"
                                }`}
                                disabled={payStatus === 'loading'}
                            >
                                <div className="flex items-center justify-center gap-1">
                                    <RotateCcw size={14} /> Reset
                                </div>
                            </button>
                         </div>

                         {/* Info Text */}
                         <div className="text-xs text-center text-gray-500 bg-blue-50/50 p-2 rounded border border-blue-100">
                             {paymentMode === "add" ? (
                                <span>Adding to current paid amount <br/>(Max addable: ₹{invoice.total_amount - invoice.paid_amount})</span>
                             ) : (
                                <span>Overwriting total paid amount <br/>(Max: ₹{invoice.total_amount})</span>
                             )}
                         </div>

                         <div className="relative">
                            <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                            <Input 
                                type="number" 
                                placeholder="0.00" 
                                className="pl-9 text-lg font-semibold"
                                value={payAmount}
                                onChange={(e) => {
                                    setPayError('');
                                    setPayAmount(e.target.value);
                                }}
                                disabled={payStatus === 'loading'}
                            />
                         </div>

                         <div className="flex justify-between text-xs text-gray-500 px-1">
                            <span>Currently Paid: ₹{invoice.paid_amount}</span>
                            <span>Total: ₹{invoice.total_amount}</span>
                         </div>
                         
                         {payError && (
                             <Alert variant="destructive" className="py-2">
                                <AlertDescription className="text-xs flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" /> {payError}
                                </AlertDescription>
                             </Alert>
                         )}

                         <Button 
                            className={`w-full ${paymentMode === "add" ? "bg-indigo-600 hover:bg-indigo-700" : "bg-rose-600 hover:bg-rose-700"}`} 
                            onClick={handlePaymentSubmit}
                            disabled={payStatus === 'loading'}
                        >
                            {payStatus === 'loading' ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                paymentMode === "add" ? "Add Payment" : "Set New Amount"
                            )}
                         </Button>
                    </div>
                )}

                {/* SUCCESS STATE */}
                {payStatus === 'success' && (
                    <div className="flex flex-col items-center justify-center py-6 space-y-4 animate-in zoom-in-95">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center shadow-sm">
                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                        </div>
                        <div className="text-center space-y-1">
                            <h3 className="text-lg font-bold text-gray-900">Updated!</h3>
                            <p className="text-sm text-gray-500">
                                Payment details saved successfully.
                            </p>
                        </div>
                        <Button 
                            className="w-full bg-gray-900 text-white" 
                            onClick={() => { setShowPaymentModal(false); }}
                        >
                            Close
                        </Button>
                    </div>
                )}

                {/* ERROR STATE (Retry) */}
                {payStatus === 'error' && (
                     <div className="flex flex-col items-center justify-center py-4 space-y-4 animate-in zoom-in-95">
                         <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center shadow-sm">
                            <AlertCircle className="w-8 h-8 text-red-600" />
                         </div>
                         <div className="text-center space-y-1 px-2">
                            <h3 className="text-lg font-bold text-gray-900">Failed</h3>
                            <p className="text-xs text-red-500 bg-red-50 p-2 rounded">
                                {payError || "Something went wrong."}
                            </p>
                         </div>
                         <div className="flex gap-2 w-full">
                             <Button 
                                variant="outline"
                                className="flex-1" 
                                onClick={() => { setShowPaymentModal(false); }}
                            >
                                Cancel
                            </Button>
                             <Button 
                                className="flex-1 bg-indigo-600" 
                                onClick={() => { setPayStatus("idle"); setPayError(""); }}
                            >
                                <RefreshCcw className="w-4 h-4 mr-2" /> Retry
                            </Button>
                         </div>
                     </div>
                )}
            </div>
         </DialogContent>
      </Dialog>
    </>
  )
}