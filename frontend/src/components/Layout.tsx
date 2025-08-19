import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { LogOut, User,  Image as ImageIcon, Menu, X,  Grid } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuthStore()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                <ImageIcon className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Image Gallery
                </h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <nav className="flex items-center space-x-1">
                <Link to="/dashboard" onClick={closeMobileMenu}>
                  <Button 
                    variant={location.pathname === '/dashboard' ? 'default' : 'ghost'}
                    size="sm"
                    className={location.pathname === '/dashboard' ? 
                      'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' : 
                      'hover:bg-slate-100 dark:hover:bg-slate-800'
                    }
                  >
                    <Grid className="h-4 w-4 mr-2" />
                    Gallery
                  </Button>
                </Link>
                {/* Uncomment if you have more routes */}
                {/* <Link to="/upload" onClick={closeMobileMenu}>
                  <Button 
                    variant={location.pathname === '/upload' ? 'default' : 'ghost'}
                    size="sm"
                    className={location.pathname === '/upload' ? 
                      'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' : 
                      'hover:bg-slate-100 dark:hover:bg-slate-800'
                    }
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </Link> */}
              </nav>

              {/* User Info & Logout */}
              <div className="flex items-center space-x-4 pl-4 border-l border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                  <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                    <User className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 max-w-24 truncate">
                    {user?.username}
                  </span>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950 dark:hover:border-red-700"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                className="hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
              <div className="px-2 pt-4 pb-3 space-y-3">
                {/* Brand name for mobile */}
                <div className="px-3">
                  <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Image Gallery
                  </h2>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-2">
                  <Link to="/dashboard" onClick={closeMobileMenu} className="block">
                    <Button 
                      variant={location.pathname === '/dashboard' ? 'default' : 'ghost'}
                      size="sm"
                      className={`w-full justify-start ${
                        location.pathname === '/dashboard' ? 
                        'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' : 
                        'hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Grid className="h-4 w-4 mr-3" />
                      Gallery
                    </Button>
                  </Link>
                  {/* Uncomment if you have more routes */}
                  {/* <Link to="/upload" onClick={closeMobileMenu} className="block">
                    <Button 
                      variant={location.pathname === '/upload' ? 'default' : 'ghost'}
                      size="sm"
                      className={`w-full justify-start ${
                        location.pathname === '/upload' ? 
                        'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' : 
                        'hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Upload className="h-4 w-4 mr-3" />
                      Upload
                    </Button>
                  </Link> */}
                </nav>

                {/* User Info & Logout for Mobile */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center space-x-3 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {user?.username}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Signed in
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleLogout}
                    className="w-full justify-start border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950 dark:hover:border-red-700"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Optional Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center text-sm text-slate-600 dark:text-slate-400">
            <p>© 2025 Image Gallery. Made with ❤️</p>
          </div>
        </div>
      </footer>
    </div>
  )
}