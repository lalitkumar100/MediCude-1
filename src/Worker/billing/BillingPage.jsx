import React, { useState, useMemo } from "react"
import { ArrowLeft, Plus, Trash2, Package, X, CreditCard, User, Phone, Loader2, Receipt } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { BillingDialog } from "./BillingDialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// --- SONNER IMPORTS ---
import { toast } from "sonner" // Import the function directly
import axios from "axios"



// Counter configuration
const COUNTERS = [
  {
    id: 1,
    name: "Counter 1",
    color: "blue",
    bgColor: "bg-blue-50/60",
    headerBg: "bg-blue-100/60",
    headerText: "text-blue-700",
    iconText: "text-blue-600",
    buttonColor: "bg-blue-600",
    hoverColor: "hover:bg-blue-700",
    borderColor: "border-blue-200",
  },
  {
    id: 2,
    name: "Counter 2",
    color: "green",
    bgColor: "bg-green-50/60",
    headerBg: "bg-green-100/60",
    headerText: "text-green-700",
    iconText: "text-green-600",
    buttonColor: "bg-green-600",
    hoverColor: "hover:bg-green-700",
    borderColor: "border-green-200",
  },
  {
    id: 3,
    name: "Counter 3",
    color: "purple",
    bgColor: "bg-purple-50/60",
    headerBg: "bg-purple-100/60",
    headerText: "text-purple-700",
    iconText: "text-purple-600",
    buttonColor: "bg-purple-600",
    hoverColor: "hover:bg-purple-700",
    borderColor: "border-purple-200",
  },
 {
  id: 4,
  name: "Counter 4",
  color: "yellow",
  bgColor: "bg-yellow-100/60",
  headerBg: "bg-yellow-200/100",
  headerText: "text-yellow-700",
  iconText: "text-yellow-600",
  buttonColor: "bg-yellow-600",
  hoverColor: "hover:bg-yellow-700",
  borderColor: "border-yellow-200",
},
{
  id: 5,
  name: "Counter 5",
  color: "pink",
  bgColor: "bg-pink-100/60",
  headerBg: "bg-pink-200/100",
  headerText: "text-pink-700",
  iconText: "text-pink-600",
  buttonColor: "bg-pink-600",
  hoverColor: "hover:bg-pink-700",
  borderColor: "border-pink-200",
},

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
  // No need for useToast hook anymore
  const [activeCounter, setActiveCounter] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const handleAddItemToBill = (newItem) => {
    setCountersData(prev => ({
      ...prev,
      [activeCounter]: {
        ...prev[activeCounter],
        billItems: [...prev[activeCounter].billItems, newItem]
      }
    }))
    // Sonner Success
    toast.success("Item Added", {
      description: `${newItem.name} added to bill.`
    })
  }

  const handleRemoveItemFromBill = (id) => {
    setCountersData(prev => ({
      ...prev,
      [activeCounter]: {
        ...prev[activeCounter],
        billItems: prev[activeCounter].billItems.filter(item => item.id !== id)
      }
    }))
    toast.info("Item Removed")
  }

  const handleClearCounter = () => {
    if (currentCounterData.billItems.length === 0 && !currentCounterData.customerData.customerNumber) {
      toast.warning("Counter Empty", { description: "Nothing to clear." })
      return
    }

    if (window.confirm(`Are you sure you want to clear ${activeCounterConfig.name}?`)) {
      setCountersData(prev => ({
        ...prev,
        [activeCounter]: getInitialCounterState()
      }))
      toast.info("Cleared", { description: `${activeCounterConfig.name} has been reset.` })
    }
  }

  const calculateTotal = (counterId) => {
    return countersData[counterId].billItems.reduce((sum, item) => sum + item.quantity * item.sellingPrice, 0)
  }

  const totalBill = useMemo(() => {
    return calculateTotal(activeCounter)
  }, [currentCounterData.billItems, activeCounter])


  // --- API INTEGRATION ---
  // --- API INTEGRATION ---
  const handleGenerateBill = async () => {
    // 1. Validation
    if (currentCounterData.billItems.length === 0) {
      toast.error("Empty Bill", {
        description: "Please add at least one medicine to the bill.",
      })
      return
    }

    if (!currentCounterData.customerData.customerNumber) {
      toast.error("Missing Details", {
        description: "Customer Contact Number is required.",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // 2. Prepare Payload
      const formatPayment = (method) =>
        method.charAt(0).toUpperCase() + method.slice(1)

      const payload = {
        customer_name:
          currentCounterData.customerData.customerName || "Unknown",
        contact_number: currentCounterData.customerData.customerNumber,
        payment_method: formatPayment(
          currentCounterData.selectedPaymentMethod
        ),
        medicines: currentCounterData.billItems.map((item) => ({
          medicine_id: item.medicineId,
          quantity: parseInt(item.quantity),
          rate: parseFloat(item.sellingPrice),
        })),
      }

      console.log("Payload:", payload)

      // 3. Get Token
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication token not found. Please login again.")
      }

      // 4. API Call (Axios)
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/admin/sales`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const result = response.data

      // 5. Success Handling
      toast.success("Bill Generated Successfully!", {
        description: `Total Amount: ₹${totalBill.toFixed(2)}`,
        duration: 4000,
      })

      console.log("Server Response:", result)

      // Reset Counter
      setCountersData((prev) => ({
        ...prev,
        [activeCounter]: getInitialCounterState(),
      }))
    } catch (error) {
      console.error("Billing Error:", error)

      toast.error("Error Generating Bill", {
        description:
          error.response?.data?.message ||
          error.message ||
          "Failed to generate bill",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>


      {/* Main Content */}
      <div className="flex flex-1 flex-col gap-6 p-3 max-w-7xl mx-auto w-full">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1
            className={`text-3xl font-bold tracking-tight flex items-center gap-2 ${activeCounterConfig.headerText}`}
          >
            <Receipt className={`h-8 w-8 ${activeCounterConfig.iconText}`} />
            Billing
          </h1>


          {/* Counter Switcher */}
          <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 no-scrollbar">
            {COUNTERS.map(counter => {
              const counterTotal = calculateTotal(counter.id)
              const itemCount = countersData[counter.id].billItems.length
              const isActive = activeCounter === counter.id

              return (
                <button
                  key={counter.id}
                  onClick={() => setActiveCounter(counter.id)}
                  className={`
                        relative flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-400 whitespace-nowrap
                        ${isActive
                      ? `${counter.buttonColor} text-white shadow-lg shadow-${counter.color}-500/30 border-transparent transform scale-105`
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }
                      `}
                >
                  <span className="font-medium text-sm">{counter.name}</span>
                  {counterTotal > 0 && (
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      ₹{counterTotal.toFixed(0)}
                    </span>
                  )}
                  {itemCount > 0 && !isActive && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* Left Column: Customer & Actions */}
          <div className="space-y-6 lg:col-span-1">

            {/* Customer Details Card */}
            <Card
              className={`shadow-lg border-0 ring-1 ring-slate-200 pt-0 ${activeCounterConfig.borderColor} ${activeCounterConfig.bgColor}`}
            >
              <CardHeader
                className={`pb-0 pt-4 border-b  ${activeCounterConfig.headerBg}`}
              >
                <CardTitle
                  className={`text-lg flex items-center gap-2 ${activeCounterConfig.headerText}`}
                >
                  <User className={`h-5 w-5 ${activeCounterConfig.iconText}`} />
                  Customer Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customerNumber" className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" /> Contact Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="customerNumber"
                    value={currentCounterData.customerData.customerNumber}
                    onChange={(e) => handleInputChange("customerNumber", e.target.value)}
                    placeholder="9876543210"
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    value={currentCounterData.customerData.customerName}
                    onChange={(e) => handleInputChange("customerName", e.target.value)}
                    placeholder="Walk-in Customer"
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod" className="flex items-center gap-2">
                    <CreditCard className="h-3.5 w-3.5" /> Payment Method
                  </Label>
                  <Select value={currentCounterData.selectedPaymentMethod} onValueChange={handlePaymentMethodChange}>
                    <SelectTrigger id="paymentMethod" className="h-10">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="UPI">UPI</SelectItem>
                      <SelectItem value="Credit">Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Bill Summary Card */}
            <Card className={`shadow-lg border-0 ring-1  ring-slate-200 overflow-hidden  ${activeCounterConfig.borderColor} ${activeCounterConfig.bgColor}`}>
              <div className={`${activeCounterConfig.buttonColor} p-6 text-white text-center`}>
                <p className="text-blue-100 text-sm font-medium uppercase tracking-wider mb-1">Total Payable</p>
                <div className="text-4xl font-bold tracking-tight">₹{totalBill.toFixed(2)}</div>
              </div>
              <CardContent className={`p-0 ${activeCounterConfig.borderColor} ${activeCounterConfig.bgColor}`}>
                <div className={`p-4 ${activeCounterConfig.borderColor} ${activeCounterConfig.bgColor} space-y-2 text-sm text-slate-600`}>
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{totalBill.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (Incl.)</span>
                    <span>₹0.00</span>
                  </div>
                  <div className="flex justify-between font-medium text-slate-900 pt-2 border-t">
                    <span>Net Total</span>
                    <span>₹{totalBill.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className={`p-4 bg-white border-t flex flex-col gap-3 ${activeCounterConfig.borderColor} ${activeCounterConfig.bgColor}`}>
                <Button
                  onClick={handleGenerateBill}
                  disabled={isSubmitting}
                  className={`w-full h-11 text-base shadow-md transition-all hover:scale-[1.02] ${activeCounterConfig.buttonColor} ${activeCounterConfig.hoverColor}`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                    </>
                  ) : (
                    <>
                      Generate Bill <Receipt className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleClearCounter} className="w-full text-slate-500 hover:text-red-600 hover:bg-red-200 border-dashed">
                  Clear {activeCounterConfig.name}
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Right Column: Items List */}
          <div className="lg:col-span-2 space-y-4">
            <Card className={`shadow-md border-0 ring-1 ring-slate-200 h-full min-h-[500px] pt-0 flex flex-col ${activeCounterConfig.borderColor} ${activeCounterConfig.bgColor}`}>
              <CardHeader className={`flex flex-row items-center justify-between pb-2 pt-4 border-b ${activeCounterConfig.headerBg}`}>
                <div>
                  <CardTitle>Cart Items</CardTitle>
                  <CardDescription>
                    {currentCounterData.billItems.length} medicine(s) added
                  </CardDescription>
                </div>
                <BillingDialog
                  isOpen={isAddItemModalOpen}
                  onOpenChange={setIsAddItemModalOpen}
                  onAddItem={handleAddItemToBill}
                  counterTheme={activeCounterConfig}   // ✅ ADD THIS
                  triggerButton={
                    <Button size="sm" className="bg-slate-900 text-white hover:bg-slate-800 shadow-sm">
                      <Plus className="h-4 w-4 mr-2" /> Add Medicine
                    </Button>
                  }
                />
              </CardHeader>

              <CardContent className="flex-1 p-0 bg-slate-50/30">
                {currentCounterData.billItems.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 p-3 bg-slate-100/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <div className="col-span-5 md:col-span-4">Medicine</div>
                      <div className="col-span-2 text-center">Batch</div>
                      <div className="col-span-2 text-center">Qty</div>
                      <div className="col-span-2 text-right">Price</div>
                      <div className="col-span-1"></div>
                    </div>

                    {/* Items */}
                    {currentCounterData.billItems.map((item) => (
                      <div key={item.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white transition-colors group">
                        <div className="col-span-5 md:col-span-4">
                          <p className="font-semibold text-slate-800 text-sm">{item.name}</p>
                          <p className="text-xs text-slate-500 hidden md:block">{item.brand}</p>
                        </div>
                        <div className="col-span-2 text-center">
                          <Badge variant="outline" className="font-mono text-[10px] text-slate-500">{item.batch}</Badge>
                        </div>
                        <div className="col-span-2 text-center">
                          <span className="font-medium text-sm bg-slate-100 px-2 py-1 rounded">{item.quantity}</span>
                        </div>
                        <div className="col-span-2 text-right">
                          <p className="font-semibold text-sm text-slate-700">₹{(item.quantity * item.sellingPrice).toFixed(2)}</p>
                          <p className="text-[10px] text-slate-400">@ {item.sellingPrice}</p>
                        </div>
                        <div className="col-span-1 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItemFromBill(item.id)}
                            className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-12 text-center text-slate-400">
                    <div className="bg-slate-100 p-4 rounded-full mb-4">
                      <Package className="h-8 w-8 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 mb-1">Your cart is empty</h3>
                    <p className="text-sm max-w-xs mx-auto mb-6">
                      Search and add medicines to create a bill for this counter.
                    </p>
                  </div>
                )}
              </CardContent>

              {currentCounterData.billItems.length > 0 && (
                <div className="p-4 border-t bg-white flex justify-end gap-4 text-sm text-slate-500">
                  <div>Total Items: <span className="font-semibold text-slate-900">{currentCounterData.billItems.length}</span></div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

    </>
  )
}