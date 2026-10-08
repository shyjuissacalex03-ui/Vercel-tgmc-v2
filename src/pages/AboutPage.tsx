import React from "react";
import { Link } from "../components/Router.tsx";
import { OptimizedImage } from "../components/OptimizedImage.tsx";
import {
  churchInfo as defaultChurchInfo,
  pastorInfo as defaultPastorInfo,
  defaultAboutContent,
} from "../data/churchData.ts";
import { useContent } from "../firebase/contentContext.tsx";
import { Compass, BookOpen, CheckCircle, ArrowRight, ShieldCheck } from "lucide-react";

export const AboutPage: React.FC = () => {
  const { content } = useContent();
  const churchInfo = content.churchInfo || defaultChurchInfo;
  const pastorInfo = content.pastorInfo || defaultPastorInfo;
  const about = content.aboutContent || defaultAboutContent;

  return (
    <div className="bg-slate-950 text-white min-h-screen">
      {/* Hero Header */}
      <section className="relative py-20 bg-slate-900 border-b border-slate-800 overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <OptimizedImage
            src={about.heroImage || "/images/event-worship-2.jpg"}
            alt="TGMC Fellowship"
            fill={true}
            className="object-cover"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            {about.heroBadge || "Who We Are"}
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            {about.heroTitle || "About The Great Mission Church"}
          </h1>
          <p className="text-slate-300 text-base max-w-2xl mx-auto">
            {about.heroSubtitle || "A Bible-believing, Spirit-filled, CHRIST-centred, and mission-driven church community located in Uxbridge, United Kingdom."}
          </p>
        </div>
      </section>

      {/* Main Content Sections */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {/* Identity & Heritage */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <h2 className="text-3xl font-bold text-white">{about.heritageTitle || "Our Identity & Heritage"}</h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                {about.heritageParagraph1 || "We are a Bible-believing, Spirit-filled, CHRIST-centred, and mission-driven church. We are passionate about living out the Gospel, walking in the power of the Holy Spirit, and reaching people from every background with the love and truth of JESUS CHRIST."}
              </p>
              <p className="text-slate-300 text-sm leading-relaxed">
                {about.heritageParagraph2 || "Based in Uxbridge (Hillingdon), we proudly serve believers and families across Watford, Harefield, Hillingdon, and the broader Greater London region with services conducted in English and Malayalam."}
              </p>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <p className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Registered UK Charity</span>
                </p>
                <p className="text-sm font-semibold text-white">
                  Charity No. {churchInfo.contact.charityNo}
                </p>
                <p className="text-xs text-slate-400">
                  {about.charityNote || "Serving the community with biblical integrity, transparency, and Christian compassion."}
                </p>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl h-80 sm:h-96">
                <OptimizedImage
                  src={about.heritageImage || "/images/event-worship-2.jpg"}
                  alt="TGMC Fellowship Hall"
                  fill={true}
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* Mission & Vision Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Our Mission */}
            <div className="p-8 rounded-3xl bg-slate-900 border border-amber-500/30 space-y-6 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{about.missionTitle || "Our Mission"}</h3>
                <p className="text-xs text-amber-400 font-medium mt-1">{about.missionVerse || "Matthew 28:18–20"}</p>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                {about.missionIntro || "We exist to bring people everywhere into a saving relationship with JESUS CHRIST. We do this through:"}
              </p>
              <ul className="space-y-3 text-sm text-slate-300">
                {(about.missionPoints || []).map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Our Vision */}
            <div className="p-8 rounded-3xl bg-slate-900 border border-indigo-500/30 space-y-6 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{about.visionTitle || "Our Vision"}</h3>
                <p className="text-xs text-indigo-400 font-medium mt-1">{about.visionVerse || "Habakkuk 2:14"}</p>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                {about.visionDescription || "To see a generation awakened to the glory of GOD, lives transformed by the Holy Spirit, and the Church equipped to impact the UK and beyond for eternity."}
              </p>
              {about.coreValues && about.coreValues.length > 0 && (
                <div className="pt-2 space-y-2">
                  <p className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Core Pillars</p>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {about.coreValues.slice(0, 4).map((val, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                        <span><strong>{val.title}:</strong> {val.description}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Pastoral Leadership Feature */}
          <div className="p-8 lg:p-12 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-4">
                <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg h-72 sm:h-80 relative">
                  <OptimizedImage
                    src={pastorInfo.image}
                    alt={pastorInfo.name}
                    fill={true}
                    className="object-cover object-top hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold">
                  Pastoral Leadership
                </div>
                <h3 className="text-3xl font-extrabold text-white">{pastorInfo.name}</h3>
                <p className="text-amber-400 font-semibold text-sm">{pastorInfo.role}</p>
                <p className="text-slate-300 text-sm leading-relaxed">{pastorInfo.bio}</p>
                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <Link
                    href="/pastor-bio"
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-2 shadow"
                  >
                    <span>Read Full Pastor Biography</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/contact-us"
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                  >
                    Contact Pr. Begin Alex
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Explore Links */}
          <div className="text-center p-12 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
            <h3 className="text-2xl font-bold text-white">Explore Our Beliefs & Service Times</h3>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Learn more about our 5 core doctrines in the Statement of Faith or join us this Sunday for divine worship in Uxbridge.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/statement-of-faith"
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow"
              >
                Statement of Faith
              </Link>
              <Link
                href="/events"
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition-colors"
              >
                Worship Schedule
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
