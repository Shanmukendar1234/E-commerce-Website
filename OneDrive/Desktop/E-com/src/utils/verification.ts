// Client-side verification service
const verificationCodes: Map<string, { code: string; expires: number }> = new Map();

// Generate a random 6-digit code
const generateCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendVerificationCode = async (
  target: string,
  method: 'email' | 'mobile'
): Promise<void> => {
  const code = generateCode();
  const expires = Date.now() + 10 * 60 * 1000; // 10 minutes expiration

  // Store the code
  verificationCodes.set(target, { code, expires });

  // In a real application, this would make an API call to your backend
  // For demo purposes, we'll log the code to the console
  console.log(`Verification code for ${method} (${target}): ${code}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
};

export const verifyCode = async (
  target: string,
  code: string,
  method: 'email' | 'mobile'
): Promise<boolean> => {
  const storedData = verificationCodes.get(target);

  if (!storedData) {
    return false;
  }

  const { code: storedCode, expires } = storedData;

  // Check if code is expired
  if (Date.now() > expires) {
    verificationCodes.delete(target);
    return false;
  }

  // Verify code
  const isValid = code === storedCode;

  // Remove code after verification attempt
  verificationCodes.delete(target);

  return isValid;
};