import { Shield, Menu, X, Home } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold">File Utilities</h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link 
            to="/" 
            className={`transition-colors ${isActive('/') ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <span className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              Home
            </span>
          </Link>
          <Link 
            to="/pdf-merge" 
            className={`transition-colors ${isActive('/pdf-merge') ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}
          >
            PDF Merge
          </Link>
          <Link 
            to="/image-to-pdf" 
            className={`transition-colors ${isActive('/image-to-pdf') ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Image to PDF
          </Link>
          <Link 
            to="/json-tools" 
            className={`transition-colors ${isActive('/json-tools') ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}
          >
            JSON Tools
          </Link>
        </nav>

        {/* Privacy Badge */}
        <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
          <Shield className="h-3 w-3" />
          <span>100% Client-Side</span>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden border-t p-4 space-y-3">
          <Link 
            to="/" 
            className={`block text-sm ${isActive('/') ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              Home
            </span>
          </Link>
          <Link 
            to="/pdf-merge" 
            className={`block text-sm ${isActive('/pdf-merge') ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setIsMenuOpen(false)}
          >
            PDF Merge
          </Link>
          <Link 
            to="/image-to-pdf" 
            className={`block text-sm ${isActive('/image-to-pdf') ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Image to PDF
          </Link>
          <Link 
            to="/json-tools" 
            className={`block text-sm ${isActive('/json-tools') ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setIsMenuOpen(false)}
          >
            JSON Tools
          </Link>
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
            <Shield className="h-3 w-3" />
            <span>100% Client-Side - No Data Leaves Your Browser</span>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
