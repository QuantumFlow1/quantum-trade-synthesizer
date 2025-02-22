
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
  { title: "Dashboard", icon: Home, url: "/" },
  { title: "Trading", icon: LineChart, url: "/trading" },
  { title: "Wallets", icon: Wallet, url: "/wallets" },
  { title: "Auto Trading", icon: Bot, url: "/auto-trading" },
  { title: "Risk Management", icon: Shield, url: "/risk-management" },
  { title: "Alerts", icon: Bell, url: "/alerts" },
  { title: "Help", icon: HelpCircle, url: "/help" },
  { title: "Settings", icon: Settings, url: "/settings" }
];

export function DashboardSidebar() {
  const currentLanguage = localStorage.getItem('preferred_language') as string || 'nl';

  const translations = {
    nl: {
      title: "QuantumFlow",
      dashboard: "Dashboard",
      trading: "Handelen",
      wallets: "Portefeuilles",
      autoTrading: "Automatisch Handelen",
      riskManagement: "Risicobeheer",
      alerts: "Meldingen",
      help: "Help",
      settings: "Instellingen"
    },
    en: {
      title: "QuantumFlow",
      dashboard: "Dashboard",
      trading: "Trading",
      wallets: "Wallets",
      autoTrading: "Auto Trading",
      riskManagement: "Risk Management",
      alerts: "Alerts",
      help: "Help",
      settings: "Settings"
    },
    ru: {
      title: "QuantumFlow",
      dashboard: "Панель управления",
      trading: "Торговля",
      wallets: "Кошельки",
      autoTrading: "Авто-трейдинг",
      riskManagement: "Управление рисками",
      alerts: "Оповещения",
      help: "Помощь",
      settings: "Настройки"
    },
    hy: {
      title: "QuantumFlow",
      dashboard: "Վահանակ",
      trading: "Առևտուր",
      wallets: "Դրամապանակներ",
      autoTrading: "Ավտոմատ առևտուր",
      riskManagement: "Ռիսկերի կառավարում",
      alerts: "Ծանուցումներ",
      help: "Օգնություն",
      settings: "Կարգավորումներ"
    }
  };

  const getText = (key: keyof typeof translations.nl) => {
    return translations[currentLanguage as keyof typeof translations]?.[key] || translations.en[key];
  };

  return (
    <Sidebar className="h-screen fixed left-0 top-0 border-r border-white/10 bg-[#221F26]/95 backdrop-blur-xl">
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-between px-4 py-4">
            <SidebarGroupLabel className="text-lg font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              {getText('title')}
            </SidebarGroupLabel>
            <SidebarTrigger className="h-7 w-7 hover:bg-white/10 transition-colors" />
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    tooltip={getText(item.title.toLowerCase().replace(' ', '') as keyof typeof translations.nl)}
                    className="transition-colors hover:bg-white/10"
                  >
                    <Link to={item.url} className="flex items-center gap-3 px-4">
                      <item.icon className="w-4 h-4" />
                      <span className="font-medium">
                        {getText(item.title.toLowerCase().replace(' ', '') as keyof typeof translations.nl)}
                      </span>
                    </Link>
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
