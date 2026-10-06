import React, { useState } from "react";
import { OptimizedImage } from "../components/OptimizedImage.tsx";
import { galleryItems as defaultGalleryItems, GalleryItem } from "../data/churchData.ts";
import { useContent } from "../firebase/contentContext.tsx";
import { Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";

const categories = ["All", "Worship", "Fellowship", "Baptism", "Youth", "Outreach"] as const;

export const GalleryPage: React.FC = () => {
  const { content } = useContent();
  const galleryItems = content.galleryItems || defaultGalleryItems;

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const filteredItems = selectedCategory === "All"
    ? galleryItems
    : galleryItems.filter((item) => item.category === selectedCategory);

  const currentIndex = activeItem
    ? filteredItems.findIndex((it) => it.id === activeItem.id)
    : -1;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      setActiveItem(filteredItems[currentIndex - 1]);
    } else {
      setActiveItem(filteredItems[filteredItems.length - 1]);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < filteredItems.length - 1) {
      setActiveItem(filteredItems[currentIndex + 1]);
    } else {
      setActiveItem(filteredItems[0]);
    }
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen">
      {/* Header */}
      <section className="relative py-20 bg-slate-900 border-b border-slate-800 text-center space-y-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            Church Moments
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Photo & Media Gallery
          </h1>
          <p className="text-slate-300 text-base max-w-2xl mx-auto">
            Capturing the vibrant worship, holy baptisms, youth gatherings, and fellowship moments at The Great Mission Church.
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? "bg-amber-500 text-slate-950 shadow-md"
                    : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveItem(item)}
                className="group relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 cursor-pointer shadow-xl hover:border-amber-500/40 transition-all duration-300"
              >
                <div className="relative h-64 w-full overflow-hidden">
                  <OptimizedImage
                    src={item.imageUrl}
                    alt={item.title}
                    fill={true}
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-300 text-[11px] font-semibold border border-amber-500/30">
                    {item.category}
                  </div>
                  <div className="absolute top-3 right-3 p-2 rounded-xl bg-slate-950/80 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow">
                    <Maximize2 className="w-4 h-4 text-amber-400" />
                  </div>
                </div>

                <div className="p-5 space-y-1 bg-slate-900">
                  <h3 className="font-bold text-white text-base group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400">{item.caption}</p>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-16 bg-slate-900/50 rounded-3xl border border-slate-800">
              <p className="text-slate-400 text-sm">No photos found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {activeItem && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
                  {activeItem.category}
                </span>
                <span className="font-bold text-sm sm:text-base">{activeItem.title}</span>
              </div>
              <button
                onClick={() => setActiveItem(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors"
                aria-label="Close image lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Image in Modal */}
            <div className="relative aspect-[16/10] sm:aspect-video w-full bg-black">
              <OptimizedImage
                src={activeItem.imageUrl}
                alt={activeItem.title}
                fill={true}
                priority={true}
                className="object-contain"
              />

              {/* Prev / Next controls */}
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-all border border-white/10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-all border border-white/10"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Caption */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <p>{activeItem.caption}</p>
              <span className="text-slate-500">
                {currentIndex + 1} of {filteredItems.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
