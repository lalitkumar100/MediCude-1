import React from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function InvoiceDetailsDialog({ 
  isOpen, 
  onOpenChange, 
  invoice,
  onDelete,
  onClose
}) {
  if (!invoice) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-w-[95vw] h-[85vh] sm:h-auto max-h-[90vh] flex flex-col p-0">
        {/* Fixed Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <DialogTitle className="text-blue-700">
            Invoice Details
          </DialogTitle>
          <DialogDescription>
            Detailed information about this invoice.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 px-6 py-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Invoice No
                </label>
                <p className="text-sm text-gray-900 font-mono">
                  {invoice.invoice_no}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Wholesaler
                </label>
                <p className="text-sm text-gray-900">
                  {invoice.name}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Created At
                </label>
                <p className="text-sm text-gray-900">
                  {new Date(invoice.createdAt).toLocaleDateString()}{" "}
                  {new Date(invoice.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Total Amount
                </label>
                <p className="text-sm text-gray-900 font-semibold">
                  ₹{invoice.total_amount}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Paid Amount
                </label>
                <p className="text-sm text-gray-900">
                  ₹{invoice.paid_amount}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Payment Status
                </label>
                <p className="text-sm text-gray-900">
                  {invoice.payment_status}
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Medicines in this Invoice
              </label>
              {invoice.medicines && invoice.medicines.length > 0 ? (
                <div className="border rounded-md max-h-60 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-gray-600">
                          Medicine
                        </th>
                        <th className="px-4 py-2 text-center font-medium text-gray-600">
                          Qty
                        </th>
                        <th className="px-4 py-2 text-right font-medium text-gray-600">
                          Price
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.medicines.map((med, idx) => (
                        <tr key={idx} className="border-t border-gray-100">
                          <td className="px-4 py-2">{med.medicine}</td>
                          <td className="px-4 py-2 text-center">
                            {med.qty}
                          </td>
                          <td className="px-4 py-2 text-right">
                            ₹{med.price}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No medicines listed for this invoice.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <DialogFooter className="px-6 py-4 border-t gap-2 flex-col sm:flex-row shrink-0">
          <Button
            variant="destructive"
            onClick={() => {
              onDelete(invoice)
              onOpenChange(false)
            }}
            className="w-full sm:w-auto"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Invoice
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              onClose()
              onOpenChange(false)
            }}
            className="w-full sm:w-auto bg-transparent"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}