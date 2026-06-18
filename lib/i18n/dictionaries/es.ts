import type { Dictionary } from "../types";

export const es: Dictionary = {
  content: {
    brand: {
      company: "Pan&Partners",
      person: "Tetiana Pan",
      role: "Consultora · sistemas de ventas y negociación",
      logo: "/brand/logo.webp",
      copyright: "© 2026 Tetiana Pan. Todos los derechos reservados.",
      email: "hello@panpartners.com",
    },
    contacts: {
      whatsapp: { href: "https://wa.me/34621209334", label: "+34 621 20 93 34" },
      telegram: { href: "https://t.me/+380504481411", label: "+380 50 448 14 11" },
    },
    nav: [
      { label: "Inicio", href: "/" },
      { label: "B2B", href: "/b2b" },
      { label: "Consultoría", href: "/consultation" },
      { label: "Cursos", href: "/courses" },
      { label: "Contacto", href: "/#contact" },
    ],
    hero: {
      eyebrow: "Pan&Partners · Vender es un sistema",
      title: "Enseñamos a tu equipo a vender y negociar con clientes B2B",
      lead: "Vende con seguridad y con un resultado previsible: herramientas simples y eficaces, casos reales y un análisis detallado de tu situación, para hacer crecer las ventas y el beneficio de la empresa.",
      bullets: [
        "Herramientas simples y eficaces",
        "Casos prácticos",
        "Análisis detallado de tu situación",
      ],
      formats:
        "Trabajamos online y presencial: formación corporativa, cursos online y mentoría (en equipo e individual).",
      primaryCta: { label: "Hablar sobre la formación del equipo", href: "#contact" },
      secondaryCta: { label: "Formatos de trabajo", href: "#formats" },
      trust: "Herramientas prácticas, casos reales, progreso medible.",
      image: "/brand/Tania1-3.webp",
    },
    about: {
      eyebrow: "Sobre la experta",
      greeting: "Hola",
      name: "Tetiana Pan",
      intro:
        "Propietaria de Pan&Partners, formadora de empresas y experta en ventas y negociación.",
      credentials: [
        "25+ años de experiencia propia en ventas y como directora comercial: «Олімп» (compañía de bebidas espirituosas), Danone, Coca-Cola, tiendas propias y su propia consultora.",
        "17+ años enseñando a vender y negociar.",
      ],
      helpIntro:
        "Ayudamos a propietarios de negocios y a equipos comerciales a vender y negociar:",
      helpPoints: ["con claridad y estructura", "con seguridad", "con el resultado esperado"],
      manner: "Sin presión. Sin manipulación. Con naturalidad y soltura.",
      mission:
        "Nuestra misión es ayudarte a disfrutar del resultado que consigues.",
      image: "/brand/Tania4.webp",
      portrait: "/brand/tania-portrait.jpg",
    },
    requests: {
      eyebrow: "Con qué llegan",
      title: "Cinco necesidades con las que más nos contactan",
      intro:
        "¿Reconoces alguna como tuya? Pulsa en tu caso y hablamos de cómo lo resolvemos juntos.",
      items: [
        "Ventas bajas o ventas en caída",
        "Ventas inestables",
        "80–90% de rechazos de clientes B2B",
        "Los clientes dicen que no o exigen descuentos",
        "El equipo no da un resultado estable",
      ],
    },
    system: {
      eyebrow: "Nuestro enfoque · Sistema de ventas",
      title: "Vender es un sistema, no cuestión de suerte",
      intro:
        "No enseñamos «trucos». Construimos un sistema de ventas que da un resultado previsible y repetible, paso a paso y a la medida de tu negocio.",
      phases: [
        { n: "01", t: "Diagnóstico", d: "Detectamos qué bloquea exactamente las ventas: el mensaje, la oferta, la negociación o el proceso." },
        { n: "02", t: "Estructura", d: "Construimos el proceso, los scripts y la metodología de ventas a la medida de tu negocio, no una plantilla." },
        { n: "03", t: "Negociación", d: "Entrenamos al equipo con casos reales: con claridad, seguridad, sin presión ni manipulación." },
        { n: "04", t: "Implementación", d: "Acompañamiento hasta el resultado: el funnel se vuelve transparente y las ventas, controlables." },
      ],
      portrait: "/brand/Tania2.jpg",
      gainsTitle: "Lo que vas a obtener",
    },
    formats: {
      eyebrow: "Pan&Partners · formatos de trabajo",
      title: "Elige la forma de trabajar que encaja con tu objetivo y tu ritmo",
      subtitle: "Un mismo método, tres niveles de inmersión.",
      cards: [
        {
          number: "01",
          title: "Formación corporativa",
          summary: "Formación a tu medida, no de catálogo, basada en tus casos reales.",
          who: "Directores y equipos comerciales",
          result: "Crecimiento de ventas de +20% a ×5, conversión hasta ×2",
          how: "Creación de la metodología y desarrollo de las habilidades que dan resultado",
          href: "/b2b",
          cta: "Saber más",
        },
        {
          number: "02",
          title: "Cursos online",
          summary: "Cursos de ventas listos para empezar a aplicar hoy mismo.",
          who: "Propietarios, comerciales, directivos",
          result: "Crecimiento de la conversión del 5% al 20–30%",
          how: "Vídeos, materiales y tareas prácticas para una implementación rápida",
          href: "/courses",
          cta: "Saber más",
        },
        {
          number: "03",
          title: "Mentoría y coaching",
          summary: "De forma individual o en grupos pequeños de hasta 4 personas: formación y análisis de casos.",
          who: "Propietarios y directivos",
          result: "Crecimiento de ventas de +20% a ×2",
          how: "Metodología de ventas, análisis de casos de negocio y apoyo entre sesiones",
          href: "/consultation",
          cta: "Empezar con una sesión",
        },
      ],
    },
    clients: {
      eyebrow: "Confían en nosotros · Ucrania y el mundo",
      title: "Nuestros clientes",
      subtitle: "Marcas que conoces y resultados que se pueden medir.",
      retention:
        "El 90% de los clientes continúa trabajando con nosotros y nos recomienda a sus socios.",
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
        { value: "25+", label: "años de experiencia real en ventas" },
        { value: "17+", label: "años formando en B2B y B2C" },
        { value: "90%", label: "de clientes continúan la colaboración" },
      ],
      caption:
        "Trabajamos con líderes de sus sectores: del FMCG y las telecomunicaciones a la energía y los servicios B2B.",
    },
    cases: {
      eyebrow: "Opiniones y casos",
      title: "Opiniones de clientes y casos",
      body: "Nuestros clientes son expertos y empresas que, tras trabajar con nosotros, venden con seguridad, alcanzan sus objetivos en la negociación y obtienen resultados estables.",
      pullquote: "Sin presión. Sin manipulación. Con naturalidad y soltura.",
      cta: { label: "Ver casos", href: "#contact" },
    },
    credibility: {
      marks: [
        { value: "15 000+", label: "alumnos aplican la tecnología de ventas" },
        { value: "№2", label: "del TOP de formadores de Ucrania — UBA 2023" },
        { value: "90%", label: "de clientes continúan la colaboración" },
      ],
    },
    testimonials: {
      eyebrow: "Opiniones y casos",
      title: "Qué dicen los clientes después de trabajar juntos",
      intro:
        "Propietarios, directivos y equipos comerciales, con sus propias palabras: sobre resultados, negociación y la seguridad que perdura.",
      videoLabel: "Ver el vídeo testimonio",
      items: [
        {
          name: "Yuliia Lytvynenko",
          role: "Directora de red (Vodafone, 8 años) · formadora de empresas, coach",
          quote:
            "Llevo más de un año trabajando en colaboración con Tetiana Pan y lo considero una gran suerte.",
        },
        {
          name: "Yuliia Dziuba",
          role: "Directora de la empresa «ІДС Аква Сервіс»",
          quote:
            "Gracias de corazón por la formación del equipo de negociadores de nuestra empresa: el resultado se nota.",
          date: "Enero 2025",
        },
        {
          name: "Iryna Chunikhina",
          role: "Directora de ventas",
          quote:
            "Desde las primeras reuniones logramos un entendimiento profesional y un plan de acción claro.",
          date: "Septiembre 2025",
        },
        {
          name: "Serhii Lotokhov",
          role: "Director comercial de «ЕНЕРГУМ»",
          quote:
            "Expreso mi agradecimiento por impartir el ciclo de formaciones de ventas para nuestro equipo.",
          date: "Julio 2025",
        },
        {
          name: "Oleksandr Mihitsko",
          role: "Entrenador personal de fitness",
          quote:
            "Acudí a Tetiana con una cuestión de fijación de precios y obtuve soluciones claras y aplicables.",
          date: "Octubre 2025",
        },
      ],
      videos: [
        {
          name: "Alona Kovryha",
          role: "Copropietaria de un negocio familiar",
          quote: "Vídeo testimonio sobre la colaboración y los resultados en ventas.",
          videoId: "2clA1fQaWjo",
        },
        {
          name: "Kateryna Yermolova",
          role: "Project Manager · sales manager",
          quote: "Vídeo testimonio sobre la formación en ventas y negociación.",
          videoId: "DEpjsnZPy4s",
        },
      ],
    },
    contact: {
      eyebrow: "Contacto",
      title: "Hablemos de tus ventas",
      body: "Cuéntanos cómo están ahora tus ventas y Tetiana te indicará personalmente por dónde empezar.",
      fields: [
        { name: "name", label: "Nombre", type: "text", placeholder: "Elena Kovalenko", required: true },
        { name: "contact", label: "Email o teléfono / mensajería", type: "text", placeholder: "mail@example.com · +380 … · @telegram", required: true },
        { name: "message", label: "", type: "textarea", placeholder: "Describe brevemente tu situación y tu objetivo" },
      ],
      submit: "Enviar solicitud",
      success: "¡Gracias! Hemos recibido tu solicitud y nos pondremos en contacto contigo muy pronto.",
    },
    footer: {
      tagline:
        "Enseñamos a los equipos a vender y negociar con clientes B2B: con claridad, seguridad y un resultado medible.",
      copyright: "© 2026 Tetiana Pan. Todos los derechos reservados.",
      columns: [
        {
          title: "Navegación",
          links: [
            { label: "Inicio", href: "/" },
            { label: "B2B", href: "/b2b" },
            { label: "Consultoría", href: "/consultation" },
            { label: "Cursos", href: "/courses" },
          ],
        },
        {
          title: "Empresa",
          links: [
            { label: "Contacto", href: "/#contact" },
            { label: "Política de privacidad", href: "/privacy" },
          ],
        },
      ],
    },
    cookie: {
      title: "Utilizamos cookies",
      body: "Utilizamos cookies para mejorar tu experiencia y analizar el tráfico. Al pulsar «Aceptar todas», aceptas el uso de cookies.",
      accept: "Aceptar todas",
      decline: "Rechazar",
    },
    b2b: {
      hero: {
        eyebrow: "Pan&Partners · B2B",
        title: "Ventas y negociación B2B",
        lead: "Estructura de ventas, negociación y acceso a grandes clientes, adaptado a los objetivos de tu negocio y no una formación estándar.",
        cta: { label: "Hablar sobre la formación del equipo", href: "#contact" },
      },
      experience: {
        eyebrow: "Mi experiencia en B2B",
        title: "Experiencia que abre las puertas de las grandes empresas",
        items: [
          "25+ años en ventas y en el trato con clientes B2B.",
          "Trabajo con clientes corporativos —Vodafone, Kyivstar, ДТЕК— y con pequeñas y medianas empresas con una facturación de €500–700K+ al mes.",
          "Experiencia llevando empresas del B2C al B2B y cerrando grandes acuerdos de ciclo de venta largo.",
        ],
      },
      solutions: {
        eyebrow: "Nuestras soluciones",
        title: "Cuatro líneas que dan resultado",
        cards: [
          {
            number: "01",
            title: "Sistema de ventas",
            points: [
              "Estructurar las ventas para obtener resultados claros y previsibles",
              "Trabajo con el director comercial y formación del equipo con casos reales de la empresa",
              "Acompañamiento durante la implementación y el logro de resultados",
            ],
          },
          {
            number: "02",
            title: "Negociación para compras",
            points: [
              "Esquemas de negociación claros y una preparación sólida de las posiciones",
              "Gestión de la presión, los argumentos y las propuestas de los proveedores",
              "Práctica basada en casos reales y situaciones difíciles",
            ],
          },
          {
            number: "03",
            title: "Negociación para proveedores (KAM)",
            points: [
              "Construir una posición sólida en la negociación con clientes",
              "Defensa del precio y de las condiciones comerciales",
              "Simulación de negociaciones y práctica de casos",
            ],
          },
          {
            number: "04",
            title: "Entrada en el B2B",
            points: [
              "Cómo encontrar nuevos clientes B2B",
              "Cómo abordar y trabajar con grandes empresas",
              "Cómo construir un sistema estructurado de ventas B2B",
            ],
          },
        ],
      },
      approach: {
        eyebrow: "Mi enfoque",
        title: "Tres principios que sostienen el trabajo",
        pillars: [
          { label: "Target", body: "El trabajo se adapta a los objetivos de negocio de la empresa, no es una formación estándar." },
          { label: "Practice", body: "Práctica basada en situaciones reales de negocio." },
          { label: "Results", body: "Foco en la implementación y en resultados reales." },
        ],
      },
    },
    consultation: {
      hero: {
        pill: "Sesión de ventas online 1:1",
        title: "Un plan claro para tus ventas en una hora de foco",
        lead: "Para emprendedores, expertos y empresas que quieren una comunicación más segura, mejor conversión y una estructura de ventas que de verdad funcione.",
        primaryCta: { label: "Reservar una sesión personalizada", href: "#book" },
        secondaryCta: { label: "Ver con qué trabajamos", href: "#what" },
        finePrint: "Solo online · 60 minutos · reserva por franjas de 1 hora",
        cards: [
          {
            title: "Diagnóstico del cuello de botella real",
            body: "Detectamos qué bloquea ahora mismo tus ventas: el mensaje, la oferta, la negociación o el proceso.",
          },
          { title: "Plan de próximos pasos", body: "Sales con un plan sencillo que puedes ejecutar de inmediato." },
          { title: "Scripts concretos", body: "Frases, estructura y respuestas para tus casos reales (sin paja)." },
        ],
      },
      what: {
        eyebrow: "Con qué trabajamos",
        title: "Ajustamos el foco a tu rol",
        audiences: [
          {
            kicker: "Para",
            title: "Individual: expertos, freelance, autónomos",
            body: "Precio, seguridad, objeciones, comunicación con clientes, conversión de chats en pagos, negociación sin estrés.",
          },
          {
            kicker: "Para",
            title: "Empresas: 1:1 para el propietario o el director comercial",
            body: "Estructura de ventas, transparencia del funnel, estrategia de negociación con clientes clave, conversión, pasos prácticos para el equipo.",
          },
        ],
        youWillGet: [
          { title: "Claridad", body: "Qué hacer en primer lugar (y qué dejar de hacer).", image: "/brand/youwill1.webp" },
          { title: "Estructura", body: "Un proceso de ventas sencillo para tu realidad (B2B o B2C).", image: "/brand/youwill2.webp" },
          { title: "Herramientas", body: "Acciones y scripts concretos que puedes aplicar el mismo día.", image: "/brand/youwill3.webp" },
        ],
        howItWorks: {
          title: "Cómo funciona",
          body: "Eliges una franja libre de 60 minutos, escribes brevemente tu necesidad y trabajamos online en directo. Tras la llamada tendrás unos próximos pasos claros.",
          cta: { label: "Reservar una sesión personalizada", href: "#book" },
        },
      },
      booking: {
        title: "Reserva de la sesión",
        intro: "Elige el día y luego la hora.",
        monthLabel: "",
        weekdays: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
        timezone: "La hora se muestra en tu zona horaria.",
        slotsHeading: "Horas disponibles",
        chooseDay: "Elige un día",
        slotsPlaceholder: "Pulsa un día del calendario para ver las franjas disponibles de 1 hora.",
        noSlots: "No hay franjas libres para este día.",
        pickSlotFirst: "Primero elige una franja horaria.",
        formLabel: "Tus datos",
        fields: [
          { name: "full_name", label: "Nombre", type: "text", placeholder: "Elena Kovalenko", required: true },
          { name: "contact", label: "Email o teléfono / mensajería", type: "text", placeholder: "mail@example.com · +380 … · @telegram", required: true },
          { name: "message", label: "", type: "textarea", placeholder: "Describe brevemente tu situación y tu objetivo" },
        ],
        submit: "Confirmar solicitud de reserva",
        note: "Tras la solicitud confirmamos la hora personalmente, en respuesta a tu email o por mensajería.",
        success: "¡Solicitud recibida! Tetiana se pondrá en contacto contigo durante la jornada laboral para confirmar la hora.",
      },
    },
    courses: {
      hero: {
        eyebrow: "Soluciones listas",
        title: "Soluciones listas para tus ventas",
        items: [
          { n: "01", title: "Ventas y negociación", sub: "Cursos online" },
          { n: "02", title: "Checklists de ventas", sub: "Listos para implementar" },
          { n: "03", title: "Scripts de mensajes", sub: "Para nuevos clientes" },
        ],
        lead: "Aquí encontrarás soluciones listas para reforzar rápidamente tus ventas y entender con claridad qué necesita mejorar tu sistema de ventas.",
        features: [
          {
            title: "Resultados rápidos",
            points: ["Compra e implementa de inmediato", "Sin procesos complejos ni configuraciones largas"],
          },
          {
            title: "Accesibilidad",
            points: ["Herramientas claras y fáciles de usar", "Soluciones rentables"],
          },
        ],
      },
      list: {
        title: "Cursos actuales",
        subtitle: "Elige el programa que se ajuste a tus objetivos y a tu nivel.",
        cards: [
          {
            title: "Ventas y negociación — curso básico",
            short: "Curso online de iniciación: herramientas simples de ventas y negociación que puedes aplicar hoy mismo.",
            price: "120 €",
            image: "/brand/course1.png",
            href: "https://tetianapan.weblium.site/?utm_source=panpartners&utm_medium=site&utm_campaign=course_basic",
            cta: "Apuntarme",
          },
        ],
      },
    },
  },
  main: {
    hero: {
      eyebrow: "Pan&Partners · método de ventas",
      titleTop: "Vender no es talento.",
      titleEm: "Es un sistema.",
      lead: "Un método que convierte la negociación con clientes B2B en un resultado que se puede predecir y repetir.",
      ctaPrimary: "Poner en marcha el sistema",
      ctaSecondary: "Cómo funciona",
    },
    company: {
      eyebrow: "Pan&Partners · sobre la empresa",
      headTop: "Construimos",
      headEm: "un sistema de ventas B2B",
      headTail: ", no solo formamos.",
      para1:
        "Pan&Partners es una consultora internacional de ventas y negociación. Enseñamos a vender a clientes B2B, desde el primer contacto hasta la firma del contrato, y diseñamos el algoritmo y los guiones de venta en todas las etapas del funnel (online y presencial).",
      para2:
        "La empresa la fundó Tetiana Pan, formadora de empresas y experta en ventas: 25+ años de experiencia propia («Олімп», Danone, Coca-Cola, tiendas propias) y 17+ años formando equipos. Trabajamos con foco en el resultado, en estos formatos: formación corporativa, cursos online y mentoría.",
      cta: "Elegir la forma de trabajar",
    },
    architect: {
      eyebrow: "Arquitecta del método",
      nameTop: "Tetiana",
      nameEm: "Pan",
      para1:
        "Tetiana no aprendió a vender en los libros: recorrió ella misma el camino, de comercial y directora de ventas en «Олімп», Danone y Coca-Cola, y después en su propia consultora. Más de 25 años de negociaciones y acuerdos reales, de cumplir planes de ventas y formar equipos comerciales de éxito.",
      para2:
        "Y hace 17 años empezó a enseñárselo a otros. Así su experiencia personal se convirtió en el método Pan&Partners: claro, estructurado y natural, para que el resultado sea el esperado y los clientes vuelvan.",
      quote:
        "«No enseño a presionar ni a manipular. Enseño a vender de modo que el cliente compre con gusto y quiera volver a ti».",
      quoteAuthor: "— Tetiana Pan, fundadora",
      image: "/brand/Tania4.webp",
    },
    mentoring: {
      eyebrow: "Trabajo personal con Tetiana",
      headTop: "Mentoría de ",
      headEm: "negocio",
      lead: "Hay cuestiones que una formación de equipo no resuelve: objetivos estratégicos, negociaciones específicas (con un cliente clave o un socio), tus metas personales y las dudas que no se hablan en grupo. Para eso está la mentoría: solo para ti y sobre ti, en profundidad, con seguridad y confidencialidad.",
      ctaPrimary: "Apuntarme a la mentoría",
      ctaSecondary: "hacer una pregunta →",
      image: "/brand/portrait.png",
    },
    faq: [
      {
        q: "¿Por dónde empiezo la colaboración?",
        a: "Por una sesión online 1:1. Una hora de foco y ya conoces el cuello de botella de tus ventas, tienes un plan de próximos pasos y scripts concretos.",
      },
      {
        q: "¿Qué formatos de trabajo hay?",
        a: "Formación corporativa a tu medida, cursos online listos y mentoría (1–4 personas). Online o presencial, como te resulte más cómodo.",
      },
      {
        q: "¿Esto solo vale para B2B?",
        a: "Nuestra especialidad principal son las ventas B2B y la negociación con grandes clientes. Pero también tenemos experiencia en B2C: construimos un proceso de ventas sencillo según tu necesidad.",
      },
      {
        q: "¿Qué resultado puedo esperar?",
        a: "Crecimiento de ventas de +10% a ×5 y conversión del 5% al 20–30%. Y un dato que refleja la confianza: el 90% de los clientes continúa la colaboración y nos recomienda a sus socios.",
      },
      {
        q: "¿Tenéis experiencia en nuestro sector?",
        a: "25+ años de práctica en 6 sectores: del FMCG (Danone, Coca-Cola, «Олімп») a las telecomunicaciones y la energía (Vodafone, Kyivstar, ДТЕК) y el agro (МХП, CFG). Construimos la metodología según la especificidad de tu negocio, no con plantillas.",
      },
      {
        q: "Sin presión, ¿cómo es eso?",
        a: "No enseñamos a manipular ni a «forzar el cierre». El sistema se apoya en la estructura, la preparación y una negociación tras la cual el cliente vuelve, con naturalidad y soltura.",
      },
    ],
  },
  ui: {
    meta: {
      titleDefault: "Pan&Partners — ventas y negociación B2B | Tetiana Pan",
      titleTemplate: "%s | Pan&Partners",
      description:
        "Enseñamos a los equipos a vender y negociar con clientes B2B: con claridad, seguridad y un resultado medible. Formación corporativa, cursos online y sesiones personalizadas con Tetiana Pan.",
      descriptionShort:
        "Enseñamos a los equipos a vender y negociar con clientes B2B: con claridad, seguridad y un resultado medible.",
      keywords: [
        "ventas B2B",
        "negociación",
        "formación en ventas",
        "Tetiana Pan",
        "Pan&Partners",
        "sesión de ventas",
      ],
      ogTitle: "Pan&Partners — ventas y negociación B2B",
      ogImageAlt: "Pan&Partners",
      b2b: {
        title: "Ventas y negociación B2B",
        description:
          "Estructura de ventas, negociación y acceso a grandes clientes, adaptado a los objetivos de tu negocio. Experiencia con Vodafone, Kyivstar, ДТЕК.",
      },
      courses: {
        title: "Cursos y soluciones listas de ventas",
        description:
          "Soluciones listas para reforzar rápidamente las ventas: cursos online, checklists y scripts de mensajes para nuevos clientes B2B.",
      },
      consultation: {
        title: "Sesión — ventas online 1:1",
        description:
          "Una hora y tus ventas tienen un plan. Sesión online 1:1 con Tetiana Pan: diagnóstico del cuello de botella, análisis de tu situación, plan de acción y scripts concretos.",
      },
      privacy: {
        title: "Política de privacidad",
        description: "Cómo Pan&Partners trata y protege tus datos personales.",
      },
    },

    jsonld: {
      description:
        "Formación corporativa, cursos online y sesiones de ventas y negociación B2B.",
      knowsAbout: ["ventas B2B", "Negociación", "Gestión de ventas"],
      slogan: "Vende con seguridad y con el resultado esperado.",
    },

    a11y: {
      skipToContent: "Ir al contenido principal",
      wordmarkHome: "Pan&Partners — al inicio",
      openMenu: "Abrir el menú",
      closeMenu: "Cerrar el menú",
      showContacts: "Contactar",
      hideContacts: "Ocultar los contactos",
      lightModeOn: "Activar el modo claro",
      darkModeOn: "Activar el modo oscuro",
      lightModeTitle: "Modo claro",
      darkModeTitle: "Modo oscuro",
      chronoNav: "Minutos de la sesión",
      languageNav: "Idioma del sitio",
      goToFormSuffix: " — ir al formulario",
    },

    header: {
      cta: "Dejar una solicitud",
    },

    footer: {
      directContact: "Contacto directo",
      manner: "Sin presión. Sin manipulación. Con naturalidad y soltura.",
    },

    footerLeadLink: "dejar una solicitud →",

    cta: {
      bannerPre: "¿Listo para reforzar ",
      bannerEm: "tus ventas",
      bannerPost: "?",
      button: "Dejar una solicitud",
    },

    stickyCta: {
      book: "Reservar una sesión",
    },

    pageHero: {
      runhead: "Pan&Partners",
    },

    contactForm: {
      titlePre: "Hablemos ",
      titleEm: "con nosotros",
      badgePct: "90%",
      badgeText: "de clientes continúan la colaboración",
      orDirect: "O escríbenos directamente",
      sending: "Enviando…",
      resend: "Enviar otra solicitud",
      finePre: "Respondemos durante la jornada laboral. Sin llamadas sin avisar. Al enviar el formulario, aceptas la ",
      fineLink: "política de privacidad",
      finePost: ".",
      error:
        "Algo ha salido mal. Inténtalo de nuevo, o escríbenos directamente por WhatsApp o Telegram.",
      topicPrefix: "Necesidad:",
    },

    booking: {
      eyebrow: "Reserva · online · 60 minutos",
      titlePre: "Elige ",
      titleEm: "día y hora",
      free: "libre",
      hostPre: "Lo imparte personalmente ",
      hostName: "Tetiana Pan",
      hostPost: " — #2 del TOP de formadores UBA 2023",
      tzPre: "La hora se muestra en tu zona horaria",
      requestSaved: "Tu solicitud ya está registrada — solo falta elegir la hora",
      chosenPrefix: "Elegido:",
      sending: "Enviando…",
      error:
        "Algo ha salido mal. Inténtalo de nuevo, o escríbenos directamente por WhatsApp o Telegram.",
      finePre: "Al enviar el formulario, aceptas la ",
      fineLink: "política de privacidad",
      finePost: ". Usamos los datos solo para contactarte sobre tu solicitud.",
      whatsNext: "Qué sigue",
      step1: "Tetiana confirmará la hora en respuesta a tu email o por mensajería.",
      step2: "Recibirás el enlace a la reunión online.",
      step3: "60 minutos y tendrás un plan de acción y scripts concretos.",
      addToCalendar: "Añadir al calendario",
      telegramReschedule: "escribir por Telegram si hay que cambiar la hora →",
      icsSummary: "Sesión · Pan&Partners (Tetiana Pan)",
      icsDescription: "Sesión de ventas online 1:1",
      trustAvatarAlt: "Tetiana Pan",
      topicPrefix: "Necesidad:",
    },

    home: {
      proofLabels: [
        "años en ventas",
        "años de formación",
        "continúan la colaboración",
        "alumnos con el método",
        "del TOP de formadores UBA 2023",
        "sectores",
      ],
      mentoringSteps: [
        {
          t: "Resolución de necesidades",
          em: "personales",
          d: "Trabajamos sobre ti y tus objetivos: construimos el plan y la estrategia de implementación según tu meta y tus valores.",
        },
        {
          t: "Análisis de",
          em: "tus casos",
          d: "Trabajamos sobre acuerdos y negociaciones reales y damos forma a las soluciones.",
        },
        {
          t: "Apoyo",
          em: "entre sesiones",
          d: "No te quedas a solas con tus dudas: avanzamos juntos hacia el resultado.",
        },
      ],
      mentoringAlt: "Tetiana Pan",
      mentoringRunhead: "Mentoría · 1:1",
      badgeMiniGroup: "grupo reducido — 2–4 personas",
      badgeOnlineOffline: "online / presencial",
      audiencePills: ["Para propietarios de negocio", "Para directores comerciales"],
      faqEyebrow: "Preguntas · respuestas",
      faqTitlePre: "Preguntas ",
      faqTitleEm: "frecuentes",
      faqNotFound: "¿No encuentras la respuesta?",
      faqWriteUs: "escríbenos — te respondemos personalmente →",
    },

    architect: {
      portraitAlt: "Tetiana Pan — fundadora de Pan&Partners",
      journeyLabel: "Una trayectoria de 25+ años",
      journey: [
        { t: "«Олімп»", d: "compañía de bebidas espirituosas", now: false },
        { t: "Danone", d: "FMCG", now: false },
        { t: "Coca-Cola", d: "FMCG", now: false },
        { t: "Negocio propio", d: "negocio propio", now: false },
        { t: "Pan&Partners", d: "consultoría", now: true },
      ],
      facts: [
        { v: "15 000+", l: "personas venden con su método" },
        { v: "6", l: "sectores — de FMCG a servicios B2B" },
        { v: "#2", l: "entre los mejores formadores de Ucrania · UBA 2023" },
      ],
    },

    consult: {
      replicas: [
        { say: "Las ventas son bajas y nadie entiende por qué.", topic: "Ventas bajas" },
        { say: "Este mes hay plan, el siguiente es un fracaso.", topic: "Ventas inestables" },
        {
          say: "El 80–90% de los clientes B2B dice que no de entrada.",
          topic: "80–90% de rechazos de clientes B2B",
        },
        { say: "«Compramos. Si nos das un descuento».", topic: "Los clientes exigen descuentos" },
        {
          say: "El equipo trabaja, pero no hay un resultado estable.",
          topic: "El equipo no da un resultado estable",
        },
      ],
      phases: [
        {
          title: "Diagnóstico",
          text: "Detectamos qué bloquea las ventas: el mensaje, la oferta, la negociación o el proceso. Tú cuentas y Tetiana hace las preguntas precisas.",
        },
        {
          title: "Análisis de tu situación",
          text: "Miramos diálogos, rechazos y descuentos reales. Encontramos el punto donde los clientes dicen «no», y por qué.",
        },
        {
          title: "Plan de acción y scripts",
          text: "Sales con un plan sencillo de próximos pasos y frases concretas para tus casos: aplicables el mismo día.",
        },
      ],
      heroEyebrow: "Online 1:1 · 60 minutos · plan de acción y scripts",
      heroTitlePre: "Una ",
      heroTitleEm: "hora",
      heroTitlePost: " y tus ventas tienen un plan",
      heroLead:
        "Primera sesión con Tetiana Pan: diagnóstico de qué bloquea exactamente las ventas, análisis de tu situación y próximos pasos concretos. Sin presión. Sin manipulación.",
      heroCtaBook: "Reservar la hora",
      heroCtaWhat: "Qué pasa en 60 minutos ↓",
      portraitAlt: "Tetiana Pan — fundadora de Pan&Partners",
      runhead: "Tu hora · 1:1",
      badgeTop: "del TOP de formadores UBA 2023",
      caption: "Tetiana Pan",
      minuteMarkPre: "−00:01 · Antes de la hora",
      repTitlePre: "Cinco frases con las que arranca esta ",
      repTitleEm: "hora",
      repTitlePost: "",
      repHint:
        "¿Reconoces la tuya? Púlsala y ya estará en el campo «Necesidad», junto al calendario.",
      repThisIsUs: "Esto va por nosotros → elegir hora",
      repFoot1: "Cada frase no es una condena, sino un síntoma.",
      repFoot2: "En 60 minutos encontramos la causa.",
      minuteMark0: "00:00 · Minuto a minuto",
      hourEyebrow: "Qué pasa en 60 minutos",
      hourTitlePre: "No es una «toma de contacto». Es una ",
      hourTitleEm: "sesión de trabajo",
      onHandLabel: "En la mano tras la llamada",
      onHand1: "Plan de acción",
      onHand2: "scripts para tus casos",
      onHand3: "un primer paso claro",
      bookCta: "Reservar la hora",
      chooseTitlePre: "Elige tu ",
      chooseTitleEm: "hora",
      chooseLead:
        "Elige el día y luego la hora. El campo «Necesidad» es opcional, pero útil.",
      manifesto1: "Sin presión. Sin manipulación.",
      manifesto2: "Con naturalidad y soltura.",
      manifesto3: "El primer paso dura una hora.",
      signature: "Tetiana Pan",
      finalCta: "reservar la hora ↑",
    },

    clientsWall: {
      titlePre: "Nuestros ",
      titleEm: "clientes",
      retentionPct: "90%",
      retentionText:
        "de clientes continúa trabajando con nosotros y nos recomienda a sus socios.",
    },

    testimonials: {
      titlePre: "Qué dicen los clientes ",
      titleEm: "después de trabajar juntos",
      pullPre: "Sin presión. Sin manipulación. ",
      pullEm: "Con naturalidad y soltura.",
      captionSuffix: " · Pan&Partners",
      watchReview: "ver el testimonio →",
    },

    requests: {
      titlePre: "Cinco ",
      titleEm: "necesidades",
      titlePost: " con las que más nos contactan",
      discuss: "hablemos de tu situación →",
    },

    formats: {
      kicker1: "Formación",
      title1Pre: "Formación ",
      title1Em: "corporativa",
      result1: "+20% → ×5",
      kicker2: "Cursos",
      title2Pre: "Cursos ",
      title2Em: "online",
      result2: "conversión 5% → 20–30%",
      kicker3: "Mentoría",
      title3Pre: "Mentoría y ",
      title3Em: "coaching",
      result3: "+20% → ×2",
      choosePre: "Elige la ",
      chooseEm: "forma de trabajar",
      choosePost: " que encaja con tu objetivo y tu ritmo",
      resultBadge: "Resultado",
    },

    b2bPage: {
      heroTitlePre: "Ventas y ",
      heroTitleEm: "negociación B2B",
      heroPrimary: "Hablar sobre la formación del equipo",
      heroSecondary: "Nuestras soluciones",
      contactTitlePre: "Deja tu ",
      contactTitleEm: "solicitud",
      solutionsTitlePre: "Cuatro líneas que dan ",
      solutionsTitleEm: "resultado",
      discussCard: "hablar →",
      discussWhich: "hablar de cuál es tu línea →",
    },

    coursesPage: {
      heroTitlePre: "Soluciones listas para tus ",
      heroTitleEm: "ventas",
      heroPrimary: "Al catálogo de cursos",
      heroSecondary: "Hacer una pregunta",
      extra: [
        {
          title: "Checklists de ventas",
          short:
            "Checklists listos para revisar y reforzar rápidamente tu sistema de ventas.",
          price: "A consultar",
        },
        {
          title: "Scripts de mensajes",
          short:
            "Scripts de los primeros mensajes para nuevos clientes B2B, para entrar al diálogo con seguridad.",
          price: "A consultar",
        },
      ],
      catalog: "Catálogo",
      opensOnCoursePage: "se abrirá en la página del curso",
      learnMore: "saber más →",
    },

    privacy: {
      eyebrow: "Información legal",
      title: "Política de privacidad",
      lead: "Respetamos tu privacidad. A continuación, un resumen de qué datos recopilamos y cómo los usamos.",
      contactsLabel: "Contactos: ",
      sections: [
        {
          h: "Qué datos recopilamos",
          body: "Recopilamos solo los datos que facilitas voluntariamente a través de los formularios del sitio: nombre, email, teléfono, nombre de la empresa y el texto del mensaje. Además, usamos analítica de visitas anonimizada.",
        },
        {
          h: "Cómo usamos los datos",
          body: "Los datos que nos facilitas se utilizan exclusivamente para contactarte, responder a tu consulta y organizar las sesiones y la formación. No vendemos ni cedemos tus datos a terceros.",
        },
        {
          h: "Cookies",
          body: "El sitio usa cookies para mejorar la experiencia y la analítica del tráfico. Puedes aceptar o rechazar las cookies opcionales en el banner de consentimiento.",
        },
        {
          h: "Conservación y protección",
          body: "Conservamos tus datos no más tiempo del necesario para los fines indicados y adoptamos medidas técnicas y organizativas razonables para protegerlos.",
        },
        {
          h: "Tus derechos",
          body: "Tienes derecho a solicitar el acceso a tus datos, su rectificación o su supresión. Para ello, escríbenos por WhatsApp o Telegram.",
        },
      ],
    },
  },
};
