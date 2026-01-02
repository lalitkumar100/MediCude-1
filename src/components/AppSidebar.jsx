import {
  DollarSign,
  Package,
  Warehouse,
  FileText,
  TrendingUp,
  Users,
  CheckSquare,
  Settings,
  Home,
  LogOut,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Add Stock", url: "/addstock", icon: Package },
  { title: "Stock", url: "/stock", icon: Warehouse },
  { title: "Report", url: "/report", icon: FileText },
  { title: "FinTrack", url: "/fintrack", icon: TrendingUp },
  { title: "Staff", url: "/staff", icon: Users },
  { title: "Todo", url: "/todo", icon: CheckSquare },
];

export function AppSidebar(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUrl, setCurrentURL] = useState("Dashboard");

  useEffect(() => {
    const fetchURL = () => {
      const url = location.pathname.split("/")[1];
      setCurrentURL(url);
    };
    fetchURL();
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <Sidebar variant="inset" {...props}>
      {/* Header */}
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-cyan-500 to-teal-600">
            <svg
              className="h-4 w-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
          </div>

          <span className="bg-linear-to-r from-cyan-600 to-teal-600 bg-clip-text text-lg font-bold text-transparent">
            PharmaDesk
          </span>
        </div>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.url}
                      className={
                        currentUrl.toLowerCase() ===
                        item.title.toLowerCase().replace(" ", "")
                          ? "flex items-center gap-2 bg-gray-300"
                          : "flex items-center gap-2"
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="flex flex-col items-center">
        <SidebarMenu>
          <SidebarMenuItem>
            {/* Wrapper */}
            <div className="flex gap-2 w-full">
              {/* Logout (small) */}
              <SidebarMenuButton
                onClick={handleLogout}
                className="border-2 flex-none w-10 justify-center cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
              </SidebarMenuButton>

              {/* Billing (large) */}
              <SidebarMenuButton
                asChild
                className="bg-purple-600 text-white hover:bg-purple-700 flex-1 justify-center"
              >
                <Link to="/billing" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span>Billing</span>
                </Link>
              </SidebarMenuButton>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="px-4 py-2 text-xs text-muted-foreground">
          © {new Date().getFullYear()} PharmaDesk
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}