export interface ChurchInfo {
  name: string;
  tagline: string;
  subTagline: string;
  shortDescription: string;
  fullDescription: string;
  address: {
    street: string;
    city: string;
    county: string;
    postcode: string;
    fullAddress: string;
  };
  contact: {
    phone: string;
    email: string;
    charityNo: string;
    facebook: string;
    youtube: string;
    instagram: string;
  };
  logoUrl?: string;
}

export interface PastorInfo {
  id: string;
  name: string;
  role: string;
  badge?: string;
  heroBadge?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  quote: string;
  bio: string;
  bioParagraph2: string;
  bioParagraph3: string;
  image: string;
  fallbackImage?: string;
  email: string;
  phone: string;
  highlights: { title: string; desc: string }[];
}

export interface HeroSlide {
  subtitle: string;
  title: string;
  description: string;
  image: string;
  ctaText?: string;
  ctaLink?: string;
}

export interface CorePillar {
  title: string;
  description: string;
  icon: string;
}

export interface HomeContent {
  introBadge: string;
  introTitle: string;
  introParagraph1: string;
  introParagraph2: string;
  introImage: string;
  liveStreamTitle: string;
  liveStreamSubtitle: string;
  liveStreamUrl: string;
  liveStreamPreviewImage: string;
  quickWorshipTitle: string;
  quickWorshipTime: string;
  quickWorshipLocation: string;
  testimonialsTitle: string;
  testimonialsSubtitle: string;
}

export interface AboutPageContent {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heritageTitle: string;
  heritageParagraph1: string;
  heritageParagraph2: string;
  heritageImage: string;
  charityNote: string;
  missionTitle: string;
  missionVerse: string;
  missionIntro: string;
  missionPoints: string[];
  visionTitle: string;
  visionVerse: string;
  visionDescription: string;
  coreValues: { title: string; description: string; scripture?: string }[];
}

export interface EventsPageContent {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  scheduleTitle: string;
  scheduleSubtitle: string;
  eventsListTitle: string;
  eventsListSubtitle: string;
  calendarTitle: string;
  calendarSubtitle: string;
  calendarEmbedUrl: string;
}

export interface ContactPageContent {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  gatheringTimes: string;
  mapEmbedUrl: string;
  prayerIntroText: string;
  enquiryIntroText: string;
}

export interface StatementOfFaithHero {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
}

export interface GivingInfo {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  bankName: string;
  accountName: string;
  sortCode: string;
  accountNumber: string;
  iban: string;
  reference: string;
  giftAidNote: string;
}

export interface ServiceSchedule {
  id: string;
  day: string;
  time: string;
  title: string;
  language: string;
  description: string;
  location: string;
  isLiveStreamed: boolean;
}

export interface StatementOfFaith {
  id: string;
  number: number;
  title: string;
  summary: string;
  points?: string[];
  subsections?: {
    letter: string;
    title: string;
    description: string;
    scripture: string;
  }[];
  scriptures: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  category: "Worship" | "Fellowship" | "Baptism" | "Youth" | "Outreach";
  imageUrl: string;
  caption: string;
}

export interface ChurchEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: "Worship" | "Special" | "Prayer" | "Youth";
  description: string;
  image: string;
  featured: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar?: string;
}

export const churchInfo: ChurchInfo = {
  name: "The Great Mission Church",
  tagline: "Rooted in the Word, Centered on CHRIST",
  subTagline: "Proclaiming the Truth. Transforming Lives.",
  shortDescription:
    "Spirit-filled Malayali Pentecostal church (TGMC) in Uxbridge. Worship in English & Malayalam. Serving Watford, Harefield & Hillingdon.",
  fullDescription:
    "We are a Bible-believing, Spirit-filled, CHRIST-centred, and mission-driven church passionate about living out the Gospel. Our desire is to glorify GOD, walk in the power of the Holy Spirit, and reach people everywhere with the love and truth of JESUS CHRIST.",
  address: {
    street: "150 York Rd",
    city: "Uxbridge",
    county: "Hillingdon",
    postcode: "UB8 1QW",
    fullAddress: "150 York Rd, Uxbridge, Hillingdon, UB8 1QW",
  },
  contact: {
    phone: "+44 7846958451",
    email: "connect@tgmchurch.uk",
    charityNo: "1213279",
    facebook: "https://www.facebook.com/tgmcuk/",
    youtube: "https://www.youtube.com/@tgmcuk",
    instagram: "https://www.instagram.com/tgmcuk/",
  },
};

