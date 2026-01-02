import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layouts
import MainLayout from "./layouts/MainLayout";
import WorkerLayout from "./layouts/WorkerLayout";

// Public Pages
import LoginPage from "./LoginPage";

// Admin Pages
import DashboardPage from "./page/dashboard/DashboardPage";
import AddStock from ".page/add-stocks/AddStockPage";
import Stock from "./stock/StockPage";
import UpdateStock from "./stock/update/UpdateMedicinePage";
import Report from "./report/ReportPage";
import WholesalerReportPage from "./report/wholesaler/WholesalerReportPage";
import InvoiceReportPage from "./report/invoice/InvoiceReportPage";
import SalesReportPage from "./report/sales/SalesReportPage";
import StockReturnPage from "./report/Stock-Return/StockReturnPage";
import Staff from "./staff/StaffPage";
import AddEmployeePage from "./staff/add-employee/AddEmployeePage";
import Todo from "./todo/TodoPage";
import ProfilePage from "./profile/ProfilePage";
import Billing from "./billing/BillingPage";

// Worker Pages
import WorkerDashboard from "./Worker/Dashboard";
import WorkerSalesReportPage from "./Worker/sales/SalesReportPage";
import WorkerTodoPage from "./Worker/TodoPage";
import WorkerStockPage from "./Worker/stock/StockPage";
import WorkerBillingPage from "./Worker/billing/BillingPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes - No Layout */}
        <Route path="/login" element={<LoginPage />} />

        {/* Admin Routes - MainLayout wrapper */}
        <Route path="/" element={<MainLayout />}>
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
          <Route path="profile" element={<ProfilePage />} />
        </Route>

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