export type project = {
  slug: string;
  title: string;
  client: string;
  tag: string;
  summary: string;
  description: string;
  tech: string[];
  outcome: string;
  cover: string;
  gallery: string[];
  mediaType: "image" | "video";
};

export const getProjects = (lang: "en" | "hy" | "ru"): project[] => {
  const data = {
    en: [
      {
        slug: "oracle-unlimited-license",
        title: "Oracle Unlimited License Agreement",
        client: "IDBank",
        tag: "Oracle Enterprise Solutions",
        summary: "The first Oracle Unlimited License Agreement program implemented in the regional banking sector.",
        description: "DIGIBASE delivered a landmark Oracle Unlimited License Agreement program for IDBank, becoming the first implementation of its kind in the regional banking ecosystem. The project strengthened the bank’s digital transformation strategy by providing scalable Oracle technologies, optimized licensing models, and long-term infrastructure flexibility.",
        tech: ["Oracle Database", "Oracle Enterprise Systems", "Oracle Middleware", "Enterprise Licensing"],
        outcome: "Enabled predictable technology growth, optimized enterprise licensing costs, and strengthened mission-critical banking infrastructure.",
        cover: "/images/projects/oracle.mp4",
        gallery: ["/videos/0724 (1).mov", "/images/projects/5404845214351956946.jpg"],
        mediaType: "video" as const,
      },
      {
        slug: "idbank-active-active",
        title: "IDBank Active-Active Data Center Infrastructure",
        client: "IDBank",
        tag: "Banking Infrastructure",
        summary: "Dual-site active-active data center architecture ensuring uninterrupted banking operations.",
        description: "DIGIBASE designed and implemented a fully synchronized active-active infrastructure consisting of two mirrored data centers. The architecture guarantees continuous operation of banking services, applications, and card processing platforms even during a complete failure of one data center.",
        tech: ["Active-Active Architecture", "Data Replication", "High Availability", "Enterprise Storage", "Disaster Recovery"],
        outcome: "Zero service interruption architecture with resilient banking operations and continuous availability.",
        cover: "/images/projects/video_202607021424.mp4",
        gallery: ["/images/projects/video_202607021424.mp4", "/images/projects/active-active data center.png"],
        mediaType: "video" as const,
      },
      {
        slug: "softconstruct-modular-data-center",
        title: "SoftConstruct Modular Data Center",
        client: "SoftConstruct",
        tag: "Modular Data Center",
        summary: "Advanced Huawei modular data center designed for rapid deployment and future scalability.",
        description: "DIGIBASE implemented a modern Huawei modular data center solution featuring energy-efficient infrastructure, integrated cooling, intelligent monitoring, and flexible expansion capabilities. The modular approach enables fast deployment while supporting the company's future growth requirements.",
        tech: ["Huawei FusionModule", "Intelligent Cooling", "UPS Systems", "DCIM Monitoring", "Modular Infrastructure"],
        outcome: "Reduced deployment time, improved energy efficiency, and created a scalable infrastructure foundation.",
       
           cover: "/images/projects/security.mp4",
        gallery: ["/images/projects/kling_20260629_VIDEO_Camera_slo_4155_0.mp4", "/images/5307955193150379917.jpg"],
        mediaType: "video" as const, // ՈՒՂՂՎԱԾ Է․ նախկինում "image" էր
      },
      {
        slug: "national-security-systems",
        title: "National Security Systems",
        client: "Penitentiary Service of the Republic of Armenia",
        tag: "Security Infrastructure",
        summary: "Smart surveillance and access control systems protecting critical government facilities.",
        description: "DIGIBASE implemented an integrated security infrastructure including intelligent video surveillance cameras, access control systems, and a centralized command center. The solution provides reliable protection for government facilities and critical areas through advanced monitoring and analytics.",
        tech: ["Smart Surveillance Cameras", "Access Control Systems", "AI Video Analytics", "Command Center", "Security Monitoring"],
        outcome: "Enhanced facility protection through intelligent detection, centralized monitoring, and 24/7 security operations.",
         cover: "/videos/kling_20260720_VIDEO__4988_0.mp4",
        gallery: ["/videos/kling_20260720_VIDEO__4988_0.mp4", "/images/projects/WhatsApp Image 2026-06-15 at 16.04.41.jpg"],
        mediaType: "video" as const,
      },
    ],
    hy: [
      {
        slug: "oracle-unlimited-license",
        title: "Oracle Unlimited License Agreement (ULA)",
        client: "IDBank",
        tag: "Oracle Կորպորատիվ Լուծումներ",
        summary: "Տարածաշրջանային բանկային հատվածում իրականացված առաջին Oracle ULA ծրագիրը։",
        description: "DIGIBASE-ը IDBank-ի համար իրականացրեց Oracle Unlimited License Agreement (ULA) նշանակալից ծրագիրը՝ դառնալով նմանատիպ առաջին ներդրումը տարածաշրջանային բանկային էկոհամակարգում: Նախագիծն ամրապնդեց բանկի թվային փոխակերպման ռազմավարությունը՝ տրամադրելով մասշտաբավորվող Oracle տեխնոլոգիաներ, լիցենզավորման օպտիմալացված մոդելներ և երկարաժամկետ ենթակառուցվածքային ճկունություն:",
        tech: ["Oracle Database", "Oracle Enterprise Systems", "Oracle Middleware", "Enterprise Licensing"],
        outcome: "Ապահովվել է կանխատեսելի տեխնոլոգիական աճ, օպտիմալացվել են կորպորատիվ լիցենզավորման ծախսերը և ամրապնդվել է առաքելության համար կրիտիկական բանկային ենթակառուցվածքը:",
        cover: "/images/projects/oracle.mp4",
        gallery: ["/videos/0724 (1).mov", "/images/projects/5404845214351956946.jpg"],
        mediaType: "video" as const,
      },
      {
        slug: "idbank-active-active",
        title: "IDBank Active-Active Տվյալների Կենտրոնի Ենթակառուցվածք",
        client: "IDBank",
        tag: "Բանկային Ենթակառուցվածք",
        summary: "Երկկողմանի active-active տվյալների կենտրոնի արխիվային ճարտարապետություն՝ անխափան բանկային գործառնությունների ապահովման համար։",
        description: "DIGIBASE-ը նախագծել և ներդրել է լիովին սինխրոնիզացված active-active ենթակառուցվածք, որը բաղկացած է հայելային երկու տվյալների կենտրոններից: Այս ճարտարապետությունը երաշխավորում է բանկային ծառայությունների, հավելվածների և քարտային պրոցեսինգի հարթակների շարունակական աշխատանքը նույնիսկ տվյալների մեկ կենտրոնի ամբողջական խափանման դեպքում:",
        tech: ["Active-Active Architecture", "Data Replication", "High Availability", "Enterprise Storage", "Disaster Recovery"],
        outcome: "Զրոյական խափանման ճարտարապետություն՝ հուսալի բանկային գործառնություններով և մշտական ​​հասանելիությամբ:",
        cover: "/images/projects/video_202607021424.mp4",
        gallery: ["/images/projects/video_202607021424.mp4", "/images/projects/active-active data center.png"],
        mediaType: "video" as const,
      },
      {
        slug: "softconstruct-modular-data-center",
        title: "SoftConstruct Մոդուլային Տվյալների Կենտրոն",
        client: "SoftConstruct",
        tag: "Մոդուլային Տվյալների Կենտրոն",
        summary: "Huawei առաջադեմ մոդուլային տվյալների կենտրոն՝ նախագծված արագ տեղակայման և ապագա մասշտաբավորման համար:",
        description: "DIGIBASE-ը ներդրել է ժամանակակից Huawei մոդուլային տվյալների կենտրոնի լուծում, որը ներառում է էներգաարդյունավետ ենթակառուցվածք, ինտեգրված հովացում, խելացի մոնիտորինգ և ճկուն ընդլայնման հնարավորություններ: Մոդուլային մոտեցումն ապահովում է արագ տեղակայում՝ միաժամանակ աջակցելով ընկերության ապագա աճի պահանջներին:",
        tech: ["Huawei FusionModule", "Intelligent Cooling", "UPS Systems", "DCIM Monitoring", "Modular Infrastructure"],
        outcome: "Կրճատվել է տեղակայման ժամանակը, բարելավվել է էներգաարդյունավետությունը և ստեղծվել է մասշտաբավորվող ենթակառուցվածքային հիմք:",
       
        cover: "/images/projects/security.mp4",
        gallery: ["/images/projects/kling_20260629_VIDEO_Camera_slo_4155_0.mp4", "/images/5307955193150379917.jpg"],
        mediaType: "video" as const, // ՈՒՂՂՎԱԾ Է․ նախկինում "image" էր
      },
      {
        slug: "national-security-systems",
        title: "Ազգային Անվտանգության Համակարգեր",
        client: "ՀՀ ԱՆ Քրեակատարողական ծառայություն",
        tag: "Անվտանգության Ենթակառուցվածք",
        summary: "Խելացի տեսահսկման և մուտքի կառավարման համակարգեր՝ կրիտիկական պետական ​​օբյեկտների պաշտպանության համար:",
        description: "DIGIBASE-ն իրականացրել է անվտանգության ինտեգրված ենթակառուցվածք, որը ներառում է խելացի տեսահսկման տեսախցիկներ, մուտքի կառավարման համակարգեր և կենտրոնացված հրամանատարական կետ: Լուծումն ապահովում է պետական ​​օբյեկտների և կարևորագույն տարածքների հուսալի պաշտպանություն՝ առաջադեմ մոնիտորինգի և վերլուծության միջոցով:",
        tech: ["Smart Surveillance Cameras", "Access Control Systems", "AI Video Analytics", "Command Center", "Security Monitoring"],
        outcome: "Բարելավվել է օբյեկտների պաշտպանությունը խելացի հայտնաբերման, կենտրոնացված մոնիտորինգի և շուրջօրյա անվտանգության գործառնությունների միջոցով:",
        cover: "/videos/kling_20260720_VIDEO__4988_0.mp4",
        gallery: ["/videos/kling_20260720_VIDEO__4988_0.mp4", "/images/projects/WhatsApp Image 2026-06-15 at 16.04.41.jpg"],
        mediaType: "video" as const,
      },
    ],
    ru: [
      {
        slug: "oracle-unlimited-license",
        title: "Oracle Unlimited License Agreement",
        client: "IDBank",
        tag: "Корпоративные решения Oracle",
        summary: "Первая программа Oracle Unlimited License Agreement, реализованная в региональном банковском секторе.",
        description: "Компания DIGIBASE реализовала масштабную программу Oracle Unlimited License Agreement для IDBank, ставшую первым подобным внедрением в региональной банковской экосистеме. Проект укрепил стратегию цифровой трансформации банка, предоставив масштабируемые технологии Oracle, оптимизированные модели лицензирования и долгосрочную гибкость инфраструктуры.",
        tech: ["Oracle Database", "Oracle Enterprise Systems", "Oracle Middleware", "Enterprise Licensing"],
        outcome: "Обеспечен прогнозируемый технологический рост, оптимизированы затраты на корпоративное лицензирование и укреплена критически важная банковская инфраструктура.",
        cover: "/images/projects/oracle.mp4",
        gallery: ["/videos/0724 (1).mov", "/images/projects/5404845214351956946.jpg"],
        mediaType: "video" as const,
      },
      {
        slug: "idbank-active-active",
        title: "Инфраструктура дата-центра IDBank Active-Active",
        client: "IDBank",
        tag: "Банковская инфраструктура",
        summary: "Двухсайтовая архитектура дата-центра active-active для обеспечения бесперебойных банковских операций.",
        description: "DIGIBASE спроектировала и внедрила полностью синхронизированную инфраструктуру active-active, состоящую из двух зеркальных центров обработки данных. Архитектура гарантирует непрерывную работу банковских сервисов, приложений и платформ карточного процессинга даже в случае полного отказа одного дата-центра.",
        tech: ["Active-Active Architecture", "Data Replication", "High Availability", "Enterprise Storage", "Disaster Recovery"],
        outcome: "Архитектура с нулевым временем простоя, отказоустойчивыми банковскими операциями и непрерывной доступностью.",
        cover: "/images/projects/video_202607021424.mp4",
        gallery: ["/images/projects/video_202607021424.mp4", "/images/projects/active-active data center.png"],
        mediaType: "video" as const,
      },
      {
        slug: "softconstruct-modular-data-center",
        title: "Модульный дата-центр SoftConstruct",
        client: "SoftConstruct",
        tag: "Модульный дата-центр",
        summary: "Передовой модульный дата-центр Huawei, разработанный для быстрого развертывания и масштабирования.",
        description: "DIGIBASE внедрила современное решение модульного дата-центра Huawei, включающее энергоэффективную инфраструктуру, интегрированное охлаждение, интеллектуальный мониторинг и возможности гибкого расширения. Модульный подход обеспечивает быстрое развертывание, поддерживая требования компании к будущему росту.",
        tech: ["Huawei FusionModule", "Intelligent Cooling", "UPS Systems", "DCIM Monitoring", "Modular Infrastructure"],
        outcome: "Сокращено время развертывания, повышена энергоэффективность и создана масштабируемая инфраструктурная база.",
        cover: "/images/projects/security.mp4",
        gallery: ["/images/projects/kling_20260629_VIDEO_Camera_slo_4155_0.mp4", "/images/5307955193150379917.jpg"],
        mediaType: "video" as const, // ՈՒՂՂՎԱԾ Է․ նախկինում "image" էր
      },
      {
        slug: "national-security-systems",
        title: "Системы национальной безопасности",
        client: "Пенитенциарная служба Республики Армения",
        tag: "Инфраструктура безопасности",
        summary: "Интеллектуальные системы видеонаблюдения и контроля доступа для защиты критически важных объектов.",
        description: "DIGIBASE реализовала интегрированную инфраструктуру безопасности, включая интеллектуальные камеры видеонаблюдения, системы контроля доступа и централизованный командный пункт. Решение обеспечивает надежную защиту государственных объектов и критически важных зон с помощью передового мониторинга и аналитики.",
        tech: ["Smart Surveillance Cameras", "Access Control Systems", "AI Video Analytics", "Command Center", "Security Monitoring"],
        outcome: "Повышена защита объектов за счет интеллектуального обнаружения, централизованного мониторинга и круглосуточных операций безопасности.",

          cover: "/videos/kling_20260720_VIDEO__4988_0.mp4",
        gallery: ["/videos/kling_20260720_VIDEO__4988_0.mp4", "/images/projects/WhatsApp Image 2026-06-15 at 16.04.41.jpg"],
        mediaType: "video" as const,
      },
    ],
  };

  return data[lang] || data.en;
};