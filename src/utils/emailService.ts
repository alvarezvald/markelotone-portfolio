
import emailjs from '@emailjs/browser';

export interface EmailData {
  name: string;
  email: string;
  message: string;
}

export const sendContactEmail = async (data: EmailData): Promise<void> => {
  // These will need to be configured with your EmailJS account
  const serviceId = 'YOUR_SERVICE_ID';
  const templateId = 'YOUR_TEMPLATE_ID';
  const publicKey = 'YOUR_PUBLIC_KEY';

  const templateParams = {
    from_name: data.name,
    from_email: data.email,
    message: data.message,
    to_name: 'Mark Anthony Alvarez',
  };

  try {
    await emailjs.send(serviceId, templateId, templateParams, publicKey);
  } catch (error) {
    console.error('EmailJS Error:', error);
    throw new Error('Failed to send email');
  }
};
