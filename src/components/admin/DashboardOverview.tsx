import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  FileText, 
  TrendingUp, 
  Activity,
  Calendar,
  Clock,
  CheckCircle
} from 'lucide-react';
import { User } from '../../services/auth';
import { API_ENDPOINTS, createAuthHeaders, handleApiError } from '../../config/api';

interface DashboardOverviewProps {
  user: User;
}

interface DashboardStats {
  totalCompanies: number;
  totalUsers: number;
  totalDocuments: number;
  recentRegistrations: number;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ user }) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalCompanies: 0,
    totalUsers: 0,
    totalDocuments: 0,
    recentRegistrations: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([
    { id: 1, type: 'registration', message: 'New company registered: Tech Solutions Inc', time: '2 hours ago' },
    { id: 2, type: 'user', message: 'New user added: John Doe', time: '4 hours ago' },
    { id: 3, type: 'document', message: 'Document uploaded: Business License', time: '6 hours ago' },
    { id: 4, type: 'system', message: 'System backup completed', time: '1 day ago' },
  ]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Load companies data
        const token = localStorage.getItem('authToken');
        if (token) {
          const response = await fetch(`${API_ENDPOINTS.COMPANIES}?limit=1000`, {
            headers: createAuthHeaders(token),
          });
          await handleApiError(response);
          const data = await response.json();
          
          setStats(prev => ({
            ...prev,
            totalCompanies: data.total || 0,
            totalUsers: data.companies?.reduce((acc: number, company: any) => acc + (company.users?.length || 0), 0) || 0,
            recentRegistrations: data.companies?.filter((company: any) => {
              const createdAt = new Date(company.created_at);
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return createdAt > weekAgo;
            }).length || 0,
          }));
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Total Companies',
      value: stats.totalCompanies,
      icon: Building2,
      color: 'blue',
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'emerald',
      change: '+8%',
      changeType: 'positive' as const,
    },
    {
      title: 'Documents',
      value: stats.totalDocuments,
      icon: FileText,
      color: 'amber',
      change: '+15%',
      changeType: 'positive' as const,
    },
    {
      title: 'Recent Registrations',
      value: stats.recentRegistrations,
      icon: TrendingUp,
      color: 'purple',
      change: '+25%',
      changeType: 'positive' as const,
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      amber: 'bg-amber-50 text-amber-600 border-amber-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome back, {user.first_name}!
        </h2>
        <p className="text-gray-600">
          Here's what's happening with your ERP system today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`p-6 rounded-xl border-2 ${getColorClasses(stat.color)} transition-all duration-200 hover:shadow-lg`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${getColorClasses(stat.color).replace('border-', 'bg-').replace('-50', '-100')}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800 mb-1">
                  {stat.value.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-600" />
              Recent Activity
            </h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 bg-white rounded-lg">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{activity.message}</p>
                  <p className="text-xs text-gray-500 flex items-center mt-1">
                    <Clock className="w-3 h-3 mr-1" />
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-emerald-600" />
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full p-4 bg-white rounded-lg text-left hover:bg-blue-50 transition-colors duration-200 border border-gray-200 hover:border-blue-300">
              <div className="flex items-center space-x-3">
                <Building2 className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-800">Add New Company</p>
                  <p className="text-sm text-gray-600">Register a new company in the system</p>
                </div>
              </div>
            </button>
            
            <button className="w-full p-4 bg-white rounded-lg text-left hover:bg-emerald-50 transition-colors duration-200 border border-gray-200 hover:border-emerald-300">
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="font-medium text-gray-800">Manage Users</p>
                  <p className="text-sm text-gray-600">Add, edit, or remove user accounts</p>
                </div>
              </div>
            </button>
            
            <button className="w-full p-4 bg-white rounded-lg text-left hover:bg-amber-50 transition-colors duration-200 border border-gray-200 hover:border-amber-300">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="font-medium text-gray-800">View Documents</p>
                  <p className="text-sm text-gray-600">Browse and manage uploaded documents</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Company Information */}
      {user.company && (
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Company</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Company Name</p>
              <p className="text-gray-800">{user.company.company_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Industry</p>
              <p className="text-gray-800 capitalize">{user.company.industry}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Company Size</p>
              <p className="text-gray-800">{user.company.company_size}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Website</p>
              <p className="text-gray-800">{user.company.website || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Phone</p>
              <p className="text-gray-800">{user.company.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Tax ID</p>
              <p className="text-gray-800">{user.company.tax_id}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};