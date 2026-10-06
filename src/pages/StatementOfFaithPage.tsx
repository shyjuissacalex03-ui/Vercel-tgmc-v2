import React, { useState } from "react";
import { Link } from "../components/Router.tsx";
import { statementsOfFaith as defaultStatementsOfFaith } from "../data/churchData.ts";
import { useContent } from "../firebase/contentContext.tsx";
import {
  ChevronDown,
  ChevronUp,
  CircleCheck,
  BookOpen,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const StatementOfFaithPage: React.FC = () => {
  const { content } = useContent();
  const statementsOfFaith = content.statementsOfFaith || defaultStatementsOfFaith;

  // First item open by default
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    trinity: true,
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    statementsOfFaith.forEach((item) => (all[item.id] = true));
    setOpenItems(all);
  };

  const collapseAll = () => {
    setOpenItems({});
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen">
      {/* Header */}
      <section className="relative py-20 bg-slate-900 border-b border-slate-800 text-center space-y-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            Apostolic & Biblical Doctrine
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Statement of Faith
          </h1>
          <p className="text-slate-300 text-base max-w-2xl mx-auto leading-relaxed">
            Our core doctrinal convictions, standing firmly on the unchanging truth of Scripture for salvation, worship, and Spirit-filled living.
          </p>
          <div className="pt-2 flex justify-center gap-3 text-xs">
            <button
              onClick={expandAll}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              Collapse All
            </button>
          </div>
        </div>
      </section>

      {/* Accordion List */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-6">
            {statementsOfFaith.map((item) => {
              const isOpen = !!openItems[item.id];
              return (
                <div
                  key={item.id}
                  className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? "bg-slate-900 border-amber-500/50 shadow-2xl shadow-amber-500/5"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full p-6 text-left flex items-start sm:items-center justify-between gap-4 focus:outline-none transition-colors"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-300 font-extrabold flex items-center justify-center text-base shrink-0">
                        {item.number}
                      </div>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white">
                          {item.title}
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                          {item.summary}
                        </p>
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-800 text-amber-400 shrink-0">
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-8 pt-2 border-t border-slate-800 space-y-6 animate-in fade-in duration-200">
                      <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-medium">
                        {item.summary}
                      </p>

                      {/* Regular Points */}
                      {item.points && item.points.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                            Key Doctrinal Statements:
                          </h4>
                          <ul className="space-y-2.5">
                            {item.points.map((pt, i) => (
                              <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                                <CircleCheck className="w-4 h-4 text-amber-400 mt-1 shrink-0" />
                                <span>{pt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Subsections if present (Mission) */}
                      {item.subsections && item.subsections.length > 0 && (
                        <div className="space-y-4">
                          {item.subsections.map((sub, i) => (
                            <div
                              key={i}
                              className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2"
                            >
                              <div className="flex items-center justify-between flex-wrap gap-2">
                                <h4 className="font-bold text-base text-white">{sub.title}</h4>
                                <span className="text-xs text-amber-400 font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                                  {sub.scripture}
                                </span>
                              </div>
                              <p className="text-xs text-slate-300 leading-relaxed">
                                {sub.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Biblical References */}
                      <div className="pt-4 flex flex-wrap items-center gap-2 border-t border-slate-800/80 text-xs">
                        <span className="text-slate-400 font-semibold flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                          <span>Biblical References:</span>
                        </span>
                        {item.scriptures.map((sc, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 font-medium"
                          >
                            {sc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Contact prompt */}
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4">
            <h3 className="text-2xl font-bold text-white">Have Doctrinal or Spiritual Questions?</h3>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Our Lead Pastor Pr. Begin Alex and elders welcome your questions and would love to study God's Word with you.
            </p>
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow transition-all hover:scale-105 active:scale-95"
            >
              <span>Connect With Pastoral Team</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StatementOfFaithPage;
