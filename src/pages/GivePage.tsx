import React, { useState } from "react";
import { Link } from "../components/Router.tsx";
import { churchInfo as defaultChurchInfo } from "../data/churchData.ts";
import { useContent } from "../firebase/contentContext.tsx";
import {
  Heart,
  Landmark,
  ShieldCheck,
  Gift,
  Copy,
  Check,
  Phone,
  Mail,
  ArrowRight,
} from "lucide-react";

export const GivePage: React.FC = () => {
  const { content } = useContent();
  const churchInfo = content.churchInfo || defaultChurchInfo;
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen">
      {/* Hero Header */}
      <section className="relative py-20 bg-slate-900 border-b border-slate-800 text-center space-y-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold uppercase tracking-wider">
            Generous Giving & Stewardship
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Support The Great Mission Church
          </h1>
          <p className="text-slate-300 text-base max-w-2xl mx-auto">
            Your generous offerings and tithes enable us to preach the Gospel, support local outreach in Uxbridge, and impact lives for eternity.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Scripture Quote */}
          <blockquote className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3 shadow-xl">
            <Heart className="w-10 h-10 text-rose-500 fill-rose-500/20 mx-auto" />
            <p className="text-lg sm:text-xl font-bold text-white italic max-w-2xl mx-auto">
              "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."
            </p>
            <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              2 Corinthians 9:7
            </p>
          </blockquote>

          {/* Bank Transfer Details Box */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/60 border border-amber-500/30 shadow-2xl space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-800">
              <div>
                <div className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <Landmark className="w-4 h-4" /> Direct Bank Transfer
                </div>
                <h2 className="text-2xl font-bold text-white">TGMC UK Bank Account</h2>
              </div>
              <div className="px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Charity No. {churchInfo.contact.charityNo}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Account Name */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 relative group">
                <p className="text-xs text-slate-400 font-medium">Account Name</p>
                <p className="text-sm font-bold text-white">The Great Mission Church</p>
                <button
                  onClick={() => handleCopy("The Great Mission Church", "name")}
                  className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 font-semibold pt-1"
                >
                  {copied === "name" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Name</span>
                    </>
                  )}
                </button>
              </div>

              {/* Sort Code */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <p className="text-xs text-slate-400 font-medium">Sort Code</p>
                <p className="text-sm font-bold text-amber-300 font-mono">Contact TGMC Office</p>
                <a
                  href={`tel:${churchInfo.contact.phone}`}
                  className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-white pt-1"
                >
                  <Phone className="w-3 h-3 text-[#ecb029]" />
                  <span>{churchInfo.contact.phone}</span>
                </a>
              </div>

              {/* Account Number */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <p className="text-xs text-slate-400 font-medium">Account Number</p>
                <p className="text-sm font-bold text-amber-300 font-mono">Contact TGMC Office</p>
                <a
                  href={`mailto:${churchInfo.contact.email}`}
                  className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-white pt-1"
                >
                  <Mail className="w-3 h-3 text-[#ecb029]" />
                  <span>{churchInfo.contact.email}</span>
                </a>
              </div>
            </div>

            {/* Bank Reference Instructions */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-1">
              <p className="font-semibold text-white">Bank Reference Instructions:</p>
              <p>
                Please use <strong className="text-amber-400">"Tithe"</strong>,{" "}
                <strong className="text-amber-400">"Offering"</strong>, or{" "}
                <strong className="text-amber-400">"Mission"</strong> as your payment reference so our treasury team can allocate your gift accurately.
              </p>
            </div>
          </div>

          {/* UK Gift Aid */}
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">UK Gift Aid Declaration</h3>
                <p className="text-xs text-slate-400">
                  Boost your donation by 25p for every £1 you give at no extra cost to you.
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              If you are a UK taxpayer, The Great Mission Church can claim Gift Aid on your offerings. Please contact our treasurer or complete a Gift Aid declaration form at our Sunday service in Uxbridge.
            </p>
            <div className="pt-2">
              <Link
                href="/contact-us"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-colors"
              >
                <span>Request Gift Aid Declaration Form</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GivePage;
