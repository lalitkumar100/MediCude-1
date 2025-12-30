import React, { useState, useMemo } from "react"
import { ArrowLeft, Plus, Trash2, Package, X } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { AppSidebar } from "@/components/AppSidebar"
import { BillingDialog } from "./BillingDialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import PageBreadcrumb from "@/components/PageBreadcrumb"

// Sample medicine data
const sampleMedicines = [
  {
    id: 8,
    name: "Losartan 50mg",
    brand: "Cozaar",
    batch: "LOS008",
    quantity: 110,
    expiry: "2025-10-12",
    price: 42.75,
    purchasePrice: 42.75 * 0.8,
  },
  {
    id: 9,
    name: "Amlodipine 5mg",
    brand: "Norvasc",
    batch: "AML009",
    quantity: 95,
    expiry: "2026-02-08",
    price: 38.0,
    purchasePrice: 38.0 * 0.8,
  },
  {
    id: 10,
    name: "Levothyroxine 50mcg",
    brand: "Synthroid",
    batch: "LEV010",
    quantity: 140,
    expiry: "2025-12-03",
    price: 22.5,
    purchasePrice: 22.5 * 0.8,
  },
]

// Counter configuration with colors
const COUNTERS = [
  { id: 1, name: "Counter 1", color: "blue", bgColor: "bg-blue-50", buttonColor: "bg-blue-600", hoverColor: "hover:bg-blue-700", borderColor: "border-blue-300" },
  { id: 2, name: "Counter 2", color: "green", bgColor: "bg-green-50", buttonColor: "bg-green-600", hoverColor: "hover:bg-green-700", borderColor: "border-green-300" },
  { id: 3, name: "Counter 3", color: "purple", bgColor: "bg-purple-50", buttonColor: "bg-purple-600", hoverColor: "hover:bg-purple-700", borderColor: "border-purple-300" },
  { id: 4, name: "Counter 4", color: "orange", bgColor: "bg-orange-50", buttonColor: "bg-orange-600", hoverColor: "hover:bg-orange-700", borderColor: "border-orange-300" },
  { id: 5, name: "Counter 5", color: "red", bgColor: "bg-red-50", buttonColor: "bg-red-600", hoverColor: "hover:bg-red-700", borderColor: "border-red-300" },
]

// Initial state for a single counter
const getInitialCounterState = () => ({
  customerData: {
    customerNumber: "",
    customerName: "",
  },
  selectedPaymentMethod: "cash",
  billItems: [],
})

