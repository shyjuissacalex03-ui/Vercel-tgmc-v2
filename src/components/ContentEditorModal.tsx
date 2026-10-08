import React, { useState, useEffect } from "react";
import { useContent, ChurchContentState } from "../firebase/contentContext.tsx";
import { useAuth, ADMIN_EMAIL } from "../firebase/authContext.tsx";
import { uploadChurchAsset } from "../firebase/storageService.ts";
import {
  defaultHomeContent,
  defaultAboutContent,
  defaultEventsContent,
  defaultContactContent,
  defaultStatementOfFaithHero,
  pastorInfo as defaultPastorInfo,
  churchInfo as defaultChurchInfo,
  serviceSchedules as defaultServiceSchedules,
  upcomingEvents as defaultUpcomingEvents,
  statementsOfFaith as defaultStatementsOfFaith,
  corePillars as defaultCorePillars,
  heroSlides as defaultHeroSlides,
  galleryItems as defaultGalleryItems,
  ChurchEvent,
  ServiceSchedule,
  StatementOfFaith,
} from "../data/churchData.ts";
import {
  X,
  Save,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  RotateCcw,
  Loader2,
  Church,
  User,
  Calendar,
  Sparkles,
  ShieldAlert,
  Home,
  BookOpen,
  Phone,
  Layers,
  Tv,
} from "lucide-react";

interface ContentEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType =
  | "home"
  | "about"
  | "pastor"
  | "faith"
  | "events"
  | "contact"
  | "branding";

