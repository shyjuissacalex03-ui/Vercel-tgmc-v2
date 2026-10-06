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

export const pastorInfo = {
  id: "pr-begin-alex",
  name: "Pr. Begin Alex",
  role: "Lead Pastor",
  bio: "Pr. Begin Alex leads The Great Mission Church with great dedication and love. Under his anointed leadership, TGMC serves as a Spirit-filled Malayalam Pentecostal church in Uxbridge, committed to biblical preaching, prayer, and kingdom impact.",
  image: "/images/pastor-begin-alex.jpg",
  fallbackImage: "/images/livestream-preview.jpg",
  email: "connect@tgmchurch.uk",
  phone: "+44 7846958451",
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
