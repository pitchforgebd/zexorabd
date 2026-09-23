import React, { useRef, useState } from 'react';
import SEO from '../components/SEO';
import { CheckCircle2, ChevronDown, UploadCloud } from 'lucide-react';
import { apiFetch, ApiError } from '../lib/api';

export default function Career() {
  const form = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    education: '',
    experience: '',
    coverLetter: '',
    message: '',
    consent: false
  });
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [id]: checked });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload your CV.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const fd = new FormData();
      fd.append('fullName', formData.fullName);
      fd.append('email', formData.email);
      fd.append('phone', formData.phone);
      fd.append('position', formData.position);
      fd.append('education', formData.education);
      fd.append('experience', formData.experience);
      fd.append('coverLetter', formData.coverLetter);
      fd.append('message', formData.message);
      fd.append('consent', String(formData.consent));
      fd.append('cv', file);

      await apiFetch('/api/career', { method: 'POST', body: fd });

      setIsSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        position: '',
        education: '',
        experience: '',
        coverLetter: '',
        message: '',
        consent: false
      });
      setFile(null);
      if (form.current) form.current.reset();

    } catch (err) {
      console.error('Submission error:', err);
      setError(err instanceof ApiError ? err.message : 'An error occurred during submission. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO 
        title="Career Application Form | Zexora Corporation"
        description="Join Our Team / Apply For A Position at Zexora Corporation."
      />
      <div className="pt-32 pb-24 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-sm font-semibold text-primary-blue tracking-wider uppercase mb-3">Careers</h1>
            <h2 className="text-3xl md:text-5xl font-bold text-primary-dark mb-4 tracking-tight">Join Our Team / Apply For A Position</h2>
            <p className="text-lg text-body-text max-w-2xl mx-auto">
              We are always looking for passionate and talented individuals.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-10">
            {isSuccess ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Thank you for your interest in joining Zexora. Our HR team will review your application and contact you if you are a good fit.
                </p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="bg-primary-blue text-white px-8 py-3 rounded-xl font-medium hover:bg-accent-hover transition-colors"
                >
                  Submit Another
                </button>
              </div>
            ) : (
              <form ref={form} onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-200 text-sm">
                    {error}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                    <input type="text" id="fullName" name="full_name" required value={formData.fullName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-blue/20 transition-all text-gray-800" placeholder="Enter your full name" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                    <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-blue/20 transition-all text-gray-800" placeholder="Enter your email address" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                    <input type="tel" id="phone" name="phone" required value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-blue/20 transition-all text-gray-800" placeholder="Enter your phone number" />
                  </div>
                  <div>
                    <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">Select Position <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select id="position" name="position" required value={formData.position} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-blue/20 transition-all text-gray-800 appearance-none cursor-pointer">
                        <option value="">Select Position</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Sales & Marketing">Sales & Marketing</option>
                        <option value="Accounts & Finance">Accounts & Finance</option>
                        <option value="Human Resource">Human Resource</option>
                        <option value="Internship">Internship</option>
                        <option value="Other">Other</option>
                      </select>
                      <ChevronDown className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                    <input type="text" id="education" name="education" value={formData.education} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-blue/20 transition-all text-gray-800" placeholder="Enter your highest education qualification" />
                  </div>
                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
                    <input type="number" min="0" step="0.5" id="experience" name="experience" value={formData.experience} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-blue/20 transition-all text-gray-800" placeholder="Enter your experience" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload CV (PDF/DOC up to 5MB) <span className="text-red-500">*</span></label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl bg-gray-50 hover:bg-blue-50/50 hover:border-primary-blue/50 transition-colors relative cursor-pointer overflow-hidden group">
                    <div className="space-y-1 text-center">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-[0_2px_8px_rgba(0,0,0,0.08)] group-hover:shadow-md transition-shadow">
                        <UploadCloud className="w-6 h-6 text-primary-blue" />
                      </div>
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label htmlFor="resume-upload" className="relative cursor-pointer text-primary-blue font-medium hover:text-accent-hover focus-within:outline-none">
                          <span>{file ? 'Change File' : 'Upload a file'}</span>
                          <input id="resume-upload" type="file" required={!file} accept=".pdf,.doc,.docx" className="sr-only" onChange={handleFileChange} />
                        </label>
                        <p className="pl-1 hidden sm:block">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        {file ? <span className="font-semibold text-primary-dark">{file.name}</span> : 'PDF, DOC, DOCX up to 5MB'}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-1">Cover Letter</label>
                  <textarea id="coverLetter" name="cover_letter" rows={4} value={formData.coverLetter} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-blue/20 transition-all text-gray-800 resize-none" placeholder="Write a short introduction about yourself and why you want to join our company"></textarea>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Additional Message</label>
                  <textarea id="message" name="additional_message" rows={3} value={formData.message} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-blue/20 transition-all text-gray-800 resize-none" placeholder="Any additional information you want to share"></textarea>
                </div>

                <div className="flex items-center">
                  <input
                    id="consent"
                    name="consent"
                    type="checkbox"
                    required
                    checked={formData.consent}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-blue focus:ring-primary-blue border-gray-300 rounded"
                  />
                  <label htmlFor="consent" className="ml-2 block text-sm text-gray-700">
                    I agree that my information can be used for recruitment purposes.
                  </label>
                </div>

                <div className="pt-2">
                  <button type="submit" disabled={isSubmitting} className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold uppercase tracking-wider text-white bg-primary-blue hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}>
                    {isSubmitting ? 'Uploading CV & Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

