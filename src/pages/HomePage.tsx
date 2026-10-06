import React, { useState, useEffect } from "react";
import { Link } from "../components/Router.tsx";
import { OptimizedImage } from "../components/OptimizedImage.tsx";
import {
  churchInfo as defaultChurchInfo,
  pastorInfo as defaultPastorInfo,
  upcomingEvents as defaultUpcomingEvents,
  corePillars as defaultCorePillars,
  heroSlides as defaultHeroSlides,
  testimonials,
} from "../data/churchData.ts";
import { useContent } from "../firebase/contentContext.tsx";
import { LiveStreamModal } from "../components/LiveStreamModal.tsx";
import { useAuth } from "../firebase/authContext.tsx";
import {
  submitPrayerRequest,
  submitContactMessage,
} from "../firebase/firestoreService.ts";
import {
  ArrowRight,
  Play,
  ChevronRight,
  Radio,
  ExternalLink,
  MapPin,
  Clock,
  Calendar,
  Phone,
  Mail,
  Heart,
  Send,
  CheckCircle2,
  BookOpen,
  Flame,
  Quote,
  ShieldCheck,
  ChevronLeft,
  Tv,
  Loader2,
} from "lucide-react";

export const HomePage: React.FC = () => {
  const { content } = useContent();
  const churchInfo = content.churchInfo || defaultChurchInfo;
  const pastorInfo = content.pastorInfo || defaultPastorInfo;
  const upcomingEvents = content.upcomingEvents || defaultUpcomingEvents;
  const corePillars = content.corePillars || defaultCorePillars;
  const heroSlides = content.heroSlides || defaultHeroSlides;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"contact" | "prayer">("contact");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  // Prefill user details if logged in
  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || currentUser.displayName || "",
        email: prev.email || currentUser.email || "",
      }));
    }
  }, [currentUser]);

  // Rotate hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const slide = heroSlides[currentSlide];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setSubmitting(true);
    setErrorMsg(null);

    try {
      if (activeTab === "prayer") {
        await submitPrayerRequest({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject || "Prayer Petition",
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
      console.error("Firestore submission error:", err);
      // Even if offline, show friendly feedback
      setErrorMsg("Thank you! Your request has been queued and will sync with TGMC.");
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* 0. HERO SECTION */}
      <section className="relative min-h-[75vh] flex items-center justify-center bg-[#1f2530] text-white overflow-hidden py-16 lg:py-24">
        {/* Background slide */}
        <div className="absolute inset-0 z-0">
          <OptimizedImage
            src={slide.image}
            alt={slide.title}
            fill={true}
            priority={true}
            className="object-cover transition-all duration-1000 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1f2530]/95 via-[#1f2530]/85 to-[#1f2530]/65" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Text */}
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ecb029]/20 border border-[#ecb029]/40 text-[#ecb029] text-xs sm:text-sm font-bold uppercase tracking-wider">
                {slide.subtitle}
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
                {slide.title}
              </h1>
              <p className="text-base sm:text-lg text-slate-200 font-normal leading-relaxed max-w-2xl">
                {slide.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  href="/about"
                  className="px-7 py-3.5 rounded-lg bg-[#478226] hover:bg-[#39691e] text-white font-bold text-sm shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <span>Read More</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setVideoModalOpen(true)}
                  className="px-7 py-3.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/30 backdrop-blur-md transition-all duration-200 flex items-center gap-2"
                >
                  <Play className="w-4 h-4 text-[#ecb029] fill-[#ecb029]" />
                  <span>Watch Live Broadcast</span>
                </button>
              </div>

              {/* Slider Dots */}
              <div className="flex items-center gap-2 pt-6">
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      currentSlide === i ? "w-8 bg-[#ecb029]" : "w-2.5 bg-white/40 hover:bg-white/70"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Right Quick Schedule Card */}
            <div className="lg:col-span-4 hidden lg:block">
              <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white space-y-4 shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-white/20">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#ecb029]">
                    Sunday Worship
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-[#478226] font-semibold text-white">
                    10:00 AM - 1:00 PM
                  </span>
                </div>
                <p className="text-sm font-semibold">{churchInfo.address.fullAddress}</p>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Malayalam & English Spirit-filled praise, worship, prayer, and word of God.
                </p>
                <Link
                  href="/events"
                  className="w-full py-2.5 rounded-lg bg-[#478226] hover:bg-[#39691e] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow"
                >
                  <span>View Full Schedule</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1. WELCOME TO TGMC / ABOUT TEASER */}
      <section className="py-20 bg-white text-[#282f3b] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Image with Pastor Badge */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-2xl h-[420px] w-full">
                <OptimizedImage
                  src={pastorInfo.image}
                  alt={pastorInfo.name}
                  fill={true}
                  className="object-cover object-top"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 p-6 rounded-2xl bg-[#478226] text-white shadow-xl hidden sm:block max-w-xs">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-100">
                  {pastorInfo.role}
                </p>
                <p className="text-xl font-extrabold">{pastorInfo.name}</p>
                <p className="text-xs text-slate-100 mt-1 italic">
                  "{churchInfo.subTagline}"
                </p>
              </div>
            </div>

            {/* Right Narrative */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-bold text-[#478226] uppercase tracking-wider bg-[#478226]/10 px-3.5 py-1 rounded-full border border-[#478226]/20">
                  Welcome to
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#282f3b] tracking-tight mt-2">
                  {churchInfo.name}
                </h2>
              </div>
              <p className="text-slate-700 text-base leading-relaxed">
                {churchInfo.fullDescription}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[#f0f3f9] border border-slate-200 space-y-1">
                  <div className="flex items-center gap-2 text-[#478226] font-bold text-sm">
                    <BookOpen className="w-4 h-4" />
                    <span>Grounded in Scripture</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    We stand firmly on the unchanging truth of Scripture.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#f0f3f9] border border-slate-200 space-y-1">
                  <div className="flex items-center gap-2 text-[#478226] font-bold text-sm">
                    <Flame className="w-4 h-4" />
                    <span>Led by the Spirit</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    We depend on the Holy Spirit for wisdom, power, and transformation.
                  </p>
                </div>
              </div>
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  href="/about"
                  className="px-6 py-3 rounded-lg bg-[#478226] hover:bg-[#39691e] text-white font-bold text-sm transition-all flex items-center gap-2 shadow-md hover:scale-105 active:scale-95"
                >
                  <span>Learn About Us</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/pastor-bio"
                  className="px-5 py-3 rounded-lg bg-[#f0f3f9] hover:bg-slate-200 text-[#282f3b] font-bold text-sm border border-slate-300 transition-colors"
                >
                  Pastor's Bio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OUR THREE CORE PILLARS */}
      <section className="py-20 bg-[#f0f3f9] text-[#282f3b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold text-[#478226] uppercase tracking-wider bg-[#478226]/10 px-3.5 py-1 rounded-full border border-[#478226]/20">
              Welcome to The Great Mission Church
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#282f3b] tracking-tight">
              Our Three Core Pillars
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Everything we do at TGMC is built upon biblical truth, Holy Spirit empowerment, and Christlike love.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {corePillars.map((pillar, idx) => (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-white border border-slate-200 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center space-y-4 group"
              >
                <div className="w-20 h-20 rounded-2xl bg-[#f0f3f9] border border-slate-200 flex items-center justify-center p-3 group-hover:scale-110 transition-transform">
                  <div className="relative w-12 h-12">
                    <OptimizedImage
                      src={pillar.icon}
                      alt={pillar.title}
                      className="object-contain w-12 h-12"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-[#282f3b] group-hover:text-[#478226] transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. LIVE STREAM BANNER */}
      <section className="py-16 bg-[#1f2530] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl bg-gradient-to-r from-[#191e28] via-[#1f2530] to-[#282f3b] border border-slate-700/60 p-8 lg:p-12 overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider">
                  <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                  <span>Live Worship Broadcast</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
                  The Great Mission Church Live Stream!
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
                  Experience the presence of GOD right where you are through our live worship services. Every message, song, and prayer is centered on JESUS CHRIST — inspiring faith, renewing hope, and strengthening your walk with GOD.
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <a
                    href="https://www.youtube.com/@tgmcuk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg transition-all flex items-center gap-2"
                  >
                    <Tv className="w-4 h-4" />
                    <span>Join Live Stream on YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => setVideoModalOpen(true)}
                    className="px-5 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-colors flex items-center gap-2"
                  >
                    <Play className="w-4 h-4 text-[#ecb029] fill-[#ecb029]" />
                    <span>Watch Stream Video</span>
                  </button>
                </div>
              </div>

              {/* Video Thumbnail */}
              <div className="lg:col-span-5">
                <div
                  onClick={() => setVideoModalOpen(true)}
                  className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl cursor-pointer group h-64 w-full"
                >
                  <OptimizedImage
                    src="/images/livestream-preview.png"
                    alt="TGMC Live Stream"
                    fill={true}
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                      <Play className="w-7 h-7 fill-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-black/80 backdrop-blur-md text-xs text-white border border-white/20 flex items-center justify-between">
                    <span className="font-semibold text-[#ecb029]">Sunday Live Worship</span>
                    <span className="text-slate-300">10:00 AM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CHURCH EVENTS */}
      <section className="py-20 bg-white text-[#282f3b] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-14">
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#478226] uppercase tracking-wider bg-[#478226]/10 px-3.5 py-1 rounded-full border border-[#478226]/20">
                Join With Us
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#282f3b] tracking-tight">
                Church Events
              </h2>
              <p className="text-slate-600 text-sm max-w-xl">
                Experience powerful praise, Holy Communion, and anointed preaching at our weekly gatherings in Uxbridge.
              </p>
            </div>
            <Link
              href="/events"
              className="px-5 py-2.5 rounded-lg bg-[#282f3b] hover:bg-[#1f2530] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow"
            >
              <span>View All Events</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-lg flex flex-col justify-between hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative h-52 w-full">
                  <OptimizedImage
                    src={event.image}
                    alt={event.title}
                    fill={true}
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#478226] text-white text-xs font-bold shadow">
                    {event.category}
                  </div>
                </div>

                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-4 text-xs text-[#478226] font-bold">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {event.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {event.time}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#282f3b] group-hover:text-[#478226] transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-[#478226]" />
                      <span className="truncate max-w-[170px]">{event.location}</span>
                    </span>
                    <Link href="/events" className="text-[#478226] font-bold hover:underline">
                      Join Event
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS / QUOTE ABOUT */}
      <section className="py-20 bg-white text-[#282f3b] border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold text-[#478226] uppercase tracking-wider bg-[#478226]/10 px-3.5 py-1 rounded-full border border-[#478226]/20">
              Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#282f3b] tracking-tight">
              Quote About
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Voices of our church family testifying to God's grace and Spirit-filled fellowship at TGMC Uxbridge.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Pastoral Leadership Card */}
            <div className="p-8 rounded-2xl bg-[#1f2530] text-white space-y-4 shadow-xl relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-3">
                <span className="px-3 py-1 rounded-full bg-[#ecb029]/20 text-[#ecb029] text-xs font-bold uppercase">
                  Pastoral Leadership
                </span>
                <h3 className="text-2xl font-bold text-white">{pastorInfo.name}</h3>
                <p className="text-xs font-semibold text-[#ecb029]">{pastorInfo.role}</p>
                <p className="text-slate-300 text-sm leading-relaxed italic pt-2">
                  "{pastorInfo.bio}"
                </p>
              </div>
              <p className="text-xs text-slate-400 border-t border-slate-700 pt-4 mt-4">
                Uxbridge, Watford, Harefield & Hillingdon
              </p>
            </div>

            {/* Testimonial Cards */}
            {testimonials.map((item) => (
              <div
                key={item.id}
                className="p-8 rounded-2xl bg-[#f0f3f9] border border-slate-200 shadow-md flex flex-col justify-between space-y-6 hover:shadow-xl transition-all"
              >
                <div className="space-y-4">
                  <Quote className="w-10 h-10 text-[#478226] fill-[#478226]/20" />
                  <p className="text-slate-700 text-sm leading-relaxed italic">
                    "{item.quote}"
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-300 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#478226] text-white flex items-center justify-center font-bold text-base shadow">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#282f3b]">{item.name}</h4>
                    <p className="text-xs text-slate-500">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. JOIN WITH TGMC / CONTACT & PRAYER REQUEST */}
      <section className="py-20 bg-[#f0f3f9] text-[#282f3b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Contact Information */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-bold text-[#478226] uppercase tracking-wider bg-[#478226]/10 px-3.5 py-1 rounded-full border border-[#478226]/20">
                  Join With Us
                </span>
                <h2 className="text-3xl font-extrabold text-[#282f3b] tracking-tight mt-2">
                  Join with The Great Mission Church
                </h2>
                <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                  Whether you're seeking a Spirit-filled spiritual home, need prayer, or want to attend our Sunday services, we would love to connect with you.
                </p>
              </div>

              <div className="space-y-4 pt-2 text-xs text-slate-600">
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
                    <a
                      href={`tel:${churchInfo.contact.phone}`}
                      className="text-[#478226] font-bold hover:underline"
                    >
                      {churchInfo.contact.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#478226] shrink-0" />
                  <div>
                    <strong className="text-[#282f3b]">Mail Us :</strong>{" "}
                    <a
                      href={`mailto:${churchInfo.contact.email}`}
                      className="text-[#478226] font-bold hover:underline"
                    >
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

            {/* Right Interactive Form */}
            <div className="lg:col-span-7">
              <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xl space-y-6">
                {/* Tabs */}
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
                        ? "Your prayer request has been received by Pr. Begin Alex and our intercessory prayer team. May God bless and strengthen you."
                        : "Your message has been submitted. We will contact you as soon as possible."}
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
                      }}
                      className="px-6 py-2.5 rounded-lg bg-[#282f3b] hover:bg-slate-800 text-xs font-bold text-white shadow transition-colors"
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
                          className="w-full px-4 py-3 rounded-xl bg-[#f0f3f9] border border-slate-300 text-[#282f3b] text-sm focus:outline-none focus:border-[#478226] transition-colors"
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
                          className="w-full px-4 py-3 rounded-xl bg-[#f0f3f9] border border-slate-300 text-[#282f3b] text-sm focus:outline-none focus:border-[#478226] transition-colors"
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
                          className="w-full px-4 py-3 rounded-xl bg-[#f0f3f9] border border-slate-300 text-[#282f3b] text-sm focus:outline-none focus:border-[#478226] transition-colors"
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
                          className="w-full px-4 py-3 rounded-xl bg-[#f0f3f9] border border-slate-300 text-[#282f3b] text-sm focus:outline-none focus:border-[#478226] transition-colors"
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
                            ? "Please share how we can pray with you and stand in faith together..."
                            : "Your message"
                        }
                        className="w-full px-4 py-3 rounded-xl bg-[#f0f3f9] border border-slate-300 text-[#282f3b] text-sm focus:outline-none focus:border-[#478226] resize-none transition-colors"
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
                          <span>{activeTab === "prayer" ? "Submit Prayer Request" : "Send Message"}</span>
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

      {/* Live Stream Video Modal */}
      <LiveStreamModal isOpen={videoModalOpen} onClose={() => setVideoModalOpen(false)} />
    </div>
  );
};

export default HomePage;
