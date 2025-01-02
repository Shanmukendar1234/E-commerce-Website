import React, { useState } from 'react';
import { verificationService } from '../services/verificationService';
import { VerificationMethod } from '../types';

interface VerificationFormProps {
  target: string;
  method: VerificationMethod;
  onSuccess: () => void;
  onCancel: () => void;
}

export const VerificationForm: React.FC<VerificationFormProps> = ({
  target,
  method,
  onSuccess,
  onCancel,
}) => {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setMessage('Verification code must be 6 digits.');
      setIsError(true);
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const result = await verificationService.verifyCode(target, code);
      setMessage(result.message);
      setIsError(!result.success);
      if (result.success) {
        setTimeout(onSuccess, 1000);
      }
    } catch (error) {
      setMessage('An error occurred during verification. Please try again.');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      const result = await verificationService.sendCode(target, method);
      setMessage(result.message || 'A new verification code has been sent.');
      setIsError(!result.success);
    } catch (error) {
      setMessage('Failed to resend the verification code. Please try again.');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">
        Please enter the verification code sent to your {method}.
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={code}
            onChange={(e) =>
              setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
            }
            className="w-full px-4 py-2 text-lg tracking-widest text-center border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="000000"
            maxLength={6}
            required
            disabled={isLoading}
          />
        </div>

        {message && (
          <div
            className={`p-3 rounded-lg ${
              isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}
          >
            {message}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={isLoading || code.length !== 6}
          >
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </button>
          <button
            type="button"
            onClick={handleResend}
            className="px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Resending...' : 'Resend'}
          </button>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="w-full px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100"
        >
          Back
        </button>
      </form>
    </div>
  );
};
