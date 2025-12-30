import React, { useState, useMemo } from "react"
import { Plus, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function BillingDialog({ 
  isOpen, 
  onOpenChange, 
  medicines, 
  onAddItem,
  triggerButton 
}) {
  const [selectedMedicine, setSelectedMedicine] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [quantity, setQuantity] = useState("")
  const [sellingPrice, setSellingPrice] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)

  const handleSearchChange = (value) => {
    setSearchTerm(value)
    setShowSuggestions(true)
  }

  const handleSelectMedicine = (medicine) => {
    setSelectedMedicine(medicine)
    setSearchTerm(`${medicine.name} (${medicine.batch})`)
    setSellingPrice(medicine.price)
    setQuantity("")
    setShowSuggestions(false)
  }

  const handleClearFields = () => {
    setSelectedMedicine(null)
    setSearchTerm("")
    setQuantity("")
    setSellingPrice("")
  }

  const handleAdd = () => {
    if (!selectedMedicine) {
      alert("Please select a medicine.")
      return
    }
    const qty = Number(quantity)
    const sp = Number(sellingPrice)

    if (!Number.isFinite(qty) || qty <= 0) {
      alert("Please enter a valid quantity.")
      return
    }
    if (!Number.isFinite(sp) || sp <= 0) {
      alert("Please enter a valid selling price.")
      return
    }

    if (qty > selectedMedicine.quantity) {
      alert("Quantity exceeds available stock!")
      return
    }

    if (sp < selectedMedicine.purchasePrice) {
      const confirmAdd = window.confirm(
        `Selling price (₹${sp.toFixed(2)}) is less than purchase price (₹${selectedMedicine.purchasePrice.toFixed(2)}). Do you want to add this item anyway?`
      )
      if (!confirmAdd) {
        return
      }
    }

    const newItem = {
      id: Date.now(),
      medicineId: selectedMedicine.id,
      name: selectedMedicine.name,
      batch: selectedMedicine.batch,
      quantity: qty,
      sellingPrice: sp,
      mrp: selectedMedicine.price,
      purchasePrice: selectedMedicine.purchasePrice,
    }

    onAddItem(newItem)
    handleClearFields()
    onOpenChange(false)
  }

  const filteredSuggestions = useMemo(() => {
    return medicines.filter((medicine) => {
      const term = searchTerm.toLowerCase()
      return (
        medicine.name.toLowerCase().includes(term) || 
        medicine.batch.toLowerCase().includes(term)
      )
    })
  }, [searchTerm, medicines])

  return (
      // Inside BillingDialog.jsx
// ... (imports and logic remain the same)


    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {triggerButton && <DialogTrigger asChild>{triggerButton}</DialogTrigger>}
      
      {/* FIX APPLIED HERE: 
          1. Added 'max-h-[95vh]' to prevent it going off top/bottom.
          2. Added 'overflow-y-auto' to allow scrolling inside the dialog.
          3. Added 'flex flex-col' to handle internal layout properly.
      */}
      <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg max-h-[95vh] overflow-y-auto">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-blue-700">Add Item to Bill</DialogTitle>
          <DialogDescription>
            Search for a medicine and add it to the current bill.
          </DialogDescription>
        </DialogHeader>

        {/* Added 'flex-1' to the container below to ensure it scrolls if content is long */}
        <div className="grid gap-4 py-4 flex-1">
          <div className="space-y-2 relative">
            <Label htmlFor="itemSearch">Item Name (Batch No)</Label>
            <Input
              id="itemSearch"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => {
                if (searchTerm.length > 0) setShowSuggestions(true)
              }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
              placeholder="Search medicine by name or batch"
            />
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
                {filteredSuggestions.map((med) => (
                  <div
                    key={med.id}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onMouseDown={() => handleSelectMedicine(med)}
                  >
                    {med.name} ({med.batch})
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedMedicine && (
            <div className="space-y-4"> {/* Container for selected med details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Purchase Price</Label>
                  <Input
                    value={`₹${selectedMedicine.purchasePrice.toFixed(2)}`}
                    disabled
                    className="bg-gray-100 text-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label>MRP</Label>
                  <Input
                    value={`₹${selectedMedicine.price.toFixed(2)}`}
                    disabled
                    className="bg-gray-100 text-gray-500"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Available Quantity</Label>
                <Input
                  value={`${selectedMedicine.quantity} units`}
                  disabled
                  className="bg-gray-100 text-gray-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="itemQuantity">Quantity</Label>
                  <Input
                    id="itemQuantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className={
                      typeof quantity === "number" && quantity > selectedMedicine.quantity
                        ? "border-red-500 text-red-600"
                        : ""
                    }
                    placeholder="Enter quantity"
                  />
                  {typeof quantity === "number" && quantity > selectedMedicine.quantity && (
                    <p className="text-red-500 text-xs">Exceeds stock!</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="itemSellingPrice">Selling Price (₹)</Label>
                  <Input
                    id="itemSellingPrice"
                    type="number"
                    step="0.01"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(Number(e.target.value))}
                    className={
                      typeof sellingPrice === "number" &&
                      sellingPrice < selectedMedicine.purchasePrice
                        ? "border-red-500 text-red-600"
                        : ""
                    }
                    placeholder="Enter selling price"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FIX APPLIED HERE:
            Changed sm:flex-row to ensure buttons stay accessible.
            Added shrink-0 to prevent footer from disappearing.
        */}
        <DialogFooter className="gap-2 flex-col sm:flex-row pt-2 shrink-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:order-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleClearFields}
            variant="outline"
            className="w-full sm:order-2"
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Clear
          </Button>
          <Button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:order-3"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
