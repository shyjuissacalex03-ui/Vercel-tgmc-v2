import React from "react";
import { Link } from "../components/Router.tsx";
import { OptimizedImage } from "../components/OptimizedImage.tsx";
import { pastorInfo as defaultPastorInfo, churchInfo as defaultChurchInfo } from "../data/churchData.ts";
import { useContent } from "../firebase/contentContext.tsx";
import { Phone, Mail, ArrowRight, Quote, Heart, MapPin, Calendar } from "lucide-react";

export const PastorBioPage: React.FC = () => {
  const { content } = useContent();
  const pastorInfo = content.pastorInfo || defaultPastorInfo;
  const churchInfo = content.churchInfo || defaultChurchInfo;
  return (
    <div className="bg-white text-[#282f3b] min-h-screen">
      {/* Hero Header */}
      <section className="relative py-20 bg-[#1f2530] text-white text-center space-y-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold text-[#ecb029] uppercase tracking-wider bg-[#ecb029]/10 px-3.5 py-1 rounded-full border border-[#ecb029]/20">
            {pastorInfo.heroBadge || "Leadership & Ministry"}
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mt-2">
            {pastorInfo.heroTitle || "Pastor's Bio"}
          </h1>
          <p className="text-slate-300 text-base max-w-2xl mx-auto">
            {pastorInfo.heroSubtitle || `${pastorInfo.name} — Lead Pastor of The Great Mission Church, Uxbridge.`}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Pastor Portrait */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-2xl h-[500px] w-full group">
                <OptimizedImage
                  src={pastorInfo.image}
                  alt={pastorInfo.name}
                  fill={true}
                  priority={true}
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-black/60 backdrop-blur-md text-white border border-white/20">
                  <p className="font-bold text-base">{pastorInfo.name}</p>
                  <p className="text-xs text-[#ecb029]">{pastorInfo.role} · TGMC</p>
                </div>
              </div>
            </div>

            {/* Pastor Narrative & Contacts */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-bold text-[#478226] uppercase tracking-wider bg-[#478226]/10 px-3 py-1 rounded-full">
                  {pastorInfo.badge || "Lead Pastoral Leadership"}
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#282f3b] mt-3">
                  {pastorInfo.name}
                </h2>
                <p className="text-[#478226] font-bold text-sm mt-0.5">{pastorInfo.role}</p>
              </div>

              {pastorInfo.quote && (
                <blockquote className="p-5 rounded-xl bg-[#f0f3f9] border-l-4 border-[#478226] text-slate-700 italic text-sm">
                  <Quote className="w-6 h-6 text-[#478226]/40 mb-1" />
                  "{pastorInfo.quote}"
                </blockquote>
              )}

              <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
                <p>{pastorInfo.bio}</p>
                {pastorInfo.bioParagraph2 && <p>{pastorInfo.bioParagraph2}</p>}
                {pastorInfo.bioParagraph3 && <p>{pastorInfo.bioParagraph3}</p>}
              </div>

              {/* Contact Cards */}
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#f0f3f9] border border-slate-200 flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#478226] shrink-0" />
                  <div>
                    <p className="text-[11px] text-slate-500 font-semibold">Phone Contact</p>
                    <a
                      href={`tel:${pastorInfo.phone.replace(/\s+/g, "")}`}
                      className="text-xs font-bold text-[#282f3b] hover:text-[#478226] transition-colors"
                    >
                      {pastorInfo.phone}
                    </a>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#f0f3f9] border border-slate-200 flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#478226] shrink-0" />
                  <div>
                    <p className="text-[11px] text-slate-500 font-semibold">Email Address</p>
                    <a
                      href={`mailto:${pastorInfo.email}`}
                      className="text-xs font-bold text-[#282f3b] hover:text-[#478226] transition-colors"
                    >
                      {pastorInfo.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Service Invitation Banner */}
          <div className="p-8 rounded-2xl bg-[#1f2530] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#ecb029] text-xs font-bold uppercase tracking-wider">
                <Calendar className="w-4 h-4" />
                <span>Join Us This Sunday for Worship</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Sunday Worship Gathering</h3>
              <p className="text-slate-300 text-xs flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-[#ecb029]" />
                <span>10:00 AM - 1:00 PM at {churchInfo.address.fullAddress}</span>
              </p>
            </div>
            <Link
              href="/contact-us"
              className="px-6 py-3 rounded-lg bg-[#478226] hover:bg-[#39691e] text-white font-bold text-xs shrink-0 flex items-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              <span>Get In Touch</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PastorBioPage;
