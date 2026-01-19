import React, { useState, useEffect } from "react"
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios from "axios"


export function InvoiceDetailsDialog({ 
  isOpen, 
  onOpenChange, 
  invoiceId,
  onDelete,
  onClose,
  onPaymentSuccess,
  onNavigateToLogin,

}) {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL; 
  const token = localStorage.getItem("token");

  // --- STATE FOR INVOICE DATA ---
  const [invoice, setInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [is404, setIs404] = useState(false);

  // --- STATE FOR PAYMENT MODAL ---
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMode, setPaymentMode] = useState("add");
  const [payAmount, setPayAmount] = useState("");
  const [payStatus, setPayStatus] = useState("idle");
  const [payError, setPayError] = useState("");

  // --- FETCH INVOICE DATA ---
  useEffect(() => {
    const fetchInvoiceByID = async () => {
      if (!isOpen || !invoiceId || !axios) return;

      setIsLoading(true);
      setFetchError(null);
      setIs404(false);
      setInvoice(null);

      try {
        const res = await axios.get(
          `${BASE_URL}/admin/invoice/${invoiceId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTimeout(() => {
          
        }, 10000);
        console.log("Fetched Invoice Details:", res.data);
        setInvoice(res.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to Fetch Invoice:", error);
        setIsLoading(false);

        // Handle 401 - Unauthorized
        if (error.response?.status === 401) {
          console.log("Unauthorized - Redirecting to login");
          if (onNavigateToLogin) {
            onNavigateToLogin();
          } else {
            window.location.href = "/login";
          }
          return;
        }

        // Handle 404 - Not Found
        if (error.response?.status === 404) {
          setIs404(true);
          setFetchError("Invoice not found");
          return;
        }

        // Handle other errors
        setFetchError(error.response?.data?.message || "Failed to load invoice details");
      }
    };

    fetchInvoiceByID();
  }, [invoiceId, isOpen, axios]);

  // Reset payment state when payment modal opens
  useEffect(() => {
    if (showPaymentModal && invoice) {
        setPayAmount("");
        setPaymentMode("add");
        setPayStatus("idle");
        setPayError("");
    }
  }, [showPaymentModal, invoice]);

  // --- PAYMENT HANDLER ---
  const handlePaymentSubmit = async () => {
    if (!axios) return;
    
    setPayError("");
    const amountNum = parseFloat(payAmount);
    const totalBill = parseFloat(invoice.total_amount);
    const currentPaid = parseFloat(invoice.paid_amount);

    if (isNaN(amountNum) || payAmount === "") {
        setPayError("Please enter a valid number.");
        setPayStatus("idle");
        return;
    }

    if (paymentMode === "add") {
        if (amountNum <= 0) {
            setPayError("Amount to add must be greater than 0.");
            return;
        }
        if (amountNum + currentPaid > totalBill) {
            const remaining = totalBill - currentPaid;
            setPayError(`Cannot add ₹${amountNum}. Remaining due is only ₹${remaining}.`);
            return;
        }
    } else {
        if (amountNum < 0) {
            setPayError("Amount cannot be negative.");
            return;
        }
        if (amountNum > totalBill) {
            setPayError(`Amount cannot exceed the total bill (₹${totalBill}).`);
            return;
        }
    }

    setPayStatus("loading");
    try {
        const res = await axios.put(
            `${BASE_URL}/admin/invoice/${invoiceId}/update_payment`, 
            { 
                amount: amountNum,
                onlyadd: paymentMode === "add"
            },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        if (res.status === 200 || res.status === 201) {
            setPayStatus("success");
            // Refresh invoice data
            const updatedRes = await axios.get(
              `${BASE_URL}/admin/invoice/${invoiceId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            setInvoice(updatedRes.data);
            if(onPaymentSuccess) onPaymentSuccess(); 
        } else {
            setPayError(res.data.message || "Payment update failed.");
            setPayStatus("error");
        }
    } catch (err) {
        if (err.response?.status === 401) {
          if (onNavigateToLogin) {
            onNavigateToLogin();
          } else {
            window.location.href = "/login";
          }
          return;
        }
        setPayError(err.response?.data?.message || "Server connection failed.");
        setPayStatus("error");
    }
  };

  // --- HELPERS ---
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

  const handleRetry = () => {
    setFetchError(null);
    setIsLoading(true);
    setIs404(false);
  };

  return (
    <>
      {/* --- MAIN DETAILS DIALOG --- */}
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-xl w-full max-w-[95vw] h-[85vh] sm:h-[600px] p-0 gap-0 border-0 shadow-2xl flex flex-col overflow-hidden bg-white">
          
          {isLoading ? (
            // --- LOADING STATE ---
            <div className="flex flex-col items-center justify-center h-full py-12 space-y-4">
              <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
              <p className="text-gray-600 font-medium">Loading invoice details...</p>
            </div>
          ) : is404 ? (
            // --- 404 NOT FOUND STATE ---
            <div className="flex flex-col items-center justify-center h-full py-8 px-6 space-y-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
              <div className="text-center space-y-2 max-w-md">
                <h3 className="text-2xl font-bold text-gray-900">Invoice Not Found</h3>
                <p className="text-gray-600">
                  The invoice you're looking for doesn't exist or has been removed from the system.
                </p>
                {fetchError && (
                  <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                    {fetchError}
                  </p>
                )}
              </div>
              <Button
                onClick={() => onOpenChange(false)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Close
              </Button>
            </div>
          ) : fetchError && !is404 ? (
            // --- ERROR STATE ---
            <div className="flex flex-col items-center justify-center h-full py-8 px-6 space-y-6">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-orange-600" />
              </div>
              <div className="text-center space-y-2 max-w-md">
                <h3 className="text-2xl font-bold text-gray-900">Failed to Load</h3>
                <p className="text-sm text-orange-600 bg-orange-50 p-3 rounded-lg border border-orange-200">
                  {fetchError}
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={handleRetry}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
              </div>
            </div>
          ) : invoice ? (
            // --- INVOICE CONTENT ---
            <>
              <DialogHeader className="px-6 py-5 bg-gradient-to-r from-purple-50 to-white border-b border-purple-100 shrink-0">
                <div className="flex items-center gap-3">
                   <div className="p-2.5 bg-white border border-purple-100 rounded-lg shadow-sm">
                      <FileText className="w-6 h-6 text-purple-600" />
                   </div>
                   <div>
                      <DialogTitle className="text-xl text-purple-950">
                        Invoice Details
                      </DialogTitle>
                      <DialogDescription className="text-slate-500 mt-1">
                        View transaction summary and items.
                      </DialogDescription>
                   </div>
                </div>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                {/* Meta Data Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 flex flex-col gap-1">
                      <span className="text-xs font-semibold text-slate-400 uppercase flex items-center gap-1.5">
                         <FileText className="w-3 h-3" /> Invoice No
                      </span>
                      <span className="text-sm font-mono font-medium text-slate-700">
                         {invoice.invoice_no}
                      </span>
                   </div>
                   <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 flex flex-col gap-1">
                      <span className="text-xs font-semibold text-slate-400 uppercase flex items-center gap-1.5">
                         <Building2 className="w-3 h-3" /> Wholesaler
                      </span>
                      <span className="text-sm font-medium text-slate-700 truncate">
                         {invoice.name || invoice.wholesaler}
                      </span>
                   </div>
                   <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 flex flex-col gap-1">
                      <span className="text-xs font-semibold text-slate-400 uppercase flex items-center gap-1.5">
                         <Calendar className="w-3 h-3" /> Date
                      </span>
                      <span className="text-sm font-medium text-slate-700">
                         {new Date(invoice.created_at || invoice.createdAt).toLocaleDateString()}
                      </span>
                   </div>
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
                    <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                        <div className="flex items-center gap-2 text-purple-600 mb-1">
                            <IndianRupee className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">Total Bill</span>
                        </div>
                        <div className="text-2xl font-bold text-purple-900">
                            ₹{invoice.total_amount}
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-violet-50 border border-violet-100">
                        <div className="flex items-center gap-2 text-violet-600 mb-1">
                            <CreditCard className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">Amount Paid</span>
                        </div>
                        <div className="text-2xl font-bold text-violet-900">
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
                          <thead className="bg-purple-50 border-b border-purple-200 sticky top-0">
                            <tr>
                              <th className="px-4 py-2.5 font-medium text-purple-700 text-xs uppercase">Item Name</th>
                              <th className="px-4 py-2.5 font-medium text-purple-700 text-xs uppercase text-center">Qty</th>
                              <th className="px-4 py-2.5 font-medium text-purple-700 text-xs uppercase text-right">Price</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {invoice.medicines.map((med, idx) => (
                              <tr key={idx} className="hover:bg-purple-50/30 transition-colors">
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

              <DialogFooter className="px-6 py-4 bg-slate-50 border-t flex-col sm:flex-row gap-3 shrink-0">
                <Button
                   onClick={() => setShowPaymentModal(true)}
                   className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white"
                >
                   <CreditCard className="w-4 h-4 mr-2" />
                   Update Payment
                </Button>

                <Button
                  onClick={() => { if(onDelete) onDelete(invoice); onOpenChange(false); }}
                  variant="destructive"
                  className="w-full sm:w-auto"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Purchase Return
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* --- PAYMENT MODAL --- */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
         <DialogContent className="sm:max-w-xs w-[90vw] rounded-xl p-0 overflow-hidden">
            <div className="bg-purple-50 p-4 border-b border-purple-100">
                <DialogTitle className="text-center text-lg text-purple-900">Update Payment</DialogTitle>
            </div>
            
            <div className="p-4">
                {(payStatus === 'idle' || payStatus === 'loading') && invoice && (
                    <div className="space-y-4">
                         <div className="grid grid-cols-2 p-1 bg-purple-100 rounded-lg">
                            <button
                                onClick={() => { setPaymentMode("add"); setPayError(""); }}
                                className={`text-sm font-medium py-1.5 rounded-md transition-all ${
                                    paymentMode === "add" 
                                    ? "bg-white text-purple-600 shadow-sm" 
                                    : "text-purple-500 hover:text-purple-700"
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
                                    : "text-purple-500 hover:text-purple-700"
                                }`}
                                disabled={payStatus === 'loading'}
                            >
                                <div className="flex items-center justify-center gap-1">
                                    <RotateCcw size={14} /> Reset
                                </div>
                            </button>
                         </div>

                         <div className="text-xs text-center text-purple-700 bg-purple-50 p-2 rounded border border-purple-100">
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
                                className="pl-9 text-lg font-semibold border-purple-200 focus:border-purple-500"
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
                            className={`w-full ${paymentMode === "add" ? "bg-purple-600 hover:bg-purple-700" : "bg-rose-600 hover:bg-rose-700"}`} 
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

                {payStatus === 'success' && (
                    <div className="flex flex-col items-center justify-center py-6 space-y-4">
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
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white" 
                            onClick={() => { setShowPaymentModal(false); }}
                        >
                            Close
                        </Button>
                    </div>
                )}

                {payStatus === 'error' && (
                     <div className="flex flex-col items-center justify-center py-4 space-y-4">
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
                                className="flex-1 bg-purple-600 hover:bg-purple-700" 
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