import React, { useState, useEffect } from "react";
import { OptimizedImage } from "../components/OptimizedImage.tsx";
import {
  upcomingEvents as defaultUpcomingEvents,
  serviceSchedules as defaultServiceSchedules,
  churchInfo as defaultChurchInfo,
  ChurchEvent,
  ServiceSchedule,
  EventsPageContent,
} from "../data/churchData.ts";
import { useContent } from "../firebase/contentContext.tsx";
import { useAuth } from "../firebase/authContext.tsx";
import { submitEventRSVP } from "../firebase/firestoreService.ts";
import { uploadChurchAsset } from "../firebase/storageService.ts";
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
  Edit3,
  Plus,
  Trash2,
  Save,
  Upload,
  Sparkles,
  ShieldAlert,
} from "lucide-react";

export const EventsPage: React.FC = () => {
  const { content, saveContent } = useContent();
  const { currentUser, isAdmin } = useAuth();

  const upcomingEvents = content.upcomingEvents || defaultUpcomingEvents;
  const serviceSchedules = content.serviceSchedules || defaultServiceSchedules;
  const churchInfo = content.churchInfo || defaultChurchInfo;
  const eventsContent = content.eventsContent || {
    heroBadge: "Fellowship & Gatherings",
    heroTitle: "Church Events & Services",
    heroSubtitle:
      "Join our weekly worship services in Uxbridge, fasting prayer gatherings, youth fellowships, and special mission events.",
    scheduleTitle: "Weekly Gathering Schedule",
    scheduleSubtitle:
      "Regular services held at our Uxbridge worship facility and streamed online.",
    eventsListTitle: "Upcoming Church Events",
    eventsListSubtitle:
      "Mark your calendar for special services, seasonal conferences, and community gatherings.",
    calendarTitle: "Official TGMC Google Calendar",
    calendarSubtitle: "Interactive Schedule",
    calendarEmbedUrl:
      "https://calendar.google.com/calendar/u/0/newembed?height=600&wkst=1&ctz=Europe/London&showPrint=0&showTabs=0&showTz=0&showCalendars=0&hl=en_GB&src=dGdtY2h1cmNodWtAZ21haWwuY29t&color=%23039be5",
  };

  const [filter, setFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [rsvpEvent, setRsvpEvent] = useState<ChurchEvent | null>(null);
  const [rsvpSubmitting, setRsvpSubmitting] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [rsvpForm, setRsvpForm] = useState({ name: "", email: "", attendees: "1" });

  // Direct editing states (Admin only)
  const [editingSchedule, setEditingSchedule] = useState<ServiceSchedule | null>(null);
  const [editingEvent, setEditingEvent] = useState<ChurchEvent | null>(null);
  const [editingHero, setEditingHero] = useState(false);
  const [heroForm, setHeroForm] = useState<EventsPageContent>(eventsContent);
  const [editingCalendar, setEditingCalendar] = useState(false);
  const [calendarForm, setCalendarForm] = useState({
    calendarTitle: eventsContent.calendarTitle || "",
    calendarSubtitle: eventsContent.calendarSubtitle || "",
    calendarEmbedUrl: eventsContent.calendarEmbedUrl || "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      setRsvpForm((prev) => ({
        ...prev,
        name: prev.name || currentUser.displayName || "",
        email: prev.email || currentUser.email || "",
      }));
    }
  }, [currentUser]);

  useEffect(() => {
    if (eventsContent) {
      setHeroForm(eventsContent);
      setCalendarForm({
        calendarTitle: eventsContent.calendarTitle || "",
        calendarSubtitle: eventsContent.calendarSubtitle || "",
        calendarEmbedUrl: eventsContent.calendarEmbedUrl || "",
      });
    }
  }, [eventsContent]);

  const showSuccessFeedback = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(null), 3500);
  };

  // Open the full CMS modal tab
  const openFullCmsEvents = () => {
    window.dispatchEvent(
      new CustomEvent("open-cms-editor", { detail: { tab: "events" } })
    );
  };

  // Save Schedule Item (including the 3rd box: Fasting Prayer & Communion)
  const handleSaveScheduleItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSchedule || !isAdmin) return;

    setIsSaving(true);
    try {
      const exists = serviceSchedules.some((s) => s.id === editingSchedule.id);
      let updatedSchedules: ServiceSchedule[];

      if (exists) {
        updatedSchedules = serviceSchedules.map((s) =>
          s.id === editingSchedule.id ? editingSchedule : s
        );
      } else {
        updatedSchedules = [...serviceSchedules, editingSchedule];
      }

      await saveContent({ serviceSchedules: updatedSchedules });
      setEditingSchedule(null);
      showSuccessFeedback(`Saved "${editingSchedule.title}" successfully!`);
    } catch (err: any) {
      alert("Error saving schedule: " + (err?.message || "Unknown error"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteScheduleItem = async (id: string, title: string) => {
    if (!isAdmin) return;
    if (!confirm(`Are you sure you want to remove "${title}" from weekly gatherings?`)) return;

    setIsSaving(true);
    try {
      const updated = serviceSchedules.filter((s) => s.id !== id);
      await saveContent({ serviceSchedules: updated });
      showSuccessFeedback(`Removed "${title}".`);
    } catch (err: any) {
      alert("Error deleting schedule: " + (err?.message || "Unknown error"));
    } finally {
      setIsSaving(false);
    }
  };

  // Save Hero & Headings
  const handleSaveHeroForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;

    setIsSaving(true);
    try {
      await saveContent({
        eventsContent: {
          ...eventsContent,
          ...heroForm,
        },
      });
      setEditingHero(false);
      showSuccessFeedback("Saved events page headings successfully!");
    } catch (err: any) {
      alert("Error saving: " + (err?.message || "Unknown error"));
    } finally {
      setIsSaving(false);
    }
  };

  // Save Calendar
  const handleSaveCalendar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;

    setIsSaving(true);
    try {
      await saveContent({
        eventsContent: {
          ...eventsContent,
          ...calendarForm,
        },
      });
      setEditingCalendar(false);
      showSuccessFeedback("Saved Google Calendar settings successfully!");
    } catch (err: any) {
      alert("Error saving calendar settings: " + (err?.message || "Unknown error"));
    } finally {
      setIsSaving(false);
    }
  };

  // Save Upcoming Event
  const handleSaveEventItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent || !isAdmin) return;

    setIsSaving(true);
    try {
      const exists = upcomingEvents.some((ev) => ev.id === editingEvent.id);
      let updatedEvents: ChurchEvent[];

      if (exists) {
        updatedEvents = upcomingEvents.map((ev) =>
          ev.id === editingEvent.id ? editingEvent : ev
        );
      } else {
        updatedEvents = [editingEvent, ...upcomingEvents];
      }

      await saveContent({ upcomingEvents: updatedEvents });
      setEditingEvent(null);
      showSuccessFeedback(`Saved event "${editingEvent.title}"!`);
    } catch (err: any) {
      alert("Error saving event: " + (err?.message || "Unknown error"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteEventItem = async (id: string, title: string) => {
    if (!isAdmin) return;
    if (!confirm(`Are you sure you want to delete event "${title}"?`)) return;

    setIsSaving(true);
    try {
      const updated = upcomingEvents.filter((ev) => ev.id !== id);
      await saveContent({ upcomingEvents: updated });
      showSuccessFeedback(`Deleted event "${title}".`);
    } catch (err: any) {
      alert("Error deleting event: " + (err?.message || "Unknown error"));
    } finally {
      setIsSaving(false);
    }
  };

  // Upload event image to Firebase Storage
  const handleEventImageUpload = async (file: File) => {
    if (!editingEvent || !isAdmin) return;
    setUploadingImage(true);
    try {
      const url = await uploadChurchAsset(file, "event_posters");
      setEditingEvent({
        ...editingEvent,
        image: url,
      });
    } catch (err: any) {
      alert("Image upload failed: " + (err?.message || "Storage permission denied"));
    } finally {
      setUploadingImage(false);
    }
  };

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
      {/* Toast Feedback for Admin */}
      {actionSuccessMsg && (
        <div className="fixed top-20 right-6 z-50 bg-[#478226] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 border border-emerald-400">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <span className="text-xs font-bold">{actionSuccessMsg}</span>
        </div>
      )}

      {/* Admin Quick Action Banner - Admin Only */}
      {isAdmin && (
        <div className="bg-[#19202c] border-b border-slate-700/80 px-4 py-3 sticky top-16 z-30 shadow-md">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ecb029] animate-pulse" />
              <span className="font-bold text-[#ecb029]">Administrator CMS Active:</span>
              <span className="hidden md:inline text-slate-300">
                All boxes (including Fasting Prayer & Communion), headings, calendar, and events are fully editable.
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setEditingHero(true)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center gap-1.5 border border-slate-600 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#ecb029]" />
                <span>Edit Hero</span>
              </button>
              <button
                onClick={() => {
                  const newSched: ServiceSchedule = {
                    id: `sched-${Date.now()}`,
                    day: "Every Saturday",
                    time: "6:30 PM - 8:30 PM",
                    title: "Special Gathering",
                    language: "All Believers",
                    description: "Weekly fellowship, intercession, and fellowship.",
                    location: "150 York Rd, Uxbridge, UB8 1QW",
                    isLiveStreamed: false,
                  };
                  setEditingSchedule(newSched);
                }}
                className="px-3 py-1.5 rounded-lg bg-[#478226] hover:bg-[#39691e] text-white font-bold flex items-center gap-1.5 shadow transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Gathering Box</span>
              </button>
              <button
                onClick={() => {
                  const newEv: ChurchEvent = {
                    id: `ev-${Date.now()}`,
                    title: "New TGMC Gathering",
                    date: "Upcoming Weekend",
                    time: "10:00 AM - 1:00 PM",
                    location: "150 York Rd, Uxbridge, UB8 1QW",
                    category: "Worship",
                    description: "Join us in the presence of God for fellowship and word.",
                    image: "/images/event-worship-1.jpg",
                    featured: true,
                  };
                  setEditingEvent(newEv);
                }}
                className="px-3 py-1.5 rounded-lg bg-[#478226] hover:bg-[#39691e] text-white font-bold flex items-center gap-1.5 shadow transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Event</span>
              </button>
              <button
                onClick={openFullCmsEvents}
                className="px-3 py-1.5 rounded-lg bg-[#ecb029] hover:bg-[#d99f20] text-slate-900 font-extrabold flex items-center gap-1.5 shadow transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Full CMS</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="relative py-20 bg-[#1f2530] text-white text-center space-y-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {isAdmin && (
            <button
              onClick={() => setEditingHero(true)}
              className="absolute top-0 right-4 px-3 py-1.5 rounded-full bg-[#ecb029] hover:bg-[#d99f20] text-slate-900 text-xs font-bold flex items-center gap-1.5 shadow"
              title="Edit Hero & Headings"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Hero</span>
            </button>
          )}

          <span className="text-xs font-bold text-[#ecb029] uppercase tracking-wider bg-[#ecb029]/10 px-3.5 py-1 rounded-full border border-[#ecb029]/20">
            {eventsContent.heroBadge || "Fellowship & Gatherings"}
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mt-2">
            {eventsContent.heroTitle || "Church Events & Services"}
          </h1>
          <p className="text-slate-300 text-base max-w-2xl mx-auto">
            {eventsContent.heroSubtitle ||
              "Join our weekly worship services in Uxbridge, fasting prayer gatherings, youth fellowships, and special mission events."}
          </p>
        </div>
      </section>

      {/* Weekly Schedule Section */}
      <section className="py-16 bg-[#f0f3f9] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2 relative">
            <h2 className="text-2xl font-bold text-[#282f3b]">
              {eventsContent.scheduleTitle || "Weekly Gathering Schedule"}
            </h2>
            <p className="text-xs text-slate-600">
              {eventsContent.scheduleSubtitle ||
                "Regular worship, prayer, and discipleship schedule at TGMC Uxbridge"}
            </p>

            {isAdmin && (
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => {
                    const newSched: ServiceSchedule = {
                      id: `sched-${Date.now()}`,
                      day: "First Saturday of Every Month",
                      time: "4:00 PM - 6:00 PM",
                      title: "Sunday Services",
                      language: "All Believers",
                      description:
                        "Monthly consecrated fasting prayer for revival, healings, community outreach, and kingdom breakthrough in West London.",
                      location: "150 York Rd, Uxbridge, UB8 1QW",
                      isLiveStreamed: false,
                    };
                    setEditingSchedule(newSched);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#478226] hover:bg-[#39691e] text-white text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Schedule Box</span>
                </button>
                <button
                  onClick={openFullCmsEvents}
                  className="px-3.5 py-1.5 rounded-xl bg-[#1f2530] hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow border border-slate-700"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#ecb029]" />
                  <span>Edit in CMS</span>
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceSchedules.map((schedule, idx) => {
              const isDarkHighlight =
                idx === 2 ||
                schedule.id === "fasting-prayer-communion" ||
                schedule.title.toLowerCase().includes("fasting");

              return isDarkHighlight ? (
                <div
                  key={schedule.id || idx}
                  className="p-6 rounded-2xl bg-[#1f2530] text-white flex flex-col justify-between space-y-4 shadow-xl hover:shadow-2xl transition-all relative border border-slate-700/60"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-[#ecb029]/20 text-[#ecb029] text-xs font-bold border border-[#ecb029]/30">
                        {schedule.day}
                      </span>
                      {schedule.isLiveStreamed ? (
                        <span className="flex items-center gap-1 text-[10px] text-red-400 font-bold bg-red-950/60 px-2 py-0.5 rounded border border-red-500/30">
                          <Radio className="w-3 h-3 animate-pulse" />
                          <span>LIVE</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                          {schedule.language || "All Believers"}
                        </span>
                      )}
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-white text-base">{schedule.title}</h3>
                      {idx === 2 && (
                        <span className="text-[10px] font-bold bg-[#ecb029] text-slate-900 px-2 py-0.5 rounded-full shrink-0">
                          Box 3
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {schedule.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-700">
                    <div className="space-y-1.5 text-xs text-slate-300">
                      <div className="flex items-center gap-1.5 text-[#ecb029] font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{schedule.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-[#ecb029] shrink-0" />
                        <span>{schedule.location}</span>
                      </div>
                    </div>

                    {/* Admin Edit Controls for this Box */}
                    {isAdmin && (
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-700/80">
                        <button
                          onClick={() => setEditingSchedule(schedule)}
                          className="flex-1 py-2 px-3 rounded-xl bg-[#ecb029] hover:bg-[#d99f20] text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-transform hover:scale-[1.02]"
                          title={`Edit ${schedule.title}`}
                        >
                          <Edit3 className="w-3.5 h-3.5 text-slate-900" />
                          <span>Edit Box ({schedule.title})</span>
                        </button>
                        <button
                          onClick={() => handleDeleteScheduleItem(schedule.id, schedule.title)}
                          className="p-2 rounded-xl text-rose-300 hover:text-white bg-rose-950/50 hover:bg-rose-900 border border-rose-800/40 transition-colors"
                          title="Delete Box"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  key={schedule.id || idx}
                  className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between space-y-4 shadow-md hover:shadow-xl transition-all relative"
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
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-[#282f3b] text-base">{schedule.title}</h3>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full shrink-0">
                        Box #{idx + 1}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{schedule.description}</p>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-200">
                    <div className="space-y-1.5 text-xs text-slate-700">
                      <div className="flex items-center gap-1.5 text-[#478226] font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{schedule.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-[#478226] shrink-0" />
                        <span className="truncate">{schedule.location}</span>
                      </div>
                    </div>

                    {/* Admin Edit Controls for this Box */}
                    {isAdmin && (
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => setEditingSchedule(schedule)}
                          className="flex-1 py-2 px-3 rounded-xl bg-[#478226] hover:bg-[#39691e] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-transform hover:scale-[1.02]"
                          title={`Edit ${schedule.title}`}
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#ecb029]" />
                          <span>Edit Box ({schedule.title})</span>
                        </button>
                        <button
                          onClick={() => handleDeleteScheduleItem(schedule.id, schedule.title)}
                          className="p-2 rounded-xl text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
                          title="Delete Box"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Google Calendar Section */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-xs font-bold text-[#478226] uppercase tracking-wider bg-[#478226]/10 px-3 py-1 rounded-full">
                {eventsContent.calendarSubtitle || "Interactive Schedule"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#282f3b] mt-2 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-[#478226]" />
                <span>{eventsContent.calendarTitle || "Official TGMC Google Calendar"}</span>
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {isAdmin && (
                <button
                  onClick={() => setEditingCalendar(true)}
                  className="px-3.5 py-2 rounded-lg bg-[#478226] hover:bg-[#39691e] text-white text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#ecb029]" />
                  <span>Edit Calendar</span>
                </button>
              )}
              {eventsContent.calendarEmbedUrl && (
                <a
                  href={eventsContent.calendarEmbedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-[#1f2530] text-white text-xs font-bold flex items-center gap-2 shadow hover:bg-slate-800 transition-colors"
                >
                  <span>Open Full Calendar</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#ecb029]" />
                </a>
              )}
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-300 shadow-xl bg-[#f0f3f9] p-2">
            <iframe
              src={
                eventsContent.calendarEmbedUrl ||
                "https://calendar.google.com/calendar/u/0/newembed?height=600&wkst=1&ctz=Europe/London&showPrint=0&showTabs=0&showTz=0&showCalendars=0&hl=en_GB&src=dGdtY2h1cmNodWtAZ21haWwuY29t&color=%23039be5"
              }
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
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-2 relative">
            <span className="text-xs font-bold text-[#478226] uppercase tracking-wider bg-[#478226]/10 px-3.5 py-1 rounded-full border border-[#478226]/20">
              Special Gatherings
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#282f3b] tracking-tight">
              {eventsContent.eventsListTitle || "Upcoming Church Events"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {eventsContent.eventsListSubtitle ||
                "Mark your calendar for special services, seasonal conferences, and community gatherings."}
            </p>

            {isAdmin && (
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => {
                    const newEv: ChurchEvent = {
                      id: `ev-${Date.now()}`,
                      title: "New TGMC Gathering",
                      date: "Upcoming Sunday",
                      time: "10:00 AM - 1:00 PM",
                      location: "150 York Rd, Uxbridge, UB8 1QW",
                      category: "Worship",
                      description: "Join us for praise and worship in the presence of God.",
                      image: "/images/event-worship-1.jpg",
                      featured: true,
                    };
                    setEditingEvent(newEv);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#478226] hover:bg-[#39691e] text-white text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Upcoming Event</span>
                </button>
                <button
                  onClick={openFullCmsEvents}
                  className="px-3.5 py-1.5 rounded-xl bg-[#1f2530] hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#ecb029]" />
                  <span>Manage in CMS</span>
                </button>
              </div>
            )}
          </div>

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

                  <div className="pt-4 border-t border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
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

                    {/* Admin Edit / Delete for this Event */}
                    {isAdmin && (
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          onClick={() => setEditingEvent(event)}
                          className="flex-1 py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow"
                        >
                          <Edit3 className="w-3 h-3 text-[#ecb029]" />
                          <span>Edit Event</span>
                        </button>
                        <button
                          onClick={() => handleDeleteEventItem(event.id, event.title)}
                          className="p-1.5 rounded-lg text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200"
                          title="Delete Event"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Direct Schedule Editor Modal (for Fasting Prayer & Communion or any Gathering Box) */}
      {editingSchedule && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => !isSaving && setEditingSchedule(null)}
        >
          <div
            className="relative max-w-xl w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-bold text-[#478226] uppercase tracking-wider">
                  Admin CMS · Gathering Box Editor
                </span>
                <h3 className="text-xl font-bold text-[#282f3b] mt-1">
                  Edit: {editingSchedule.title || "Weekly Schedule"}
                </h3>
                <p className="text-xs text-slate-500">
                  Changes save directly to Firestore and update the website live.
                </p>
              </div>
              <button
                onClick={() => setEditingSchedule(null)}
                disabled={isSaving}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveScheduleItem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#282f3b] mb-1">
                  Service / Gathering Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingSchedule.title}
                  onChange={(e) =>
                    setEditingSchedule({ ...editingSchedule, title: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f0f3f9] border border-slate-300 text-xs text-[#282f3b] font-semibold focus:outline-none focus:border-[#478226]"
                  placeholder="e.g. Fasting Prayers & Communion"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#282f3b] mb-1">
                    Day / Schedule Frequency *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSchedule.day}
                    onChange={(e) =>
                      setEditingSchedule({ ...editingSchedule, day: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#f0f3f9] border border-slate-300 text-xs text-[#282f3b] focus:outline-none focus:border-[#478226]"
                    placeholder="e.g. First Saturday of Every Month"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#282f3b] mb-1">
                    Time Interval *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSchedule.time}
                    onChange={(e) =>
                      setEditingSchedule({ ...editingSchedule, time: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#f0f3f9] border border-slate-300 text-xs text-[#282f3b] focus:outline-none focus:border-[#478226]"
                    placeholder="e.g. 10:00 AM - 1:00 PM"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#282f3b] mb-1">
                    Location Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSchedule.location}
                    onChange={(e) =>
                      setEditingSchedule({ ...editingSchedule, location: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#f0f3f9] border border-slate-300 text-xs text-[#282f3b] focus:outline-none focus:border-[#478226]"
                    placeholder="e.g. 150 York Rd, Uxbridge, UB8 1QW"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#282f3b] mb-1">
                    Language / Attendees
                  </label>
                  <input
                    type="text"
                    value={editingSchedule.language || ""}
                    onChange={(e) =>
                      setEditingSchedule({ ...editingSchedule, language: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#f0f3f9] border border-slate-300 text-xs text-[#282f3b] focus:outline-none focus:border-[#478226]"
                    placeholder="e.g. All Believers, Malayalam & English"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#282f3b] mb-1">
                  Description / Spiritual Purpose *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingSchedule.description}
                  onChange={(e) =>
                    setEditingSchedule({ ...editingSchedule, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f0f3f9] border border-slate-300 text-xs text-[#282f3b] leading-relaxed focus:outline-none focus:border-[#478226]"
                  placeholder="Describe this gathering, prayer focus, or communion service..."
                />
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  id="liveStreamToggle"
                  checked={editingSchedule.isLiveStreamed}
                  onChange={(e) =>
                    setEditingSchedule({
                      ...editingSchedule,
                      isLiveStreamed: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded text-[#478226] focus:ring-[#478226]"
                />
                <label
                  htmlFor="liveStreamToggle"
                  className="text-xs font-bold text-[#282f3b] cursor-pointer"
                >
                  Streamed Live on YouTube / Online
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingSchedule(null)}
                  disabled={isSaving}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-[#478226] hover:bg-[#39691e] disabled:opacity-60 text-white text-xs font-bold shadow-md transition-colors flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Box...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hero & Headings Edit Modal */}
      {editingHero && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => !isSaving && setEditingHero(false)}
        >
          <div
            className="relative max-w-xl w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-bold text-[#478226] uppercase tracking-wider">
                  Admin CMS · Events Page Headings
                </span>
                <h3 className="text-xl font-bold text-[#282f3b] mt-1">
                  Edit Hero & Section Titles
                </h3>
              </div>
              <button
                onClick={() => setEditingHero(false)}
                disabled={isSaving}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHeroForm} className="space-y-4">
              <div className="space-y-3 p-4 bg-[#f0f3f9] rounded-2xl border border-slate-200">
                <h4 className="text-xs font-bold text-[#282f3b]">1. Hero Banner</h4>
                <div>
                  <label className="block text-[11px] font-bold text-[#282f3b] mb-1">
                    Badge
                  </label>
                  <input
                    type="text"
                    value={heroForm.heroBadge}
                    onChange={(e) => setHeroForm({ ...heroForm, heroBadge: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#282f3b] mb-1">
                    Main Title
                  </label>
                  <input
                    type="text"
                    value={heroForm.heroTitle}
                    onChange={(e) => setHeroForm({ ...heroForm, heroTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#282f3b] mb-1">
                    Subtitle Description
                  </label>
                  <textarea
                    rows={2}
                    value={heroForm.heroSubtitle}
                    onChange={(e) =>
                      setHeroForm({ ...heroForm, heroSubtitle: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-3 p-4 bg-[#f0f3f9] rounded-2xl border border-slate-200">
                <h4 className="text-xs font-bold text-[#282f3b]">
                  2. Weekly Gathering Schedule Section
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#282f3b] mb-1">
                      Schedule Title
                    </label>
                    <input
                      type="text"
                      value={heroForm.scheduleTitle}
                      onChange={(e) =>
                        setHeroForm({ ...heroForm, scheduleTitle: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#282f3b] mb-1">
                      Schedule Subtitle
                    </label>
                    <input
                      type="text"
                      value={heroForm.scheduleSubtitle}
                      onChange={(e) =>
                        setHeroForm({ ...heroForm, scheduleSubtitle: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3 p-4 bg-[#f0f3f9] rounded-2xl border border-slate-200">
                <h4 className="text-xs font-bold text-[#282f3b]">
                  3. Upcoming Events Section
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#282f3b] mb-1">
                      Events List Title
                    </label>
                    <input
                      type="text"
                      value={heroForm.eventsListTitle}
                      onChange={(e) =>
                        setHeroForm({ ...heroForm, eventsListTitle: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#282f3b] mb-1">
                      Events List Subtitle
                    </label>
                    <input
                      type="text"
                      value={heroForm.eventsListSubtitle}
                      onChange={(e) =>
                        setHeroForm({ ...heroForm, eventsListSubtitle: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingHero(false)}
                  disabled={isSaving}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-[#478226] hover:bg-[#39691e] disabled:opacity-60 text-white text-xs font-bold shadow flex items-center gap-2"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Headings</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Calendar Edit Modal */}
      {editingCalendar && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => !isSaving && setEditingCalendar(false)}
        >
          <div
            className="relative max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-bold text-[#478226] uppercase tracking-wider">
                  Admin CMS · Google Calendar
                </span>
                <h3 className="text-xl font-bold text-[#282f3b] mt-1">
                  Calendar Embed & Link
                </h3>
              </div>
              <button
                onClick={() => setEditingCalendar(false)}
                disabled={isSaving}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCalendar} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#282f3b] mb-1">
                  Section Title
                </label>
                <input
                  type="text"
                  value={calendarForm.calendarTitle}
                  onChange={(e) =>
                    setCalendarForm({ ...calendarForm, calendarTitle: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f0f3f9] border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#282f3b] mb-1">
                  Badge / Subtitle
                </label>
                <input
                  type="text"
                  value={calendarForm.calendarSubtitle}
                  onChange={(e) =>
                    setCalendarForm({ ...calendarForm, calendarSubtitle: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f0f3f9] border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#282f3b] mb-1">
                  Google Calendar Embed URL
                </label>
                <input
                  type="text"
                  value={calendarForm.calendarEmbedUrl}
                  onChange={(e) =>
                    setCalendarForm({ ...calendarForm, calendarEmbedUrl: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f0f3f9] border border-slate-300 text-xs font-mono"
                  placeholder="https://calendar.google.com/calendar/u/0/newembed?..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingCalendar(false)}
                  disabled={isSaving}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-[#478226] hover:bg-[#39691e] disabled:opacity-60 text-white text-xs font-bold shadow flex items-center gap-2"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Calendar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Direct Upcoming Event Editor Modal */}
      {editingEvent && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => !isSaving && setEditingEvent(null)}
        >
          <div
            className="relative max-w-xl w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-bold text-[#478226] uppercase tracking-wider">
                  Admin CMS · Church Event
                </span>
                <h3 className="text-xl font-bold text-[#282f3b] mt-1">
                  Edit Event: {editingEvent.title}
                </h3>
              </div>
              <button
                onClick={() => setEditingEvent(null)}
                disabled={isSaving}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEventItem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#282f3b] mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingEvent.title}
                  onChange={(e) =>
                    setEditingEvent({ ...editingEvent, title: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f0f3f9] border border-slate-300 text-xs text-[#282f3b] font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#282f3b] mb-1">
                    Date *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingEvent.date}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, date: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#f0f3f9] border border-slate-300 text-xs"
                    placeholder="e.g. 15th April 2026"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#282f3b] mb-1">
                    Time *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingEvent.time}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, time: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#f0f3f9] border border-slate-300 text-xs"
                    placeholder="e.g. 10:00 AM"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#282f3b] mb-1">
                    Category *
                  </label>
                  <select
                    value={editingEvent.category}
                    onChange={(e) =>
                      setEditingEvent({
                        ...editingEvent,
                        category: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#f0f3f9] border border-slate-300 text-xs font-semibold"
                  >
                    <option value="Worship">Worship</option>
                    <option value="Special">Special</option>
                    <option value="Prayer">Prayer</option>
                    <option value="Youth">Youth</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#282f3b] mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  required
                  value={editingEvent.location}
                  onChange={(e) =>
                    setEditingEvent({ ...editingEvent, location: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f0f3f9] border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#282f3b] mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingEvent.description}
                  onChange={(e) =>
                    setEditingEvent({ ...editingEvent, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f0f3f9] border border-slate-300 text-xs"
                />
              </div>

              {/* Event Image & Firebase Storage Upload */}
              <div className="p-4 rounded-2xl bg-[#f0f3f9] border border-slate-200 space-y-3">
                <label className="block text-xs font-bold text-[#282f3b]">
                  Event Poster / Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingEvent.image}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, image: e.target.value })
                    }
                    className="flex-1 px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs"
                    placeholder="/images/event-worship-1.jpg or Firebase Storage URL"
                  />
                  <label className="px-3.5 py-2 rounded-lg bg-[#478226] text-white text-xs font-bold cursor-pointer hover:bg-[#39691e] transition-colors flex items-center gap-1.5 shadow whitespace-nowrap">
                    {uploadingImage ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>{uploadingImage ? "Uploading..." : "Upload New"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingImage}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleEventImageUpload(file);
                      }}
                    />
                  </label>
                </div>
                {editingEvent.image && (
                  <div className="relative h-28 w-full rounded-xl overflow-hidden border border-slate-300">
                    <OptimizedImage
                      src={editingEvent.image}
                      alt="Preview"
                      fill={true}
                      className="object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  disabled={isSaving}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-[#478226] hover:bg-[#39691e] disabled:opacity-60 text-white text-xs font-bold shadow flex items-center gap-2"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Event</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

