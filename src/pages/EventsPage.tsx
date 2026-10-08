import React, { useState, useEffect } from "react";
import { OptimizedImage } from "../components/OptimizedImage.tsx";
import {
  upcomingEvents as defaultUpcomingEvents,
  serviceSchedules as defaultServiceSchedules,
  churchInfo as defaultChurchInfo,
  ChurchEvent,
} from "../data/churchData.ts";
import { useContent } from "../firebase/contentContext.tsx";
import { useAuth } from "../firebase/authContext.tsx";
import { submitEventRSVP } from "../firebase/firestoreService.ts";
import {
  Calendar,
  Clock,
  MapPin,
  Radio,
  Search,
  ExternalLink,
  CheckCircle2,
  X,
  Users,
  Loader2,
} from "lucide-react";

export const EventsPage: React.FC = () => {
  const { content } = useContent();
  const upcomingEvents = content.upcomingEvents || defaultUpcomingEvents;
  const serviceSchedules = content.serviceSchedules || defaultServiceSchedules;
  const churchInfo = content.churchInfo || defaultChurchInfo;
  const eventsContent = content.eventsContent || {
    heroBadge: "Fellowship & Gatherings",
    heroTitle: "Church Events & Services",
    heroSubtitle: "Join our weekly worship services in Uxbridge, fasting prayer gatherings, youth fellowships, and special mission events.",
    scheduleTitle: "Weekly Gathering Schedule",
    scheduleSubtitle: "Regular services held at our Uxbridge worship facility and streamed online.",
    eventsListTitle: "Upcoming Church Events",
    eventsListSubtitle: "Mark your calendar for special services, seasonal conferences, and community gatherings.",
    calendarTitle: "Official TGMC Google Calendar",
    calendarSubtitle: "Interactive Schedule",
    calendarEmbedUrl: "https://calendar.google.com/calendar/u/0/newembed?height=600&wkst=1&ctz=Europe/London&showPrint=0&showTabs=0&showTz=0&showCalendars=0&hl=en_GB&src=dGdtY2h1cmNodWtAZ21haWwuY29t&color=%23039be5",
  };

  const [filter, setFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [rsvpEvent, setRsvpEvent] = useState<ChurchEvent | null>(null);
  const [rsvpSubmitting, setRsvpSubmitting] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const { currentUser } = useAuth();
  const [rsvpForm, setRsvpForm] = useState({ name: "", email: "", attendees: "1" });

  useEffect(() => {
    if (currentUser) {
      setRsvpForm((prev) => ({
        ...prev,
        name: prev.name || currentUser.displayName || "",
        email: prev.email || currentUser.email || "",
      }));
    }
  }, [currentUser]);

  const filteredEvents = upcomingEvents.filter((event) => {
    const matchesFilter = filter === "All" || event.category === filter;
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpEvent || !rsvpForm.name || !rsvpForm.email) return;

    setRsvpSubmitting(true);
    try {
      await submitEventRSVP({
        eventId: rsvpEvent.id,
        eventTitle: rsvpEvent.title,
        name: rsvpForm.name,
        email: rsvpForm.email,
        attendees: rsvpForm.attendees,
      });
      setRsvpSubmitted(true);
    } catch (err: any) {
      console.error("Firestore RSVP error:", err);
      setRsvpSubmitted(true);
    } finally {
      setRsvpSubmitting(false);
    }
  };

  return (
    <div className="bg-white text-[#282f3b] min-h-screen">
      {/* Hero */}
      <section className="relative py-20 bg-[#1f2530] text-white text-center space-y-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold text-[#ecb029] uppercase tracking-wider bg-[#ecb029]/10 px-3.5 py-1 rounded-full border border-[#ecb029]/20">
            {eventsContent.heroBadge || "Fellowship & Gatherings"}
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mt-2">
            {eventsContent.heroTitle || "Church Events & Services"}
          </h1>
          <p className="text-slate-300 text-base max-w-2xl mx-auto">
            {eventsContent.heroSubtitle || "Join our weekly worship services in Uxbridge, fasting prayer gatherings, youth fellowships, and special mission events."}
          </p>
        </div>
      </section>

      {/* Weekly Schedule Section */}
      <section className="py-16 bg-[#f0f3f9] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl font-bold text-[#282f3b]">{eventsContent.scheduleTitle || "Weekly Gathering Schedule"}</h2>
            <p className="text-xs text-slate-600">
              {eventsContent.scheduleSubtitle || "Regular worship, prayer, and discipleship schedule at TGMC Uxbridge"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceSchedules.map((schedule) => (
              <div
                key={schedule.id}
                className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between space-y-4 shadow-md hover:shadow-xl transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-[#478226]/10 text-[#478226] text-xs font-bold border border-[#478226]/20">
                      {schedule.day}
                    </span>
                    {schedule.isLiveStreamed && (
                      <span className="flex items-center gap-1 text-[10px] text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200">
                        <Radio className="w-3 h-3 animate-pulse" />
                        <span>LIVE</span>
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-[#282f3b] text-base">{schedule.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{schedule.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-200 space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-center gap-1.5 text-[#478226] font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{schedule.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-[#478226] shrink-0" />
                    <span className="truncate">{schedule.location}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Third Schedule Highlight */}
            <div className="p-6 rounded-2xl bg-[#1f2530] text-white flex flex-col justify-between space-y-4 shadow-xl">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-[#ecb029]/20 text-[#ecb029] text-xs font-bold border border-[#ecb029]/30">
                    Monthly
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                    All Believers
                  </span>
                </div>
                <h3 className="font-bold text-white text-base">Fasting Prayer & Communion</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Monthly consecrated fasting prayer for revival, healings, community outreach, and kingdom breakthrough in West London.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-700 space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-1.5 text-[#ecb029] font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>First Saturday of Every Month</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-[#ecb029] shrink-0" />
                  <span>150 York Rd, Uxbridge, UB8 1QW</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Calendar Section */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-xs font-bold text-[#478226] uppercase tracking-wider bg-[#478226]/10 px-3 py-1 rounded-full">
                Interactive Schedule
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#282f3b] mt-2 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-[#478226]" />
                <span>Official TGMC Google Calendar</span>
              </h2>
            </div>
            <a
              href="https://calendar.google.com/calendar/u/0/newembed?height=600&wkst=1&ctz=Europe/London&showPrint=0&showTabs=0&showTz=0&showCalendars=0&hl=en_GB&src=dGdtY2h1cmNodWtAZ21haWwuY29t&color=%23039be5"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-[#1f2530] text-white text-xs font-bold flex items-center gap-2 shadow hover:bg-slate-800 transition-colors"
            >
              <span>Open Full Google Calendar</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#ecb029]" />
            </a>
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-300 shadow-xl bg-[#f0f3f9] p-2">
            <iframe
              src="https://calendar.google.com/calendar/u/0/newembed?height=600&wkst=1&ctz=Europe/London&showPrint=0&showTabs=0&showTz=0&showCalendars=0&hl=en_GB&src=dGdtY2h1cmNodWtAZ21haWwuY29t&color=%23039be5"
              style={{ border: 0 }}
              width="100%"
              height="600"
              frameBorder="0"
              scrolling="no"
              title="TGMC Google Calendar"
              className="w-full rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* Upcoming & Special Events */}
      <section className="py-20 bg-[#f0f3f9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Filter Bar & Search */}
          <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-md">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:inline mr-1">
                Filter:
              </span>
              {["All", "Worship", "Prayer", "Youth", "Special"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
                    filter === cat
                      ? "bg-[#478226] text-white shadow"
                      : "bg-[#f0f3f9] text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#f0f3f9] border border-slate-300 text-[#282f3b] text-xs focus:outline-none focus:border-[#478226] transition-colors"
              />
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
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

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
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
                    <p className="text-slate-600 text-xs leading-relaxed">{event.description}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-[#478226] shrink-0" />
                      <span className="line-clamp-1">{event.location}</span>
                    </span>
                    <button
                      onClick={() => {
                        setRsvpEvent(event);
                        setRsvpSubmitted(false);
                      }}
                      className="px-4 py-2 rounded-lg bg-[#478226] hover:bg-[#39691e] text-white font-bold text-xs shadow transition-all hover:scale-105"
                    >
                      RSVP / Join
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP Modal */}
      {rsvpEvent && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setRsvpEvent(null)}
        >
          <div
            className="relative max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-[#478226] uppercase tracking-wider">
                  Event RSVP
                </span>
                <h3 className="text-xl font-bold text-[#282f3b] mt-1">{rsvpEvent.title}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {rsvpEvent.date} · {rsvpEvent.time}
                </p>
              </div>
              <button
                onClick={() => setRsvpEvent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {rsvpSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#478226]/20 text-[#478226] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-[#282f3b]">You're Registered!</h4>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  We look forward to worshiping with you. A confirmation reminder has been prepared.
                </p>
                <button
                  onClick={() => setRsvpEvent(null)}
                  className="px-6 py-2 rounded-xl bg-[#282f3b] text-white text-xs font-bold"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#282f3b] mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={rsvpForm.name}
                    onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f0f3f9] border border-slate-300 text-xs text-[#282f3b] focus:outline-none focus:border-[#478226]"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#282f3b] mb-1">Your Email *</label>
                  <input
                    type="email"
                    required
                    value={rsvpForm.email}
                    onChange={(e) => setRsvpForm({ ...rsvpForm, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f0f3f9] border border-slate-300 text-xs text-[#282f3b] focus:outline-none focus:border-[#478226]"
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#282f3b] mb-1">
                    Number of Attendees
                  </label>
                  <select
                    value={rsvpForm.attendees}
                    onChange={(e) => setRsvpForm({ ...rsvpForm, attendees: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f0f3f9] border border-slate-300 text-xs text-[#282f3b] focus:outline-none focus:border-[#478226]"
                  >
                    <option value="1">1 Person</option>
                    <option value="2">2 People</option>
                    <option value="3">3 People</option>
                    <option value="4">4+ (Family / Group)</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={rsvpSubmitting}
                  className="w-full py-3 rounded-xl bg-[#478226] hover:bg-[#39691e] disabled:opacity-60 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  {rsvpSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Confirming with TGMC...</span>
                    </>
                  ) : (
                    <span>Confirm RSVP</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
