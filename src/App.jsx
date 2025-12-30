import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./LoginPage";

import DashboardPage from "./dashboard/DashboardPage";
import AddStock from "./add-stocks/AddStockPage";
import Stock from "./stock/StockPage";
import UpdateStock from "./stock/update/UpdateMedicinePage"
import Report from "./report/ReportPage";
import WholesalerReportPage from "./report/wholesaler/WholesalerReportPage";
import InvoiceReportPage from "./report/invoice/InvoiceReportPage";
import SalesReportPage from "./report/sales/SalesReportPage";
import Staff from "./staff/StaffPage";
import AddEmployeePage from "./staff/add-employee/AddEmployeePage";
import Todo from "./todo/TodoPage";
import ProfilePage from "./profile/ProfilePage";
// import Settings from "./";
import Billing from "./billing/BillingPage";
import Loading from "./add-stocks/Loading";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<LoginPage />} />

        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/add-stock" element={<AddStock />} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/stock/update/:Id" element={<UpdateStock />} />
        <Route path="/report" element={<Report />} />
        <Route path="/report/wholesaler" element={<WholesalerReportPage />} />
        <Route path="/report/invoice" element={<InvoiceReportPage />} />
         <Route path="/report/sales" element={<SalesReportPage />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/staff/add-employee" element={<AddEmployeePage />} />
        <Route path="/todo" element={<Todo />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
