import React from 'react';
import { LogOut } from 'lucide-react';

export const Layout = ({ 
  children, 
  userEmail, 
  currentView, 
  onLogout,
  onHomeClick
}) => {
  return (
    <div className="min-h-screen bg-cosco-bg font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer" onClick={onHomeClick}>
            <div className="flex items-center">
              <span className="text-2xl font-black text-gray-900 tracking-tight">COSCO</span>
              <span className="text-2xl font-bold text-cosco-primary ml-1.5">SHIPPING</span>
            </div>
            <div className="h-6 w-px bg-gray-300 mx-2 hidden sm:block"></div>
            <h1 className="text-gray-600 text-sm sm:text-base hidden sm:block font-medium">Receipt Request Form</h1>
          </div>

          <div className="flex items-center gap-4">
            {userEmail && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 hidden md:inline-block">
                  {userEmail}
                </span>
                <button 
                  onClick={onLogout}
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600 transition-colors border px-3 py-1 rounded hover:bg-red-50"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} COSCO SHIPPING Lines (India) Pvt. Ltd. All rights reserved.
      </footer>
    </div>
  );
};