export default function BillingPage() {
  const navigate = useNavigate()
  const [activeCounter, setActiveCounter] = useState(1)
  const [countersData, setCountersData] = useState(() => {
    const initial = {}
    COUNTERS.forEach(counter => {
      initial[counter.id] = getInitialCounterState()
    })
    return initial
  })
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false)

  // Get current counter data
  const currentCounterData = countersData[activeCounter]
  const activeCounterConfig = COUNTERS.find(c => c.id === activeCounter)

  const handleInputChange = (field, value) => {
    setCountersData(prev => ({
      ...prev,
      [activeCounter]: {
        ...prev[activeCounter],
        customerData: {
          ...prev[activeCounter].customerData,
          [field]: value,
        }
      }
    }))
  }

  const handlePaymentMethodChange = (value) => {
    setCountersData(prev => ({
      ...prev,
      [activeCounter]: {
        ...prev[activeCounter],
        selectedPaymentMethod: value,
      }
    }))
  }

  const handleGoBack = () => {
    navigate("/dashboard")
  }

  const handleCustomerFormSubmit = (e) => {
    e.preventDefault()
    if (!currentCounterData.customerData.customerNumber) {
      alert("Customer Number is required!")
      return
    }
    console.log("Customer Data Submitted:", currentCounterData.customerData, "Payment Method:", currentCounterData.selectedPaymentMethod)
    alert(`Customer ${currentCounterData.customerData.customerNumber} selected with ${currentCounterData.selectedPaymentMethod} payment on ${activeCounterConfig.name}!`)
  }

  const handleAddItemToBill = (newItem) => {
    setCountersData(prev => ({
      ...prev,
      [activeCounter]: {
        ...prev[activeCounter],
        billItems: [...prev[activeCounter].billItems, newItem]
      }
    }))
  }

  const handleRemoveItemFromBill = (id) => {
    setCountersData(prev => ({
      ...prev,
      [activeCounter]: {
        ...prev[activeCounter],
        billItems: prev[activeCounter].billItems.filter(item => item.id !== id)
      }
    }))
  }

  const handleClearCounter = () => {
    if (currentCounterData.billItems.length === 0 && !currentCounterData.customerData.customerNumber) {
      alert("Counter is already empty!")
      return
    }
    
    if (window.confirm(`Are you sure you want to clear ${activeCounterConfig.name}?`)) {
      setCountersData(prev => ({
        ...prev,
        [activeCounter]: getInitialCounterState()
      }))
      alert(`${activeCounterConfig.name} cleared successfully!`)
    }
  }

  const handleGenerateBill = () => {
    if (currentCounterData.billItems.length === 0) {
      alert("Please add at least one item to generate a bill.")
      return
    }
    if (!currentCounterData.customerData.customerNumber) {
      alert("Customer Number is required to generate a bill.")
      return
    }
    
    console.log("Generating Bill:", {
      counter: activeCounterConfig.name,
      customerData: currentCounterData.customerData,
      paymentMethod: currentCounterData.selectedPaymentMethod,
      billItems: currentCounterData.billItems,
      totalBill: calculateTotal(activeCounter),
    })
    
    alert(`Bill generated successfully for ₹${calculateTotal(activeCounter).toFixed(2)} on ${activeCounterConfig.name}!`)
    
    // Clear only the current counter after successful bill generation
    setCountersData(prev => ({
      ...prev,
      [activeCounter]: getInitialCounterState()
    }))
  }

  // Calculate total for a specific counter
  const calculateTotal = (counterId) => {
    return countersData[counterId].billItems.reduce((sum, item) => sum + item.quantity * item.sellingPrice, 0)
  }

  // Calculate total bill for current counter
  const totalBill = useMemo(() => {
    return calculateTotal(activeCounter)
  }, [currentCounterData.billItems, activeCounter])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className={`${activeCounterConfig.bgColor} transition-colors duration-300`}>
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[data-collapsible=icon]/sidebar-wrapper:h-12 bg-white">
          <PageBreadcrumb
            items={[
              { label: "PharmaDesk", href: "/dashboard" },
              { label: "Billing" },
            ]}
            currentPage="Billing"
          />
        </header>

        {/* Main Content */}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={handleGoBack} aria-label="Go back">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold text-gray-800">New Bill - {activeCounterConfig.name}</h1>
            </div>
          </div>

          {/* Counter Selection Buttons */}
          <Card className="bg-transparent border-none shadow-none">
            
            <CardContent>
              <div className="flex flex-wrap gap-3 align-middle">
                {COUNTERS.map(counter => {
                  const counterTotal = calculateTotal(counter.id)
                  const itemCount = countersData[counter.id].billItems.length
                  const isActive = activeCounter === counter.id
                  
                  return (
                    <Button
                      key={counter.id}
                      onClick={() => setActiveCounter(counter.id)}
                      className={`${counter.buttonColor} ${counter.hoverColor} text-white relative ${
                        isActive ? 'ring-4 ring-offset-2 ring-gray-400' : ''
                      }`}
                      size="lg"
                    >
                      <span className="mr-2">{counter.name}</span>
                      {counterTotal > 0 && (
                        <Badge variant="secondary" className="ml-2 bg-white text-gray-800 font-semibold">
                          ₹{counterTotal.toFixed(0)}
                        </Badge>
                      )}
                      {itemCount > 0 && (
                        <Badge 
                          variant="destructive" 
                          className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 rounded-full"
                        >
                          {itemCount}
                        </Badge>
                      )}
                    </Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card className={`shadow-sm bg-white border-2 ${activeCounterConfig.borderColor}`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Customer Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCustomerFormSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="customerNumber" className="text-sm">
                    Customer Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="customerNumber"
                    value={currentCounterData.customerData.customerNumber}
                    onChange={(e) => handleInputChange("customerNumber", e.target.value)}
                    placeholder="Enter number"
                    required
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="customerName" className="text-sm">Customer Name</Label>
                  <Input
                    id="customerName"
                    value={currentCounterData.customerData.customerName}
                    onChange={(e) => handleInputChange("customerName", e.target.value)}
                    placeholder="Enter name (optional)"
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="paymentMethod" className="text-sm">Payment Method</Label>
                  <Select value={currentCounterData.selectedPaymentMethod} onValueChange={handlePaymentMethodChange}>
                    <SelectTrigger id="paymentMethod" className="h-9">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="unpaid">Unpaid</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button type="submit" className={`${activeCounterConfig.buttonColor} ${activeCounterConfig.hoverColor} text-white h-9 w-full`}>
                    Load Customer
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className={`shadow-sm bg-white border-2 ${activeCounterConfig.borderColor}`}>
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-xl">Items</CardTitle>
                  <CardDescription>
                    {currentCounterData.billItems.length} item{currentCounterData.billItems.length !== 1 ? "s" : ""} added
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={handleClearCounter}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear Counter
                  </Button>
                  <BillingDialog
                    isOpen={isAddItemModalOpen}
                    onOpenChange={setIsAddItemModalOpen}
                    medicines={sampleMedicines}
                    onAddItem={handleAddItemToBill}
                    triggerButton={
                      <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Item
                      </Button>
                    }
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {currentCounterData.billItems.length > 0 ? (
                <div className="space-y-4">
                  {/* Total Bill */}
                  <div className={`p-4 ${activeCounterConfig.bgColor} rounded-lg border-t-2 ${activeCounterConfig.borderColor} flex justify-between items-center`}>
                    <span className="text-lg font-semibold text-gray-700">Total Bill</span>
                    <span className="text-xl font-bold text-indigo-600">₹{totalBill.toFixed(2)}</span>
                  </div>

                  {/* Item Cards */}
                  {currentCounterData.billItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 border rounded-lg hover:border-cyan-300 transition-colors bg-white shadow-sm"
                    >
                      {/* Card Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-indigo-700">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.batch}</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:bg-red-100 hover:text-red-700"
                          onClick={() => handleRemoveItemFromBill(item.id)}
                          aria-label="Delete item"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>

                      {/* Card Body - Responsive Grid */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-3 md:grid-cols-4">
                        <div>
                          <span className="block text-xs font-medium text-gray-500">Quantity</span>
                          <span className="font-medium text-gray-800">{item.quantity}</span>
                        </div>
                        <div>
                          <span className="block text-xs font-medium text-gray-500">Selling Price</span>
                          <span className="font-medium text-gray-800">₹{item.sellingPrice.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="block text-xs font-medium text-gray-500">MRP</span>
                          <span className="font-medium text-gray-800">₹{item.mrp.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="block text-xs font-medium text-gray-500">Subtotal</span>
                          <span className="font-semibold text-indigo-700">
                            ₹{(item.quantity * item.sellingPrice).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center border-2 border-dashed rounded-lg border-gray-200">
                  <Package className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p className="font-medium text-gray-500">No items added yet.</p>
                  <p className="text-sm text-gray-400">
                    Click "Add Item" to begin adding items to the bill.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Final Actions */}
          <div className="flex justify-end gap-4 pt-6">
            <Button variant="outline" onClick={handleGoBack}>
              Cancel Bill
            </Button>
            <Button 
              onClick={handleGenerateBill} 
              className={`${activeCounterConfig.buttonColor} ${activeCounterConfig.hoverColor} text-white`}
            >
              Generate Bill
            </Button>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}