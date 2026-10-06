import React from "react";
import { Link } from "./Router.tsx";
import { OptimizedImage } from "./OptimizedImage.tsx";
import { useContent } from "../firebase/contentContext.tsx";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "./SocialIcons.tsx";
import { MapPin, Phone, Mail, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { content } = useContent();
  const churchInfo = content.churchInfo;

  return (
    <footer className="bg-[#1f2530] text-slate-300 pt-16 pb-8 border-t border-slate-700/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-700/60">
          {/* Col 1: About TGMC & Charity */}
          <div className="space-y-4">
            <div className="relative w-44 h-12">
              <OptimizedImage
                src={churchInfo.logoUrl || "/images/logo-dr.png"}
                alt={churchInfo.name}
                className="object-contain h-12 brightness-0 invert"
              />
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              We are a Bible-believing, Spirit-filled, CHRIST-centred, and mission-driven church passionate about living out the Gospel.
            </p>
            <div className="p-3 rounded-lg bg-[#282f3b] border border-slate-700 text-xs">
              <p className="text-slate-400">Charity Reg. No.</p>
              <p className="font-bold text-[#ecb029]">{churchInfo.contact.charityNo}</p>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 border-l-4 border-[#478226] pl-3">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link href="/" className="hover:text-[#ecb029] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#ecb029] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/statement-of-faith" className="hover:text-[#ecb029] transition-colors">
                  Statement of Faith
                </Link>
              </li>
              <li>
                <Link href="/pastor-bio" className="hover:text-[#ecb029] transition-colors">
                  Pastor's Bio
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-[#ecb029] transition-colors">
                  Events & Service Times
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-[#ecb029] transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="hover:text-[#ecb029] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/give" className="text-rose-400 font-semibold hover:text-rose-300 flex items-center gap-1">
                  <Heart className="w-3 h-3 fill-rose-500/20" />
                  <span>Give / Support</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Get In Touch */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 border-l-4 border-[#478226] pl-3">
              Get In Touch
            </h3>
            <div className="space-y-3 text-xs text-slate-300">
              <div>
                <p className="font-semibold text-white">Location</p>
                <p className="text-slate-300 flex items-start gap-1.5 mt-0.5">
                  <MapPin className="w-4 h-4 text-[#ecb029] shrink-0 mt-0.5" />
                  <span>{churchInfo.address.fullAddress}</span>
                </p>
              </div>
              <div>
                <p className="font-semibold text-white">Contact</p>
                <p className="flex items-center gap-1.5 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-[#ecb029]" />
                  <span>Phone: </span>
                  <a
                    href={`tel:${churchInfo.contact.phone.replace(/\s+/g, "")}`}
                    className="hover:text-[#ecb029]"
                  >
                    {churchInfo.contact.phone}
                  </a>
                </p>
                <p className="flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-[#ecb029]" />
                  <span>Mail Us: </span>
                  <a
                    href={`mailto:${churchInfo.contact.email}`}
                    className="hover:text-[#ecb029]"
                  >
                    {churchInfo.contact.email}
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Col 4: Follow Us */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 border-l-4 border-[#478226] pl-3">
              Follow Us
            </h3>
            <p className="text-xs text-slate-300 mb-4">
              Stay connected with our live worship services and weekly announcements.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={churchInfo.contact.facebook}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-lg bg-[#282f3b] border border-slate-700 flex items-center justify-center hover:bg-[#478226] hover:text-white transition-all text-slate-300"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href={churchInfo.contact.youtube}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-lg bg-[#282f3b] border border-slate-700 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all text-slate-300"
                aria-label="YouTube"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
              <a
                href={churchInfo.contact.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-lg bg-[#282f3b] border border-slate-700 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all text-slate-300"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>© {currentYear} The Great Mission Church (TGMC). All Rights Reserved.</p>
          <p>Malayali Pentecostal Church serving Uxbridge, Watford, Harefield & Hillingdon.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