export const pastorInfo: PastorInfo = {
  id: "pr-begin-alex",
  name: "Pr. Begin Alex",
  role: "Lead Pastor",
  heroBadge: "Leadership & Ministry",
  heroTitle: "Pastor's Bio",
  heroSubtitle: "Pr. Begin Alex — Lead Pastor of The Great Mission Church, Uxbridge.",
  quote: "A wonderful place of worship and spiritual growth. The services are Spirit-filled, and Pr. Begin Alex leads with great dedication and love.",
  bio: "Pr. Begin Alex leads The Great Mission Church with great dedication and love. Under his anointed leadership, TGMC serves as a Spirit-filled Malayalam Pentecostal church in Uxbridge, committed to biblical preaching, prayer, and kingdom impact.",
  bioParagraph2: "Serving families across Watford, Harefield, Hillingdon, and Greater London, Pr. Begin Alex ministers in English and Malayalam, guiding believers into spiritual maturity through biblical exposition, apostolic prayer, and compassionate pastoral care.",
  bioParagraph3: "Under his ministry, The Great Mission Church has grown into a vibrant spiritual family committed to the Great Commission of Jesus Christ: proclaiming the Gospel, making disciples, and caring for people with Christlike love.",
  image: "/images/pastor-begin-alex.jpg",
  fallbackImage: "/images/livestream-preview.jpg",
  email: "connect@tgmchurch.uk",
  phone: "+44 7846958451",
  highlights: [
    { title: "Biblical Expository Preaching", desc: "Uncompromising devotion to God's holy Word in English & Malayalam." },
    { title: "Pastoral Shepherding", desc: "Devoted care, home visits, and intercessory prayer for every family." },
  ],
};

export const defaultHomeContent: HomeContent = {
  introBadge: "Welcome to",
  introTitle: "The Great Mission Church",
  introParagraph1: "We are a Bible-believing, Spirit-filled, CHRIST-centred, and mission-driven church passionate about living out the Gospel. Our desire is to glorify GOD, walk in the power of the Holy Spirit, and reach people everywhere with the love and truth of JESUS CHRIST.",
  introParagraph2: "Based in Uxbridge, we welcome all believers and seekers to join our worship services conducted in Malayalam and English.",
  introImage: "/images/pastor-begin-alex.jpg",
  liveStreamTitle: "The Great Mission Church Live Stream!",
  liveStreamSubtitle: "Experience the presence of GOD right where you are through our live worship services. Every message, song, and prayer is centered on JESUS CHRIST — inspiring faith, renewing hope, and strengthening your walk with GOD.",
  liveStreamUrl: "https://www.youtube.com/@tgmcuk",
  liveStreamPreviewImage: "/images/livestream-preview.png",
  quickWorshipTitle: "Sunday Worship",
  quickWorshipTime: "10:00 AM - 1:00 PM",
  quickWorshipLocation: "150 York Rd, Uxbridge, Hillingdon, UB8 1QW",
  testimonialsTitle: "Voices of Our Community",
  testimonialsSubtitle: "Hear how God is moving in the lives of our church family and visitors.",
};

export const defaultAboutContent: AboutPageContent = {
  heroBadge: "Who We Are",
  heroTitle: "About The Great Mission Church",
  heroSubtitle: "A Bible-believing, Spirit-filled, CHRIST-centred, and mission-driven church community located in Uxbridge, United Kingdom.",
  heroImage: "/images/event-worship-2.jpg",
  heritageTitle: "Our Identity & Heritage",
  heritageParagraph1: "We are a Bible-believing, Spirit-filled, CHRIST-centred, and mission-driven church. We are passionate about living out the Gospel, walking in the power of the Holy Spirit, and reaching people from every background with the love and truth of JESUS CHRIST.",
  heritageParagraph2: "Based in Uxbridge (Hillingdon), we proudly serve believers and families across Watford, Harefield, Hillingdon, and the broader Greater London region with services conducted in English and Malayalam.",
  heritageImage: "/images/event-worship-2.jpg",
  charityNote: "Serving the community with biblical integrity, transparency, and Christian compassion.",
  missionTitle: "Our Mission",
  missionVerse: "Matthew 28:18–20",
  missionIntro: "We exist to bring people everywhere into a saving relationship with JESUS CHRIST. We do this through:",
  missionPoints: [
    "Proclaiming the Gospel with clarity, conviction, and divine boldness.",
    "Planting churches that reflect the heart and global mission of CHRIST.",
    "Making disciples who are rooted in Scripture and led by the Holy Spirit.",
    "Serving our communities with Christian charity, warmth, and mercy.",
  ],
  visionTitle: "Our Vision",
  visionVerse: "Habakkuk 2:14",
  visionDescription: "To see a generation awakened to the glory of GOD, lives transformed by the Holy Spirit, and the Church equipped to impact the UK and beyond for eternity.",
  coreValues: [
    { title: "Christ-Centred", description: "JESUS is the head of our church, the centre of our worship, and the foundation of our faith.", scripture: "Colossians 1:18" },
    { title: "Word-Anchored", description: "The Bible is the inspired, infallible, and authoritative Word of GOD that governs everything we believe and practice.", scripture: "2 Timothy 3:16" },
    { title: "Spirit-Empowered", description: "We believe in the power, presence, and gifts of the Holy Spirit for ministry, worship, and holy living today.", scripture: "Acts 1:8" },
    { title: "Mission-Driven", description: "We exist to carry out the Great Commission by evangelising the lost and discipling believers.", scripture: "Mark 16:15" },
  ],
};

