import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, RefreshCw } from "lucide-react";

// import BASE_URL from "../../../config";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const token = localStorage.getItem("lalitkumar_choudhary") || "";

function formatDate(dateStr) {
  if (!dateStr) return "";
  return dateStr.slice(0, 10);
}

const initialFields = {
  medicine_name: "",
  brand_name: "",
  mfg_date: "",
  expiry_date: "",
  packed_type: "",
  stock_quantity: "",
  purchase_price: "",
  mrp: "",
  batch_no: "",
};

export default function AddMedicineModal({ onClose, onAddMedicine }) {
  const [fields, setFields] = useState(initialFields);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [error, setError] = useState(null);

  const debounceTimeout = useRef(null);
  const inputRef = useRef(null);

  // Debounced fetch for medicine name suggestions
  useEffect(() => {
    if (!fields.medicine_name) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setShowSuggestions(true);
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${BASE_URL}/admin/medicines/recommendation?query=${fields.medicine_name}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (res.data.status === "success") {
          setSuggestions(res.data.recommendations || []);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        setSuggestions([]);
      }
      setLoading(false);
    }, 400);

    return () => clearTimeout(debounceTimeout.current);
  }, [fields.medicine_name]);

  // Keyboard navigation for suggestions
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIdx((idx) => (idx + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIdx((idx) => (idx <= 0 ? suggestions.length - 1 : idx - 1));
    } else if (e.key === "Enter" && selectedIdx >= 0) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[selectedIdx]);
    }
  };

  // Select suggestion and fetch details
  const handleSelectSuggestion = async (suggestion) => {
    setShowSuggestions(false);
    setFields((f) => ({
      ...f,
      medicine_name: suggestion.medicine_name,
    }));
    setSuggestions([]);
    setSelectedIdx(-1);
    setFetchingDetails(true);
    setError(null);
    try {
      const res = await axios.get(
        `${BASE_URL}/admin/medicne_info/${suggestion.medicine_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (
        res.data.status === "success" &&
        res.data.medicine &&
        res.data.medicine.length > 0
      ) {
        const med = res.data.medicine[0];
        setFields({
          medicine_name: med.medicine_name || "",
          brand_name: med.brand_name || "",
          mfg_date: formatDate(med.mfg_date),
          expiry_date: formatDate(med.expiry_date),
          packed_type: med.packed_type || "",
          stock_quantity: med.stock_quantity || "",
          purchase_price: med.purchase_price || "",
          mrp: med.mrp || "",
          batch_no: med.batch_no || "",
        });
      } else {
        setError("Failed to fetch medicine details.");
      }
    } catch (err) {
      setError("Network error or failed to fetch medicine details.");
    }
    setFetchingDetails(false);
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((f) => ({
      ...f,
      [name]: value,
    }));
    if (name === "medicine_name") {
      setShowSuggestions(true);
      setSelectedIdx(-1);
    }
    setError(null);
  };

  // Add medicine
  const handleAdd = () => {
    setError(null);
    // Basic validation
    if (
      !fields.medicine_name ||
      !fields.brand_name ||
      !fields.mfg_date ||
      !fields.expiry_date ||
      !fields.packed_type ||
      !fields.stock_quantity ||
      !fields.purchase_price ||
      !fields.mrp ||
      !fields.batch_no
    ) {
      setError("Please fill all required fields.");
      return;
    }
    // Pass medicine object to parent
    onAddMedicine({
      medicine_name: fields.medicine_name,
      brand_name: fields.brand_name,
      mfg_date: fields.mfg_date,
      expiry_date: fields.expiry_date,
      packed_type: fields.packed_type,
      stock_quantity: Number(fields.stock_quantity),
      purchase_price: Number(fields.purchase_price),
      mrp: Number(fields.mrp),
      batch_no: fields.batch_no,
    });
    onClose();
  };

  // Refresh/clear fields
  const handleRefresh = () => {
    setFields(initialFields);
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIdx(-1);
    setError(null);
  };

  // Click outside to close suggestions
  useEffect(() => {
    const handleClick = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-w-[95vw] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-blue-700">Add New Medicine</DialogTitle>
          <DialogDescription>
            Enter details for the medicine to add to stock. All fields are required.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Medicine Name with auto-suggest */}
          <div ref={inputRef} className="relative space-y-2">
            <Label htmlFor="medicine_name">
              Medicine Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="medicine_name"
              name="medicine_name"
              placeholder="Search medicine name..."
              className="border-cyan-200 focus:border-cyan-500"
              value={fields.medicine_name}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              disabled={fetchingDetails}
            />
            {/* Suggestions Dropdown */}
            {showSuggestions && fields.medicine_name && (
              <div className="absolute z-50 left-0 right-0 bg-white border border-cyan-200 rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
                {loading ? (
                  <div className="px-4 py-3 text-sm text-gray-500 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading suggestions...
                  </div>
                ) : suggestions.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-gray-500">
                    No suggestions found
                  </div>
                ) : (
                  suggestions.map((s, idx) => (
                    <div
                      key={s.medicine_id}
                      className={`px-4 py-2.5 cursor-pointer text-sm transition-colors ${
                        idx === selectedIdx
                          ? "bg-cyan-100 text-cyan-900"
                          : "hover:bg-cyan-50"
                      }`}
                      onMouseDown={() => handleSelectSuggestion(s)}
                    >
                      {s.medicine_name}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Two Column Grid for Other Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Brand Name */}
            <div className="space-y-2">
              <Label htmlFor="brand_name">
                Brand Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="brand_name"
                name="brand_name"
                placeholder="e.g., Cipla"
                className="border-cyan-200 focus:border-cyan-500"
                value={fields.brand_name}
                onChange={handleChange}
                disabled={fetchingDetails}
              />
            </div>

            {/* MFG Date */}
            <div className="space-y-2">
              <Label htmlFor="mfg_date">
                MFG Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="mfg_date"
                type="date"
                name="mfg_date"
                className="border-cyan-200 focus:border-cyan-500"
                value={fields.mfg_date}
                onChange={handleChange}
                disabled={fetchingDetails}
              />
            </div>

            {/* Expiry Date */}
            <div className="space-y-2">
              <Label htmlFor="expiry_date">
                Expiry Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="expiry_date"
                type="date"
                name="expiry_date"
                className="border-cyan-200 focus:border-cyan-500"
                value={fields.expiry_date}
                onChange={handleChange}
                disabled={fetchingDetails}
              />
            </div>

            {/* Packed Type */}
            <div className="space-y-2">
              <Label htmlFor="packed_type">
                Packed Type <span className="text-red-500">*</span>
              </Label>
              <Input
                id="packed_type"
                name="packed_type"
                placeholder="e.g., Strip, Bottle"
                className="border-cyan-200 focus:border-cyan-500"
                value={fields.packed_type}
                onChange={handleChange}
                disabled={fetchingDetails}
              />
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <Label htmlFor="stock_quantity">
                Quantity <span className="text-red-500">*</span>
              </Label>
              <Input
                id="stock_quantity"
                type="number"
                name="stock_quantity"
                placeholder="0"
                className="border-cyan-200 focus:border-cyan-500"
                value={fields.stock_quantity}
                onChange={handleChange}
                min={1}
                disabled={fetchingDetails}
              />
            </div>

            {/* Purchase Price */}
            <div className="space-y-2">
              <Label htmlFor="purchase_price">
                Purchase Price (₹) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="purchase_price"
                type="number"
                name="purchase_price"
                placeholder="0.00"
                className="border-cyan-200 focus:border-cyan-500"
                value={fields.purchase_price}
                onChange={handleChange}
                min={0}
                step="0.01"
                disabled={fetchingDetails}
              />
            </div>

            {/* MRP */}
            <div className="space-y-2">
              <Label htmlFor="mrp">
                MRP (₹) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="mrp"
                type="number"
                name="mrp"
                placeholder="0.00"
                className="border-cyan-200 focus:border-cyan-500"
                value={fields.mrp}
                onChange={handleChange}
                min={0}
                step="0.01"
                disabled={fetchingDetails}
              />
            </div>

            {/* Batch No */}
            <div className="space-y-2">
              <Label htmlFor="batch_no">
                Batch No <span className="text-red-500">*</span>
              </Label>
              <Input
                id="batch_no"
                name="batch_no"
                placeholder="Batch number"
                className="border-cyan-200 focus:border-cyan-500"
                value={fields.batch_no}
                onChange={handleChange}
                disabled={fetchingDetails}
              />
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Fetching Details Indicator */}
          {fetchingDetails && (
            <Alert className="bg-blue-50 text-blue-800 border-blue-200">
              <AlertDescription className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Fetching medicine details...
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={fetchingDetails}
            className="w-full sm:w-auto border-orange-500 text-orange-600 hover:bg-orange-50 bg-transparent  "
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleRefresh}
            disabled={fetchingDetails}
            className="w-full sm:w-auto flex items-center gap-2  border-emerald-500 text-emerald-600 hover:bg-emerald-50 bg-transparent "
          >
            <RefreshCw className="h-4 w-4 " />
            Refresh
          </Button>
          <Button
            type="button"
            onClick={handleAdd}
            disabled={fetchingDetails}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
          >
            {fetchingDetails ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              "Add Medicine"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}