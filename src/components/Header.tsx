
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { usePizzaContext } from '@/contexts/PizzaContext';
import { Menu, Sun, Moon } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const Header: React.FC = () => {
  const { isAdmin, logoutAdmin, darkMode, toggleDarkMode } = usePizzaContext();
  const location = useLocation();
  
  const isAdminPage = location.pathname.startsWith('/admin');
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-display font-bold text-primary">Pizzaria da Vila</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Home
          </Link>
          
          {isAdmin && (
            <Link 
              to="/admin" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isAdminPage ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Admin
            </Link>
          )}
          
          {isAdmin && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={logoutAdmin}
              className="text-sm font-medium"
            >
              Sair
            </Button>
          )}
          
          {!isAdmin && !isAdminPage && (
            <Link to="/admin/login">
              <Button variant="ghost" size="sm" className="text-sm font-medium">
                Área Restrita
              </Button>
            </Link>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleDarkMode} 
            className="ml-2"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
        </nav>
        
        {/* Mobile Navigation */}
        <div className="flex items-center md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleDarkMode} 
            className="mr-2"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 mt-8">
                <Link 
                  to="/" 
                  className={`text-lg font-medium transition-colors hover:text-primary ${
                    location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  Home
                </Link>
                
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className={`text-lg font-medium transition-colors hover:text-primary ${
                      isAdminPage ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    Admin
                  </Link>
                )}
                
                {isAdmin && (
                  <Button 
                    variant="ghost"  
                    onClick={logoutAdmin}
                    className="text-lg font-medium justify-start p-0"
                  >
                    Sair
                  </Button>
                )}
                
                {!isAdmin && !isAdminPage && (
                  <Link to="/admin/login" className="text-lg font-medium transition-colors hover:text-primary">
                    Área Restrita
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
