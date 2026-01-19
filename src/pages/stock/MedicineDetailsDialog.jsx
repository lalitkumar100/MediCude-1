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
import { Loader2, Package, AlertCircle, Calendar, DollarSign, FileText, Building2, Box, Clock } from "lucide-react"

export function MedicineDetailsDialog({ 
  isOpen, 
  onOpenChange, 
  medicine,
  onPurchaseReturn,
  onUpdate,
  isLoading = false,
  notFound = false
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-w-[95vw] mx-auto max-h-[90vh] overflow-y-auto flex flex-col border-0 shadow-2xl">
        {isLoading ? (
          // Loading State
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
            <p className="text-gray-600 font-medium">Loading medicine details...</p>
          </div>
        ) : notFound ? (
          // 404 Not Found State
          <div className="flex flex-col items-center justify-center py-8 space-y-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-gray-900">Medicine Not Found</h3>
              <p className="text-gray-600 max-w-md">
                The medicine you're looking for doesn't exist or has been removed from the inventory.
              </p>
            </div>
            <Button
              onClick={() => onOpenChange(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Close
            </Button>
          </div>
        ) : medicine ? (
          // Medicine Details
          <>
            <DialogHeader className="shrink-0 border-b pb-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-2xl font-bold text-gray-900 mb-1">
                    {medicine.medicine_name}
                  </DialogTitle>
                  <DialogDescription className="text-base">
                    {medicine.brand_name}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-3 py-6 flex-1">
              {/* Primary Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-blue-700" />
                    <label className="text-sm font-semibold text-blue-900">MRP</label>
                  </div>
                  <p className="text-2xl font-bold text-blue-700">₹{medicine.mrp}</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Box className="w-5 h-5 text-green-700" />
                    <label className="text-sm font-semibold text-green-900">Stock Quantity</label>
                  </div>
                  <p className="text-2xl font-bold text-green-700">{medicine.stock_quantity} units</p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoCard
                  icon={<FileText className="w-4 h-4" />}
                  label="Batch Number"
                  value={medicine.batch_no}
                  mono
                />
                <InfoCard
                  icon={<DollarSign className="w-4 h-4" />}
                  label="Purchase Price"
                  value={`₹${(medicine.mrp * 0.8).toFixed(2)}`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoCard
                  icon={<FileText className="w-4 h-4" />}
                  label="Invoice Number"
                  value={medicine.invoice_no}
                  mono
                />
                <InfoCard
                  icon={<Calendar className="w-4 h-4" />}
                  label="Expiry Date"
                  value={new Date(medicine.expiry_date).toLocaleDateString()}
                  highlight={new Date(medicine.expiry_date) < new Date() ? "text-red-600" : ""}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoCard
                  icon={<Building2 className="w-4 h-4" />}
                  label="Wholesaler"
                  value={medicine.wholesaler_name}
                />
                <InfoCard
                  icon={<Package className="w-4 h-4" />}
                  label="Packaging"
                  value="Strip of 10 tablets"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoCard
                  icon={<Calendar className="w-4 h-4" />}
                  label="Manufacturing Date"
                  value={new Date(
                    new Date(medicine.expiry_date).getTime() - 2 * 365 * 24 * 60 * 60 * 1000
                  ).toLocaleDateString()}
                />
                <InfoCard
                  icon={<Clock className="w-4 h-4" />}
                  label="Created At"
                  value={`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`}
                />
              </div>
            </div>

            <DialogFooter className="gap-2 flex-col sm:flex-row shrink-0 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  onPurchaseReturn(medicine.medicine_id)
                  onOpenChange(false)
                }}
                className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50 bg-transparent w-full sm:w-auto font-semibold transition-all hover:scale-105"
              >
                Purchase Return
              </Button>
              <Button
                onClick={() => {
                  onUpdate(medicine.medicine_id)
                  onOpenChange(false)
                }}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white w-full sm:w-auto font-semibold shadow-lg transition-all hover:scale-105"
              >
                Update Medicine
              </Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

// Info Card Component
function InfoCard({ icon, label, value, mono = false, highlight = "" }) {
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-all hover:shadow-md">
      <div className="flex items-center gap-2 mb-1">
        <div className="text-gray-500">{icon}</div>
        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</label>
      </div>
      <p className={`text-sm font-semibold text-gray-900 ${mono ? 'font-mono' : ''} ${highlight}`}>
        {value}
      </p>
    </div>
  )
}

// Demo Component
export default function Demo() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [currentState, setCurrentState] = React.useState("loaded") // "loading", "loaded", "notFound"

  const sampleMedicine = {
    medicine_id: "MED001",
    medicine_name: "Paracetamol",
    brand_name: "Crocin",
    batch_no: "BT2024001",
    stock_quantity: 150,
    mrp: 45.00,
    invoice_no: "INV2024-0123",
    expiry_date: "2025-12-31",
    wholesaler_name: "MediSupply Co.",
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Medicine Details Dialog</h1>
          <p className="text-gray-600">Stylish dialog with loading and error states</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Test Different States:</h2>
          
          <Button
            onClick={() => {
              setCurrentState("loaded")
              setIsOpen(true)
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Show Medicine Details (Loaded)
          </Button>

          <Button
            onClick={() => {
              setCurrentState("loading")
              setIsOpen(true)
            }}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            Show Loading State
          </Button>

          <Button
            onClick={() => {
              setCurrentState("notFound")
              setIsOpen(true)
            }}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            Show 404 Not Found
          </Button>
        </div>

        <MedicineDetailsDialog
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          medicine={currentState === "loaded" ? sampleMedicine : null}
          isLoading={currentState === "loading"}
          notFound={currentState === "notFound"}
          onPurchaseReturn={(id) => console.log("Purchase return:", id)}
          onUpdate={(id) => console.log("Update:", id)}
        />
      </div>
    </div>
  )
}