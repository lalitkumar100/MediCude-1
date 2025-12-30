import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import axios from "axios";
import { ArrowLeft } from "lucide-react";

export default function UpdateMedicinePage() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const [medicineData, setMedicineData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { Id } = useParams();

  useEffect(() => {
    const fetchMedicineById = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/admin/medicne_info/${Id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMedicineData(res.data.medicine[0]);
      } catch (error) {
        console.error("Error fetching medicines", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMedicineById();
  }, []);

  const handleInputChange = (field, value) => {
    setMedicineData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdateSubmit = async () => {
    setIsSaving(true);

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/admin/medicine_stock/${Id}`,
        medicineData, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res);
    } catch (error) {
      console.error("Error fetching medicines", error);
    } finally {
      setIsSaving(false);
      alert("Medicine updated successfully!");
      navigate("/stock");
    }
  };

  const handleCancel = () => {
    navigate("/stock");
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-1 items-center justify-center p-4">
            Loading medicine data...
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (!medicineData) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[data-collapsible=icon]/sidebar-wrapper:h-12 ">
           <PageBreadcrumb
            items={[
            { label: "PharmaDesk", href: "/dashboard" },
            { label: "Stock Management" , href: "/stock"},
            { label:"update", href: "/stock/update/:Id"}
             ]} />
        </header>

        {/* Main Content */}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">
              Update Medicine: {medicineData.medicine_name}
            </h1>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Medicine Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Medicine Name</Label>
                <Input
                  id="name"
                  value={medicineData.medicine_name || ""}
                  onChange={(e) =>
                    handleInputChange("medicine_name", e.target.value)
                  }
                />
              </div>

              {/* Brand */}
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={medicineData.brand_name || ""}
                  onChange={(e) =>
                    handleInputChange("brand_name", e.target.value)
                  }
                />
              </div>

              {/* Batch */}
              <div className="space-y-2">
                <Label htmlFor="batch">Batch</Label>
                <Input
                  id="batch"
                  value={medicineData.batch_no || ""}
                  onChange={(e) =>
                    handleInputChange("batch_no", e.target.value)
                  }
                />
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={medicineData.stock_quantity}
                  onChange={(e) =>
                    handleInputChange("stock_quantity", e.target.value)
                  }
                />
              </div>

              {/* Expiry */}
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  type="text"
                  value={new Date(
                    medicineData.expiry_date
                  ).toLocaleDateString()}
                  onChange={(e) => handleInputChange("expiry", e.target.value)}
                  disabled={true}
                />
              </div>

              {/* Price (MRP) */}
              <div className="space-y-2">
                <Label htmlFor="price">MRP (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={medicineData.mrp}
                  onChange={(e) => handleInputChange("mrp", e.target.value)}
                />
              </div>

              {/* Purchase Price (Editable for demo but pre-filled) */}
              <div className="space-y-2">
                <Label htmlFor="purchasePrice">Purchase Price (₹)</Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  step="0.01"
                  value={String(medicineData.purchase_price)}
                  onChange={(e) =>
                    handleInputChange("purchase_price", e.target.value)
                  }
                />
              </div>
            </div>

            <Separator />

            <h3 className="text-lg font-semibold text-gray-800">
              Non-Editable Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Invoice No (Non-editable) */}
              <div className="space-y-2">
                <Label htmlFor="invoiceNo">Invoice No</Label>
                <Input
                  id="invoiceNo"
                  value={`INV-${String(medicineData.id || "").padStart(
                    4,
                    "0"
                  )}`}
                  disabled
                  className="bg-gray-100 text-gray-500"
                />
              </div>

              {/* Wholesaler (Non-editable) */}
              <div className="space-y-2">
                <Label htmlFor="wholesaler">Wholesaler</Label>
                <Input
                  id="wholesaler"
                  value="MedSupply Co. Ltd."
                  disabled
                  className="bg-gray-100 text-gray-500"
                />
              </div>

              {/* Created At (Non-editable) */}
              <div className="space-y-2">
                <Label htmlFor="createdAt">Created At</Label>
                <Input
                  id="createdAt"
                  value={`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`}
                  disabled
                  className="bg-gray-100 text-gray-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateSubmit}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSaving ? "Updating..." : "Update Medicine"}
              </Button>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
