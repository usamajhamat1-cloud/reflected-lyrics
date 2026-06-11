import React, { useState, useEffect } from 'react';
import { Inquiry } from '../types';

export default function InquiryForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState('');
  const [message, setMessage] = useState('');
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load existing requests from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('reflected_lyrical_inquiries');
      if (stored) {
        setInquiries(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Local storage error:", e);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !type || !message) {
      alert("Please fill in all licensing and messaging fields.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newInquiry: Inquiry = {
        id: `inq-${Date.now()}`,
        name,
        email,
        type,
        message,
        timestamp: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        status: 'Received'
      };

      const updated = [newInquiry, ...inquiries];
      setInquiries(updated);
      localStorage.setItem('reflected_lyrical_inquiries', JSON.stringify(updated));

      // Reset form
      setName('');
      setEmail('');
      setType('');
      setMessage('');
      setIsSubmitting(false);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    }, 1200);
  };

  const handleClearInquiries = () => {
    if (confirm("Are you sure you want to clear your local licensing submission log?")) {
      setInquiries([]);
      localStorage.removeItem('reflected_lyrical_inquiries');
    }
  };

  return (
    <div className="space-y-16">
      
      {/* Form Card */}
      <div className="max-w-4xl mx-auto glass p-8 md:p-16 border border-white/5 relative overflow-hidden">
        
        {/* Subtle background flair */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="text-center mb-12">
          <span className="font-sans text-[10px] uppercase tracking-[0.5em] text-primary mb-4 block">Inquiries</span>
          <h2 className="font-serif text-3xl md:text-5xl text-white tracking-wide">Let's Create Something <br/>Extraordinary</h2>
        </div>

        {isSuccess && (
          <div className="mb-8 p-6 bg-primary/10 border border-primary/30 text-center rounded relative animate-fade-in">
            <span className="material-symbols-outlined text-primary text-3xl mb-3 block">check_circle</span>
            <h4 className="font-serif text-lg text-white mb-1">Inquiry Registered Securely</h4>
            <p className="text-xs text-on-surface-variant font-sans uppercase tracking-widest leading-relaxed">
              Your vision has been recorded inside our production files. Review its status below.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="relative">
              <input 
                className="w-full bg-transparent border-0 border-b border-white/10 focus:border-primary focus:ring-0 text-sm py-4 transition-all placeholder:text-white/20 text-white font-sans focus:outline-none" 
                id="form_name" 
                placeholder="FULL NAME" 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <input 
                className="w-full bg-transparent border-0 border-b border-white/10 focus:border-primary focus:ring-0 text-sm py-4 transition-all placeholder:text-white/20 text-white font-sans focus:outline-none" 
                id="form_email" 
                placeholder="EMAIL ADDRESS" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="relative">
            <select 
              className="w-full bg-transparent border-0 border-b border-white/10 focus:border-primary focus:ring-0 text-sm py-4 transition-all appearance-none text-white/50 focus:outline-none font-sans"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              <option value="" disabled className="bg-surface text-white">SELECT INQUIRY TYPE</option>
              <option value="Music Licensing" className="bg-surface text-white">Music Licensing & Sync</option>
              <option value="Creative Collaboration" className="bg-surface text-white">Creative Co-Writing</option>
              <option value="Publishing Rights" className="bg-surface text-white">Publishing & Authorship</option>
              <option value="Press Inquiry" className="bg-surface text-white">Press & Media Relations</option>
            </select>
            <div className="absolute right-0 bottom-4 pointer-events-none text-white/30">
              <span className="material-symbols-outlined text-sm">unfold_more</span>
            </div>
          </div>

          <div className="relative">
            <textarea 
              className="w-full bg-transparent border-0 border-b border-white/10 focus:border-primary focus:ring-0 text-sm py-4 transition-all placeholder:text-white/20 text-white font-sans focus:outline-none" 
              id="form_message" 
              placeholder="TELL US ABOUT YOUR VISION" 
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          <div className="pt-8 text-center">
            <button 
              className="px-16 py-5 bg-primary text-on-primary font-sans text-xs uppercase tracking-[0.3em] hover:bg-white hover:text-background transition-all duration-500 font-semibold disabled:opacity-50 disabled:cursor-wait"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Recording Submission...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>

      {/* Live tracking list */}
      {inquiries.length > 0 && (
        <div className="max-w-4xl mx-auto py-8 border-t border-white/5 animate-fade-in">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-white">Licensing Desk Submissions Log</h4>
            </div>
            <button 
              onClick={handleClearInquiries}
              className="font-sans text-[10px] uppercase tracking-widest text-error/60 hover:text-error transition-colors"
            >
              Clear Logs
            </button>
          </div>

          <div className="space-y-4">
            {inquiries.map((inq) => (
              <div key={inq.id} className="p-6 bg-surface-container/40 border border-white/5 rounded flex flex-col md:flex-row justify-between gap-6 hover:bg-surface-container/60 transition-all">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-serif text-base text-white font-medium">{inq.name}</span>
                    <span className="text-[10px] font-mono py-1 px-2.5 bg-white/5 rounded-full text-primary uppercase tracking-wider">{inq.type}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant font-mono">{inq.email} &bull; Received {inq.timestamp}</p>
                  <p className="text-sm italic text-on-surface-variant/80 pt-1 font-serif">"{inq.message}"</p>
                </div>
                
                {/* Status Indicator */}
                <div className="flex items-center gap-4 self-start md:self-center">
                  <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-[#99907c]">STATUS:</span>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-primary font-semibold">
                      IN PIPELINE
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
