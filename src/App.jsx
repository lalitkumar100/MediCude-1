import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layouts
import MainLayout from "./layouts/MainLayout";
import WorkerLayout from "./layouts/WorkerLayout";



import LoginPage from "./pages/LoginPage";

import DashboardPage from "./pages/dashboard/DashboardPage";
import AddStock from "./pages/add-stocks/AddStockPage";
import Stock from "./pages/stock/StockPage";
import UpdateStock from "./pages/stock/update/UpdateMedicinePage"
import Report from "./pages/report/ReportPage";
import WholesalerReportPage from "./pages/report/wholesaler/WholesalerReportPage";
import InvoiceReportPage from "./pages/report/invoice/InvoiceReportPage";
import SalesReportPage from "./pages/report/sales/SalesReportPage";
import Staff from "./pages/staff/StaffPage";
import AddEmployeePage from "./pages/staff/add-employee/AddEmployeePage";
import Todo from "./pages/todo/TodoPage";
import ProfilePage from "./pages/profile/ProfilePage";
// import Settings from "./";
import Billing from "./pages/billing/BillingPage";
import AccessDenial from "./AcessDenial";
import WorkerDashboard from "./Worker/Dashboard";
import WorkerSalesReportPage from "./Worker/sales/SalesReportPage";
import WorkerTodoPage from "./Worker/TodoPage";
import WorkerStockPage from "./Worker/stock/StockPage";
import WorkerBillingPage from "./Worker/billing/BillingPage";
import StockReturnPage from "./pages/report/Stock-Return/StockReturnPage";
export default function App() {
  return (
  <BrowserRouter>
      <Routes>
        {/* Public Routes - No Layout */}
        <Route path="/login" element={<LoginPage />} />

        {/* Admin Routes - MainLayout wrapper */}
        <Route path="/admin" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="addstock" element={<AddStock />} />
          <Route path="stock" element={<Stock />} />
          <Route path="stock/update/:Id" element={<UpdateStock />} />
          <Route path="report" element={<Report />} />
          <Route path="report/wholesaler" element={<WholesalerReportPage />} />
          <Route path="report/invoice" element={<InvoiceReportPage />} />
          <Route path="report/stock-return" element={<StockReturnPage />} />
          <Route path="report/sales" element={<SalesReportPage />} />
          <Route path="staff" element={<Staff />} />
          <Route path="staff/add-employee" element={<AddEmployeePage />} />
          <Route path="todo" element={<Todo />} />
          <Route path="billing" element={<Billing />} />
          
        </Route>
         <Route path="Forbidden" element={<AccessDenial/>}/>
         <Route path="profile" element={<ProfilePage />} />
        {/* Worker Routes - WorkerLayout wrapper */}
        <Route path="/worker" element={<WorkerLayout />}>
          <Route index element={<WorkerDashboard />} />
          <Route path="sales" element={<WorkerSalesReportPage />} />
          <Route path="todo" element={<WorkerTodoPage />} />
          <Route path="stock" element={<WorkerStockPage />} />
          <Route path="billing" element={<WorkerBillingPage />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
