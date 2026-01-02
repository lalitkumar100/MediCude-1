import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import PageBreadcrumb from "@/components/PageBreadcrumb"
import { AppSidebar } from "@/components/AppSidebar";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  SidebarInset,
  SidebarProvider,

} from "@/components/ui/sidebar";
import { ArrowLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AddEmployeePage() {
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState({
    firstName: "",
    lastName: "",
    gender: "Male",
    role: "",
    email: "",
    phone: "",
    address: "",
    dob: "",
    salary:"",
    aadharNo: "",
    panCard: "",
    accountNo: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field, value) => {
    setEmployeeData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsSaving(true);

      console.log(employeeData);

      if (
        !employeeData.firstName ||
        !employeeData.phone ||
        !employeeData.role
      ) {
        alert("First name, phone, and role are required");
        return;
      }

      const payload = {
        first_name: employeeData.firstName,
        last_name: employeeData.lastName,
        gender: employeeData.gender,
        date_of_birth: employeeData.dob,
        contact_number: employeeData.phone,
        email: employeeData.email,
        address: employeeData.address,
        date_of_joining: new Date().toISOString().split("T")[0],
        role: employeeData.role,
        salary: employeeData.salary,
        aadhar_card_no: employeeData.aadharNo,
        pan_card_no: employeeData.panCard,
        account_no: employeeData.accountNo,
        profile_photo: null,
      };

      console.log(payload);

      const token = localStorage.getItem("token");

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/admin/employee`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Employee added successfully!");
    } catch (error) {
      console.error("FULL ERROR:", error);

      if (error.response) {
        console.error("BACKEND MESSAGE:", error.response.data);
        alert(
          error.response.data?.message || JSON.stringify(error.response.data)
        );
      } else {
        alert("Server not reachable");
      }
    } finally {
      setIsSaving(false);
      navigate("/staff");
    }
  };

  const handleCancel = () => {
    navigate("/staff");
  };

  return (

<>
        {/* Main Content */}
        <div className="flex flex-1 flex-col gap-4 p-0 pt-0">
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
              Add New Employee
            </h1>
          </div>

          <form onSubmit={handleAddSubmit}>
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={employeeData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    placeholder="Enter first name"
                    required
                  />
                </div>
                {/* Last Name */}
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={employeeData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    placeholder="Enter last name"
                  />
                </div>
                {/* Role */}
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={employeeData.role}
                    onChange={(e) => handleInputChange("role", e.target.value)}
                    placeholder="e.g., Pharmacist, Assistant"
                    required
                  />
                </div>
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={employeeData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter email address"
                    required
                  />
                </div>
                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={employeeData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Enter phone number"
                    required
                  />
                </div>
                {/* Date of Birth */}
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={employeeData.dob}
                    onChange={(e) => handleInputChange("dob", e.target.value)}
                    required
                  />
                </div>
                {/* Salary */}
                <div className="space-y-2">
                  <Label htmlFor="salary">Salary (₹)</Label>
                  <Input
                    id="salary"
                    type="number"
                    step="0.01"
                    value={employeeData.salary}
                    onChange={(e) =>
                      handleInputChange("salary", e.target.value)
                    }
                    placeholder="Enter annual salary"
                  />
                </div>
                {/* Aadhar Number */}
                <div className="space-y-2">
                  <Label htmlFor="aadharNo">Aadhar Number</Label>
                  <Input
                    id="aadharNo"
                    value={employeeData.aadharNo}
                    onChange={(e) =>
                      handleInputChange("aadharNo", e.target.value)
                    }
                    placeholder="Enter Aadhar number"
                    required
                  />
                </div>
                {/* PAN Card */}
                <div className="space-y-2">
                  <Label htmlFor="panCard">PAN Card</Label>
                  <Input
                    id="panCard"
                    value={employeeData.panCard}
                    onChange={(e) =>
                      handleInputChange("panCard", e.target.value)
                    }
                    placeholder="Enter PAN card number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={employeeData.gender}
                    onValueChange={(v) => handleInputChange("gender", v)}
                  >
                    <SelectTrigger className="w-full" id="gender">
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="acc-no">Account Number</Label>
                  <Input
                    id="acc-no"
                    type="number"
                    value={employeeData.accountNo}
                    onChange={(e) =>
                      handleInputChange("accountNo", e.target.value)
                    }
                    placeholder="Enter Account Number"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={employeeData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter full address"
                  rows={3}
                  required
                />
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
                  type="submit"
                  disabled={isSaving}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSaving ? "Adding..." : "Add Employee"}
                </Button>
              </div>
            </div>
          </form>
        </div>

      </>

  );
}
