
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { UserWizard } from './components/user/UserWizard';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AppView } from './types';

function App() {
  const [currentView, setCurrentView] = useState(AppView.USER_WIZARD);
  const [currentUser, setCurrentUser] = useState(null);
  
  // State for public user flow
  const [publicUserEmail, setPublicUserEmail] = useState(null);
  const [wizardResetKey, setWizardResetKey] = useState(0);

  // Check for existing session on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('cosco_admin_token');
    const storedEmail = localStorage.getItem('cosco_admin_email');
    if (storedToken && storedEmail) {
      setCurrentUser({ email: storedEmail, token: storedToken });
      setCurrentView(AppView.ADMIN_DASHBOARD);
    }
  }, []);

  const handleAdminLoginSuccess = (token, email) => {
    localStorage.setItem('cosco_admin_token', token);
    localStorage.setItem('cosco_admin_email', email);
    setCurrentUser({ email, token });
    setCurrentView(AppView.ADMIN_DASHBOARD);
  };

  const handleLogout = () => {
    // Admin Logout
    localStorage.removeItem('cosco_admin_token');
    localStorage.removeItem('cosco_admin_email');
    setCurrentUser(null);
    
    // Public User Logout
    setPublicUserEmail(null);
    setWizardResetKey(prev => prev + 1); // Reset the UserWizard state to landing

    // Return to landing page
    setCurrentView(AppView.USER_WIZARD);
  };

  const renderContent = () => {
    switch (currentView) {
      case AppView.USER_WIZARD:
        return (
          <UserWizard 
            key={wizardResetKey} // Force reset on logout
            onAdminAccess={() => setCurrentView(AppView.ADMIN_LOGIN)} 
            onLogout={handleLogout}
            onUserVerified={setPublicUserEmail}
          />
        );
      
      case AppView.ADMIN_LOGIN:
        return (
          <AdminLogin 
            onSuccess={handleAdminLoginSuccess} 
            onCancel={() => setCurrentView(AppView.USER_WIZARD)} 
          />
        );

      case AppView.ADMIN_DASHBOARD:
        if (!currentUser) return null; // Should redirect or show loader
        return <AdminDashboard token={currentUser.token} />;

      default:
        return <div>View Not Found</div>;
    }
  };

  return (
    <Layout 
      userEmail={currentUser?.email || publicUserEmail} 
      currentView={currentView}
      onLogout={handleLogout}
      onHomeClick={() => {
          if(!currentUser) setCurrentView(AppView.USER_WIZARD);
      }}
    >
      {renderContent()}
    </Layout>
  );
}

export default App;
