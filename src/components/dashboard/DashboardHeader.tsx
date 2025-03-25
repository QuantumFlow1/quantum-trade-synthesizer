
import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DashboardNav } from './DashboardNav';

export const DashboardHeader: React.FC = () => {
  return (
    <header className="border-b bg-card px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <DashboardNav />
          </SheetContent>
        </Sheet>
        <h1 className="text-xl font-bold">Trading Platform</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          Simulation Mode
        </Button>
      </div>
    </header>
  );
};
