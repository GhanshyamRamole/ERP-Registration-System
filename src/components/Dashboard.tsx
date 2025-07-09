import React, { useState, useEffect } from 'react';
import { Building2, Users, FileText, Settings, LogOut, User, Bell } from 'lucide-react';
import { authService, User as UserType } from '../services/auth';

interface DashboardProps {
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await authService.getProfile();
        setUser(userData);
      } catch (error) {
        console.error('Failed to load user data:', error);
        onLogout();
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [onLogout]);

  const handleLogout = () => {
    authService.logout();
    onLogout();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Failed to load user data</p>
          <button
            onClick={onLogout}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Building2 className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-800">ERP Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Bell className="w-5 h-5" />
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-800">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="bg-white rounded-lg shadow-sm p-4">
              <ul className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-200 ${
                          activeTab === item.id
                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome back, {user.first_name}!</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-600 text-sm font-medium">Company</p>
                          <p className="text-2xl font-bold text-blue-800">
                            {user.company?.company_name || 'N/A'}
                          </p>
                        </div>
                        <Building2 className="w-8 h-8 text-blue-600" />
                      </div>
                    </div>
                    
                    <div className="bg-emerald-50 p-6 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-emerald-600 text-sm font-medium">Department</p>
                          <p className="text-2xl font-bold text-emerald-800 capitalize">
                            {user.department}
                          </p>
                        </div>
                        <Users className="w-8 h-8 text-emerald-600" />
                      </div>
                    </div>
                    
                    <div className="bg-amber-50 p-6 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-amber-600 text-sm font-medium">Role</p>
                          <p className="text-2xl font-bold text-amber-800 capitalize">
                            {user.role}
                          </p>
                        </div>
                        <User className="w-8 h-8 text-amber-600" />
                      </div>
                    </div>
                  </div>

                  {user.company && (
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Company Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">Industry:</span>
                          <span className="ml-2 text-gray-800 capitalize">{user.company.industry}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Size:</span>
                          <span className="ml-2 text-gray-800">{user.company.company_size}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Website:</span>
                          <span className="ml-2 text-gray-800">{user.company.website || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Phone:</span>
                          <span className="ml-2 text-gray-800">{user.company.phone}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'users' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">User Management</h2>
                  <p className="text-gray-600">User management features coming soon...</p>
                </div>
              )}

              {activeTab === 'documents' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Documents</h2>
                  <p className="text-gray-600">Document management features coming soon...</p>
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>
                  <p className="text-gray-600">Settings panel coming soon...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};