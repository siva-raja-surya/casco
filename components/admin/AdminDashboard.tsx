import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Search, Filter, MoreHorizontal } from 'lucide-react';
import { Button } from '../ui/Button';

const data = [
  { name: 'Mon', requests: 40 },
  { name: 'Tue', requests: 30 },
  { name: 'Wed', requests: 20 },
  { name: 'Thu', requests: 27 },
  { name: 'Fri', requests: 58 },
  { name: 'Sat', requests: 23 },
  { name: 'Sun', requests: 10 },
];

const pieData = [
  { name: 'Import', value: 400 },
  { name: 'Export', value: 300 },
  { name: 'Other', value: 100 },
];

const COLORS = ['#006C5B', '#26A69A', '#80CBC4'];

const recentRequests = [
  { id: 'REQ-001', party: 'ABC LOGISTICS LTD', type: 'Export', amount: '45,000', status: 'Pending', date: '2023-10-24' },
  { id: 'REQ-002', party: 'GLOBAL TRADERS INC', type: 'Import', amount: '12,500', status: 'Processed', date: '2023-10-24' },
  { id: 'REQ-003', party: 'SUNSHINE SHIPPING', type: 'Import', amount: '8,200', status: 'Pending', date: '2023-10-23' },
  { id: 'REQ-004', party: 'FAST TRACK CARGO', type: 'Others', amount: '2,100', status: 'Rejected', date: '2023-10-23' },
  { id: 'REQ-005', party: 'OCEAN BLUE EXPORTS', type: 'Export', amount: '115,000', status: 'Processed', date: '2023-10-22' },
];

export const AdminDashboard: React.FC = () => {
  return (
    <div className="w-full space-y-6 animate-fade-in">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Total Requests</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">1,284</p>
          <span className="text-green-500 text-xs font-medium">+12% from last week</span>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Pending</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">42</p>
          <span className="text-yellow-500 text-xs font-medium">Action Required</span>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Processed Today</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">18</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Total Revenue (Est)</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">₹4.2M</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Weekly Request Volume</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
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
              {recentRequests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-cosco-primary">{req.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{req.party}</td>
                  <td className="px-6 py-4">{req.type}</td>
                  <td className="px-6 py-4">{req.amount}</td>
                  <td className="px-6 py-4">{req.date}</td>
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
              ))}
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