
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Search, Filter, MoreHorizontal } from 'lucide-react';
import { Button } from '../ui/Button';
import { api } from '../../services/api';

const COLORS = ['#006C5B', '#26A69A', '#80CBC4'];

export const AdminDashboard = ({ token }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processedToday: 0,
    totalRevenue: 0
  });

  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await api.getRequests(token);
      setRequests(data);
      processData(data);
    } catch (err) {
      setError('Failed to fetch data. Is backend running?');
    } finally {
      setLoading(false);
    }
  };

  const processData = (data) => {
    // 1. Stats
    const total = data.length;
    const pending = data.filter(r => r.status === 'Pending').length;
    
    // Check processed today
    const today = new Date().toISOString().split('T')[0];
    const processedToday = data.filter(r => 
      r.status === 'Processed' && 
      new Date(r.createdAt).toISOString().split('T')[0] === today
    ).length;

    const totalRevenue = data.reduce((acc, curr) => acc + (Number(curr.invoiceAmount) || 0), 0);

    setStats({ total, pending, processedToday, totalRevenue });

    // 2. Pie Chart (Distribution)
    const distribution = { Export: 0, Import: 0, Others: 0 };
    data.forEach(r => {
      if (distribution[r.caseType] !== undefined) {
        distribution[r.caseType]++;
      } else {
        distribution.Others++;
      }
    });
    setPieData([
      { name: 'Import', value: distribution.Import },
      { name: 'Export', value: distribution.Export },
      { name: 'Others', value: distribution.Others }
    ]);

    // 3. Bar Chart (Weekly)
    // Simplified: Grouping by last 7 days from mock logic or actual dates
    // For now, let's just group by day name of createdAt
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const volume = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
    
    data.forEach(r => {
      const d = new Date(r.createdAt);
      const dayName = days[d.getDay()];
      volume[dayName]++;
    });

    const processedChartData = days.map(day => ({
      name: day,
      requests: volume[day]
    }));
    setChartData(processedChartData);
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(val);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cosco-primary"></div>
      </div>
    );
  }

  if (error) {
     return (
        <div className="w-full p-6 bg-red-50 text-red-600 rounded-lg text-center">
           <p className="font-bold">Error Loading Dashboard</p>
           <p className="text-sm">{error}</p>
           <Button onClick={fetchData} className="mt-4" variant="outline">Retry</Button>
        </div>
     )
  }

  return (
    <div className="w-full space-y-6 animate-fade-in">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Total Requests</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
          <span className="text-green-500 text-xs font-medium">Updated just now</span>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Pending</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pending}</p>
          <span className="text-yellow-500 text-xs font-medium">Action Required</span>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Processed Today</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.processedToday}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Total Revenue (Est)</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(stats.totalRevenue)}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Weekly Request Volume</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} 
                  cursor={{fill: '#F3F4F6'}}
                />
                <Bar dataKey="requests" fill="#006C5B" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Request Distribution</h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-2">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index]}}></div>
                <span className="text-sm text-gray-600">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Requests Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h3 className="text-lg font-bold text-gray-800">Recent Requisitions</h3>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input type="text" placeholder="Search UTR..." className="pl-9 pr-4 py-2 border rounded-md text-sm w-full focus:outline-none focus:ring-1 focus:ring-cosco-primary" />
            </div>
            <Button variant="outline" className="px-3">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="px-3">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Request ID</th>
                <th className="px-6 py-4">Party Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Amount (₹)</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.length === 0 ? (
                <tr>
                   <td colSpan="7" className="px-6 py-8 text-center text-gray-500">No requests found.</td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-cosco-primary text-xs">{req._id.substring(req._id.length - 8).toUpperCase()}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{req.partyName}</td>
                    <td className="px-6 py-4">{req.caseType}</td>
                    <td className="px-6 py-4">{req.invoiceAmount}</td>
                    <td className="px-6 py-4">{formatDate(req.createdAt)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${req.status === 'Processed' ? 'bg-green-100 text-green-800' : 
                          req.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-center">
            <button className="text-sm text-cosco-primary font-medium hover:underline">View All Requests</button>
        </div>
      </div>
    </div>
  );
};
