
import emailjs from '@emailjs/browser';

export interface EmailData {
  name: string;
  email: string;
  message: string;
}

export const sendContactEmail = async (data: EmailData): Promise<void> => {
  const serviceId = 'service_2znje0u';
  const templateId = 'template_pyie4ds';
  const publicKey = 'TkJv59OMNojkPGhi7';

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
