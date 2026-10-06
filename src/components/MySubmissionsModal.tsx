import React, { useEffect, useState } from "react";
import { useAuth } from "../firebase/authContext.tsx";
import {
  subscribeUserPrayerRequests,
  subscribeUserRSVPs,
} from "../firebase/firestoreService.ts";
import { X, Heart, Calendar, Clock, MapPin, CheckCircle, LogOut, Edit3 } from "lucide-react";

interface MySubmissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenEditor?: () => void;
}

export const MySubmissionsModal: React.FC<MySubmissionsModalProps> = ({
  isOpen,
  onClose,
  onOpenEditor,
}) => {
  const { currentUser, signOut, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<"prayers" | "rsvps">("prayers");
  const [prayers, setPrayers] = useState<any[]>([]);
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !currentUser) return;
    setLoading(true);

    const unsubPrayers = subscribeUserPrayerRequests(
      currentUser.uid,
      (data) => {
        setPrayers(data);
        setLoading(false);
      },
      (err) => {
        console.warn("Could not fetch user prayers:", err);
        setLoading(false);
      }
    );

    const unsubRsvps = subscribeUserRSVPs(
      currentUser.uid,
      (data) => {
        setRsvps(data);
      },
      (err) => {
        console.warn("Could not fetch user RSVPs:", err);
      }
    );

    return () => {
      unsubPrayers();
      unsubRsvps();
    };
  }, [isOpen, currentUser]);

  if (!isOpen || !currentUser) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            {currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={currentUser.displayName || "User"}
                className="w-10 h-10 rounded-full border border-slate-300"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#478226] text-white flex items-center justify-center font-bold">
                {currentUser.displayName?.charAt(0) || "U"}
              </div>
            )}
            <div>
              <h3 className="font-bold text-base text-[#282f3b]">
                {currentUser.displayName || "Member"}
              </h3>
              <p className="text-xs text-slate-500">{currentUser.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && onOpenEditor && (
              <button
                onClick={onOpenEditor}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#478226] hover:bg-[#39691e] flex items-center gap-1.5 shadow-sm transition-all"
                title="Edit Website Content and Images"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#ecb029]" />
                <span>Edit Site Content</span>
              </button>
            )}
            <button
              onClick={() => {
                signOut();
                onClose();
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 flex items-center gap-1 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex p-1 bg-[#f0f3f9] rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab("prayers")}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "prayers"
                ? "bg-[#478226] text-white shadow"
                : "text-slate-600 hover:text-[#282f3b]"
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>My Prayer Requests ({prayers.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("rsvps")}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "rsvps"
                ? "bg-[#478226] text-white shadow"
                : "text-slate-600 hover:text-[#282f3b]"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>My Event RSVPs ({rsvps.length})</span>
          </button>
        </div>

        {/* Content list */}
        <div className="overflow-y-auto space-y-3 flex-1 pr-1">
          {activeTab === "prayers" ? (
            prayers.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                <Heart className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p>No prayer requests submitted yet.</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Submit a petition on the Home or Contact page.
                </p>
              </div>
            ) : (
              prayers.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-[#f0f3f9] border border-slate-200 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#282f3b]">{item.subject}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#478226]/10 text-[#478226] border border-[#478226]/20">
                      {item.status === "prayed" ? "Prayed Over" : "Active Petition"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.message}</p>
                  <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-200">
                    <span>Submitted {new Date(item.createdAt).toLocaleDateString()}</span>
                    <span>{item.isPrivate ? "Private to Pastoral Team" : "Public"}</span>
                  </div>
                </div>
              ))
            )
          ) : rsvps.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p>No event RSVPs registered yet.</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Explore our upcoming gatherings on the Events page.
              </p>
            </div>
          ) : (
            rsvps.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-[#f0f3f9] border border-slate-200 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#282f3b]">{item.eventTitle}</span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <CheckCircle className="w-3 h-3" /> Confirmed
                  </span>
                </div>
                <div className="text-xs text-slate-600 flex items-center gap-3">
                  <span>Attendees: {item.attendees}</span>
                  <span>·</span>
                  <span>Registered: {new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MySubmissionsModal;
