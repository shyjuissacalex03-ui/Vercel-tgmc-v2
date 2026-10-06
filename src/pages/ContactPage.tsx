import React, { useState, useEffect } from "react";
import { churchInfo as defaultChurchInfo } from "../data/churchData.ts";
import { useContent } from "../firebase/contentContext.tsx";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "../components/SocialIcons.tsx";
import { useAuth } from "../firebase/authContext.tsx";
import {
  submitPrayerRequest,
  submitContactMessage,
} from "../firebase/firestoreService.ts";
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Send,
  Heart,
  CheckCircle2,
  ExternalLink,
  Loader2,
} from "lucide-react";

export const ContactPage: React.FC = () => {
  const { content } = useContent();
  const churchInfo = content.churchInfo || defaultChurchInfo;

  const [activeTab, setActiveTab] = useState<"contact" | "prayer">("contact");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || currentUser.displayName || "",
        email: prev.email || currentUser.email || "",
      }));
    }
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setSubmitting(true);
    try {
      if (activeTab === "prayer") {
        await submitPrayerRequest({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject || "Prayer Request",
          message: formData.message,
          isPrivate: true,
        });
      } else {
        await submitContactMessage({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject || "General Enquiry",
          message: formData.message,
        });
      }
      setSubmitted(true);
    } catch (err: any) {
      console.error("Firestore contact submission error:", err);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen">
      {/* Hero Header */}
      <section className="relative py-20 bg-slate-900 border-b border-slate-800 text-center space-y-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            We'd Love to Hear From You
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Contact The Great Mission Church
          </h1>
          <p className="text-slate-300 text-base max-w-2xl mx-auto">
            Find our location in Uxbridge, general enquiry contacts, and prayer request forms.
          </p>
        </div>
      </section>

      {/* 3 Contact Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Address */}
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Church Address</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{churchInfo.address.fullAddress}</p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=150%20York%20Rd%2C%20Uxbridge%2C%20Hillingdon%2C%20UB81QW"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:underline pt-2"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Card 2: General Enquiries */}
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">General Enquiries</h3>
              <div className="space-y-2 text-sm text-slate-300">
                <p>
                  Phone:{" "}
                  <a href={`tel:${churchInfo.contact.phone}`} className="font-semibold text-white hover:text-amber-400">
                    {churchInfo.contact.phone}
                  </a>
                </p>
                <p>
                  Email:{" "}
                  <a href={`mailto:${churchInfo.contact.email}`} className="font-semibold text-white hover:text-amber-400">
                    {churchInfo.contact.email}
                  </a>
                </p>
              </div>
            </div>

            {/* Card 3: Registered Charity */}
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Registered Charity</h3>
              <p className="text-sm text-slate-300">
                UK Charity Reg No.{" "}
                <strong className="text-amber-400 font-bold">{churchInfo.contact.charityNo}</strong>
              </p>
              <div className="pt-2 flex items-center gap-3">
                <a
                  href={churchInfo.contact.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-950 text-slate-300 hover:text-amber-400 border border-slate-800 transition-colors"
                  aria-label="Facebook"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>
                <a
                  href={churchInfo.contact.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-950 text-slate-300 hover:text-red-400 border border-slate-800 transition-colors"
                  aria-label="YouTube"
                >
                  <YoutubeIcon className="w-4 h-4" />
                </a>
                <a
                  href={churchInfo.contact.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-950 text-slate-300 hover:text-pink-400 border border-slate-800 transition-colors"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Form & Location Info */}
      <section className="py-20 bg-[#f0f3f9] text-[#282f3b] border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Info */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#478226] uppercase tracking-wider bg-[#478226]/10 px-3.5 py-1 rounded-full border border-[#478226]/20">
                  Contact us
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#282f3b] tracking-tight">
                  Join with The Great Mission Church
                </h2>
                <p className="text-[#478226] font-bold text-sm">
                  We will contact you as soon as possible
                </p>
              </div>

              <blockquote className="p-5 rounded-2xl bg-white border-l-4 border-[#478226] shadow-sm text-slate-700 italic text-sm">
                "Be transformed by the renewing of your mind." <br />
                <strong className="text-[#478226] font-bold not-italic">— Romans 12:2</strong>
              </blockquote>

              <p className="text-slate-600 text-sm leading-relaxed font-semibold">
                If you have any questions?
              </p>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md space-y-4">
                <h3 className="font-bold text-lg text-[#282f3b] border-b border-slate-200 pb-2">
                  Get In Touch
                </h3>
                <div className="space-y-3 text-xs text-slate-700">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#478226] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#282f3b]">Location:</strong>
                      <p>{churchInfo.address.fullAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[#478226] shrink-0" />
                    <div>
                      <strong className="text-[#282f3b]">Phone :</strong>{" "}
                      <a href={`tel:${churchInfo.contact.phone}`} className="text-[#478226] font-bold hover:underline">
                        {churchInfo.contact.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-[#478226] shrink-0" />
                    <div>
                      <strong className="text-[#282f3b]">Mail Us :</strong>{" "}
                      <a href={`mailto:${churchInfo.contact.email}`} className="text-[#478226] font-bold hover:underline">
                        {churchInfo.contact.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 pt-1">
                    <ShieldCheck className="w-4 h-4 text-[#478226] shrink-0" />
                    <div>
                      <strong className="text-[#282f3b]">Charity No. :</strong>{" "}
                      <span className="font-bold text-[#478226]">
                        {churchInfo.contact.charityNo}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Form */}
            <div className="lg:col-span-7">
              <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xl space-y-6">
                <div className="flex p-1 bg-[#f0f3f9] rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("contact");
                      setSubmitted(false);
                    }}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      activeTab === "contact"
                        ? "bg-[#478226] text-white shadow"
                        : "text-slate-600 hover:text-[#282f3b]"
                    }`}
                  >
                    <Mail className="w-4 h-4" />
                    <span>General Contact</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("prayer");
                      setSubmitted(false);
                    }}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      activeTab === "prayer"
                        ? "bg-[#478226] text-white shadow"
                        : "text-slate-600 hover:text-[#282f3b]"
                    }`}
                  >
                    <Heart className="w-4 h-4" />
                    <span>Prayer Request</span>
                  </button>
                </div>

                {submitted ? (
                  <div className="py-12 text-center space-y-4 animate-in fade-in duration-300">
                    <div className="w-16 h-16 rounded-full bg-[#478226]/20 text-[#478226] border border-[#478226]/40 flex items-center justify-center mx-auto shadow-lg">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-[#282f3b]">
                      Thank You for Reaching Out!
                    </h3>
                    <p className="text-slate-600 text-xs max-w-md mx-auto leading-relaxed">
                      {activeTab === "prayer"
                        ? "Your prayer request has been received by Pr. Begin Alex and our intercessory prayer team. We believe God answers prayer."
                        : "Your message has been submitted. We will contact you as soon as possible."}
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
                      }}
                      className="px-6 py-2.5 rounded-lg bg-[#282f3b] text-xs font-bold text-white shadow"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#282f3b] mb-1">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your name"
                          className="w-full px-4 py-3 rounded-xl bg-[#f0f3f9] border border-slate-300 text-[#282f3b] text-sm focus:outline-none focus:border-[#478226]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#282f3b] mb-1">
                          Your Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="Your email"
                          className="w-full px-4 py-3 rounded-xl bg-[#f0f3f9] border border-slate-300 text-[#282f3b] text-sm focus:outline-none focus:border-[#478226]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#282f3b] mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+44 7846958451"
                          className="w-full px-4 py-3 rounded-xl bg-[#f0f3f9] border border-slate-300 text-[#282f3b] text-sm focus:outline-none focus:border-[#478226]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#282f3b] mb-1">
                          Subject
                        </label>
                        <input
                          type="text"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          placeholder={activeTab === "prayer" ? "Prayer Need / Title" : "Subject"}
                          className="w-full px-4 py-3 rounded-xl bg-[#f0f3f9] border border-slate-300 text-[#282f3b] text-sm focus:outline-none focus:border-[#478226]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#282f3b] mb-1">
                        {activeTab === "prayer" ? "Your Prayer Request *" : "Your Message *"}
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder={
                          activeTab === "prayer"
                            ? "Please share how we can pray with you..."
                            : "Your message"
                        }
                        className="w-full px-4 py-3 rounded-xl bg-[#f0f3f9] border border-slate-300 text-[#282f3b] text-sm focus:outline-none focus:border-[#478226] resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 rounded-xl bg-[#478226] hover:bg-[#39691e] disabled:opacity-60 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Saving to TGMC Database...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>{activeTab === "prayer" ? "Send Prayer Request" : "Send Message"}</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps Location Embed */}
      <section className="h-[450px] w-full bg-slate-900 border-t border-slate-800 relative">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2481.5644158482084!2d-0.47278272337624194!3d51.54228960769399!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48766e4a2829283f%3A0xc3910cbe445c7117!2s150%20York%20Rd%2C%20Uxbridge%20UB8%201QW!5e0!3m2!1sen!2suk!4v1700000000000!5m2!1sen!2suk"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="TGMC Location Map"
          className="w-full h-full grayscale contrast-125 opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
        />
      </section>
    </div>
  );
};

export default ContactPage;