export const defaultEventsContent: EventsPageContent = {
  heroBadge: "Fellowship & Gatherings",
  heroTitle: "Church Events & Services",
  heroSubtitle: "Join our weekly worship services in Uxbridge, fasting prayer gatherings, youth fellowships, and special mission events.",
  scheduleTitle: "Weekly Gathering Schedule",
  scheduleSubtitle: "Regular services held at our Uxbridge worship facility and streamed online.",
  eventsListTitle: "Upcoming Church Events",
  eventsListSubtitle: "Mark your calendar for special services, seasonal conferences, and community gatherings.",
  calendarTitle: "Official TGMC Google Calendar",
  calendarSubtitle: "Interactive Schedule",
  calendarEmbedUrl: "https://calendar.google.com/calendar/u/0/newembed?height=600&wkst=1&ctz=Europe/London&showPrint=0&showTabs=0&showTz=0&showCalendars=0&hl=en_GB&src=dGdtY2h1cmNodWtAZ21haWwuY29t&color=%23039be5",
};

export const defaultContactContent: ContactPageContent = {
  heroBadge: "We'd Love to Hear From You",
  heroTitle: "Contact The Great Mission Church",
  heroSubtitle: "Find our location in Uxbridge, general enquiry contacts, and prayer request forms.",
  gatheringTimes: "Every Sunday 10:00 AM – 1:00 PM | Friday Bible Study 7:00 PM",
  mapEmbedUrl: "https://www.google.com/maps?q=150+York+Rd,+Uxbridge,+Hillingdon,+UB8+1QW",
  prayerIntroText: "Our pastoral and intercessory prayer team prays over every petition with confidentiality and faith.",
  enquiryIntroText: "Have questions about Sunday services, Malayalam fellowship, or ministry opportunities? Reach out to us below.",
};

export const defaultStatementOfFaithHero: StatementOfFaithHero = {
  heroBadge: "Apostolic & Biblical Doctrine",
  heroTitle: "Statement of Faith",
  heroSubtitle: "Our core doctrinal convictions, standing firmly on the unchanging truth of Scripture for salvation, worship, and Spirit-filled living.",
};

export const serviceSchedules: ServiceSchedule[] = [
  {
    id: "sunday-worship",
    day: "Every Sunday",
    time: "10:00 AM - 1:00 PM",
    title: "Sunday Worship Service",
    language: "Malayalam & English",
    description:
      "An empowering morning of praise, worship, prayer, breaking of bread, and anointed preaching from the Word of God.",
    location: "150 York Rd, Uxbridge, Hillingdon, UB8 1QW",
    isLiveStreamed: true,
  },
  {
    id: "friday-bible-study",
    day: "Every Friday",
    time: "7:00 PM - 8:30 PM",
    title: "Friday Bible Study",
    language: "English & Malayalam",
    description:
      "Deep verse-by-verse exploration of God's Word with interactive Q&A and group prayer.",
    location: "150 York Rd, Uxbridge, UB8 1QW",
    isLiveStreamed: true,
  },
  {
    id: "fasting-prayer-communion",
    day: "Sunday Services",
    time: "4:00 PM - 6:00 PM",
    title: "Sunday Worship Service",
    language: "All Believers",
    description:
      "Monthly consecrated fasting prayer for revival, healings, community outreach, and kingdom breakthrough in West London.",
    location: "150 York Rd, Uxbridge, UB8 1QW",
    isLiveStreamed: false,
  },
];

