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
import panelGif from "../../public/assets/logo.png"
const menuItems = [
  { title: "Dashboard", url: "/admin/dashboard", icon: Home },
  { title: "Add Stock", url: "/admin/addstock", icon: Package },
  { title: "Stock", url: "/admin/stock", icon: Warehouse },
  { title: "Report", url: "/admin/report", icon: FileText },
  { title: "FinTrack", url: "/admin/fintrack", icon: TrendingUp },
  { title: "Staff", url: "/admin/staff", icon: Users },
  { title: "Todo", url: "/admin/todo", icon: CheckSquare },
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
          <div className="flex h-8 w-8 items-center justify-center  bg-transparent">
           <img
               src={panelGif}
               alt="Open panel"
               className="h-8 w-8 "
             />
          </div>

          <span className="bg-linear-to-r from-cyan-600 to-teal-600 bg-clip-text text-lg font-bold text-transparent">
            MediCube
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
          © {new Date().getFullYear()} MediCude
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}