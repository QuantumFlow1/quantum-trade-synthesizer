
import React from 'react';
import { Link } from 'react-router-dom';

interface ShellProps {
  children: React.ReactNode;
}

export const Shell: React.FC<ShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto py-4 px-4 md:px-6 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">TradingApp</Link>
          
          <nav className="hidden md:flex space-x-4">
            <Link to="/dashboard" className="hover:text-primary">Dashboard</Link>
            <Link to="/market" className="hover:text-primary">Market</Link>
            <Link to="/trading" className="hover:text-primary">Trading</Link>
            <Link to="/wallet" className="hover:text-primary">Wallet</Link>
            <Link to="/stockbot" className="hover:text-primary">StockBot</Link>
            <Link to="/settings" className="hover:text-primary">Settings</Link>
          </nav>
          
          <div className="md:hidden">
            {/* Mobile menu button would go here */}
            <button className="p-2">Menu</button>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {children}
      </main>
      
      <footer className="border-t py-4">
        <div className="container mx-auto px-4 md:px-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} TradingApp. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