export const statementsOfFaith: StatementOfFaith[] = [
  {
    id: "trinity",
    number: 1,
    title: "1. The Trinity",
    summary:
      "We believe in One GOD, eternally existing in three Persons: the Father, the Son, and the Holy Spirit.",
    points: [
      "Each Person of the Trinity is fully and equally God, united in essence, purpose, and glory.",
      "The Father is the Creator, the Son is the Redeemer, and the Holy Spirit is the Comforter and Empowerer of the Church.",
      "We worship one God revealed in three divine Persons who work in perfect unity for the salvation and sanctification of humanity.",
    ],
    scriptures: ["Matthew 28:19", "2 Corinthians 13:14", "John 1:1-14"],
  },
  {
    id: "church",
    number: 2,
    title: "2. The Church",
    summary:
      "We believe that the Church is the Body of CHRIST, made up of all believers, both in heaven and on earth, who have been born again by the Holy Spirit and united to JESUS through faith.",
    points: [
      "This universal Church includes every person who has truly trusted CHRIST for salvation.",
      "The Church finds its visible expression in local congregations that gather regularly to worship GOD, hear His Word, pray, serve, and grow together.",
      "A true local church is marked by: Faithful preaching of the Bible, Baptism by immersion, Partaking in Holy Communion, Loving accountability among believers.",
      "As Pentecostal believers, we affirm that the Church is empowered by the Holy Spirit to continue the mission of JESUS: sharing the Gospel, making disciples, and demonstrating GOD's love through spiritual gifts, service, and unity.",
    ],
    scriptures: ["Ephesians 1:22–23", "Ephesians 4:11–13"],
  },
  {
    id: "mission",
    number: 3,
    title: "3. The Mission of the Church",
    summary:
      "We believe that JESUS CHRIST has given His Church a clear and powerful mission: to go into all the world and make disciples of all nations, through the power of the Holy Spirit.",
    subsections: [
      {
        letter: "A",
        title: "A. Evangelise: Sharing the Good News",
        description:
          "We are commanded by JESUS to make disciples of all nations, sharing the Gospel and calling people to repentance and faith. This includes baptising believers by immersion and teaching them to obey CHRIST's commands. This mission is carried out in the power of the Holy Spirit, who equips the Church for witness until JESUS returns.",
        scripture: "Matthew 28:18-20",
      },
      {
        letter: "B",
        title: "B. Encourage: Motivating Faith in CHRIST",
        description:
          "We believe in proclaiming the Gospel with boldness and compassion, urging people to turn to GOD in repentance and believe in the Lord JESUS CHRIST.",
        scripture: "Acts 20:20–21",
      },
      {
        letter: "C",
        title: "C. Edify: Growing in Christlike Maturity",
        description:
          "We aim to build up the Church by helping every believer grow spiritually through biblical teaching, discipleship, prayer, and the work of the Holy Spirit. Our desire is to present each person complete in CHRIST.",
        scripture: "Colossians 1:28",
      },
    ],
    scriptures: ["Matthew 28:18-20", "Acts 20:20–21", "Colossians 1:28"],
  },
  {
    id: "baptism-water",
    number: 4,
    title: "4. Baptism by Immersion in Water",
    summary:
      "We believe that those who have repented and placed their faith in JESUS CHRIST are commanded to be baptised in water by full immersion, symbolising their identification with CHRIST in His death, burial, and resurrection.",
    points: [
      "Water baptism is: A public declaration of faith, An act of obedience, A symbol of inward transformation.",
      "Baptism does not save, but expresses the salvation already received.",
      "We do not baptise infants; baptism is reserved for those who personally respond to the Gospel.",
    ],
    scriptures: ["Matthew 28:19", "Acts 2:38", "Romans 6:4"],
  },
  {
    id: "baptism-spirit",
    number: 5,
    title: "5. Baptism in the Holy Spirit",
    summary:
      "We believe in the baptism in the Holy Spirit as a distinct and empowering experience following salvation.",
    points: [
      "This baptism equips believers with spiritual power for effective witness, ministry, and holy living.",
      "The baptism in the Holy Spirit is often accompanied by spiritual gifts, including speaking in tongues, as recorded in the book of Acts.",
      "While not required for salvation, it is a vital part of a Spirit-filled Christian life.",
    ],
    scriptures: ["Acts 1:8", "Acts 2:4", "Luke 24:49"],
  },
];

