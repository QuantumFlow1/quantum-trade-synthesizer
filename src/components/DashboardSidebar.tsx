
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
      <Sidebar className="border-r border-white/10 bg-[#221F26]/95 backdrop-blur-xl">
        <SidebarContent>
          <SidebarGroup>
            <div className="flex items-center justify-between px-4 py-4">
              <SidebarGroupLabel className="text-lg font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                QuantumFlow
              </SidebarGroupLabel>
              <SidebarTrigger className="h-7 w-7 hover:bg-white/10 transition-colors" />
            </div>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild
                      tooltip={item.title}
                      className="transition-colors hover:bg-white/10"
                    >
                      <Link to={item.url} className="flex items-center gap-3 px-4">
                        <item.icon className="w-4 h-4" />
                        <span className="font-medium">{item.title}</span>
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
