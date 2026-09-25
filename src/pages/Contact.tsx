import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import FadeIn from '../components/FadeIn';
import { apiFetch, ApiError } from '../lib/api';

const EMPTY_FORM = { name: '', company: '', email: '', phone: '', subject: '', message: '' };

export default function Contact() {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await apiFetch('/api/contact', { method: 'POST', body: JSON.stringify(formData) });
      setIsSuccess(true);
      setFormData(EMPTY_FORM);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-light-gray pt-24 min-h-screen">
      {/* Hero */}
      <section className="bg-primary-blue text-white py-24 px-4 text-center">
        <FadeIn className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">Contact Us</h1>
          <p className="text-xl md:text-2xl text-blue-100 font-medium">We Are Here to Support Your Business</p>
        </FadeIn>
      </section>

      {/* Contact Content */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16">
          
          {/* Form */}
          <FadeIn direction="right" className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-primary-dark mb-8">Send Us a Message</h2>
            
            {isSuccess ? (
              <div className="bg-green-50 text-green-700 p-6 rounded-xl border border-green-200 text-center">
                <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                <p>Thank you for reaching out. We will get back to you shortly.</p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="mt-4 px-6 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-200 text-sm">
                    {error}
                  </div>
                )}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-body-text mb-2">Full Name *</label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-blue/50 focus:border-primary-blue transition-colors" placeholder="John Doe" required />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-body-text mb-2">Company Name</label>
                    <input type="text" name="company" id="company" value={formData.company} onChange={handleChange} className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-blue/50 focus:border-primary-blue transition-colors" placeholder="XYZ Corp" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-body-text mb-2">Email Address *</label>
                    <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-blue/50 focus:border-primary-blue transition-colors" placeholder="john@example.com" required />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-body-text mb-2">Phone Number</label>
                    <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-blue/50 focus:border-primary-blue transition-colors" placeholder="+880 1..." />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-body-text mb-2">Subject</label>
                  <input type="text" name="subject" id="subject" value={formData.subject} onChange={handleChange} className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-blue/50 focus:border-primary-blue transition-colors" placeholder="How can we help?" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-body-text mb-2">Message *</label>
                  <textarea name="message" id="message" rows={5} value={formData.message} onChange={handleChange} className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-blue/50 focus:border-primary-blue transition-colors resize-none" placeholder="Write your message here..." required></textarea>
                </div>
                <button type="submit" disabled={isSubmitting} className={`w-full bg-primary-blue hover:bg-accent-hover text-white py-4 rounded-md font-bold transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </FadeIn>

          {/* Info & Map */}
          <FadeIn direction="left" className="space-y-8">
            <div className="bg-primary-dark text-white p-8 md:p-12 rounded-2xl shadow-lg border-b-4 border-primary-blue">
              <h2 className="text-2xl font-bold text-white mb-8">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="w-6 h-6 text-primary-blue mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-sm text-gray-400 font-medium mb-1">Email</h3>
                    <a href="mailto:info@zexora.com.bd" className="text-lg font-bold text-white hover:text-primary-blue transition-colors">info@zexora.com.bd</a>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="w-6 h-6 text-primary-blue mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-sm text-gray-400 font-medium mb-1">Phone</h3>
                    <a href="tel:+8801855939450" className="text-lg font-bold text-white hover:text-primary-blue transition-colors">+880 1855 939 450</a>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 text-primary-blue mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-sm text-gray-400 font-medium mb-1">Head Office</h3>
                    <p className="text-white font-medium">292, Inner Circular Road,<br/>Shatabdi Centre, Fakirapool,<br/>Motijheel, Dhaka-1000</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="w-6 h-6 text-primary-blue mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-sm text-gray-400 font-medium mb-1">Business Hours</h3>
                    <p className="text-white font-medium">Saturday–Thursday: 9:00 AM – 6:00 PM<br/><span className="text-primary-blue">Friday: Closed</span></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm h-64 border border-gray-100 relative">
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.3843701617134!2d90.4185923!3d23.733669!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b9e75f0afbbd%3A0x5f71646b22407002!2sZexora%20Corporation!5e0!3m2!1sen!2sbd!4v1782203946425!5m2!1sen!2sbd"
    className="w-full h-full"
    style={{ border: 0 }}
    allowFullScreen
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    title="Zexora Office Location"
  ></iframe>
</div>
          </FadeIn>
          
        </div>
      </section>
      
      {/* Footer Quote */}
      <section className="bg-white py-16 text-center px-4 border-t border-gray-100">
        <FadeIn>
          <p className="text-2xl md:text-3xl font-bold text-primary-dark max-w-3xl mx-auto mb-6">
            "Your industrial success is our commitment. Let's build something great together."
          </p>
          <p className="text-body-text italic mb-6">— Zexora Corporation — Performance. Partnership. Progress.</p>
          <div className="flex items-center justify-center space-x-6 text-body-text font-medium">
             <a href="https://www.facebook.com/zexoracorporation" target="_blank" rel="noopener noreferrer" className="hover:text-primary-blue transition-colors underline decoration-2 underline-offset-4">Facebook</a>
             <a href="https://www.instagram.com/zexoracorporation" target="_blank" rel="noopener noreferrer" className="hover:text-primary-blue transition-colors underline decoration-2 underline-offset-4">Instagram</a>
             <a href="https://www.linkedin.com/company/zexoracorporation" target="_blank" rel="noopener noreferrer" className="hover:text-primary-blue transition-colors underline decoration-2 underline-offset-4">LinkedIn</a>
             <a href="https://www.youtube.com/@zexoracorporation" target="_blank" rel="noopener noreferrer" className="hover:text-primary-blue transition-colors underline decoration-2 underline-offset-4">YouTube</a>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
