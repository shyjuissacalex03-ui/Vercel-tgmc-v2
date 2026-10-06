import React, { useEffect } from "react";
import { X, Radio, ExternalLink } from "lucide-react";

interface LiveStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveStreamModal: React.FC<LiveStreamModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#1f2530] rounded-2xl border border-slate-700 overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-700 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-red-500 animate-pulse" />
            <span className="font-bold text-sm">TGMC Official YouTube Broadcast</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
            aria-label="Close live stream player"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Container */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            className="w-full h-full"
            src="https://www.youtube-nocookie.com/embed/videoseries?list=PL2czf23ni4jun3&autoplay=1"
            title="TGMC Live Stream Worship"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#191e28] border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-slate-300">
            Sunday Worship: 10:00 AM - 1:00 PM UK Time
          </span>
          <a
            href="https://www.youtube.com/@tgmcuk"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold flex items-center gap-1.5 transition-colors"
          >
            <span>Open in YouTube App</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default LiveStreamModal;
