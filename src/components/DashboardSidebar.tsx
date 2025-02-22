
import { PanelLeft, Home, LineChart, Wallet, Bot, Shield, Bell, HelpCircle, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", icon: Home, url: "/admin/dashboard/overview" },
  { title: "Trading", icon: LineChart, url: "/admin/dashboard/finance" },
  { title: "Wallets", icon: Wallet, url: "/admin/dashboard/wallets" },
  { title: "Auto Trading", icon: Bot, url: "/admin/dashboard/system" },
  { title: "Risk Management", icon: Shield, url: "/admin/dashboard/users" },
  { title: "Alerts", icon: Bell, url: "/admin/dashboard/alerts" },
  { title: "Help", icon: HelpCircle, url: "/admin/dashboard/help" },
  { title: "Settings", icon: Settings, url: "/admin/dashboard/settings" }
];

export function DashboardSidebar() {
  return (
    <>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <div className="flex items-center justify-between px-4 py-2">
              <SidebarGroupLabel>QuantumFlow</SidebarGroupLabel>
              <SidebarTrigger className="h-7 w-7" />
            </div>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild
                      tooltip={item.title}
                    >
                      <Link to={item.url} className="flex items-center gap-2">
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
}
