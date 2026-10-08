import React, { createContext, useContext, useEffect, useState } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db, auth } from "./config.ts";
import { isUserAdminEmail } from "./authContext.tsx";
import { handleFirestoreError, OperationType } from "./errorHandler.ts";
import {
  churchInfo as defaultChurchInfo,
  pastorInfo as defaultPastorInfo,
  corePillars as defaultCorePillars,
  heroSlides as defaultHeroSlides,
  serviceSchedules as defaultServiceSchedules,
  upcomingEvents as defaultUpcomingEvents,
  galleryItems as defaultGalleryItems,
  statementsOfFaith as defaultStatementsOfFaith,
  defaultHomeContent,
  defaultAboutContent,
  defaultEventsContent,
  defaultContactContent,
  defaultStatementOfFaithHero,
  ChurchInfo,
  PastorInfo,
  ServiceSchedule,
  StatementOfFaith,
  GalleryItem,
  ChurchEvent,
  HomeContent,
  AboutPageContent,
  EventsPageContent,
  ContactPageContent,
  StatementOfFaithHero,
} from "../data/churchData.ts";

export interface ChurchContentState {
  churchInfo: ChurchInfo;
  pastorInfo: PastorInfo;
  corePillars: typeof defaultCorePillars;
  heroSlides: typeof defaultHeroSlides;
  serviceSchedules: ServiceSchedule[];
  upcomingEvents: ChurchEvent[];
  galleryItems: GalleryItem[];
  statementsOfFaith: StatementOfFaith[];
  homeContent: HomeContent;
  aboutContent: AboutPageContent;
  eventsContent: EventsPageContent;
  contactContent: ContactPageContent;
  statementOfFaithHero: StatementOfFaithHero;
}

interface ContentContextType {
  content: ChurchContentState;
  loading: boolean;
  saveContent: (updated: Partial<ChurchContentState>) => Promise<void>;
  resetToDefaults: () => Promise<void>;
}

const defaultContent: ChurchContentState = {
  churchInfo: defaultChurchInfo,
  pastorInfo: defaultPastorInfo,
  corePillars: defaultCorePillars,
  heroSlides: defaultHeroSlides,
  serviceSchedules: defaultServiceSchedules,
  upcomingEvents: defaultUpcomingEvents,
  galleryItems: defaultGalleryItems,
  statementsOfFaith: defaultStatementsOfFaith,
  homeContent: defaultHomeContent,
  aboutContent: defaultAboutContent,
  eventsContent: defaultEventsContent,
  contactContent: defaultContactContent,
  statementOfFaithHero: defaultStatementOfFaithHero,
};

const ContentContext = createContext<ContentContextType>({
  content: defaultContent,
  loading: true,
  saveContent: async () => {},
  resetToDefaults: async () => {},
});

export const useContent = () => useContext(ContentContext);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<ChurchContentState>(defaultContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(db, "siteContent", "main");

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setContent({
            churchInfo: data.churchInfo || defaultContent.churchInfo,
            pastorInfo: data.pastorInfo || defaultContent.pastorInfo,
            corePillars: data.corePillars || defaultContent.corePillars,
            heroSlides: data.heroSlides || defaultContent.heroSlides,
            serviceSchedules: data.serviceSchedules || defaultContent.serviceSchedules,
            upcomingEvents: data.upcomingEvents || defaultContent.upcomingEvents,
            galleryItems: data.galleryItems || defaultContent.galleryItems,
            statementsOfFaith: data.statementsOfFaith || defaultContent.statementsOfFaith,
            homeContent: data.homeContent || defaultContent.homeContent,
            aboutContent: data.aboutContent || defaultContent.aboutContent,
            eventsContent: data.eventsContent || defaultContent.eventsContent,
            contactContent: data.contactContent || defaultContent.contactContent,
            statementOfFaithHero: data.statementOfFaithHero || defaultContent.statementOfFaithHero,
          });
        } else {
          setContent(defaultContent);
        }
        setLoading(false);
      },
      (error) => {
        console.warn("Firestore siteContent read error (using fallback defaults):", error);
        setContent(defaultContent);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const saveContent = async (updated: Partial<ChurchContentState>) => {
    // Requirements 2 & 9: Only administrators can save or publish changes to Firestore
    if (!auth.currentUser || !isUserAdminEmail(auth.currentUser.email)) {
      throw new Error("You do not have permission to edit website content.");
    }

    const docRef = doc(db, "siteContent", "main");
    const merged = {
      ...content,
      ...updated,
      updatedAt: new Date().toISOString(),
      updatedBy: auth.currentUser?.email || "shyjuissacalex03@gmail.com",
    };

    try {
      await setDoc(docRef, merged, { merge: true });
      setContent(merged);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, "siteContent/main");
    }
  };

  const resetToDefaults = async () => {
    // Requirements 2 & 9: Only administrators can modify Firestore siteContent
    if (!auth.currentUser || !isUserAdminEmail(auth.currentUser.email)) {
      throw new Error("You do not have permission to edit website content.");
    }

    const docRef = doc(db, "siteContent", "main");
    try {
      await setDoc(docRef, {
        ...defaultContent,
        updatedAt: new Date().toISOString(),
        updatedBy: auth.currentUser?.email || "shyjuissacalex03@gmail.com",
      });
      setContent(defaultContent);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, "siteContent/main");
    }
  };

  return (
    <ContentContext.Provider
      value={{
        content,
        loading,
        saveContent,
        resetToDefaults,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};
