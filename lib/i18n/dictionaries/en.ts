import type { Dictionary } from "../types";

export const en: Dictionary = {
  content: {
    brand: {
      company: "Pan&Partners",
      person: "Tetiana Pan",
      role: "Consulting firm · sales and negotiation systems",
      logo: "/brand/logo.webp",
      copyright: "© 2026 Tetiana Pan. All rights reserved.",
      email: "hello@panpartners.com",
    },
    contacts: {
      whatsapp: { href: "https://wa.me/34621209334", label: "+34 621 20 93 34" },
      telegram: { href: "https://t.me/+380504481411", label: "+380 50 448 14 11" },
    },
    nav: [
      { label: "Home", href: "/" },
      { label: "B2B", href: "/b2b" },
      { label: "Consultation", href: "/consultation" },
      { label: "Courses", href: "/courses" },
      { label: "Contact", href: "/#contact" },
    ],
    hero: {
      eyebrow: "Pan&Partners · Sales is a system",
      title: "We'll teach your team to sell and negotiate with B2B clients",
      lead: "Sell with confidence and predictable results: simple, effective tools, real-world cases, and a detailed breakdown of your situation — to grow your sales and your company's profit.",
      bullets: [
        "Simple, effective tools",
        "Hands-on cases",
        "A detailed breakdown of your situation",
      ],
      formats:
        "We work online and offline — corporate training, online courses, and mentoring (team and one-on-one).",
      primaryCta: { label: "Discuss training for your team", href: "#contact" },
      secondaryCta: { label: "Ways to work together", href: "#formats" },
      trust: "Practical tools, real cases, measurable progress.",
      image: "/brand/Tania1-3.webp",
    },
    about: {
      eyebrow: "About the expert",
      greeting: "Hi",
      name: "Tetiana Pan",
      intro:
        "Owner of Pan&Partners, business trainer, and expert in sales and negotiations.",
      credentials: [
        "25+ years of hands-on experience in sales and as a head of sales — Olimp (a spirits company), Danone, Coca-Cola, my own retail stores, and my own consulting firm.",
        "17+ years teaching teams to sell and negotiate.",
      ],
      helpIntro:
        "We help business owners and sales teams sell and negotiate:",
      helpPoints: ["clearly and with structure", "with confidence", "with predictable results"],
      manner: "No pressure. No manipulation. Natural and effortless.",
      mission:
        "Our mission is to help you feel genuine satisfaction in the results you achieve.",
      image: "/brand/Tania4.webp",
      portrait: "/brand/tania-portrait.jpg",
    },
    requests: {
      eyebrow: "What brings clients to us",
      title: "The five challenges clients bring to us most often",
      intro:
        "See something familiar? Click your situation — and let's talk about how we solve it together.",
      items: [
        "Low or falling sales",
        "Unstable sales",
        "80–90% of B2B clients say no",
        "Clients walk away or demand discounts",
        "The team isn't delivering steady results",
      ],
    },
    system: {
      eyebrow: "Our approach · The sales system",
      title: "Sales is a system, not luck",
      intro:
        "We don't teach \"tricks.\" We build a sales system that delivers predictable, repeatable results — step by step, tailored to your business.",
      phases: [
        { n: "01", t: "Diagnosis", d: "We pinpoint exactly what's blocking sales: the message, the offer, the negotiations, or the process." },
        { n: "02", t: "Structure", d: "We build the process, scripts, and methodology around your business — not a template." },
        { n: "03", t: "Negotiations", d: "We train your team on real cases — clear, confident, with no pressure or manipulation." },
        { n: "04", t: "Implementation", d: "We support you all the way to results: the funnel becomes transparent and sales become manageable." },
      ],
      portrait: "/brand/Tania2.jpg",
      gainsTitle: "What you'll gain",
    },
    formats: {
      eyebrow: "Pan&Partners · ways to work together",
      title: "Choose the way of working that matches your goal and pace",
      subtitle: "One method — three levels of depth.",
      cards: [
        {
          number: "01",
          title: "Corporate training",
          summary: "Training built around your needs — not off the shelf, but on your real cases.",
          who: "Sales leaders and teams",
          result: "Sales growth from +20% to ×5, conversion up to ×2",
          how: "Building the methodology and the skills that deliver results",
          href: "/b2b",
          cta: "Learn more",
        },
        {
          number: "02",
          title: "Online courses",
          summary: "Ready-made sales courses — start applying them today.",
          who: "Owners, managers, and leaders",
          result: "Conversion growth from 5% to 20–30%",
          how: "Video, materials, and assignments for fast implementation",
          href: "/courses",
          cta: "Learn more",
        },
        {
          number: "03",
          title: "Mentoring and coaching",
          summary: "One-on-one or in small groups of up to 4 — training and case reviews.",
          who: "Owners and leaders",
          result: "Sales growth from +20% to ×2",
          how: "Sales methodology, business-case reviews, and support between sessions",
          href: "/consultation",
          cta: "Start with a consultation",
        },
      ],
    },
    clients: {
      eyebrow: "Trusted by · Ukraine and beyond",
      title: "Our clients",
      subtitle: "Brands you know — and results you can measure.",
      retention:
        "90% of our clients continue working with us and recommend us to their partners.",
      named: [
        "Vodafone",
        "Kyivstar",
        "ДТЕК",
        "Danone",
        "Coca-Cola",
        "Олімп",
        "Energum",
        "ІДС Аква Сервіс",
      ],
      logos: [
        "/brand/customers_car_1.png",
        "/brand/customers_car_2.png",
        "/brand/customers_car_3.png",
        "/brand/customers_car_4.png",
        "/brand/customers_car_5.png",
      ],
      logoTiles: [
        { name: "Coca-Cola", src: "/brand/clients/coca-cola.png" },
        { name: "Vodafone", src: "/brand/clients/vodafone.png" },
        { name: "Puratos", src: "/brand/clients/puratos.png" },
        { name: "ДТЕК", src: "/brand/clients/dtek.png" },
        { name: "PrivatBank", src: "/brand/clients/privatbank.png" },
        { name: "Ашан", src: "/brand/clients/auchan.png" },
        { name: "DoMyTax", src: "/brand/clients/domytax.png" },
        { name: "RedHead", src: "/brand/clients/redhead.png" },
        { name: "Takeda", src: "/brand/clients/takeda.png" },
        { name: "Kernel", src: "/brand/clients/kernel.png" },
        { name: "Yasno", src: "/brand/clients/yasno.png" },
        { name: "Pfizer", src: "/brand/clients/pfizer.png" },
        { name: "IDS Ukraine", src: "/brand/clients/ids-ukraine.png" },
        { name: "Synevo", src: "/brand/clients/synevo.png" },
        { name: "KLO", src: "/brand/clients/klo.png" },
        { name: "Київстар", src: "/brand/clients/kyivstar.png" },
        { name: "Добробут", src: "/brand/clients/dobrobut.png" },
        { name: "Campari", src: "/brand/clients/campari.png" },
        { name: "Suziria", src: "/brand/clients/suziria.png" },
        { name: "Сільпо", src: "/brand/clients/silpo.png" },
        { name: "SCM", src: "/brand/clients/scm.png" },
        { name: "Continental", src: "/brand/clients/continental.png" },
        { name: "OTP Bank", src: "/brand/clients/otp-bank.png" },
        { name: "Щедро", src: "/brand/clients/schedro.png" },
        { name: "Дія", src: "/brand/clients/diia.png" },
      ],
      stats: [
        { value: "25+", label: "years of real sales experience" },
        { value: "17+", label: "years of B2B and B2C training" },
        { value: "90%", label: "of clients keep working with us" },
      ],
      caption:
        "We work with leaders in their industries — from FMCG and telecom to energy and B2B services.",
    },
    cases: {
      eyebrow: "Reviews and case studies",
      title: "Client reviews and case studies",
      body: "Our clients are experts and businesses that, after working with us, sell with confidence, hit their negotiation goals, and achieve consistent results.",
      pullquote: "No pressure. No manipulation. Natural and effortless.",
      cta: { label: "View the case studies", href: "#contact" },
    },
    credibility: {
      marks: [
        { value: "15 000+", label: "learners applying the sales method" },
        { value: "#2", label: "among Ukraine's top trainers — UBA 2023" },
        { value: "90%", label: "of clients keep working with us" },
      ],
    },
    testimonials: {
      eyebrow: "Reviews and case studies",
      title: "What clients say after working with us",
      intro:
        "Owners, leaders, and sales teams — in their own words: on results, negotiations, and the confidence that lasts.",
      videoLabel: "Watch the video review",
      items: [
        {
          name: "Yuliia Lytvynenko",
          role: "Network director (Vodafone, 8 years) · business trainer, coach",
          quote:
            "I've been partnering with Tetiana Pan for over a year now, and I consider it a real stroke of luck.",
        },
        {
          name: "Yuliia Dziuba",
          role: "Director of IDS Aqua Service",
          quote:
            "Sincere thanks for training our company's negotiating team — the results speak for themselves.",
          date: "January 2025",
        },
        {
          name: "Iryna Chunikhina",
          role: "Sales Director",
          quote:
            "From the very first meetings, we reached real professional understanding and a clear action plan.",
          date: "September 2025",
        },
        {
          name: "Serhii Lotokhov",
          role: "Commercial Director, ENERGUM LLC",
          quote:
            "I want to thank you for delivering the series of sales training sessions for our team.",
          date: "July 2025",
        },
        {
          name: "Oleksandr Mihitsko",
          role: "Personal fitness trainer",
          quote:
            "I came to Tetiana with a pricing question — and walked away with clear, workable solutions.",
          date: "October 2025",
        },
      ],
      videos: [
        {
          name: "Alona Kovryha",
          role: "Co-owner of a family business",
          quote: "A video review of our work together and the sales results it delivered.",
          videoId: "2clA1fQaWjo",
        },
        {
          name: "Kateryna Yermolova",
          role: "Project Manager · sales manager",
          quote: "A video review of the sales and negotiation training.",
          videoId: "DEpjsnZPy4s",
        },
      ],
    },
    contact: {
      eyebrow: "Contact",
      title: "Let's talk about your sales",
      body: "Tell us where your sales stand right now — and Tetiana will personally point you to the right place to start.",
      fields: [
        { name: "name", label: "Name", type: "text", placeholder: "Olena Kovalenko", required: true },
        { name: "contact", label: "Email or phone / messenger", type: "text", placeholder: "mail@example.com · +380 … · @telegram", required: true },
        { name: "message", label: "", type: "textarea", placeholder: "Briefly describe your situation and your goal" },
      ],
      submit: "Send your request",
      success: "Thank you! We've received your request and will be in touch shortly.",
    },
    footer: {
      tagline:
        "We train teams to sell and negotiate with B2B clients — clearly, confidently, and with measurable results.",
      copyright: "© 2026 Tetiana Pan. All rights reserved.",
      columns: [
        {
          title: "Navigation",
          links: [
            { label: "Home", href: "/" },
            { label: "B2B", href: "/b2b" },
            { label: "Consultation", href: "/consultation" },
            { label: "Courses", href: "/courses" },
          ],
        },
        {
          title: "Company",
          links: [
            { label: "Contact", href: "/#contact" },
            { label: "Privacy Policy", href: "/privacy" },
          ],
        },
      ],
    },
    cookie: {
      title: "We use cookies",
      body: "We use cookies to improve your experience and analyze traffic. By clicking \"Accept all,\" you consent to the use of cookies.",
      accept: "Accept all",
      decline: "Decline",
    },
    b2b: {
      hero: {
        eyebrow: "Pan&Partners · B2B",
        title: "B2B sales and negotiations",
        lead: "Sales structure, negotiations, and winning major clients — tailored to your business goals, not a one-size-fits-all training.",
        cta: { label: "Discuss training for your team", href: "#contact" },
      },
      experience: {
        eyebrow: "My B2B experience",
        title: "Experience that opens doors to major companies",
        items: [
          "25+ years in sales and working with B2B clients.",
          "Work with corporate clients — Vodafone, Kyivstar, ДТЕК — and with small and mid-sized businesses with €500–700K+ in monthly turnover.",
          "Experience moving companies from B2C into B2B and closing major deals with long sales cycles.",
        ],
      },
      solutions: {
        eyebrow: "Our solutions",
        title: "Four directions that deliver results",
        cards: [
          {
            number: "01",
            title: "Sales system",
            points: [
              "Structuring sales to deliver clear, predictable results",
              "Working with the head of sales and training the team on the company's real cases",
              "Support through implementation and achieving results",
            ],
          },
          {
            number: "02",
            title: "Negotiations for procurement",
            points: [
              "Clear negotiation frameworks and strong position prep",
              "Handling pressure, arguments, and supplier proposals",
              "Practice built on real cases and tough situations",
            ],
          },
          {
            number: "03",
            title: "Negotiations for suppliers (KAM)",
            points: [
              "Building a strong position in client negotiations",
              "Defending price and commercial terms",
              "Negotiation simulations and case practice",
            ],
          },
          {
            number: "04",
            title: "Breaking into B2B",
            points: [
              "How to find new B2B clients",
              "How to approach and work with major companies",
              "How to build a structured B2B sales system",
            ],
          },
        ],
      },
      approach: {
        eyebrow: "My approach",
        title: "Three principles the work is built on",
        pillars: [
          { label: "Target", body: "The work is tailored to your company's business goals, not a standard training." },
          { label: "Practice", body: "Practice based on real business situations." },
          { label: "Results", body: "Focused on implementation and real results." },
        ],
      },
    },
    consultation: {
      hero: {
        pill: "Online 1:1 sales consultation",
        title: "A clear plan for your sales — in one focused hour",
        lead: "For entrepreneurs, experts, and companies that want more confident conversations, better conversion, and a sales structure that actually works.",
        primaryCta: { label: "Book a personal consultation", href: "#book" },
        secondaryCta: { label: "See what we work on", href: "#what" },
        finePrint: "Online only · 60 minutes · booked in 1-hour slots",
        cards: [
          {
            title: "Diagnosis of the real bottleneck",
            body: "We pinpoint exactly what's blocking sales right now: the message, the offer, the negotiations, or the process.",
          },
          { title: "A plan for your next steps", body: "You leave with a simple plan you can act on right away." },
          { title: "Concrete scripts", body: "Phrasing, structure, and responses built for your real cases (no fluff)." },
        ],
      },
      what: {
        eyebrow: "What we work on",
        title: "We tailor the focus to your role",
        audiences: [
          {
            kicker: "For",
            title: "Individuals — experts, freelancers, sole proprietors",
            body: "Pricing, confidence, objections, client communication, turning chats into payments, and stress-free negotiations.",
          },
          {
            kicker: "For",
            title: "Companies — 1:1 for the owner or head of sales",
            body: "Sales structure, funnel transparency, negotiation strategy for key clients, conversion, and practical steps for the team.",
          },
        ],
        youWillGet: [
          { title: "Clarity", body: "What to do first (and what to stop doing).", image: "/brand/youwill1.webp" },
          { title: "Structure", body: "A simple sales process built for your reality (B2B or B2C).", image: "/brand/youwill2.webp" },
          { title: "Tools", body: "Concrete actions and scripts you can apply the very same day.", image: "/brand/youwill3.webp" },
        ],
        howItWorks: {
          title: "How it works",
          body: "You pick a free 60-minute slot, briefly describe your request, and we work live online. After the call, you'll have clear next steps.",
          cta: { label: "Book a personal consultation", href: "#book" },
        },
      },
      booking: {
        title: "Book a consultation",
        intro: "Pick a day, then a time.",
        monthLabel: "",
        weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        timezone: "Times are shown in your time zone.",
        slotsHeading: "Available times",
        chooseDay: "Pick a day",
        slotsPlaceholder: "Click a day on the calendar to see the available 1-hour slots.",
        noSlots: "No open slots on this day.",
        pickSlotFirst: "Pick a time slot first.",
        formLabel: "Your details",
        fields: [
          { name: "full_name", label: "Name", type: "text", placeholder: "Olena Kovalenko", required: true },
          { name: "contact", label: "Email or phone / messenger", type: "text", placeholder: "mail@example.com · +380 … · @telegram", required: true },
          { name: "message", label: "", type: "textarea", placeholder: "Briefly describe your situation and your goal" },
        ],
        submit: "Confirm your booking request",
        note: "Once you send your request, we confirm the time personally — by email or messenger.",
        success: "Request received! Tetiana will reach out within the business day to confirm the time.",
      },
    },
    courses: {
      hero: {
        eyebrow: "Ready-made solutions",
        title: "Ready-made solutions for your sales",
        items: [
          { n: "01", title: "Sales and negotiations", sub: "Online courses" },
          { n: "02", title: "Sales checklists", sub: "Ready to implement" },
          { n: "03", title: "Message scripts", sub: "For new clients" },
        ],
        lead: "Here you'll find ready-made solutions to quickly strengthen your sales and clearly see what your sales system needs to improve.",
        features: [
          {
            title: "Fast results",
            points: ["Buy and implement right away", "No complex processes or lengthy setup"],
          },
          {
            title: "Accessibility",
            points: ["Clear, easy-to-use tools", "Cost-effective solutions"],
          },
        ],
      },
      list: {
        title: "Current courses",
        subtitle: "Choose the program that matches your goals and level.",
        cards: [
          {
            title: "Sales and negotiations — foundation course",
            short: "A starter online course: simple sales and negotiation tools you can apply today.",
            price: "120 €",
            image: "/brand/course1.png",
            href: "https://tetianapan.weblium.site/?utm_source=panpartners&utm_medium=site&utm_campaign=course_basic",
            cta: "Join",
          },
        ],
      },
    },
  },
  main: {
    hero: {
      eyebrow: "Pan&Partners · the sales method",
      titleTop: "Selling isn't a talent.",
      titleEm: "It's a system.",
      lead: "A method that turns B2B negotiations into results you can predict — and repeat.",
      ctaPrimary: "Launch the system",
      ctaSecondary: "How it works",
    },
    company: {
      eyebrow: "Pan&Partners · about the company",
      headTop: "We build",
      headEm: "a B2B sales system",
      headTail: " — we don't just train!",
      para1:
        "Pan&Partners is an international sales and negotiation consulting firm. We teach teams to sell to B2B clients — from first contact to signed contract — and we build the algorithm and sales scenarios for every stage of the funnel (online and offline).",
      para2:
        "The firm was founded by Tetiana Pan — a business trainer and sales expert: 25+ years of hands-on experience (Olimp, Danone, Coca-Cola, her own retail stores) and 17+ years training teams. We work with a relentless focus on results, in three formats: corporate training, online courses, and mentoring.",
      cta: "Choose a way to work together",
    },
    architect: {
      eyebrow: "Architect of the method",
      nameTop: "Tetiana",
      nameEm: "Pan",
      para1:
        "Tetiana didn't learn sales from books — she walked the path herself: from sales manager and head of sales at Olimp, Danone, and Coca-Cola, and later in her own consulting firm. Over 25 years of negotiations and real deals, hitting sales targets and building winning sales teams.",
      para2:
        "And 17 years ago, she began teaching it to others. That's how personal experience became the Pan&Partners method: clear, structured, and natural — so results are predictable and clients keep coming back.",
      quote:
        "\"I don't teach pressure or manipulation. I teach you to sell so that clients buy with pleasure — and want to come back to you!\"",
      quoteAuthor: "— Tetiana Pan, founder",
      image: "/brand/Tania4.webp",
    },
    mentoring: {
      eyebrow: "Working one-on-one with Tetiana",
      headTop: "Business ",
      headEm: "mentoring",
      lead: "Some questions team training can't solve: strategic goals, specific negotiations (with a key client or partner), your own personal goals and the doubts you don't share openly. That's what mentoring is for — it's only for you and about you: deep, safe, and confidential.",
      ctaPrimary: "Sign up for mentoring",
      ctaSecondary: "ask a question →",
      image: "/brand/portrait.png",
    },
    faq: [
      {
        q: "How do we get started?",
        a: "With a 1:1 online consultation. One focused hour — and you'll know your sales bottleneck, have a plan for your next steps, and walk away with concrete scripts.",
      },
      {
        q: "What formats are available?",
        a: "Corporate training built around your needs, ready-made online courses, and mentoring (1–4 people). Online or offline — whatever works best for you.",
      },
      {
        q: "Is this only for B2B?",
        a: "Our core specialty is B2B sales and negotiations with major clients. But we also have B2C experience: we build a simple sales process around your needs.",
      },
      {
        q: "What kind of results can I expect?",
        a: "Sales growth from +10% to ×5, and conversion from 5% to 20–30%. And one metric that shows trust: 90% of clients keep working with us and recommend us to their partners.",
      },
      {
        q: "Do you have experience in our industry?",
        a: "25+ years of practice across 6 industries — from FMCG (Danone, Coca-Cola, Olimp) to telecom and energy (Vodafone, Kyivstar, ДТЕК) and agriculture (МХП, CFG). We build the methodology around the specifics of your business, not from a template.",
      },
      {
        q: "What does \"no pressure\" actually mean?",
        a: "We don't teach manipulation or hard-closing. The system rests on structure, preparation, and negotiations that leave the client wanting to come back — naturally and effortlessly.",
      },
    ],
  },
  ui: {
    meta: {
      titleDefault: "Pan&Partners — B2B sales and negotiations | Tetiana Pan",
      titleTemplate: "%s | Pan&Partners",
      description:
        "We train teams to sell and negotiate with B2B clients — clearly, confidently, with measurable results. Corporate training, online courses, and personal consultations from Tetiana Pan.",
      descriptionShort:
        "We train teams to sell and negotiate with B2B clients — clearly, confidently, with measurable results.",
      keywords: [
        "B2B sales",
        "negotiations",
        "sales training",
        "Tetiana Pan",
        "Pan&Partners",
        "sales consultation",
      ],
      ogTitle: "Pan&Partners — B2B sales and negotiations",
      ogImageAlt: "Pan&Partners",
      b2b: {
        title: "B2B sales and negotiations",
        description:
          "Sales structure, negotiations, and winning major clients — tailored to your business goals. Experience with Vodafone, Kyivstar, ДТЕК.",
      },
      courses: {
        title: "Sales courses and ready-made solutions",
        description:
          "Ready-made solutions to quickly strengthen your sales: online courses, checklists, and message scripts for new B2B clients.",
      },
      consultation: {
        title: "Consultation — online 1:1 on sales",
        description:
          "One hour — and your sales have a plan. An online 1:1 consultation with Tetiana Pan: bottleneck diagnosis, a breakdown of your situation, an action plan, and concrete scripts.",
      },
      privacy: {
        title: "Privacy Policy",
        description: "How Pan&Partners processes and protects your personal data.",
      },
    },

    jsonld: {
      description:
        "Corporate training, online courses, and consultations on B2B sales and negotiations.",
      knowsAbout: ["B2B sales", "Negotiations", "Sales management"],
      slogan: "Sell with confidence and predictable results.",
    },

    a11y: {
      skipToContent: "Skip to main content",
      wordmarkHome: "Pan&Partners — back to home",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      showContacts: "Get in touch",
      hideContacts: "Hide contacts",
      lightModeOn: "Switch to light mode",
      darkModeOn: "Switch to dark mode",
      lightModeTitle: "Light mode",
      darkModeTitle: "Dark mode",
      chronoNav: "Session minutes",
      languageNav: "Site language",
      goToFormSuffix: " — go to the form",
    },

    header: {
      cta: "Get in touch",
    },

    footer: {
      directContact: "Direct contact",
      manner: "No pressure. No manipulation. Natural and effortless.",
    },

    footerLeadLink: "get in touch →",

    cta: {
      bannerPre: "Ready to grow ",
      bannerEm: "your sales",
      bannerPost: "?",
      button: "Get in touch",
    },

    stickyCta: {
      book: "Book a consultation",
    },

    pageHero: {
      runhead: "Pan&Partners",
    },

    contactForm: {
      titlePre: "Let's ",
      titleEm: "connect",
      badgePct: "90%",
      badgeText: "of clients keep working with us",
      orDirect: "Or reach out directly",
      sending: "Sending…",
      resend: "Send another request",
      finePre: "We reply within the business day. No unexpected calls. By submitting this form, you agree to our ",
      fineLink: "privacy policy",
      finePost: ".",
      error:
        "Something went wrong. Please try again — or reach out directly on WhatsApp or Telegram.",
      topicPrefix: "Request:",
    },

    booking: {
      eyebrow: "Booking · online · 60 minutes",
      titlePre: "Pick a ",
      titleEm: "day and time",
      free: "open",
      hostPre: "Led personally by ",
      hostName: "Tetiana Pan",
      hostPost: " — #2 top trainer, UBA 2023",
      tzPre: "Times are shown in your time zone",
      requestSaved: "Your request is already saved — just pick a time",
      chosenPrefix: "Selected:",
      sending: "Sending…",
      error:
        "Something went wrong. Please try again — or reach out directly on WhatsApp or Telegram.",
      finePre: "By submitting this form, you agree to our ",
      fineLink: "privacy policy",
      finePost: ". We use your data only to follow up on your request.",
      whatsNext: "What's next",
      step1: "Tetiana will confirm the time by email or messenger.",
      step2: "You'll receive a link to the online meeting.",
      step3: "60 minutes — and you'll have an action plan and concrete scripts.",
      addToCalendar: "Add to calendar",
      telegramReschedule: "message on Telegram if you need to reschedule →",
      icsSummary: "Consultation · Pan&Partners (Tetiana Pan)",
      icsDescription: "Online 1:1 sales consultation",
      trustAvatarAlt: "Tetiana Pan",
      topicPrefix: "Request:",
    },

    home: {
      proofLabels: [
        "years in sales",
        "years of training",
        "keep working with us",
        "learners using the method",
        "top trainers, UBA 2023",
        "industries",
      ],
      mentoringSteps: [
        {
          t: "Solving personal",
          em: "challenges",
          d: "We work on you and your goals: building a plan and an implementation strategy around your goal and your values.",
        },
        {
          t: "Reviewing",
          em: "your cases",
          d: "We work on real deals and negotiations — and shape the solutions.",
        },
        {
          t: "Support",
          em: "between sessions",
          d: "You're never left alone with your questions — we move toward results together.",
        },
      ],
      mentoringAlt: "Tetiana Pan",
      mentoringRunhead: "Mentoring · 1:1",
      badgeMiniGroup: "small group — 2–4 people",
      badgeOnlineOffline: "online / offline",
      audiencePills: ["For business owners", "For heads of sales"],
      faqEyebrow: "Questions · answers",
      faqTitlePre: "Frequently asked ",
      faqTitleEm: "questions",
      faqNotFound: "Didn't find your answer?",
      faqWriteUs: "write to us — we'll reply personally →",
    },

    architect: {
      portraitAlt: "Tetiana Pan — founder of Pan&Partners",
      journeyLabel: "A 25+ year journey",
      journey: [
        { t: "«Олімп»", d: "spirits company", now: false },
        { t: "Danone", d: "FMCG", now: false },
        { t: "Coca-Cola", d: "FMCG", now: false },
        { t: "Own business", d: "entrepreneurship", now: false },
        { t: "Pan&Partners", d: "consulting", now: true },
      ],
      facts: [
        { v: "15 000+", l: "people sell using her method" },
        { v: "6", l: "industries — from FMCG to B2B services" },
        { v: "#2", l: "among Ukraine's top trainers · UBA 2023" },
      ],
    },

    consult: {
      replicas: [
        { say: "Sales are low, and no one knows why.", topic: "Low sales" },
        { say: "This month we hit the plan, next month it's a bust.", topic: "Unstable sales" },
        {
          say: "80–90% of B2B clients say no at the door.",
          topic: "80–90% of B2B clients say no",
        },
        { say: "\"We'll buy. If you give us a discount.\"", topic: "Clients demand discounts" },
        {
          say: "The team works hard, but there's no steady result.",
          topic: "The team isn't delivering steady results",
        },
      ],
      phases: [
        {
          title: "Diagnosis",
          text: "We pinpoint exactly what's blocking sales: the message, the offer, the negotiations, or the process. You talk — Tetiana asks the precise questions.",
        },
        {
          title: "A breakdown of your situation",
          text: "We look at the real conversations, the rejections, and the discounts. We find where clients say \"no\" — and why.",
        },
        {
          title: "Action plan and scripts",
          text: "You leave with a simple plan for your next steps and concrete phrasing for your cases — ready to use the same day.",
        },
      ],
      heroEyebrow: "Online 1:1 · 60 minutes · action plan and scripts",
      heroTitlePre: "One ",
      heroTitleEm: "hour",
      heroTitlePost: " — and your sales have a plan",
      heroLead:
        "Your first consultation with Tetiana Pan: a diagnosis of exactly what's blocking sales, a breakdown of your situation, and concrete next steps. No pressure. No manipulation.",
      heroCtaBook: "Book your hour",
      heroCtaWhat: "What happens in 60 minutes ↓",
      portraitAlt: "Tetiana Pan — founder of Pan&Partners",
      runhead: "Your hour · 1:1",
      badgeTop: "top trainers, UBA 2023",
      caption: "Tetiana Pan",
      minuteMarkPre: "−00:01 · Before the hour",
      repTitlePre: "Five lines this ",
      repTitleEm: "hour",
      repTitlePost: " begins with",
      repHint:
        "Recognize yours? Click it — and it'll appear in the \"Request\" field right next to the calendar.",
      repThisIsUs: "That's us → pick a time",
      repFoot1: "Each line isn't a verdict — it's a symptom.",
      repFoot2: "In 60 minutes, we find the cause.",
      minuteMark0: "00:00 · Minute by minute",
      hourEyebrow: "What happens in 60 minutes",
      hourTitlePre: "This isn't a \"meet and greet.\" It's a ",
      hourTitleEm: "working session",
      onHandLabel: "In hand after the call",
      onHand1: "An action plan",
      onHand2: "scripts for your cases",
      onHand3: "a clear first step",
      bookCta: "Book your hour",
      chooseTitlePre: "Pick your ",
      chooseTitleEm: "hour",
      chooseLead:
        "Pick a day, then a time. The \"Request\" field is optional, but helpful.",
      manifesto1: "No pressure. No manipulation.",
      manifesto2: "Natural and effortless.",
      manifesto3: "The first step takes one hour.",
      signature: "Tetiana Pan",
      finalCta: "book your hour ↑",
    },

    clientsWall: {
      titlePre: "Our ",
      titleEm: "clients",
      retentionPct: "90%",
      retentionText:
        "of clients continue working with us and recommend us to their partners.",
    },

    testimonials: {
      titlePre: "What clients say ",
      titleEm: "after working with us",
      pullPre: "No pressure. No manipulation. ",
      pullEm: "Natural and effortless.",
      captionSuffix: " · Pan&Partners",
      watchReview: "watch the review →",
    },

    requests: {
      titlePre: "The five ",
      titleEm: "challenges",
      titlePost: " clients bring to us most often",
      discuss: "let's talk about your situation →",
    },

    formats: {
      kicker1: "Training",
      title1Pre: "Corporate ",
      title1Em: "training",
      result1: "+20% → ×5",
      kicker2: "Courses",
      title2Pre: "Online ",
      title2Em: "courses",
      result2: "conversion 5% → 20–30%",
      kicker3: "Mentoring",
      title3Pre: "Mentoring and ",
      title3Em: "coaching",
      result3: "+20% → ×2",
      choosePre: "Choose the ",
      chooseEm: "way of working",
      choosePost: " that matches your goal and pace",
      resultBadge: "Result",
    },

    b2bPage: {
      heroTitlePre: "B2B sales and ",
      heroTitleEm: "negotiations",
      heroPrimary: "Discuss training for your team",
      heroSecondary: "Our solutions",
      contactTitlePre: "Send your ",
      contactTitleEm: "request",
      solutionsTitlePre: "Four directions that deliver ",
      solutionsTitleEm: "results",
      discussCard: "discuss →",
      discussWhich: "let's discuss which direction is yours →",
    },

    coursesPage: {
      heroTitlePre: "Ready-made solutions for your ",
      heroTitleEm: "sales",
      heroPrimary: "Browse the course catalog",
      heroSecondary: "Ask a question",
      extra: [
        {
          title: "Sales checklists",
          short:
            "Ready-made checklists to quickly review and strengthen your sales system.",
          price: "On request",
        },
        {
          title: "Message scripts",
          short:
            "First-message scripts for new B2B clients — so you start the conversation with confidence.",
          price: "On request",
        },
      ],
      catalog: "Catalog",
      opensOnCoursePage: "opens on the course page",
      learnMore: "learn more →",
    },

    privacy: {
      eyebrow: "Legal information",
      title: "Privacy Policy",
      lead: "We respect your privacy. Below is a brief overview of what data we collect and how we use it.",
      contactsLabel: "Contacts: ",
      sections: [
        {
          h: "What data we collect",
          body: "We collect only the data you voluntarily provide through the forms on this site: your name, email, phone, company name, and message. We also use anonymized visit analytics.",
        },
        {
          h: "How we use your data",
          body: "The data you provide is used solely to contact you, respond to your request, and arrange consultations and training. We do not sell or share your data with third parties.",
        },
        {
          h: "Cookies",
          body: "This site uses cookies to improve your experience and analyze traffic. You can accept or decline optional cookies in the consent banner.",
        },
        {
          h: "Storage and protection",
          body: "We keep your data no longer than needed for the stated purposes and take reasonable technical and organizational measures to protect it.",
        },
        {
          h: "Your rights",
          body: "You have the right to request access to your data, its correction, or its deletion. To do so, message us on WhatsApp or Telegram.",
        },
      ],
    },
  },
};
