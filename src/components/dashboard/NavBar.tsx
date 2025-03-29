
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bell, Search, Settings, User } from 'lucide-react';

export const NavBar = () => {
  const navigate = useNavigate();

  return (
    <header className="border-b bg-background h-14 flex items-center px-4">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold md:hidden">Trading Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" aria-label="Search">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Settings">
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Profile">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
