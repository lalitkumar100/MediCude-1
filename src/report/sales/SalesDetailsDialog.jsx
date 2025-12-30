import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SalesDetailsDialog({ isOpen, onOpenChange, sale, onClose }) {
  if (!sale) return null;

  const saleDetails = [
    { label: "Sale No", value: sale.sale_no },
    {
      label: "Sale Date",
      value: sale.sale_date
        ? new Date(sale.sale_date).toLocaleString()
        : "N/A",
    },
    { label: "Customer Name", value: sale.customer_name || "N/A" },
    { label: "Contact Number", value: sale.contact_number || "N/A" },
    { label: "Employee Name", value: sale.employee_name || "N/A" },
    { label: "Payment Method", value: sale.payment_method || "N/A" },
    {
      label: "Total Amount",
      value: `₹${parseFloat(sale.total_amount || 0).toLocaleString("en-IN")}`,
    },
    {
      label: "Profit",
      value: `₹${parseFloat(sale.profit || 0).toLocaleString("en-IN")}`,
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Sale Details
          </DialogTitle>
        </DialogHeader>

        {/* Sale Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {saleDetails.map((item, index) => (
            <div key={index} className="space-y-1">
              <p className="text-sm text-gray-500 font-medium">{item.label}</p>
              <p className="text-base font-semibold text-gray-800">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Sale Items Table */}
        {sale.sale_items && sale.sale_items.length > 0 && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Sale Items
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                  <tr>
                    <th className="px-4 py-3">Medicine Name</th>
                    <th className="px-4 py-3 text-right">Rate</th>
                    <th className="px-4 py-3 text-right">Quantity</th>
                    <th className="px-4 py-3 text-right">Purchase Price</th>
                    <th className="px-4 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {sale.sale_items.map((item, idx) => (
                    <tr
                      key={idx}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {item.medicine_name}
                      </td>
                      <td className="px-4 py-3 text-right">
                        ₹{parseFloat(item.rate).toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3 text-right">{item.quantity}</td>
                      <td className="px-4 py-3 text-right">
                        ₹
                        {parseFloat(item.purchase_price).toLocaleString(
                          "en-IN"
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">
                        ₹
                        {(
                          parseFloat(item.rate) * parseInt(item.quantity)
                        ).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-4 py-2"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}