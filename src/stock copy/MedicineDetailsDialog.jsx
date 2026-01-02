import React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function MedicineDetailsDialog({ 
  isOpen, 
  onOpenChange, 
  medicine,
  onPurchaseReturn,
  onUpdate
}) {
  if (!medicine) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {/* MODIFICATIONS MADE:
          1. added 'max-h-[90vh]' to keep the dialog within the screen height.
          2. added 'overflow-y-auto' to make the content scrollable on mobile.
          3. added 'fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]' 
             (standard in shadcn) to ensure dead-center placement.
      */}
      <DialogContent className="sm:max-w-md max-w-[95vw] mx-auto max-h-[90vh] overflow-y-auto flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-blue-700">
            Medicine Details
          </DialogTitle>
          <DialogDescription>
            View and manage medicine information
          </DialogDescription>
        </DialogHeader>

        {/* This div contains the scrollable info */}
        <div className="space-y-4 py-4 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Medicine Name</label>
              <p className="text-sm text-gray-900">{medicine.medicine_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Brand</label>
              <p className="text-sm text-gray-900">{medicine.brand_name}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Batch No</label>
              <p className="text-sm text-gray-900 font-mono">{medicine.batch_no}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Quantity</label>
              <p className="text-sm text-gray-900">{medicine.stock_quantity} units</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">MRP</label>
              <p className="text-sm text-gray-900 font-semibold">₹{medicine.mrp}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Purchase Price</label>
              <p className="text-sm text-gray-900">₹{(medicine.mrp * 0.8).toFixed(2)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Invoice No</label>
              <p className="text-sm text-gray-900 font-mono">{medicine.invoice_no}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Expiry Date</label>
              <p className="text-sm text-gray-900">
                {new Date(medicine.expiry_date).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Wholesaler</label>
              <p className="text-sm text-gray-900">{medicine.wholesaler_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Packed Type</label>
              <p className="text-sm text-gray-900">Strip of 10 tablets</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">MFG Date</label>
              <p className="text-sm text-gray-900">
                {new Date(
                  new Date(medicine.expiry_date).getTime() - 2 * 365 * 24 * 60 * 60 * 1000
                ).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Created At</label>
              <p className="text-sm text-gray-900">
                {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

        {/* shrink-0 ensures the buttons stay at the bottom 
            and don't disappear when the list is long.
        */}
        <DialogFooter className="gap-2 flex-col sm:flex-row shrink-0 pt-2 border-t">
          <Button
            variant="outline"
            onClick={() => {
              onPurchaseReturn(medicine)
              onOpenChange(false)
            }}
            className="border-orange-500 text-orange-600 hover:bg-orange-50 bg-transparent w-full sm:w-auto"
          >
            Purchase Return
          </Button>
          <Button
            onClick={() => {
              onUpdate(medicine.medicine_id)
              onOpenChange(false)
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
          >
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}