export const ContentEditorModal: React.FC<ContentEditorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { content, saveContent, resetToDefaults } = useContent();
  const { currentUser, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<TabType>("home");

  // Local draft state initialized with complete fallbacks
  const [formData, setFormData] = useState<ChurchContentState>({
    ...content,
    homeContent: content.homeContent || defaultHomeContent,
    aboutContent: content.aboutContent || defaultAboutContent,
    eventsContent: content.eventsContent || defaultEventsContent,
    contactContent: content.contactContent || defaultContactContent,
    statementOfFaithHero:
      content.statementOfFaithHero || defaultStatementOfFaithHero,
    pastorInfo: content.pastorInfo || defaultPastorInfo,
    churchInfo: content.churchInfo || defaultChurchInfo,
    serviceSchedules: content.serviceSchedules || defaultServiceSchedules,
    upcomingEvents: content.upcomingEvents || defaultUpcomingEvents,
    statementsOfFaith: content.statementsOfFaith || defaultStatementsOfFaith,
    corePillars: content.corePillars || defaultCorePillars,
    heroSlides: content.heroSlides || defaultHeroSlides,
    galleryItems: content.galleryItems || defaultGalleryItems,
  });

  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Sync draft when opened
  useEffect(() => {
    if (isOpen) {
      setFormData({
        ...content,
        homeContent: content.homeContent || defaultHomeContent,
        aboutContent: content.aboutContent || defaultAboutContent,
        eventsContent: content.eventsContent || defaultEventsContent,
        contactContent: content.contactContent || defaultContactContent,
        statementOfFaithHero:
          content.statementOfFaithHero || defaultStatementOfFaithHero,
        pastorInfo: content.pastorInfo || defaultPastorInfo,
        churchInfo: content.churchInfo || defaultChurchInfo,
        serviceSchedules: content.serviceSchedules || defaultServiceSchedules,
        upcomingEvents: content.upcomingEvents || defaultUpcomingEvents,
        statementsOfFaith:
          content.statementsOfFaith || defaultStatementsOfFaith,
        corePillars: content.corePillars || defaultCorePillars,
        heroSlides: content.heroSlides || defaultHeroSlides,
        galleryItems: content.galleryItems || defaultGalleryItems,
      });
      setStatusMsg(null);
    }
  }, [isOpen, content]);

  if (!isOpen) return null;

  // Requirement 5: If a non-admin user tries to access the CMS, show:
  // "You do not have permission to edit website content."
  if (!isAdmin) {
    return (
      <div
        className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div
          className="relative max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-[#282f3b]">Access Denied</h3>
          <p className="text-sm font-bold text-rose-600">
            You do not have permission to edit website content.
          </p>
          <p className="text-xs text-slate-500 leading-relaxed">
            Only the administrator ({ADMIN_EMAIL}) has permission to edit church
            content, upload images, and save or publish changes.
          </p>
          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-[#282f3b] hover:bg-slate-800 text-white font-bold text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle generic image upload to Firebase Storage
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldKey: string,
    onSuccess: (downloadUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(fieldKey);
    setUploadProgress(0);
    setStatusMsg(null);

    try {
      const downloadUrl = await uploadChurchAsset(
        file,
        "church_content",
        (pct) => {
          setUploadProgress(pct);
        }
      );
      onSuccess(downloadUrl);
      setStatusMsg({
        type: "success",
        text: `Image "${file.name}" uploaded successfully to Firebase Storage!`,
      });
    } catch (err: any) {
      console.error("Storage upload failed:", err);
      setStatusMsg({
        type: "error",
        text: `Storage upload failed: ${
          err.message || "Please check permissions."
        }`,
      });
    } finally {
      setUploadingField(null);
      setUploadProgress(0);
    }
  };

  // Save changes to Firestore
  const handleSaveAll = async () => {
    setSaving(true);
    setStatusMsg(null);
    try {
      await saveContent(formData);
      setStatusMsg({
        type: "success",
        text: "Website content saved to Firebase Firestore successfully! All visitors will see your changes immediately.",
      });
    } catch (err: any) {
      console.error("Firestore save error:", err);
      setStatusMsg({
        type: "error",
        text: `Error saving: ${err.message || "Failed to update Firestore."}`,
      });
    } finally {
      setSaving(false);
    }
  };

  // Reset to default
  const handleReset = async () => {
    if (
      !window.confirm(
        "Are you sure you want to reset all content across all pages to standard defaults?"
      )
    )
      return;
    setSaving(true);
    try {
      await resetToDefaults();
      setStatusMsg({
        type: "success",
        text: "Content reset to original defaults.",
      });
    } catch (err: any) {
      setStatusMsg({
        type: "error",
        text: err.message,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Title Bar */}
        <div className="p-4 sm:p-6 bg-[#1f2530] text-white flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#478226] text-white flex items-center justify-center font-bold shadow">
              <Church className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold">
                  TGMC Website CMS & Page Editor
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ecb029] text-slate-950">
                  Firebase Connected
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Logged in as{" "}
                <strong className="text-slate-200">
                  {currentUser?.email}
                </strong>{" "}
                <span className="text-emerald-400">
                  (Administrator Access Verified)
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-[#478226] hover:bg-[#39691e] text-white text-xs font-bold flex items-center gap-1.5 shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>Save & Publish</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Toast */}
        {statusMsg && (
          <div
            className={`p-3 px-6 text-xs flex items-center gap-2 ${
              statusMsg.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-b border-emerald-200"
                : "bg-rose-50 text-rose-800 border-b border-rose-200"
            }`}
          >
            {statusMsg.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Navigation Tabs for All 6 Pages + Branding */}
        <div className="flex border-b border-slate-200 overflow-x-auto bg-[#f0f3f9] px-4 py-2 gap-1 text-xs">
          {[
            { id: "home" as const, label: "Home Page", icon: Home },
            { id: "about" as const, label: "About Page", icon: BookOpen },
            { id: "pastor" as const, label: "Pastor's Bio", icon: User },
            {
              id: "faith" as const,
              label: "Statement of Faith",
              icon: Sparkles,
            },
            {
              id: "events" as const,
              label: "Events & Services",
              icon: Calendar,
            },
            { id: "contact" as const, label: "Contact Us", icon: Phone },
            {
              id: "branding" as const,
              label: "Branding & Media",
              icon: Church,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? "bg-white text-[#478226] shadow-sm border border-slate-200"
                    : "text-slate-600 hover:text-[#282f3b]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: HOME PAGE */}
          {activeTab === "home" && (
            <div className="space-y-8 max-w-4xl">
              <div>
                <h3 className="font-bold text-lg text-[#282f3b]">
                  Home Page Content & Sections
                </h3>
                <p className="text-xs text-slate-500">
                  Fully edit hero slides, intro welcome narrative, core
                  theological pillars, and YouTube live stream settings.
                </p>
              </div>

              {/* 1.1 Hero Slides */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[#282f3b]">
                    1. Hero Carousel Slides ({formData.heroSlides.length})
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const newSlide = {
                        subtitle: "Welcome to The Great Mission Church",
                        title: "Rooted in the Word, Centered on CHRIST",
                        description:
                          "We are a Bible-believing, Spirit-filled, CHRIST-centred church.",
                        image: "/images/slide1.jpg",
                      };
                      setFormData({
                        ...formData,
                        heroSlides: [...formData.heroSlides, newSlide],
                      });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#478226] text-white text-xs font-bold flex items-center gap-1 shadow"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Slide</span>
                  </button>
                </div>

                {formData.heroSlides.map((slide, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-[#f0f3f9] border border-slate-200 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#478226]">
                        Slide #{idx + 1}
                      </span>
                      {formData.heroSlides.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = formData.heroSlides.filter(
                              (_, i) => i !== idx
                            );
                            setFormData({ ...formData, heroSlides: updated });
                          }}
                          className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#282f3b] mb-1">
                          Slide Subtitle / Badge
                        </label>
                        <input
                          type="text"
                          value={slide.subtitle}
                          onChange={(e) => {
                            const updated = [...formData.heroSlides];
                            updated[idx].subtitle = e.target.value;
                            setFormData({ ...formData, heroSlides: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-[#282f3b]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#282f3b] mb-1">
                          Slide Heading
                        </label>
                        <input
                          type="text"
                          value={slide.title}
                          onChange={(e) => {
                            const updated = [...formData.heroSlides];
                            updated[idx].title = e.target.value;
                            setFormData({ ...formData, heroSlides: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-[#282f3b]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#282f3b] mb-1">
                        Slide Description
                      </label>
                      <textarea
                        rows={2}
                        value={slide.description}
                        onChange={(e) => {
                          const updated = [...formData.heroSlides];
                          updated[idx].description = e.target.value;
                          setFormData({ ...formData, heroSlides: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-[#282f3b]"
                      />
                    </div>

                    {/* Image Upload for Hero Slide */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-300 text-xs">
                      <div className="flex items-center gap-2">
                        <img
                          src={slide.image}
                          alt="preview"
                          className="w-14 h-9 rounded object-cover border border-slate-300"
                        />
                        <span className="text-[11px] text-slate-500 truncate max-w-[200px]">
                          {slide.image}
                        </span>
                      </div>
                      <label className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-[11px] font-bold text-[#282f3b] cursor-pointer flex items-center gap-1 shadow-sm">
                        {uploadingField === `slide_${idx}` ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin text-[#478226]" />
                            <span>Uploading ({uploadProgress}%)...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3 h-3 text-[#478226]" />
                            <span>Upload Banner</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleImageUpload(e, `slide_${idx}`, (url) => {
                              const updated = [...formData.heroSlides];
                              updated[idx].image = url;
                              setFormData({ ...formData, heroSlides: updated });
                            })
                          }
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              {/* 1.2 Live Stream Broadcast */}
              <div className="p-6 rounded-2xl bg-[#f0f3f9] border border-slate-200 space-y-4">
                <h4 className="text-sm font-bold text-[#282f3b] flex items-center gap-2">
                  <Tv className="w-4 h-4 text-red-500" />
                  <span>2. Live Stream Banner & Broadcast Settings</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#282f3b] mb-1">
                      Live Stream Section Title
                    </label>
                    <input
                      type="text"
                      value={formData.homeContent.liveStreamTitle}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          homeContent: {
                            ...formData.homeContent,
                            liveStreamTitle: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-[#282f3b]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#282f3b] mb-1">
                      YouTube Live Channel URL
                    </label>
                    <input
                      type="text"
                      value={formData.homeContent.liveStreamUrl}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          homeContent: {
                            ...formData.homeContent,
                            liveStreamUrl: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-[#282f3b]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#282f3b] mb-1">
                    Live Stream Subtitle / Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.homeContent.liveStreamSubtitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        homeContent: {
                          ...formData.homeContent,
                          liveStreamSubtitle: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-[#282f3b]"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-300">
                  <div className="flex items-center gap-3">
                    <img
                      src={formData.homeContent.liveStreamPreviewImage}
                      alt="livestream preview"
                      className="w-16 h-10 rounded-lg object-cover border border-slate-300"
                    />
                    <span className="text-xs text-slate-500">
                      Live Stream Thumbnail Preview
                    </span>
                  </div>
                  <label className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-bold text-[#282f3b] cursor-pointer flex items-center gap-1 shadow-sm">
                    {uploadingField === "livestream_thumb" ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#478226]" />
                        <span>Uploading ({uploadProgress}%)...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5 text-[#478226]" />
                        <span>Upload Thumbnail</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleImageUpload(e, "livestream_thumb", (url) => {
                          setFormData({
                            ...formData,
                            homeContent: {
                              ...formData.homeContent,
                              liveStreamPreviewImage: url,
                            },
                          });
                        })
                      }
                    />
                  </label>
                </div>
              </div>

              {/* 1.3 Core Pillars */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-[#282f3b]">
                  3. Front Page Core Pillars
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {formData.corePillars.map((pillar, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-[#f0f3f9] border border-slate-200 space-y-3"
                    >
                      <div className="w-12 h-12 rounded-xl bg-white border border-slate-300 flex items-center justify-center p-2 mx-auto">
                        <img
                          src={pillar.icon}
                          alt={pillar.title}
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#282f3b] mb-1">
                          Pillar #{idx + 1} Title
                        </label>
                        <input
                          type="text"
                          value={pillar.title}
                          onChange={(e) => {
                            const updated = [...formData.corePillars];
                            updated[idx].title = e.target.value;
                            setFormData({ ...formData, corePillars: updated });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-[#282f3b]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#282f3b] mb-1">
                          Description
                        </label>
                        <textarea
                          rows={2}
                          value={pillar.description}
                          onChange={(e) => {
                            const updated = [...formData.corePillars];
                            updated[idx].description = e.target.value;
                            setFormData({ ...formData, corePillars: updated });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-[#282f3b]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ABOUT PAGE */}
          {activeTab === "about" && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h3 className="font-bold text-lg text-[#282f3b]">
                  About Page Content Editor
                </h3>
                <p className="text-xs text-slate-500">
                  Update the About page header, identity & heritage narrative,
                  charity registration note, and mission & vision declarations.
                </p>
              </div>

              {/* 2.1 Hero Header */}
              <div className="p-6 rounded-2xl bg-[#f0f3f9] border border-slate-200 space-y-4">
                <h4 className="text-sm font-bold text-[#282f3b]">
                  1. About Page Header Banner
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#282f3b] mb-1">
                      Hero Badge
                    </label>
                    <input
                      type="text"
                      value={formData.aboutContent.heroBadge}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          aboutContent: {
                            ...formData.aboutContent,
                            heroBadge: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-[#282f3b]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#282f3b] mb-1">
                      Main Page Heading
                    </label>
                    <input
                      type="text"
                      value={formData.aboutContent.heroTitle}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          aboutContent: {
                            ...formData.aboutContent,
                            heroTitle: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-[#282f3b]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#282f3b] mb-1">
                    Hero Subtitle
                  </label>
                  <textarea
                    rows={2}
                    value={formData.aboutContent.heroSubtitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        aboutContent: {
                          ...formData.aboutContent,
                          heroSubtitle: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-[#282f3b]"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-300">
                  <div className="flex items-center gap-3">
                    <img
                      src={formData.aboutContent.heroImage}
                      alt="about hero"
                      className="w-16 h-10 rounded-lg object-cover border border-slate-300"
                    />
                    <span className="text-xs text-slate-500">
                      Header Background Image
                    </span>
                  </div>
                  <label className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-bold text-[#282f3b] cursor-pointer flex items-center gap-1 shadow-sm">
                    {uploadingField === "about_hero_img" ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#478226]" />
                        <span>Uploading ({uploadProgress}%)...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5 text-[#478226]" />
                        <span>Upload Background</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleImageUpload(e, "about_hero_img", (url) => {
                          setFormData({
                            ...formData,
                            aboutContent: {
                              ...formData.aboutContent,
                              heroImage: url,
                            },
                          });
                        })
                      }
                    />
                  </label>
                </div>
              </div>

              {/* 2.2 Heritage & Identity */}
              <div className="p-6 rounded-2xl bg-[#f0f3f9] border border-slate-200 space-y-4">
                <h4 className="text-sm font-bold text-[#282f3b]">
                  2. Identity & Heritage Section
                </h4>
                <div>
                  <label className="block text-xs font-bold text-[#282f3b] mb-1">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={formData.aboutContent.heritageTitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        aboutContent: {
                          ...formData.aboutContent,
                          heritageTitle: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-[#282f3b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#282f3b] mb-1">
                    Paragraph 1 (Faith Identity)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.aboutContent.heritageParagraph1}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        aboutContent: {
                          ...formData.aboutContent,
                          heritageParagraph1: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-[#282f3b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#282f3b] mb-1">
                    Paragraph 2 (Geographic Coverage & Languages)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.aboutContent.heritageParagraph2}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        aboutContent: {
                          ...formData.aboutContent,
                          heritageParagraph2: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-[#282f3b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#282f3b] mb-1">
                    Charity Registration Note
                  </label>
                  <input
                    type="text"
                    value={formData.aboutContent.charityNote}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        aboutContent: {
                          ...formData.aboutContent,
                          charityNote: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-[#282f3b]"
                  />
                </div>
              </div>

              {/* 2.3 Mission & Vision */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[#f0f3f9] border border-slate-200 space-y-3">
                  <h4 className="text-sm font-bold text-[#282f3b]">
                    3. Our Mission Declaration
                  </h4>
                  <div>
                    <label className="block text-[11px] font-bold text-[#282f3b] mb-1">
                      Mission Title & Scripture
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={formData.aboutContent.missionTitle}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            aboutContent: {
                              ...formData.aboutContent,
                              missionTitle: e.target.value,
                            },
                          })
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-[#282f3b]"
                      />
                      <input
                        type="text"
                        value={formData.aboutContent.missionVerse}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            aboutContent: {
                              ...formData.aboutContent,
                              missionVerse: e.target.value,
                            },
                          })
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-[#282f3b]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#282f3b] mb-1">
                      Mission Statement Intro
                    </label>
                    <textarea
                      rows={2}
                      value={formData.aboutContent.missionIntro}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          aboutContent: {
                            ...formData.aboutContent,
                            missionIntro: e.target.value,
                          },
                        })
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-[#282f3b]"
                    />
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#f0f3f9] border border-slate-200 space-y-3">
                  <h4 className="text-sm font-bold text-[#282f3b]">
                    4. Our Vision Declaration
                  </h4>
                  <div>
                    <label className="block text-[11px] font-bold text-[#282f3b] mb-1">
                      Vision Title & Scripture
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={formData.aboutContent.visionTitle}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            aboutContent: {
                              ...formData.aboutContent,
                              visionTitle: e.target.value,
                            },
                          })
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-[#282f3b]"
                      />
                      <input
                        type="text"
                        value={formData.aboutContent.visionVerse}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            aboutContent: {
                              ...formData.aboutContent,
                              visionVerse: e.target.value,
                            },
                          })
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-[#282f3b]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#282f3b] mb-1">
                      Vision Description
                    </label>
                    <textarea
                      rows={3}
                      value={formData.aboutContent.visionDescription}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          aboutContent: {
                            ...formData.aboutContent,
                            visionDescription: e.target.value,
                          },
                        })
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-[#282f3b]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PASTOR'S BIO */}
          {activeTab === "pastor" && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h3 className="font-bold text-lg text-[#282f3b]">
                  Pastor's Bio & Ministry Profile
                </h3>
                <p className="text-xs text-slate-500">
                  Update Lead Pastor's name, titles, portrait image, quote, and
                  full biographical narrative shown on the Pastor Bio page.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Photo & Upload */}
                <div className="md:col-span-4 space-y-3">
                  <div className="relative rounded-2xl overflow-hidden border border-slate-300 h-72 bg-slate-100 shadow-md">
                    <img
                      src={formData.pastorInfo.image}
                      alt={formData.pastorInfo.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  <label className="w-full py-2.5 rounded-xl bg-[#478226] hover:bg-[#39691e] text-white text-xs font-bold cursor-pointer flex items-center justify-center gap-1.5 shadow transition-colors">
                    {uploadingField === "pastor_photo" ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Uploading ({uploadProgress}%)...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Pastor Photo</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingField !== null}
                      onChange={(e) =>
                        handleImageUpload(e, "pastor_photo", (url) => {
                          setFormData({
                            ...formData,
                            pastorInfo: { ...formData.pastorInfo, image: url },
                          });
                        })
                      }
                    />
                  </label>
                </div>

                {/* Form fields */}
                <div className="md:col-span-8 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#282f3b] mb-1">
                        Pastor Name
                      </label>
                      <input
                        type="text"
                        value={formData.pastorInfo.name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            pastorInfo: {
                              ...formData.pastorInfo,
                              name: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-2 rounded-xl bg-[#f0f3f9] border border-slate-300 text-xs text-[#282f3b]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#282f3b] mb-1">
                        Role Title
                      </label>
                      <input
                        type="text"
                        value={formData.pastorInfo.role}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            pastorInfo: {
                              ...formData.pastorInfo,
                              role: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-2 rounded-xl bg-[#f0f3f9] border border-slate-300 text-xs text-[#282f3b]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#282f3b] mb-1">
                        Phone Contact
                      </label>
                      <input
                        type="text"
                        value={formData.pastorInfo.phone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            pastorInfo: {
                              ...formData.pastorInfo,
                              phone: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-2 rounded-xl bg-[#f0f3f9] border border-slate-300 text-xs text-[#282f3b]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#282f3b] mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.pastorInfo.email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            pastorInfo: {
                              ...formData.pastorInfo,
                              email: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-2 rounded-xl bg-[#f0f3f9] border border-slate-300 text-xs text-[#282f3b]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#282f3b] mb-1">
                      Pastor Quote / Exhortation
                    </label>
                    <input
                      type="text"
                      value={formData.pastorInfo.quote || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pastorInfo: {
                            ...formData.pastorInfo,
                            quote: e.target.value,
                          },
                        })
                      }
                      className="w-full px-4 py-2 rounded-xl bg-[#f0f3f9] border border-slate-300 text-xs text-[#282f3b]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#282f3b] mb-1">
                      Biography Paragraph 1
                    </label>
                    <textarea
                      rows={3}
                      value={formData.pastorInfo.bio}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pastorInfo: {
                            ...formData.pastorInfo,
                            bio: e.target.value,
                          },
                        })
                      }
                      className="w-full px-4 py-2 rounded-xl bg-[#f0f3f9] border border-slate-300 text-xs text-[#282f3b]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#282f3b] mb-1">
                      Biography Paragraph 2
                    </label>
                    <textarea
                      rows={3}
                      value={formData.pastorInfo.bioParagraph2 || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pastorInfo: {
                            ...formData.pastorInfo,
                            bioParagraph2: e.target.value,
                          },
                        })
                      }
                      className="w-full px-4 py-2 rounded-xl bg-[#f0f3f9] border border-slate-300 text-xs text-[#282f3b]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#282f3b] mb-1">
                      Biography Paragraph 3
                    </label>
                    <textarea
                      rows={3}
                      value={formData.pastorInfo.bioParagraph3 || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pastorInfo: {
                            ...formData.pastorInfo,
                            bioParagraph3: e.target.value,
                          },
                        })
                      }
                      className="w-full px-4 py-2 rounded-xl bg-[#f0f3f9] border border-slate-300 text-xs text-[#282f3b]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: STATEMENT OF FAITH */}
          {activeTab === "faith" && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg text-[#282f3b]">
                    Statement of Faith Editor
                  </h3>
                  <p className="text-xs text-slate-500">
                    Add, edit, or reorder the foundational articles of faith and
                    scriptural references.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newArticle: StatementOfFaith = {
                      id: `doctrine-${Date.now()}`,
                      number: formData.statementsOfFaith.length + 1,
                      title: `${
                        formData.statementsOfFaith.length + 1
                      }. New Article of Faith`,
                      summary: "We believe in the Holy Scriptures and the truth of GOD.",
                      points: [
                        "Scriptural authority for faith and practice.",
                        "Salvation by grace through faith in Jesus Christ.",
                      ],
                      scriptures: ["2 Timothy 3:16", "Romans 10:9"],
                    };
                    setFormData({
                      ...formData,
                      statementsOfFaith: [
                        ...formData.statementsOfFaith,
                        newArticle,
                      ],
                    });
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#478226] text-white text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Article</span>
                </button>
              </div>

              {/* Header editor */}
              <div className="p-4 rounded-xl bg-[#f0f3f9] border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#282f3b] mb-1">
                    Page Header Title
                  </label>
                  <input
                    type="text"
                    value={formData.statementOfFaithHero?.heroTitle || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        statementOfFaithHero: {
                          ...formData.statementOfFaithHero,
                          heroTitle: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-[#282f3b]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#282f3b] mb-1">
                    Page Header Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.statementOfFaithHero?.heroSubtitle || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        statementOfFaithHero: {
                          ...formData.statementOfFaithHero,
                          heroSubtitle: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-[#282f3b]"
                  />
                </div>
              </div>

              {/* Articles List */}
              <div className="space-y-4">
                {formData.statementsOfFaith.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-[#f0f3f9] border border-slate-200 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#478226]">
                        Article #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formData.statementsOfFaith.filter(
                            (_, i) => i !== idx
                          );
                          setFormData({
                            ...formData,
                            statementsOfFaith: updated,
                          });
                        }}
                        className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div className="sm:col-span-1">
                        <label className="block text-[11px] font-bold text-[#282f3b] mb-1">
                          Article Number
                        </label>
                        <input
                          type="number"
                          value={item.number}
                          onChange={(e) => {
                            const updated = [...formData.statementsOfFaith];
                            updated[idx].number = parseInt(e.target.value) || 1;
                            setFormData({
                              ...formData,
                              statementsOfFaith: updated,
                            });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-[#282f3b]"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-bold text-[#282f3b] mb-1">
                          Article Title
                        </label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            const updated = [...formData.statementsOfFaith];
                            updated[idx].title = e.target.value;
                            setFormData({
                              ...formData,
                              statementsOfFaith: updated,
                            });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-[#282f3b]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#282f3b] mb-1">
                        Summary Statement
                      </label>
                      <textarea
                        rows={2}
                        value={item.summary}
                        onChange={(e) => {
                          const updated = [...formData.statementsOfFaith];
                          updated[idx].summary = e.target.value;
                          setFormData({
                            ...formData,
                            statementsOfFaith: updated,
                          });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-[#282f3b]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#282f3b] mb-1">
                        Bullet Points (one per line)
                      </label>
                      <textarea
                        rows={3}
                        value={(item.points || []).join("\n")}
                        onChange={(e) => {
                          const updated = [...formData.statementsOfFaith];
                          updated[idx].points = e.target.value
                            .split("\n")
                            .filter((line) => line.trim().length > 0);
                          setFormData({
                            ...formData,
                            statementsOfFaith: updated,
                          });
                        }}
                        placeholder="Point 1&#10;Point 2&#10;Point 3"
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-[#282f3b]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#282f3b] mb-1">
                        Scriptures (comma-separated, e.g. "Matthew 28:19, John 1:1")
                      </label>
                      <input
                        type="text"
                        value={(item.scriptures || []).join(", ")}
                        onChange={(e) => {
                          const updated = [...formData.statementsOfFaith];
                          updated[idx].scriptures = e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter((s) => s.length > 0);
                          setFormData({
                            ...formData,
                            statementsOfFaith: updated,
                          });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-[#282f3b]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: EVENTS & SERVICES */}
          {activeTab === "events" && (
            <div className="space-y-8 max-w-4xl">
              <div>
                <h3 className="font-bold text-lg text-[#282f3b]">
                  Events & Weekly Services Editor
                </h3>
                <p className="text-xs text-slate-500">
                  Manage weekly worship schedule, upcoming special services,
                  banners, categories, and calendar embeddings.
                </p>
              </div>

              {/* 5.1 Weekly Schedule Editor */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[#282f3b]">
                    1. Weekly Gathering Schedule ({formData.serviceSchedules.length})
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const newSched: ServiceSchedule = {
                        id: `sched-${Date.now()}`,
                        day: "Every Sunday",
                        time: "10:00 AM - 1:00 PM",
                        title: "Sunday Divine Worship Service",
                        language: "Malayalam & English",
                        description: "Spirit-filled praise, prayer, and Word.",
                        location: "150 York Rd, Uxbridge, UB8 1QW",
                        isLiveStreamed: true,
                      };
                      setFormData({
                        ...formData,
                        serviceSchedules: [
                          ...formData.serviceSchedules,
                          newSched,
                        ],
                      });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#478226] text-white text-xs font-bold flex items-center gap-1 shadow"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Schedule</span>
                  </button>
                </div>

                {formData.serviceSchedules.map((sched, idx) => (
                  <div
                    key={sched.id}
                    className="p-5 rounded-2xl bg-[#f0f3f9] border border-slate-200 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#478226]">
                        Schedule Item #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formData.serviceSchedules.filter(
                            (_, i) => i !== idx
                          );
                          setFormData({
                            ...formData,
                            serviceSchedules: updated,
                          });
                        }}
                        className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#282f3b] mb-1">
                          Day / Recurrence
                        </label>
                        <input
                          type="text"
                          value={sched.day}
                          onChange={(e) => {
                            const updated = [...formData.serviceSchedules];
                            updated[idx].day = e.target.value;
                            setFormData({
                              ...formData,
                              serviceSchedules: updated,
                            });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-[#282f3b]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#282f3b] mb-1">
                          Time (e.g. 10:00 AM - 1:00 PM)
                        </label>
                        <input
                          type="text"
                          value={sched.time}
                          onChange={(e) => {
                            const updated = [...formData.serviceSchedules];
                            updated[idx].time = e.target.value;
                            setFormData({
                              ...formData,
                              serviceSchedules: updated,
                            });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-[#282f3b]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#282f3b] mb-1">
                          Service Title
                        </label>
                        <input
                          type="text"
                          value={sched.title}
                          onChange={(e) => {
                            const updated = [...formData.serviceSchedules];
                            updated[idx].title = e.target.value;
                            setFormData({
                              ...formData,
                              serviceSchedules: updated,
                            });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-[#282f3b]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#282f3b] mb-1">
                          Location Address
                        </label>
                        <input
                          type="text"
                          value={sched.location}
                          onChange={(e) => {
                            const updated = [...formData.serviceSchedules];
                            updated[idx].location = e.target.value;
                            setFormData({
                              ...formData,
                              serviceSchedules: updated,
                            });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-[#282f3b]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#282f3b] mb-1">
                          Languages
                        </label>
                        <input
                          type="text"
                          value={sched.language}
                          onChange={(e) => {
                            const updated = [...formData.serviceSchedules];
                            updated[idx].language = e.target.value;
                            setFormData({
                              ...formData,
                              serviceSchedules: updated,
                            });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-[#282f3b]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#282f3b] mb-1">
                        Service Description
                      </label>
                      <textarea
                        rows={2}
                        value={sched.description}
                        onChange={(e) => {
                          const updated = [...formData.serviceSchedules];
                          updated[idx].description = e.target.value;
                          setFormData({
                            ...formData,
                            serviceSchedules: updated,
                          });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-[#282f3b]"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* 5.2 Upcoming Events */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[#282f3b]">
                    2. Upcoming Church Events ({formData.upcomingEvents.length})
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const newEv: ChurchEvent = {
                        id: `ev-${Date.now()}`,
                        title: "New TGMC Gathering",
                        date: "Upcoming Sunday",
                        time: "10:00 AM - 1:00 PM",
                        location: "150 York Rd, Uxbridge, UB8 1QW",
                        category: "Worship",
                        description:
                          "Join us for praise and worship in the presence of God.",
                        image: "/images/event-worship-1.jpg",
                        featured: true,
                      };
                      setFormData({
                        ...formData,
                        upcomingEvents: [newEv, ...formData.upcomingEvents],
                      });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#478226] text-white text-xs font-bold flex items-center gap-1 shadow"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Event</span>
                  </button>
                </div>

                {formData.upcomingEvents.map((ev, idx) => (
                  <div
                    key={ev.id}
                    className="p-5 rounded-2xl bg-[#f0f3f9] border border-slate-200 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#478226]">
                        Event #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formData.upcomingEvents.filter(
                            (_, i) => i !== idx
                          );
                          setFormData({
                            ...formData,
                            upcomingEvents: updated,
                          });
                        }}
                        className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#282f3b] mb-1">
                          Event Title
                        </label>
                        <input
                          type="text"
                          value={ev.title}
                          onChange={(e) => {
                            const updated = [...formData.upcomingEvents];
                            updated[idx].title = e.target.value;
                            setFormData({
                              ...formData,
                              upcomingEvents: updated,
                            });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-[#282f3b]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#282f3b] mb-1">
                          Date
                        </label>
                        <input
                          type="text"
                          value={ev.date}
                          onChange={(e) => {
                            const updated = [...formData.upcomingEvents];
                            updated[idx].date = e.target.value;
                            setFormData({
                              ...formData,
                              upcomingEvents: updated,
                            });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-[#282f3b]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#282f3b] mb-1">
                          Time
                        </label>
                        <input
                          type="text"
                          value={ev.time}
                          onChange={(e) => {
                            const updated = [...formData.upcomingEvents];
                            updated[idx].time = e.target.value;
                            setFormData({
                              ...formData,
                              upcomingEvents: updated,
                            });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-[#282f3b]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#282f3b] mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          value={ev.location}
                          onChange={(e) => {
                            const updated = [...formData.upcomingEvents];
                            updated[idx].location = e.target.value;
                            setFormData({
                              ...formData,
                              upcomingEvents: updated,
                            });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-[#282f3b]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#282f3b] mb-1">
                          Category
                        </label>
                        <select
                          value={ev.category}
                          onChange={(e) => {
                            const updated = [...formData.upcomingEvents];
                            updated[idx].category = e.target.value as any;
                            setFormData({
                              ...formData,
                              upcomingEvents: updated,
                            });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-[#282f3b]"
                        >
                          <option value="Worship">Worship</option>
                          <option value="Prayer">Prayer</option>
                          <option value="Youth">Youth</option>
                          <option value="Special">Special</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#282f3b] mb-1">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        value={ev.description}
                        onChange={(e) => {
                          const updated = [...formData.upcomingEvents];
                          updated[idx].description = e.target.value;
                          setFormData({
                            ...formData,
                            upcomingEvents: updated,
                          });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-[#282f3b]"
                      />
                    </div>

                    {/* Image Upload for Event */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-300 text-xs">
                      <div className="flex items-center gap-2">
                        <img
                          src={ev.image}
                          alt="preview"
                          className="w-12 h-8 rounded object-cover border border-slate-300"
                        />
                        <span className="text-[11px] text-slate-500 truncate max-w-[200px]">
                          {ev.image}
                        </span>
                      </div>
                      <label className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-[11px] font-bold text-[#282f3b] cursor-pointer flex items-center gap-1 shadow-sm">
                        {uploadingField === `event_${idx}` ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin text-[#478226]" />
                            <span>Uploading ({uploadProgress}%)...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3 h-3 text-[#478226]" />
                            <span>Upload Banner</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleImageUpload(e, `event_${idx}`, (url) => {
                              const updated = [...formData.upcomingEvents];
                              updated[idx].image = url;
                              setFormData({
                                ...formData,
                                upcomingEvents: updated,
                              });
                            })
                          }
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: CONTACT US */}
          {activeTab === "contact" && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h3 className="font-bold text-lg text-[#282f3b]">
                  Contact Us Page & Communication
                </h3>
                <p className="text-xs text-slate-500">
                  Update primary church address, telephone numbers, emails,
                  meeting times, and Google Maps direction details.
                </p>
              </div>

              {/* 6.1 Address Details */}
              <div className="p-6 rounded-2xl bg-[#f0f3f9] border border-slate-200 space-y-4">
                <h4 className="text-sm font-bold text-[#282f3b]">
                  1. Church Location Address
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#282f3b] mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={formData.churchInfo.address.street}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          churchInfo: {
                            ...formData.churchInfo,
                            address: {
                              ...formData.churchInfo.address,
                              street: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-[#282f3b]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#282f3b] mb-1">
                      City / Area
                    </label>
                    <input
                      type="text"
                      value={formData.churchInfo.address.city}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          churchInfo: {
                            ...formData.churchInfo,
                            address: {
                              ...formData.churchInfo.address,
                              city: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-[#282f3b]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#282f3b] mb-1">
                      County / Borough
                    </label>
                    <input
                      type="text"
                      value={formData.churchInfo.address.county}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          churchInfo: {
                            ...formData.churchInfo,
                            address: {
                              ...formData.churchInfo.address,
                              county: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-[#282f3b]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#282f3b] mb-1">
                      Postcode
                    </label>
                    <input
                      type="text"
                      value={formData.churchInfo.address.postcode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          churchInfo: {
                            ...formData.churchInfo,
                            address: {
                              ...formData.churchInfo.address,
                              postcode: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-[#282f3b]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#282f3b] mb-1">
                    Complete Formatted Full Address
                  </label>
                  <input
                    type="text"
                    value={formData.churchInfo.address.fullAddress}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        churchInfo: {
                          ...formData.churchInfo,
                          address: {
                            ...formData.churchInfo.address,
                            fullAddress: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-[#282f3b]"
                  />
                </div>
              </div>

              {/* 6.2 Contact Numbers & Times */}
              <div className="p-6 rounded-2xl bg-[#f0f3f9] border border-slate-200 space-y-4">
                <h4 className="text-sm font-bold text-[#282f3b]">
                  2. Direct Contact & Meeting Times
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#282f3b] mb-1">
                      Church Phone
                    </label>
                    <input
                      type="text"
                      value={formData.churchInfo.contact.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          churchInfo: {
                            ...formData.churchInfo,
                            contact: {
                              ...formData.churchInfo.contact,
                              phone: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-[#282f3b]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#282f3b] mb-1">
                      General Email
                    </label>
                    <input
                      type="email"
                      value={formData.churchInfo.contact.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          churchInfo: {
                            ...formData.churchInfo,
                            contact: {
                              ...formData.churchInfo.contact,
                              email: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-[#282f3b]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#282f3b] mb-1">
                      UK Charity Reg No
                    </label>
                    <input
                      type="text"
                      value={formData.churchInfo.contact.charityNo}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          churchInfo: {
                            ...formData.churchInfo,
                            contact: {
                              ...formData.churchInfo.contact,
                              charityNo: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-[#282f3b]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#282f3b] mb-1">
                    Regular Gathering Times Summary
                  </label>
                  <input
                    type="text"
                    value={formData.contactContent.gatheringTimes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contactContent: {
                          ...formData.contactContent,
                          gatheringTimes: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-[#282f3b]"
                  />
                </div>
              </div>

              {/* 6.3 Social Links */}
              <div className="p-6 rounded-2xl bg-[#f0f3f9] border border-slate-200 space-y-4">
                <h4 className="text-sm font-bold text-[#282f3b]">
                  3. Official Social Channels
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#282f3b] mb-1">
                      Facebook URL
                    </label>
                    <input
                      type="text"
                      value={formData.churchInfo.contact.facebook}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          churchInfo: {
                            ...formData.churchInfo,
                            contact: {
                              ...formData.churchInfo.contact,
                              facebook: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-[#282f3b]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#282f3b] mb-1">
                      YouTube URL
                    </label>
                    <input
                      type="text"
                      value={formData.churchInfo.contact.youtube}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          churchInfo: {
                            ...formData.churchInfo,
                            contact: {
                              ...formData.churchInfo.contact,
                              youtube: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-[#282f3b]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#282f3b] mb-1">
                      Instagram URL
                    </label>
                    <input
                      type="text"
                      value={formData.churchInfo.contact.instagram}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          churchInfo: {
                            ...formData.churchInfo,
                            contact: {
                              ...formData.churchInfo.contact,
                              instagram: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-[#282f3b]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: BRANDING & MEDIA */}
          {activeTab === "branding" && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h3 className="font-bold text-lg text-[#282f3b]">
                  Church Branding & Global Media
                </h3>
                <p className="text-xs text-slate-500">
                  Update primary church name, high-resolution logo, taglines,
                  and photo gallery records.
                </p>
              </div>

              {/* Logo upload */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-40 h-16 bg-slate-900 rounded-lg p-2 flex items-center justify-center border border-slate-700 shrink-0">
                  <img
                    src={formData.churchInfo.logoUrl || "/images/logo-dr.png"}
                    alt="Logo Preview"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="flex-1 w-full space-y-1.5">
                  <label className="block text-xs font-bold text-[#282f3b]">
                    Church Logo Image
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formData.churchInfo.logoUrl || ""}
                      placeholder="/images/logo-dr.png or Firebase Storage URL"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          churchInfo: {
                            ...formData.churchInfo,
                            logoUrl: e.target.value,
                          },
                        })
                      }
                      className="flex-1 px-4 py-2 rounded-xl bg-white border border-slate-300 text-xs text-[#282f3b]"
                    />
                    <label className="px-3.5 py-2 rounded-xl bg-[#478226] hover:bg-[#39691e] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-transform hover:scale-105 shrink-0">
                      {uploadingField === "church_logo" ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Uploading ({uploadProgress}%)...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload New Logo</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingField !== null}
                        onChange={(e) =>
                          handleImageUpload(e, "church_logo", (url) => {
                            setFormData({
                              ...formData,
                              churchInfo: {
                                ...formData.churchInfo,
                                logoUrl: url,
                              },
                            });
                          })
                        }
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Taglines */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#282f3b] mb-1">
                    Primary Tagline
                  </label>
                  <input
                    type="text"
                    value={formData.churchInfo.tagline}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        churchInfo: {
                          ...formData.churchInfo,
                          tagline: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-[#f0f3f9] border border-slate-300 text-xs text-[#282f3b]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#282f3b] mb-1">
                    Secondary Sub-Tagline
                  </label>
                  <input
                    type="text"
                    value={formData.churchInfo.subTagline}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        churchInfo: {
                          ...formData.churchInfo,
                          subTagline: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-[#f0f3f9] border border-slate-300 text-xs text-[#282f3b]"
                  />
                </div>
              </div>

              {/* Photo Gallery List */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-[#282f3b]">
                    Photo Gallery ({formData.galleryItems.length})
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const newItem = {
                        id: `g_${Date.now()}`,
                        title: "New Church Photo",
                        category: "Worship" as const,
                        imageUrl: "/images/event-worship-1.jpg",
                        caption: "Gathering in praise and fellowship.",
                      };
                      setFormData({
                        ...formData,
                        galleryItems: [newItem, ...formData.galleryItems],
                      });
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-[#478226] text-white text-xs font-bold flex items-center gap-1.5 shadow"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Photo</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.galleryItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-[#f0f3f9] border border-slate-200 space-y-2 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="relative h-32 rounded-xl overflow-hidden bg-slate-200 border border-slate-300">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = formData.galleryItems.filter(
                                (_, i) => i !== idx
                              );
                              setFormData({
                                ...formData,
                                galleryItems: updated,
                              });
                            }}
                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-rose-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            const updated = [...formData.galleryItems];
                            updated[idx].title = e.target.value;
                            setFormData({
                              ...formData,
                              galleryItems: updated,
                            });
                          }}
                          placeholder="Photo Title"
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-[#282f3b]"
                        />

                        <select
                          value={item.category}
                          onChange={(e) => {
                            const updated = [...formData.galleryItems];
                            updated[idx].category = e.target.value as any;
                            setFormData({
                              ...formData,
                              galleryItems: updated,
                            });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-[#282f3b]"
                        >
                          <option value="Worship">Worship</option>
                          <option value="Fellowship">Fellowship</option>
                          <option value="Baptism">Baptism</option>
                          <option value="Youth">Youth</option>
                          <option value="Outreach">Outreach</option>
                        </select>
                      </div>

                      <label className="w-full py-1.5 rounded-lg bg-white hover:bg-slate-50 text-[#282f3b] border border-slate-300 text-[11px] font-bold cursor-pointer flex items-center justify-center gap-1 shadow-sm mt-2">
                        <Upload className="w-3 h-3 text-[#478226]" />
                        <span>Upload File</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleImageUpload(e, `gallery_${idx}`, (url) => {
                              const updated = [...formData.galleryItems];
                              updated[idx].imageUrl = url;
                              setFormData({
                                ...formData,
                                galleryItems: updated,
                              });
                            })
                          }
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <button
            type="button"
            onClick={handleReset}
            className="text-slate-500 hover:text-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Standard Defaults</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-[#282f3b] font-bold text-xs transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#478226] hover:bg-[#39691e] text-white font-bold text-xs shadow-lg flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Save & Publish Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentEditorModal;
