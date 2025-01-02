import React, { useState } from 'react';
import { X, Mail, Phone, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { verificationService } from '../services/verificationService';
import { VerificationForm } from './VerificationForm';
import type { VerificationMethod } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<'credentials' | 'verify'>('credentials');
  const [verificationMethod, setVerificationMethod] = useState<VerificationMethod>('email');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  if (!isOpen) return null;

  const handleSendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const target = verificationMethod === 'email' ? email : mobile;

    try {
      const result = await verificationService.sendCode(target, verificationMethod);
      
      if (result.success) {
        setStep('verify');
      } else {
        setError(result.message || 'Failed to send verification code. Please try again.');
      }
    } catch (err) {
      console.error('Error sending verification code:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSuccess = async () => {
    try {
      await login(email, password, mobile);
      onClose();
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
      setStep('credentials');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {step === 'credentials' ? 'Login' : 'Verify Your Identity'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {step === 'credentials' ? (
          <form onSubmit={handleSendVerification} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                Mobile Number
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone size={18} className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="mobile"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="10-digit mobile number"
                  pattern="[6-9][0-9]{9}"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-700">Choose verification method:</p>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="email"
                    checked={verificationMethod === 'email'}
                    onChange={(e) => setVerificationMethod(e.target.value as VerificationMethod)}
                    className="mr-2"
                  />
                  Email
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="mobile"
                    checked={verificationMethod === 'mobile'}
                    onChange={(e) => setVerificationMethod(e.target.value as VerificationMethod)}
                    className="mr-2"
                  />
                  Mobile
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Verification Code'}
            </button>
          </form>
        ) : (
          <VerificationForm
            target={verificationMethod === 'email' ? email : mobile}
            method={verificationMethod}
            onSuccess={handleVerificationSuccess}
            onCancel={() => setStep('credentials')}
          />
        )}
      </div>
    </div>
  );
};
