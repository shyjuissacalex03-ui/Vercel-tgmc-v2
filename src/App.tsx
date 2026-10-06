import React from "react";
import { RouterProvider, usePathname, Link } from "./components/Router.tsx";
import { AuthProvider } from "./firebase/authContext.tsx";
import { ContentProvider } from "./firebase/contentContext.tsx";
import { Navbar } from "./components/Navbar.tsx";
import { Footer } from "./components/Footer.tsx";
import { HomePage } from "./pages/HomePage.tsx";
import { AboutPage } from "./pages/AboutPage.tsx";
import { StatementOfFaithPage } from "./pages/StatementOfFaithPage.tsx";
import { PastorBioPage } from "./pages/PastorBioPage.tsx";
import { GalleryPage } from "./pages/GalleryPage.tsx";
import { EventsPage } from "./pages/EventsPage.tsx";
import { ContactPage } from "./pages/ContactPage.tsx";
import { GivePage } from "./pages/GivePage.tsx";
import { Home } from "lucide-react";

function RouteRenderer() {
  const pathname = usePathname();

  // Normalize path by stripping trailing slash
  const cleanPath = pathname.length > 1 && pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;

  switch (cleanPath) {
    case "/":
      return <HomePage />;
    case "/about":
      return <AboutPage />;
    case "/statement-of-faith":
      return <StatementOfFaithPage />;
    case "/pastor-bio":
      return <PastorBioPage />;
    case "/gallery":
      return <GalleryPage />;
    case "/events":
      return <EventsPage />;
    case "/contact-us":
      return <ContactPage />;
    case "/give":
      return <GivePage />;
    default:
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 bg-slate-950 text-white space-y-4">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            Page Not Found
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight">404 - Looking for Fellowship?</h1>
          <p className="text-slate-400 text-sm max-w-md">
            The page you are looking for doesn't exist or has moved. Return to our home page to explore service times and doctrines.
          </p>
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-[#478226] hover:bg-[#39691e] text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>
      );
  }
}

export function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <RouterProvider>
          <div className="min-h-screen flex flex-col bg-white text-slate-800">
            <Navbar />
            <main className="flex-1">
              <RouteRenderer />
            </main>
            <Footer />
          </div>
        </RouterProvider>
      </ContentProvider>
    </AuthProvider>
  );
}

export default App;
