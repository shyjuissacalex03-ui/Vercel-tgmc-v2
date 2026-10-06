import React, { useState } from "react";
import { useContent } from "../firebase/contentContext.tsx";
import { useAuth } from "../firebase/authContext.tsx";
import { uploadChurchAsset } from "../firebase/storageService.ts";
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
  Layers,
  Calendar,
  Sparkles,
  CreditCard,
  Eye,
} from "lucide-react";

interface ContentEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContentEditorModal: React.FC<ContentEditorModalProps> = ({ isOpen, onClose }) => {
  const { content, saveContent, resetToDefaults } = useContent();
  const { currentUser, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<
    "info" | "hero" | "pastor" | "pillars" | "events" | "gallery" | "giving"
  >("info");

  // Local draft state
  const [formData, setFormData] = useState(content);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  // Sync draft when opened
  React.useEffect(() => {
    if (isOpen) {
      setFormData(content);
      setStatusMsg(null);
    }
  }, [isOpen, content]);

  if (!isOpen) return null;

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
      const downloadUrl = await uploadChurchAsset(file, "church_content", (pct) => {
        setUploadProgress(pct);
      });
      onSuccess(downloadUrl);
      setStatusMsg({
        type: "success",
        text: `Image "${file.name}" uploaded successfully to Firebase Storage!`,
      });
    } catch (err: any) {
      console.error("Storage upload failed:", err);
      setStatusMsg({
        type: "error",
        text: `Storage upload failed: ${err.message || "Please check permissions."}`,
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
        text: "Website content and images saved to Firebase Firestore successfully! All visitors will see your changes immediately.",
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
    if (!window.confirm("Are you sure you want to reset all content to default settings?")) return;
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
                <h2 className="text-lg sm:text-xl font-bold">TGMC Content & Image CMS</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ecb029] text-slate-950">
                  Firebase Connected
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Logged in as <strong className="text-slate-200">{currentUser?.email}</strong>{" "}
                {isAdmin && <span className="text-emerald-400">(Admin Privileges Active)</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-[#478226] hover:bg-[#39691e] text-white text-xs font-bold flex items-center gap-1.5 shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save Changes</span>
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

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 overflow-x-auto bg-[#f0f3f9] px-4 py-2 gap-1 text-xs">
          {[
            { id: "info", label: "General & Contacts", icon: Church },
            { id: "hero", label: "Hero Slides", icon: Sparkles },
            { id: "pastor", label: "Pastor Bio & Photo", icon: User },
            { id: "pillars", label: "Core Pillars", icon: Layers },
            { id: "events", label: "Events & Services", icon: Calendar },
            { id: "gallery", label: "Gallery Photos", icon: ImageIcon },
            { id: "giving", label: "Giving & Banking", icon: CreditCard },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
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
          {/* TAB 1: GENERAL INFO */}
          {activeTab === "info" && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h3 className="font-bold text-lg text-[#282f3b]">Church Information & Branding</h3>
                <p className="text-xs text-slate-500">
                  Update primary church name, logo, taglines, charity details, and address.
                </p>
              </div>

              {/* Church Logo upload */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-40 h-16 bg-slate-900 rounded-lg p-2 flex items-center justify-center border border-slate-700 shrink-0">
                  <img
                    src={formData.churchInfo.logoUrl || "/images/logo-dr.png"}
                    alt="Logo Preview"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="flex-1 w-full space-y-1.5">
                  <label className="block text-xs font-bold text-[#282f3b]">Church Logo</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formData.churchInfo.logoUrl || ""}
                      placeholder="/images/logo-dr.png or Firebase Storage URL"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          churchInfo: { ...formData.churchInfo, logoUrl: e.target.value },
                        })
                      }
                      className="flex-1 px-4 py-2 rounded-xl bg-white border border-slate-300 text-xs text-[#282f3b]"
                    />
                    <label className="px-3.5 py-2 rounded-xl bg-[#478226] hover:bg-[#39691e] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-transform hover:scale-105 shrink-0">
                      {uploadingField === "church_logo" ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>{uploadProgress}%</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Logo</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingField === "church_logo"}
                        onChange={(e) =>
                          handleImageUpload(e, "church_logo", (url) => {
                            setFormData({
                              ...formData,
                              churchInfo: { ...formData.churchInfo, logoUrl: url },
                            });
                          })
                        }
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#282f3b] mb-1">Church Name</label>
                  <input
                    type="text"
                    value={formData.churchInfo.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        churchInfo: { ...formData.churchInfo, name: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f0f3f9] border border-slate-300 text-xs text-[#282f3b] focus:outline-none focus:border-[#478226]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#282f3b] mb-1">
                    Charity Registration Number
                  </label>
                  <input
                    type="text"
                    value={formData.churchInfo.contact.charityNo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        churchInfo: {
                          ...formData.churchInfo,
                          contact: { ...formData.churchInfo.contact, charityNo: e.target.value },
                        },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f0f3f9] border border-slate-300 text-xs text-[#282f3b] focus:outline-none focus:border-[#478226]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#282f3b] mb-1">Tagline</label>
                  <input
                    type="text"
                    value={formData.churchInfo.tagline}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        churchInfo: { ...formData.churchInfo, tagline: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f0f3f9] border border-slate-300 text-xs text-[#282f3b] focus:outline-none focus:border-[#478226]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#282f3b] mb-1">Sub-Tagline</label>
                  <input
                    type="text"
                    value={formData.churchInfo.subTagline}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        churchInfo: { ...formData.churchInfo, subTagline: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f0f3f9] border border-slate-300 text-xs text-[#282f3b] focus:outline-none focus:border-[#478226]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#282f3b] mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.churchInfo.contact.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        churchInfo: {
                          ...formData.churchInfo,
                          contact: { ...formData.churchInfo.contact, phone: e.target.value },
                        },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f0f3f9] border border-slate-300 text-xs text-[#282f3b] focus:outline-none focus:border-[#478226]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#282f3b] mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.churchInfo.contact.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        churchInfo: {
                          ...formData.churchInfo,
                          contact: { ...formData.churchInfo.contact, email: e.target.value },
                        },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f0f3f9] border border-slate-300 text-xs text-[#282f3b] focus:outline-none focus:border-[#478226]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#282f3b] mb-1">Full Address</label>
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
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f0f3f9] border border-slate-300 text-xs text-[#282f3b] focus:outline-none focus:border-[#478226]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#282f3b] mb-1">Full Description</label>
                <textarea
                  rows={3}
                  value={formData.churchInfo.fullDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      churchInfo: { ...formData.churchInfo, fullDescription: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f0f3f9] border border-slate-300 text-xs text-[#282f3b] focus:outline-none focus:border-[#478226]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-[#282f3b] mb-1">Facebook URL</label>
                  <input
                    type="text"
                    value={formData.churchInfo.contact.facebook}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        churchInfo: {
                          ...formData.churchInfo,
                          contact: { ...formData.churchInfo.contact, facebook: e.target.value },
                        },
                      })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-[#f0f3f9] border border-slate-300 text-xs text-[#282f3b]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#282f3b] mb-1">YouTube URL</label>
                  <input
                    type="text"
                    value={formData.churchInfo.contact.youtube}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        churchInfo: {
                          ...formData.churchInfo,
                          contact: { ...formData.churchInfo.contact, youtube: e.target.value },
                        },
                      })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-[#f0f3f9] border border-slate-300 text-xs text-[#282f3b]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#282f3b] mb-1">Instagram URL</label>
                  <input
                    type="text"
                    value={formData.churchInfo.contact.instagram}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        churchInfo: {
                          ...formData.churchInfo,
                          contact: { ...formData.churchInfo.contact, instagram: e.target.value },
                        },
                      })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-[#f0f3f9] border border-slate-300 text-xs text-[#282f3b]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HERO SLIDES & IMAGES */}
          {activeTab === "hero" && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h3 className="font-bold text-lg text-[#282f3b]">Homepage Hero Slides</h3>
                <p className="text-xs text-slate-500">
                  Edit headlines, subtitles, and upload custom high-resolution banner images to Firebase Storage.
                </p>
              </div>

              {formData.heroSlides.map((slide, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#f0f3f9] border border-slate-200 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#478226] uppercase">
                      Hero Slide #{idx + 1}
                    </span>
                    <span className="text-[11px] text-slate-500">7-second rotation</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#282f3b] mb-1">Title</label>
                      <input
                        type="text"
                        value={slide.title}
                        onChange={(e) => {
                          const updated = [...formData.heroSlides];
                          updated[idx].title = e.target.value;
                          setFormData({ ...formData, heroSlides: updated });
                        }}
                        className="w-full px-4 py-2 rounded-xl bg-white border border-slate-300 text-xs text-[#282f3b]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#282f3b] mb-1">Subtitle</label>
                      <input
                        type="text"
                        value={slide.subtitle}
                        onChange={(e) => {
                          const updated = [...formData.heroSlides];
                          updated[idx].subtitle = e.target.value;
                          setFormData({ ...formData, heroSlides: updated });
                        }}
                        className="w-full px-4 py-2 rounded-xl bg-white border border-slate-300 text-xs text-[#282f3b]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#282f3b] mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={slide.description}
                      onChange={(e) => {
                        const updated = [...formData.heroSlides];
                        updated[idx].description = e.target.value;
                        setFormData({ ...formData, heroSlides: updated });
                      }}
                      className="w-full px-4 py-2 rounded-xl bg-white border border-slate-300 text-xs text-[#282f3b]"
                    />
                  </div>

                  {/* Image Upload for Hero Slide */}
                  <div className="pt-2 border-t border-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-12 rounded-lg bg-slate-200 overflow-hidden border border-slate-300 relative shrink-0">
                        <img
                          src={slide.image}
                          alt="Slide preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-xs">
                        <p className="font-semibold text-[#282f3b]">Current Background Image</p>
                        <p className="text-[11px] text-slate-500 truncate max-w-[240px]">
                          {slide.image}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-[#282f3b] border border-slate-300 text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-sm transition-colors">
                        {uploadingField === `slide_${idx}` ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#478226]" />
                            <span>Uploading ({uploadProgress}%)...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5 text-[#478226]" />
                            <span>Upload New Image</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploadingField !== null}
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
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: PASTOR BIO & PHOTO */}
          {activeTab === "pastor" && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h3 className="font-bold text-lg text-[#282f3b]">Lead Pastor Profile & Photo</h3>
                <p className="text-xs text-slate-500">
                  Update Lead Pastor's biography and upload an authentic portrait directly to Firebase Storage.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                <div className="md:col-span-4 space-y-3">
                  <div className="relative rounded-2xl overflow-hidden border border-slate-300 h-64 bg-slate-100 shadow-md">
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

                <div className="md:col-span-8 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#282f3b] mb-1">Pastor Name</label>
                      <input
                        type="text"
                        value={formData.pastorInfo.name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            pastorInfo: { ...formData.pastorInfo, name: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-[#f0f3f9] border border-slate-300 text-xs text-[#282f3b]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#282f3b] mb-1">Role Title</label>
                      <input
                        type="text"
                        value={formData.pastorInfo.role}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            pastorInfo: { ...formData.pastorInfo, role: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-[#f0f3f9] border border-slate-300 text-xs text-[#282f3b]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#282f3b] mb-1">Phone</label>
                      <input
                        type="text"
                        value={formData.pastorInfo.phone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            pastorInfo: { ...formData.pastorInfo, phone: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-[#f0f3f9] border border-slate-300 text-xs text-[#282f3b]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#282f3b] mb-1">Email</label>
                      <input
                        type="email"
                        value={formData.pastorInfo.email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            pastorInfo: { ...formData.pastorInfo, email: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-[#f0f3f9] border border-slate-300 text-xs text-[#282f3b]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#282f3b] mb-1">Pastor Biography</label>
                    <textarea
                      rows={5}
                      value={formData.pastorInfo.bio}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pastorInfo: { ...formData.pastorInfo, bio: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-[#f0f3f9] border border-slate-300 text-xs text-[#282f3b]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CORE PILLARS */}
          {activeTab === "pillars" && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h3 className="font-bold text-lg text-[#282f3b]">Our Three Core Pillars</h3>
                <p className="text-xs text-slate-500">
                  Customize the theological pillars and icons displayed on the front page.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {formData.corePillars.map((pillar, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-[#f0f3f9] border border-slate-200 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="w-14 h-14 rounded-xl bg-white border border-slate-300 flex items-center justify-center p-2 mx-auto">
                        <img
                          src={pillar.icon}
                          alt={pillar.title}
                          className="w-10 h-10 object-contain"
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
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-[#282f3b]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#282f3b] mb-1">
                          Description
                        </label>
                        <textarea
                          rows={3}
                          value={pillar.description}
                          onChange={(e) => {
                            const updated = [...formData.corePillars];
                            updated[idx].description = e.target.value;
                            setFormData({ ...formData, corePillars: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-[#282f3b]"
                        />
                      </div>
                    </div>

                    <label className="w-full py-2 rounded-lg bg-white hover:bg-slate-50 text-[#282f3b] border border-slate-300 text-[11px] font-bold cursor-pointer flex items-center justify-center gap-1 shadow-sm">
                      <Upload className="w-3 h-3 text-[#478226]" />
                      <span>Replace Icon</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleImageUpload(e, `pillar_${idx}`, (url) => {
                            const updated = [...formData.corePillars];
                            updated[idx].icon = url;
                            setFormData({ ...formData, corePillars: updated });
                          })
                        }
                      />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: EVENTS & SCHEDULES */}
          {activeTab === "events" && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg text-[#282f3b]">Manage Church Events</h3>
                  <p className="text-xs text-slate-500">
                    Add new upcoming events, service times, or update descriptions and event banner images.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newEv = {
                      id: `ev-${Date.now()}`,
                      title: "New TGMC Gathering",
                      date: "Upcoming Sunday",
                      time: "10:00 AM - 1:00 PM",
                      location: "150 York Rd, Uxbridge, UB8 1QW",
                      category: "Worship" as const,
                      description: "Join us for praise and worship in the presence of God.",
                      image: "/images/event-worship-1.jpg",
                      featured: true,
                    };
                    setFormData({
                      ...formData,
                      upcomingEvents: [newEv, ...formData.upcomingEvents],
                    });
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#478226] text-white text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Event</span>
                </button>
              </div>

              <div className="space-y-4">
                {formData.upcomingEvents.map((ev, idx) => (
                  <div
                    key={ev.id}
                    className="p-5 rounded-2xl bg-[#f0f3f9] border border-slate-200 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#478226]">Event #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formData.upcomingEvents.filter((_, i) => i !== idx);
                          setFormData({ ...formData, upcomingEvents: updated });
                        }}
                        className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#282f3b] mb-1">Title</label>
                        <input
                          type="text"
                          value={ev.title}
                          onChange={(e) => {
                            const updated = [...formData.upcomingEvents];
                            updated[idx].title = e.target.value;
                            setFormData({ ...formData, upcomingEvents: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-[#282f3b]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#282f3b] mb-1">Date</label>
                        <input
                          type="text"
                          value={ev.date}
                          onChange={(e) => {
                            const updated = [...formData.upcomingEvents];
                            updated[idx].date = e.target.value;
                            setFormData({ ...formData, upcomingEvents: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-[#282f3b]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#282f3b] mb-1">Time</label>
                        <input
                          type="text"
                          value={ev.time}
                          onChange={(e) => {
                            const updated = [...formData.upcomingEvents];
                            updated[idx].time = e.target.value;
                            setFormData({ ...formData, upcomingEvents: updated });
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
                            setFormData({ ...formData, upcomingEvents: updated });
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
                            setFormData({ ...formData, upcomingEvents: updated });
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
                          setFormData({ ...formData, upcomingEvents: updated });
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
                        <Upload className="w-3 h-3 text-[#478226]" />
                        <span>Upload Event Banner</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleImageUpload(e, `event_${idx}`, (url) => {
                              const updated = [...formData.upcomingEvents];
                              updated[idx].image = url;
                              setFormData({ ...formData, upcomingEvents: updated });
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

          {/* TAB 6: GALLERY & PHOTO UPLOADS */}
          {activeTab === "gallery" && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg text-[#282f3b]">Manage Photo Gallery</h3>
                  <p className="text-xs text-slate-500">
                    Upload new photos directly to Firebase Storage and assign categories and captions.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newItem = {
                      id: `g_${Date.now()}`,
                      title: "New Church Photo",
                      category: "Worship" as const,
                      imageUrl: "/images/event-worship-1.jpg",
                      caption: "Gathering in prayer and fellowship.",
                    };
                    setFormData({
                      ...formData,
                      galleryItems: [newItem, ...formData.galleryItems],
                    });
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#478226] text-white text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Gallery Item</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {formData.galleryItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-[#f0f3f9] border border-slate-200 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="relative h-36 rounded-xl overflow-hidden bg-slate-200 border border-slate-300">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = formData.galleryItems.filter((_, i) => i !== idx);
                            setFormData({ ...formData, galleryItems: updated });
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
                          setFormData({ ...formData, galleryItems: updated });
                        }}
                        placeholder="Photo Title"
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-[#282f3b]"
                      />

                      <select
                        value={item.category}
                        onChange={(e) => {
                          const updated = [...formData.galleryItems];
                          updated[idx].category = e.target.value as any;
                          setFormData({ ...formData, galleryItems: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-[#282f3b]"
                      >
                        <option value="Worship">Worship</option>
                        <option value="Fellowship">Fellowship</option>
                        <option value="Baptism">Baptism</option>
                        <option value="Youth">Youth</option>
                        <option value="Outreach">Outreach</option>
                      </select>

                      <input
                        type="text"
                        value={item.caption}
                        onChange={(e) => {
                          const updated = [...formData.galleryItems];
                          updated[idx].caption = e.target.value;
                          setFormData({ ...formData, galleryItems: updated });
                        }}
                        placeholder="Caption text"
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-[11px] text-slate-600"
                      />
                    </div>

                    <label className="w-full py-2 rounded-lg bg-white hover:bg-slate-50 text-[#282f3b] border border-slate-300 text-[11px] font-bold cursor-pointer flex items-center justify-center gap-1 shadow-sm">
                      <Upload className="w-3 h-3 text-[#478226]" />
                      <span>Upload to Storage</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleImageUpload(e, `gallery_${idx}`, (url) => {
                            const updated = [...formData.galleryItems];
                            updated[idx].imageUrl = url;
                            setFormData({ ...formData, galleryItems: updated });
                          })
                        }
                      />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: GIVING & BANK DETAILS */}
          {activeTab === "giving" && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h3 className="font-bold text-lg text-[#282f3b]">Bank Account & Stewardship Details</h3>
                <p className="text-xs text-slate-500">
                  Update bank wire details and gift aid instructions shown to donors.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#f0f3f9] border border-slate-200 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#282f3b] mb-1">
                      Account Name
                    </label>
                    <input
                      type="text"
                      value={formData.churchInfo.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          churchInfo: { ...formData.churchInfo, name: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-[#282f3b]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#282f3b] mb-1">
                      Charity Reg No
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
                  <div>
                    <label className="block text-xs font-bold text-[#282f3b] mb-1">
                      Account Contact Phone
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
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save & Publish Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentEditorModal;
