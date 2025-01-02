// Verification service
import { VerificationMethod } from '../types';

interface VerificationData {
  code: string;
  expires: number;
  attempts: number;
}

class VerificationService {
  private static instance: VerificationService;
  private verificationCodes: Map<string, VerificationData>;
  private readonly MAX_ATTEMPTS = 3;
  private readonly CODE_EXPIRY = 10 * 60 * 1000; // 10 minutes

  private constructor() {
    this.verificationCodes = new Map();
  }

  public static getInstance(): VerificationService {
    if (!VerificationService.instance) {
      VerificationService.instance = new VerificationService();
    }
    return VerificationService.instance;
  }

  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  public async sendCode(target: string, method: VerificationMethod): Promise<{ success: boolean; message: string }> {
    try {
      const existingData = this.verificationCodes.get(target);
      if (existingData && Date.now() < existingData.expires) {
        return {
          success: false,
          message: 'Please wait before requesting a new code'
        };
      }

      const code = this.generateCode();
      this.verificationCodes.set(target, {
        code,
        expires: Date.now() + this.CODE_EXPIRY,
        attempts: 0
      });

      // In production, this would call your backend API
      console.log(`Verification code for ${method} (${target}): ${code}`);
      
      return {
        success: true,
        message: `Verification code sent to your ${method}`
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send verification code'
      };
    }
  }

  public async verifyCode(target: string, code: string): Promise<{ success: boolean; message: string }> {
    const data = this.verificationCodes.get(target);
    
    if (!data) {
      return {
        success: false,
        message: 'No verification code found. Please request a new one'
      };
    }

    if (Date.now() > data.expires) {
      this.verificationCodes.delete(target);
      return {
        success: false,
        message: 'Verification code has expired'
      };
    }

    if (data.attempts >= this.MAX_ATTEMPTS) {
      this.verificationCodes.delete(target);
      return {
        success: false,
        message: 'Too many attempts. Please request a new code'
      };
    }

    data.attempts++;
    
    if (code !== data.code) {
      return {
        success: false,
        message: `Invalid code. ${this.MAX_ATTEMPTS - data.attempts} attempts remaining`
      };
    }

    this.verificationCodes.delete(target);
    return {
      success: true,
      message: 'Verification successful'
    };
  }
}

export const verificationService = VerificationService.getInstance();