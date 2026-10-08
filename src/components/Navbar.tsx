import React, { useState, useEffect } from "react";
import { Link, usePathname } from "./Router.tsx";
import { OptimizedImage } from "./OptimizedImage.tsx";
import { useContent } from "../firebase/contentContext.tsx";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "./SocialIcons.tsx";
import { useAuth } from "../firebase/authContext.tsx";
import { MySubmissionsModal } from "./MySubmissionsModal.tsx";
import { AuthModal } from "./AuthModal.tsx";
import { ContentEditorModal, ContentEditorTabType } from "./ContentEditorModal.tsx";
import {
  MapPin,
  Mail,
  Phone,
  Heart,
  Tv,
  Menu,
  X,
  ChevronRight,
  LogIn,
  User as UserIcon,
  Edit3,
  Sparkles,
} from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Statement of Faith", href: "/statement-of-faith" },
  { name: "Pastor's Bio", href: "/pastor-bio" },
  { name: "Gallery", href: "/gallery" },
  { name: "Events", href: "/events" },
  { name: "Contact Us", href: "/contact-us" },
];

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [submissionsModalOpen, setSubmissionsModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"signin" | "signup">("signin");
  const [contentEditorOpen, setContentEditorOpen] = useState(false);
  const [editorInitialTab, setEditorInitialTab] = useState<ContentEditorTabType>("home");
  const pathname = usePathname();
  const { currentUser, signOut, isAdmin } = useAuth();
  const { content } = useContent();
  const churchInfo = content.churchInfo;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleOpenEditor = (e: any) => {
      if (e?.detail?.tab) {
        setEditorInitialTab(e.detail.tab);
      }
      setContentEditorOpen(true);
    };
    window.addEventListener("open-cms-editor", handleOpenEditor);
    return () => window.removeEventListener("open-cms-editor", handleOpenEditor);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 w-full transition-all duration-300 shadow-md">
        {/* Top Utility Bar */}
        <div className="bg-[#1f2530] text-slate-200 text-xs py-2 px-4 border-b border-slate-700/60 hidden md:block">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
            {/* Left Contacts */}
            <div className="flex items-center gap-5 lg:gap-6 flex-wrap">
              <span className="flex items-center gap-1.5 text-slate-300 hover:text-[#ecb029] transition-colors">
                <MapPin className="w-3.5 h-3.5 text-[#ecb029] shrink-0" />
                <span>{churchInfo.address.fullAddress}</span>
              </span>
              <a
                href={`mailto:${churchInfo.contact.email}`}
                className="flex items-center gap-1.5 text-slate-300 hover:text-[#ecb029] transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#ecb029] shrink-0" />
                <span>{churchInfo.contact.email}</span>
              </a>
              <a
                href={`tel:${churchInfo.contact.phone.replace(/\s+/g, "")}`}
                className="flex items-center gap-1.5 text-slate-300 hover:text-[#ecb029] transition-colors font-medium"
              >
                <Phone className="w-3.5 h-3.5 text-[#ecb029] shrink-0" />
                <span>{churchInfo.contact.phone}</span>
              </a>
            </div>

            {/* Right Charity, Socials & Auth */}
            <div className="flex items-center gap-3">
              <span className="bg-[#282f3b] px-2.5 py-0.5 rounded text-[11px] text-[#ecb029] border border-[#ecb029]/30 font-medium">
                Charity No: {churchInfo.contact.charityNo}
              </span>
              <div className="flex items-center gap-2.5 text-slate-300">
                <a
                  href={churchInfo.contact.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#ecb029] transition-colors"
                  aria-label="Facebook"
                >
                  <FacebookIcon className="w-3.5 h-3.5" />
                </a>
                <a
                  href={churchInfo.contact.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-red-400 transition-colors"
                  aria-label="YouTube"
                >
                  <YoutubeIcon className="w-3.5 h-3.5" />
                </a>
                <a
                  href={churchInfo.contact.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-pink-400 transition-colors"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="w-3.5 h-3.5" />
                </a>
              </div>
              <Link
                href="/give"
                className="flex items-center gap-1 text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors"
              >
                <Heart className="w-3.5 h-3.5 fill-rose-500/30" />
                <span>Give</span>
              </Link>

              {/* User Authentication in Top Bar */}
              {currentUser ? (
                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <button
                      onClick={() => setContentEditorOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#478226] hover:bg-[#39691e] text-white text-[11px] font-bold transition-all shadow hover:scale-105 border border-emerald-400/30"
                      title="Admin CMS: Edit content and upload images"
                    >
                      <Edit3 className="w-3 h-3 text-[#ecb029]" />
                      <span>Edit Site & Images</span>
                    </button>
                  )}
                  <button
                    onClick={() => setSubmissionsModalOpen(true)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#282f3b] hover:bg-slate-700 text-[#ecb029] border border-[#ecb029]/30 text-[11px] font-semibold transition-colors"
                    title="View Account and Submissions"
                  >
                    {currentUser.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt="Avatar"
                        className="w-4 h-4 rounded-full"
                      />
                    ) : (
                      <UserIcon className="w-3.5 h-3.5" />
                    )}
                    <span className="truncate max-w-[90px]">
                      {currentUser.displayName?.split(" ")[0] || currentUser.email?.split("@")[0] || "Account"}
                    </span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setAuthModalMode("signin");
                      setAuthModalOpen(true);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#478226] hover:bg-[#39691e] text-white text-[11px] font-bold transition-colors shadow-sm"
                  >
                    <LogIn className="w-3 h-3 text-[#ecb029]" />
                    <span>Sign In</span>
                  </button>
                  <button
                    onClick={() => {
                      setAuthModalMode("signup");
                      setAuthModalOpen(true);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#282f3b] hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition-colors border border-slate-700"
                  >
                    <span>Register</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <nav
          className={`w-full bg-white transition-all duration-300 border-b border-slate-200 ${
            scrolled ? "py-2.5 shadow-lg" : "py-3.5"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-44 h-12">
                <OptimizedImage
                  src={churchInfo.logoUrl || "/images/logo-dr.png"}
                  alt={churchInfo.name}
                  priority={true}
                  className="object-contain h-12 w-auto"
                />
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "text-[#478226] bg-[#478226]/10 font-bold"
                        : "text-[#282f3b] hover:text-[#478226] hover:bg-slate-50"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Action Button & Mobile Hamburger */}
            <div className="flex items-center gap-2.5">
              {currentUser && isAdmin && (
                <button
                  onClick={() => setContentEditorOpen(true)}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-[#ecb029] hover:bg-[#d69d20] text-slate-950 shadow-md transition-all duration-200 hover:scale-105 active:scale-95"
                  title="Edit Church Website Content & Upload Images"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Content</span>
                </button>
              )}

              <a
                href="https://www.youtube.com/@tgmcuk"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-[#478226] hover:bg-[#39691e] text-white shadow-md transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <Tv className="w-3.5 h-3.5" />
                <span>Watch Live</span>
              </a>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-[#282f3b] hover:bg-slate-100 focus:outline-none border border-slate-200"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-[#1f2530]/98 backdrop-blur-md flex flex-col justify-between p-6 animate-in fade-in duration-200">
            <div className="flex justify-between items-center pb-4 border-b border-slate-700">
              <div className="relative w-40 h-10">
                <OptimizedImage
                  src={churchInfo.logoUrl || "/images/logo-dr.png"}
                  alt="TGMC Logo"
                  className="object-contain h-10 brightness-0 invert"
                />
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg text-slate-300 hover:text-white bg-slate-800"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-2 my-auto py-6 overflow-y-auto">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                      isActive
                        ? "bg-[#478226] text-white font-bold"
                        : "text-slate-200 hover:bg-slate-800"
                    }`}
                  >
                    <span>{link.name}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                );
              })}
              <Link
                href="/give"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold text-rose-400 hover:bg-slate-800"
              >
                <span className="flex items-center gap-2">
                  <Heart className="w-4 h-4 fill-rose-500/30 text-rose-400" />
                  <span>Give / Support</span>
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>

              {/* Mobile Auth and CMS actions */}
              {currentUser ? (
                <div className="space-y-2 pt-2 border-t border-slate-700">
                  {isAdmin && (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setContentEditorOpen(true);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-base font-bold text-slate-950 bg-[#ecb029] shadow-md"
                    >
                      <Edit3 className="w-5 h-5" />
                      <span>Edit Site Content & Images</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setSubmissionsModalOpen(true);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold text-[#ecb029] bg-slate-800"
                  >
                    <span className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4" />
                      <span>My Account ({currentUser.displayName?.split(" ")[0] || "User"})</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2 pt-2 border-t border-slate-700">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setAuthModalMode("signin");
                      setAuthModalOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-base font-semibold text-white bg-[#478226] hover:bg-[#39691e]"
                  >
                    <LogIn className="w-4 h-4 text-[#ecb029]" />
                    <span>Sign In (Email or Google)</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setAuthModalMode("signup");
                      setAuthModalOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-base font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700"
                  >
                    <span>Create TGMC Account</span>
                  </button>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-700 space-y-3 text-center">
              <a
                href="https://www.youtube.com/@tgmcuk"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#478226] text-white font-bold text-sm shadow-md"
              >
                <Tv className="w-4 h-4" />
                <span>Watch Live Stream</span>
              </a>
              <p className="text-xs text-slate-400">
                📞 {churchInfo.contact.phone} | Charity No: {churchInfo.contact.charityNo}
              </p>
            </div>
          </div>
        )}
      </header>

      {/* Floating Action Button for Content Editor - Admin Only */}
      {currentUser && isAdmin && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setContentEditorOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#478226] hover:bg-[#39691e] text-white font-bold text-xs shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 border-2 border-white/25 group"
            title="Edit Church Website Content & Upload Images"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-ping" />
            <Edit3 className="w-4 h-4 text-[#ecb029]" />
            <span>Edit Content & Images</span>
          </button>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />

      {/* Content Editor Modal */}
      <ContentEditorModal
        isOpen={contentEditorOpen}
        onClose={() => setContentEditorOpen(false)}
        initialTab={editorInitialTab}
      />

      {/* Submissions Modal */}
      <MySubmissionsModal
        isOpen={submissionsModalOpen}
        onClose={() => setSubmissionsModalOpen(false)}
        onOpenEditor={() => {
          setSubmissionsModalOpen(false);
          setContentEditorOpen(true);
        }}
      />
    </>
  );
};

export default Navbar;

