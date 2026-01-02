import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  ServerCrash,
  FileQuestion,
  AlertCircle,
  Receipt,
  User,
  Calendar,
  CreditCard
} from "lucide-react";
import axios from "axios";

export function SalesDetailsDialog({ isOpen, onOpenChange, sale, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saleDetails, setSaleDetails] = useState(null);
  const token = localStorage.getItem("token");

  // Reset state and fetch data when dialog opens
  useEffect(() => {
    if (isOpen && sale?.sale_id) {
      fetchSaleDetails(sale.sale_id);
    } else {
      setSaleDetails(null);
      setError(null);
      setLoading(false);
    }
  }, [isOpen, sale?.sale_id]);

  const fetchSaleDetails = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/admin/sales/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSaleDetails(response.data.data);
    } catch (err) {
      console.error("Failed to fetch sale details:", err);
      if (err.response) {
        const status = err.response.status;
        if (status === 404) {
          setError("NOT_FOUND");
        } else if (status >= 500) {
          setError("SERVER_ERROR");
        } else {
          setError("GENERIC");
        }
      } else {
        setError("SERVER_ERROR");
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper to render content based on state
  const renderContent = () => {
    // 1. Loading State
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-20 space-y-4 h-full">
          <Loader2 className="h-10 w-10 text-teal-600 animate-spin" />
          <p className="text-gray-500 font-medium">Fetching sale details...</p>
        </div>
      );
    }

    // 2. Error States
    if (error) {
      if (error === "SERVER_ERROR") {
        return (
          <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center h-full">
            <div className="p-4 bg-red-100 rounded-full">
              <ServerCrash className="h-12 w-12 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Server Error</h3>
            <p className="text-gray-500 max-w-xs">
              Something went wrong. Please check your connection.
            </p>
            <Button 
              variant="outline" 
              onClick={() => fetchSaleDetails(sale.sale_id)}
              className="border-red-200 text-red-700 hover:bg-red-50"
            >
              Retry
            </Button>
          </div>
        );
      }

      if (error === "NOT_FOUND") {
        return (
          <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center h-full">
            <div className="p-4 bg-orange-100 rounded-full">
              <FileQuestion className="h-12 w-12 text-orange-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Sale Not Found</h3>
            <p className="text-gray-500 max-w-xs">
              The details for this sale could not be found.
            </p>
          </div>
        );
      }

      return (
        <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center h-full">
          <AlertCircle className="h-12 w-12 text-gray-400" />
          <p className="text-gray-500">Unable to load details.</p>
        </div>
      );
    }

    // 3. Success State (Render Data)
    if (saleDetails) {
      const displayData = [
        { label: "Sale No", value: saleDetails.sale_no, icon: Receipt },
        {
          label: "Sale Date",
          value: saleDetails.sale_date
            ? new Date(saleDetails.sale_date).toLocaleString()
            : "N/A",
            icon: Calendar
        },
        { label: "Customer Name", value: saleDetails.customer_name || "N/A", icon: User },
        { label: "Contact Number", value: saleDetails.contact_number || "N/A", icon: User },
        { label: "Employee Name", value: saleDetails.employee_name || "N/A", icon: User },
        { label: "Payment Method", value: saleDetails.payment_method || "N/A", icon: CreditCard },
      ];

      return (
        <div className="animate-in fade-in duration-300 pb-6">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
             {/* Total Amount Highlight */}
             <div className="col-span-2 md:col-span-1 bg-teal-50 border border-teal-100 rounded-lg p-4 flex flex-col justify-center">
                <span className="text-xs uppercase font-bold text-teal-600 tracking-wider">Total Amount</span>
                <span className="text-2xl font-bold text-teal-900 mt-1">
                  ₹{parseFloat(saleDetails.total_amount || 0).toLocaleString("en-IN")}
                </span>
                {saleDetails.profit && (
                    <span className="text-xs font-medium text-green-600 mt-1">
                        Profit: ₹{parseFloat(saleDetails.profit).toLocaleString("en-IN")}
                    </span>
                )}
             </div>

             {/* Other Details */}
             <div className="col-span-2 grid grid-cols-2 gap-4">
                {displayData.map((item, index) => (
                <div key={index} className="space-y-1">
                    <div className="flex items-center gap-2">
                        <p className="text-xs uppercase tracking-wide text-teal-600 font-bold">
                        {item.label}
                        </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-800 break-words">
                    {item.value}
                    </p>
                </div>
                ))}
            </div>
          </div>

          {/* Sale Items Table */}
          {saleDetails.sale_items && saleDetails.sale_items.length > 0 ? (
            <div className="border border-gray-100 rounded-lg overflow-hidden mt-6 shadow-sm">
              <div className="bg-teal-50 px-4 py-3 border-b border-teal-100">
                  <h3 className="text-sm font-bold text-teal-900 uppercase tracking-wide">
                    Items List
                  </h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-teal-800 uppercase bg-teal-50/50 border-b border-gray-100">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Medicine Name</th>
                      <th className="px-4 py-3 text-right font-semibold">Rate</th>
                      <th className="px-4 py-3 text-right font-semibold">Qty</th>
                      <th className="px-4 py-3 text-right font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {saleDetails.sale_items.map((item, idx) => (
                      <tr
                        key={idx}
                        className="bg-white hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {item.medicine_name}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-600">
                          ₹{parseFloat(item.rate).toLocaleString("en-IN")}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-600">
                            {item.quantity}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-teal-700">
                          ₹{(parseFloat(item.rate) * parseInt(item.quantity)).toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
             <div className="border border-dashed border-gray-300 rounded-lg p-8 mt-6 text-center">
               <Receipt className="h-8 w-8 text-gray-300 mx-auto mb-2" />
               <p className="text-gray-500 italic">No items found for this sale.</p>
             </div>
          )}
        </div>
      );
    }

    return null;
  };

  if (!sale) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {/* Key Changes for Scrolling:
        1. max-h-[85vh]: Sets the max height of the dialog
        2. flex flex-col: Allows us to use flex-1 on the content
        3. overflow-hidden: Prevents double scrollbars
      */}
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden outline-none">
        
        {/* Fixed Header */}
        <div className="px-6 py-4 border-b border-gray-100 bg-white shrink-0">
            <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800 flex items-center  gap-3">
                <span>Sale Details</span>
                <span className="px-4 py-1 bg-teal-100 text-teal-800 text-sm rounded-full font-medium border border-teal-200">
                #{sale.sale_no || sale.sale_id}
                </span>
            </DialogTitle>
            </DialogHeader>
        </div>

        {/* Scrollable Content Area */}
        {/* flex-1: Takes up remaining space. overflow-y-auto: Enables scroll here */}
        <div className="flex-1 overflow-y-auto px-6 py-2">
           {renderContent()}
        </div>

        {/* Fixed Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 shrink-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-6 bg-red-300 border-red-300 text-red-700 hover:bg-red-100 hover:text-red-700 hover:border-red-300 transition-all"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}