export const galleryItems: GalleryItem[] = [
  {
    id: "g1",
    title: "Pr. Begin Alex & TGMC Worship",
    category: "Worship",
    imageUrl: "/images/livestream-preview.jpg",
    caption: "Pr. Begin Alex ministering at The Great Mission Church.",
  },
  {
    id: "g2",
    title: "Church Congregation Gathering",
    category: "Worship",
    imageUrl: "/images/event-worship-1.jpg",
    caption: "Congregational worship service in Uxbridge.",
  },
  {
    id: "g3",
    title: "Spirit-Filled Worship Fellowship",
    category: "Fellowship",
    imageUrl: "/images/event-worship-2.jpg",
    caption: "Believers gathered in prayer and worship at TGMC.",
  },
  {
    id: "g4",
    title: "TGMC Live Stream Broadcast",
    category: "Worship",
    imageUrl: "/images/livestream-preview.jpg",
    caption: "Live worship stream broadcast every Sunday.",
  },
  {
    id: "g5",
    title: "Sunday Morning Praise & Adoration",
    category: "Fellowship",
    imageUrl: "/images/slide1.jpg",
    caption: "Fellowship and adoration during Sunday morning service.",
  },
  {
    id: "g6",
    title: "Scripture & Pastoral Exhortation",
    category: "Worship",
    imageUrl: "/images/slide2.jpg",
    caption: "Deep teaching grounded in the unshakeable truth of Scripture.",
  },
];

export const upcomingEvents: ChurchEvent[] = [
  {
    id: "ev-1",
    title: "Sunday Divine Worship Service",
    date: "Every Sunday",
    time: "10:00 AM - 1:00 PM",
    location: "150 York Rd, Uxbridge, Hillingdon, UB8 1QW",
    category: "Worship",
    description:
      "Join our Sunday worship in Malayalam & English with prayer, breaking of bread, and Spirit-filled preaching by Pr. Begin Alex.",
    image: "/images/event-worship-1.jpg",
    featured: true,
  },
  {
    id: "ev-2",
    title: "TGMC Church Gathering & Fellowship",
    date: "Regular Gathering",
    time: "10:00 AM - 12:30 PM",
    location: "150 York Rd, Uxbridge, UB8 1QW",
    category: "Worship",
    description:
      "Experience the presence of GOD and vibrant fellowship at The Great Mission Church.",
    image: "/images/event-worship-2.jpg",
    featured: true,
  },
  {
    id: "ev-3",
    title: "TGMC Live Stream Worship",
    date: "Every Sunday",
    time: "10:00 AM - 1:00 PM",
    location: "Online / YouTube Live",
    category: "Special",
    description:
      "Experience the presence of GOD right where you are through our live worship services.",
    image: "/images/livestream-preview.jpg",
    featured: true,
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "eva-justin",
    name: "Eva Justin",
    role: "IT Professional",
    quote:
      "A wonderful place of worship and spiritual growth. The services are Spirit-filled, and Pr. Begin Alex leads with great dedication and love. Truly blessed to be part of this Malayalam Pentecostal Church.",
  },
  {
    id: "eva-roshan",
    name: "Eva Roshan",
    role: "Head of IT",
    quote:
      "A wonderful place of worship and spiritual growth. The services are Spirit-filled, and Pr. Begin Alex leads with great dedication and love. Truly blessed to be part of this Malayalam Pentecostal Church.",
  },
];

export const corePillars = [
  {
    title: "Grounded in the Word of God",
    description: "We stand firmly on the unchanging truth of Scripture.",
    icon: "/images/book.png",
  },
  {
    title: "Led by the Holy Spirit",
    description: "We depend on the Holy Spirit for wisdom, power, and transformation.",
    icon: "/images/fire.png",
  },
  {
    title: "Driven by the Love of Christ",
    description: "Serving others, building unity, and extending grace to all people.",
    icon: "/images/heart.png",
  },
];

export const heroSlides = [
  {
    subtitle: "Welcome to The Great Mission Church",
    title: "Rooted in the Word, Centered on CHRIST",
    description:
      "We are a Bible-believing, Spirit-filled, CHRIST-centred, and mission-driven church passionate about living out the Gospel. Our desire is to glorify GOD, walk in the power of the Holy Spirit, and reach people everywhere.",
    image: "/images/slide1.jpg",
  },
  {
    subtitle: "Experience the Power of GOD's Word",
    title: "Proclaiming the Truth. Transforming Lives.",
    description:
      "We stand firmly on the unchanging truth of Scripture, worshiping in Malayalam and English across Uxbridge, Watford, Harefield & Hillingdon.",
    image: "/images/slide2.jpg",
  },
];
