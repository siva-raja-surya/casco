import React, { useState } from 'react';
import { MOCK_ADMIN_CREDENTIALS } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Lock } from 'lucide-react';

interface AdminLoginProps {
  onSuccess: (token: string, email: string) => void;
  onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onCancel }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate Network Request for JWT
    setTimeout(() => {
      setLoading(false);
      if (email === MOCK_ADMIN_CREDENTIALS.email && password === MOCK_ADMIN_CREDENTIALS.password) {
        // Generate Mock JWT
        const mockJwt = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({email, role: 'admin'}))}.signature`;
        onSuccess(mockJwt, email);
      } else {
        setError('Invalid credentials. (Hint: admin@cosco.com / password123)');
      }
    }, 1200);
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="bg-gray-900 p-6 flex flex-col items-center justify-center">
         <div className="p-3 bg-white/10 rounded-full mb-3">
            <Lock className="text-white h-8 w-8" />
         </div>
         <h2 className="text-xl font-bold text-white">Admin Portal</h2>
         <p className="text-gray-400 text-sm">Secure Access Required</p>
      </div>
      
      <div className="p-8">
        <form onSubmit={handleLogin} className="space-y-5">
          <Input 
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@cosco.com"
            required
          />
          <Input 
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded border border-red-100">
              {error}
            </div>
          )}

          <div className="pt-2">
            <Button type="submit" className="w-full bg-gray-900 hover:bg-black" isLoading={loading}>
              Authenticate
            </Button>
            <button 
              type="button" 
              onClick={onCancel}
              className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700 py-2"
            >
              Return to User Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};