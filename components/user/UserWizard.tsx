import React, { useState } from 'react';
import { WizardStep, ReceiptFormData } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ChevronLeft, CheckCircle, Mail, ShieldCheck, ArrowRight } from 'lucide-react';

interface UserWizardProps {
  onAdminAccess: () => void;
  onLogout: () => void; // Used to clear state if needed/reset
  onUserVerified: (email: string) => void;
}

export const UserWizard: React.FC<UserWizardProps> = ({ onAdminAccess, onLogout, onUserVerified }) => {
  const [step, setStep] = useState<WizardStep>(WizardStep.LANDING);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [formData, setFormData] = useState<ReceiptFormData>({
    partyName: '',
    email: '',
    utrNo: '',
    invoiceAmount: '',
    caseType: '',
    invoiceNo: ''
  });

  // Handlers
  const handleSendOTP = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep(WizardStep.OTP_INPUT);
      // Pre-fill email in form data for later
      setFormData(prev => ({ ...prev, email }));
    }, 1000);
  };

  const handleVerifyOTP = () => {
    if (otp.length < 4) {
      setError('Please enter a valid OTP.');
      return;
    }
    // Hardcoded check for demo or simple length check
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (otp === '123456') {
        setError('');
        setStep(WizardStep.FORM);
        onUserVerified(email);
      } else {
        setError('Invalid OTP. Use 123456 for demo.');
      }
    }, 800);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.partyName || !formData.utrNo || !formData.invoiceAmount || !formData.caseType) {
       alert("Please fill in all required fields.");
       return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(WizardStep.SUCCESS);
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetFlow = () => {
    setStep(WizardStep.LANDING);
    setEmail('');
    setOtp('');
    setFormData({
      partyName: '',
      email: '',
      utrNo: '',
      invoiceAmount: '',
      caseType: '',
      invoiceNo: ''
    });
    setError('');
    onLogout();
  };

  // --- RENDERERS ---

  if (step === WizardStep.LANDING) {
    return (
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-cosco-primary animate-fade-in-up">
        <div className="p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">COSCO SHIPPING - Receipt Request Form</h2>
          <p className="text-gray-500 mb-8 text-sm">
            When you submit this form, it will not automatically collect your details like name and email address unless you provide it yourself.
          </p>

          <h3 className="text-xl font-bold text-cosco-primary mb-4">Welcome to the COSCO Receipt Requisition Form!</h3>
          <p className="text-gray-600 mb-6">
            Thank you for using our service. Please fill out the form with the required details to request a receipt.
          </p>

          <div className="bg-cosco-light rounded-lg p-6 mb-8 border-l-4 border-cosco-primary">
            <h4 className="font-bold text-gray-800 mb-2">Important:</h4>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
              <li>After submitting the initial form, you will receive a One-Time Password (OTP) sent to the email address you provide.</li>
              <li>Please check your email for the OTP and enter it in the designated field to complete your form submission.</li>
            </ul>
          </div>

          <p className="text-gray-600 mb-6">Please click Next to initiate the Receipt Requisition</p>

          <Button onClick={() => setStep(WizardStep.EMAIL_INPUT)} className="w-32">
            Next
          </Button>

          <div className="mt-12 pt-6 border-t border-gray-100">
            <button onClick={onAdminAccess} className="text-xs text-gray-400 hover:text-cosco-primary transition-colors">
              Admin Access
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === WizardStep.EMAIL_INPUT) {
    return (
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-cosco-primary">
        <div className="p-8 md:p-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Verification Required</h2>
          <p className="text-gray-600 mb-6">Please enter your email address to receive your access code.</p>

          <Input 
            label="Email Address"
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
          />

          <div className="flex gap-4 mt-8">
            <Button variant="outline" onClick={() => setStep(WizardStep.LANDING)}>
              Back
            </Button>
            <Button onClick={handleSendOTP} isLoading={loading}>
              Send OTP
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (step === WizardStep.OTP_INPUT) {
    return (
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-cosco-primary">
        <div className="p-8 md:p-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Verification Required</h2>
          <p className="text-gray-600 mb-6">
            Enter the 6-digit code sent to <span className="font-semibold text-gray-900">{email}</span>
          </p>

          <Input 
            label="One-Time Password (OTP)"
            placeholder="123456"
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Only numbers
            error={error}
            helperText="Hint: Use 123456"
          />

          <div className="flex gap-4 mt-8">
            <Button variant="outline" onClick={() => setStep(WizardStep.EMAIL_INPUT)}>
              Change Email
            </Button>
            <Button onClick={handleVerifyOTP} isLoading={loading}>
              Verify & Proceed
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (step === WizardStep.FORM) {
    return (
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-cosco-primary">
        <div className="bg-white p-8 md:p-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">COSCO SHIPPING - Receipt Request Form</h2>
          <p className="text-red-500 text-sm mb-6">* Required</p>

          <h3 className="text-lg text-cosco-primary font-medium mb-6">Please Fill the Form</h3>

          <form onSubmit={handleSubmitForm} className="space-y-6">
            
            <Input 
              label="1. Party Name (Mention in Capital Letter)"
              placeholder="Enter your answer"
              name="partyName"
              value={formData.partyName}
              onChange={(e) => setFormData({...formData, partyName: e.target.value.toUpperCase()})}
              required
            />

            <Input 
              label="2. Customer Email ID"
              placeholder="Enter your email"
              name="email"
              value={formData.email}
              readOnly
              className="opacity-75 cursor-not-allowed bg-gray-50"
              required
              helperText="Please enter only one email ID (Pre-filled from verification)"
            />

            <Input 
              label="3. UTR NO (If Multiple UTR NO, Please separate with forward slash ( / )"
              placeholder="Enter your answer"
              name="utrNo"
              value={formData.utrNo}
              onChange={handleInputChange}
              required
            />

            <Input 
              label="4. Invoice amount(Rs)"
              placeholder="Enter your answer"
              name="invoiceAmount"
              type="number"
              value={formData.invoiceAmount}
              onChange={handleInputChange}
              required
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                5. Case (Import\Export\Others). Please mention any one of them <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {['Export', 'Import', 'Others'].map((opt) => (
                  <div key={opt} className="flex items-center">
                    <input
                      id={`opt-${opt}`}
                      name="caseType"
                      type="radio"
                      className="h-4 w-4 text-cosco-primary focus:ring-cosco-primary border-gray-300"
                      checked={formData.caseType === opt}
                      onChange={() => setFormData({...formData, caseType: opt as any})}
                    />
                    <label htmlFor={`opt-${opt}`} className="ml-3 block text-sm text-gray-700">
                      {opt}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Input 
              label="6. Invoice No (If Multiple Invoice No, please separate with forward slash ( / )"
              placeholder="Enter your answer"
              name="invoiceNo"
              value={formData.invoiceNo}
              onChange={handleInputChange}
            />

            <div className="flex gap-4 mt-8 pt-4 border-t border-gray-100">
              <Button type="button" variant="secondary" onClick={resetFlow}>
                Cancel
              </Button>
              <Button type="submit" isLoading={loading}>
                Submit Request
              </Button>
            </div>

          </form>
        </div>
      </div>
    );
  }

  if (step === WizardStep.SUCCESS) {
    return (
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-cosco-primary p-12 text-center animate-fade-in-up">
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted!</h2>
        <p className="text-gray-600 mb-8">
          We have received your receipt request. A confirmation has been sent to <strong>{email}</strong>.
        </p>
        <div className="bg-gray-50 rounded p-4 mb-6 text-left text-sm">
          <p><strong>UTR:</strong> {formData.utrNo}</p>
          <p><strong>Amount:</strong> Rs. {formData.invoiceAmount}</p>
        </div>
        <Button onClick={resetFlow}>Start New Request</Button>
      </div>
    );
  }

  return null;
};