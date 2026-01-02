import React, { useState, useEffect } from "react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Loader2, 
  Building2, 
  Store, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  AlertCircle 
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const initialData = {
  name: "",
  gst_no: "",
  address: "",
  contact: "",
  email: "",
};

export default function AddWholesalerModal({
  isOpen,
  onClose,
  onAddWholesaler, // Callback to update parent list on success
}) {
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
      setError(null);
      setLoading(false);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    // Clear error when user types to improve UX
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // --- VALIDATION ---
    if (formData.gst_no.length !== 15) {
      setError("GST Number must be exactly 15 characters long.");
      return;
    }
    if (formData.contact.length !== 10) {
      setError("Contact number must be exactly 10 digits.");
      return;
    }

    // --- API INTEGRATION ---
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}/admin/wholesaler`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        // Success
        if (onAddWholesaler) {
            onAddWholesaler(response.data); // Notify parent to refresh list
        }
        onClose(); // Close modal
      } else {
        setError(response.data.message || "Failed to add wholesaler.");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || 
        "Network error. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  // Prevent closing via click-outside if currently loading
  const handleOpenChange = (open) => {
    if (!open && !loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] w-full max-w-[95vw] h-[85vh] sm:h-[600px] p-0 gap-0 border-0 shadow-2xl flex flex-col overflow-hidden bg-white">
        
        {/* Header */}
        <DialogHeader className="p-6 pb-4 bg-indigo-50/50 border-b shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-full">
              <Building2 className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <DialogTitle className="text-xl text-gray-900">
                Add New Wholesaler
              </DialogTitle>
              <DialogDescription className="mt-1 text-gray-500">
                Enter business details to register a new supplier.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          <form id="wholesaler-form" onSubmit={handleSubmit} className="p-6 space-y-5">
            
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="animate-in slide-in-from-top-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Wholesaler Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 font-medium flex items-center gap-2">
                <Store className="w-4 h-4 text-gray-400" /> 
                Wholesaler Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g. Pharmacy King"
                className="focus-visible:ring-indigo-500"
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* GST Number */}
              <div className="space-y-2">
                <Label htmlFor="gst_no" className="text-gray-700 font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  GST No <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="gst_no"
                  name="gst_no"
                  value={formData.gst_no}
                  onChange={handleChange}
                  required
                  placeholder="15-digit GSTIN"
                  maxLength={15}
                  className="focus-visible:ring-indigo-500 font-mono text-sm"
                  disabled={loading}
                />
                <p className="text-xs text-gray-400 text-right">
                  {formData.gst_no.length}/15
                </p>
              </div>

              {/* Contact Number */}
              <div className="space-y-2">
                <Label htmlFor="contact" className="text-gray-700 font-medium flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  Contact No <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contact"
                  type="number" // Changed to number to prevent text
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                  placeholder="10-digit Mobile"
                  className="focus-visible:ring-indigo-500"
                  disabled={loading}
                  onInput={(e) => {
                    if (e.target.value.length > 10) {
                        e.target.value = e.target.value.slice(0, 10);
                    }
                  }}
                />
                <p className="text-xs text-gray-400 text-right">
                  {formData.contact.length}/10
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="king@pharmcy.com"
                className="focus-visible:ring-indigo-500"
                disabled={loading}
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address" className="text-gray-700 font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                Business Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="e.g. Mumbai-223344"
                className="focus-visible:ring-indigo-500"
                disabled={loading}
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <DialogFooter className="p-6 pt-4 bg-gray-50 border-t flex-col sm:flex-row gap-3 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="w-full sm:w-auto border-gray-300 text-gray-700"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="wholesaler-form" // Connects to the form ID
            disabled={loading}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 shadow-sm"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Wholesaler"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}