import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AppSidebar } from "@/components/AppSidebar";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import SectionHeader from "@/components/SectionHeader";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function StaffPage() {
  const navigate = useNavigate();

  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState("name-asc");

  const [searchTerm, setSearchTerm] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/admin/allEmployee`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const transformed = res.data.employees.map((emp) => {
          const [firstName, ...last] = emp.name.split(" ");
          return {
            id: emp.employee_id,
            firstName,
            lastName: last.join(" "),
            role: emp.role,
            email: emp.email,
            phone: emp.contact_number,
            salary: Number(emp.salary),
          };
        });

        setStaffList(transformed);
      } catch (err) {
        console.error(err);
        setError("Failed to load employees");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const filteredStaff = staffList.filter((staff) => {
    if (!searchTerm) return true;
    const val = searchTerm.toLowerCase();

    switch (searchCriteria) {
      case "name":
        return `${staff.firstName} ${staff.lastName}`
          .toLowerCase()
          .includes(val);
      case "email":
        return staff.email.toLowerCase().includes(val);
      case "contact":
        return staff.phone.includes(val);
      case "role":
        return staff.role.toLowerCase().includes(val);
      default:
        return true;
    }
  });

  const sortedStaff = [...filteredStaff].sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return `${a.firstName} ${a.lastName}`.localeCompare(
          `${b.firstName} ${b.lastName}`
        );
      case "name-desc":
        return `${b.firstName} ${b.lastName}`.localeCompare(
          `${a.firstName} ${a.lastName}`
        );
      case "role-asc":
        return a.role.localeCompare(b.role);
      case "role-desc":
        return b.role.localeCompare(a.role);
      case "salary-low":
        return a.salary - b.salary;
      case "salary-high":
        return b.salary - a.salary;
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedStaff.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStaff = sortedStaff.slice(startIndex, endIndex);

  return (
<>
        {/* CONTENT */}
        <div className="p-0 space-y-4">
          <SectionHeader
            title="Staff Directory"
            description="View and manage your pharmacy staff members." />


          <div className="flex justify-end mb-4">
            <Button
              className="bg-linear-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white cursor-pointer"
              onClick={() => navigate("/admin/staff/add-employee")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </div>
          {/* SEARCH SECTION */}
          <div className="grid grid-cols-2 gap-3 md:flex md:items-center md:gap-4">

            {/* 1. Search Criteria Select */}
            {/* Mobile: Order 2 (Bottom Left), Half Width */}
            {/* Desktop: Order 1 (Far Left), Fixed Width */}
            <div className="col-span-1 order-2 md:order-1 md:w-40">
              <Select value={searchCriteria} onValueChange={setSearchCriteria}>
                {/* Changed w-40 to w-full so it fills the grid cell on mobile */}
                <SelectTrigger className="w-full border-cyan-200 focus:border-cyan-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="contact">Contact</SelectItem>
                  <SelectItem value="role">Role</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 2. Search Input */}
            {/* Mobile: Order 1 (Top), Full Width (col-span-2) */}
            {/* Desktop: Order 2 (Middle), Flexible Width */}
            <div className="col-span-2 order-1 md:order-2 md:flex-1">
              <Input
                placeholder={`Search by ${searchCriteria}`}
                className="w-full border-cyan-200 focus:border-cyan-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* 3. Sort By Select */}
            {/* Mobile: Order 3 (Bottom Right), Half Width */}
            {/* Desktop: Order 3 (Far Right), Fixed Width */}
            <div className="col-span-1 order-3 md:order-3 md:w-48">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full border-cyan-200 focus:border-cyan-500">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  <SelectItem value="role-asc">Role (A-Z)</SelectItem>
                  <SelectItem value="role-desc">Role (Z-A)</SelectItem>
                  <SelectItem value="salary-low">Salary Low to High</SelectItem>
                  <SelectItem value="salary-high">Salary High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </div>

          {/* LOADING */}
          {loading && (
            <div className="text-center py-10 text-gray-500">
              Loading employees...
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="text-center py-10 text-red-500">{error}</div>
          )}

          {/* STAFF GRID */}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentStaff.map((staff) => (
                <Card key={staff.id} className="text-center p-4">
                  <Avatar className="w-24 h-24 m-auto bg-cyan-200">
                    <AvatarFallback className="text-cyan-800  bg-cyan-300"> {/* Optional: Darker text for contrast */}
                      {staff.firstName[0]}
                      {staff.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>

                  <CardHeader className="gap-0">
                    <CardTitle>
                      {staff.firstName} {staff.lastName}
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm text-cyan-600 font-medium">
                      {staff.role}
                    </p>
                    <p className="text-sm">{staff.email}</p>
                    <p className="text-sm">{staff.phone}</p>

                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white w-full mt-3 cursor-pointer"
                      onClick={() => {
                        setSelectedStaff(staff);
                        setIsViewModalOpen(true);
                      }}
                    >
                      View
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* PAGINATION */}
          {staffList.length > itemsPerPage &&
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <ChevronLeft />
              </Button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <ChevronRight />
              </Button>
            </div>
          }
        </div>

        {/* VIEW MODAL */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Employee Details</DialogTitle>
            </DialogHeader>
            {selectedStaff && (
              <div className="space-y-2">
                <p>
                  <b>Name:</b> {selectedStaff.firstName}{" "}
                  {selectedStaff.lastName}
                </p>
                <p>
                  <b>Role:</b> {selectedStaff.role}
                </p>
                <p>
                  <b>Email:</b> {selectedStaff.email}
                </p>
                <p>
                  <b>Phone:</b> {selectedStaff.phone}
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>
  
</>

  );
}
