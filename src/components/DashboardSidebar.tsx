
import { PanelLeft, Home, LineChart, Wallet, Bot, Shield, Bell, HelpCircle, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", icon: Home, url: "/" },
  { title: "Trading", icon: LineChart, url: "/trading" },
  { title: "Wallets", icon: Wallet, url: "/wallets" },
  { title: "Auto Trading", icon: Bot, url: "/auto-trading" },
  { title: "Risk Management", icon: Shield, url: "/risk" },
  { title: "Alerts", icon: Bell, url: "/alerts" },
  { title: "Help", icon: HelpCircle, url: "/help" },
  { title: "Settings", icon: Settings, url: "/settings" }
];

export function DashboardSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>QuantumFlow</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
