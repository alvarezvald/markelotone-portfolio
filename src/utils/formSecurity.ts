
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  honeypot?: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateContactForm = (data: ContactFormData): ValidationResult => {
  // Check required fields
  if (!data.name?.trim()) {
    return { isValid: false, error: "Name is required" };
  }

  if (!data.email?.trim()) {
    return { isValid: false, error: "Email is required" };
  }

  if (!data.message?.trim()) {
    return { isValid: false, error: "Message is required" };
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }

  // Check field lengths
  if (data.name.length > 100) {
    return { isValid: false, error: "Name must be less than 100 characters" };
  }

  if (data.email.length > 100) {
    return { isValid: false, error: "Email must be less than 100 characters" };
  }

  if (data.message.length > 1000) {
    return { isValid: false, error: "Message must be less than 1000 characters" };
  }

  if (data.message.length < 10) {
    return { isValid: false, error: "Message must be at least 10 characters long" };
  }

  // Check for suspicious patterns (basic spam detection)
  const suspiciousPatterns = [
    /https?:\/\/[^\s]+/gi, // URLs
    /\b(?:viagra|casino|lottery|winner|congratulations)\b/gi, // Common spam words
    /(.)\1{4,}/gi, // Repeated characters (aaaaa)
  ];

  const fullText = `${data.name} ${data.email} ${data.message}`.toLowerCase();
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(fullText)) {
      return { isValid: false, error: "Message content appears to be spam" };
    }
  }

  return { isValid: true };
};

export const sanitizeInput = (input: string): string => {
  if (!input) return "";
  
  return input
    .trim()
    // Remove HTML tags
    .replace(/<[^>]*>/g, "")
    // Remove potentially dangerous characters
    .replace(/[<>'"&]/g, "")
    // Normalize whitespace
    .replace(/\s+/g, " ")
    // Remove control characters
    .replace(/[\x00-\x1F\x7F]/g, "");
};

export const createSecurityHeaders = () => {
  return {
    "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-XSS-Protection": "1; mode=block"
  };
};
