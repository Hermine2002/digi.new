export type Member = {
  id: number;
  name: { hy: string; en: string; ru: string };
  role: { hy: string; en: string; ru: string };
  initials: string;
  photo?: string;
  isLeadership?: boolean;
};

export const team: Member[] = [
  // 1. ՂԵԿԱՎԱՐ ԿԱԶՄ (20+ տարվա փորձով)
  {
    id: 1,
    name: {
      hy: "Հայկ Ամիրջանյան",
      en: "Hayk Amirjanyan",
      ru: "Айк Амирджанян",
    },
    role: {
      hy: "Կառավարման Գործընկեր — Տելեկոմ և IT ոլորտների 20+ տարվա փորձ",
      en: "Managing Partner — 20+ years of experience in Telecom and IT",
      ru: "Управляющий Партнер — 20+ лет опыта в сфере Телеком и IT",
    },
    initials: "ՀԱ",
    photo: "/images/hayk-amirjanyan.png",
    isLeadership: true,
  },
  {
    id: 2,
    name: {
      hy: "Երվանդ Բարսեղյան",
      en: "Yervand Barseghyan",
      ru: "Ерванд Барсегян",
    },
    role: {
      hy: "Գործադիր Տնօրեն — Ֆինանսական և բանկային ոլորտների 25 տարվա փորձ",
      en: "Chief Executive Officer (CEO) — 25 years of experience in Finance and Banking",
      ru: "Генеральный Директор — 25 лет опыта в сфере Финансов и Банковского дела",
    },
    initials: "ԵԲ",
    photo: "/images/ervand-barseghyan..png",
    isLeadership: true,
  },
  {
    id: 3,
    name: {
      hy: "Արամ Սաֆարյան",
      en: "Aram Safaryan",
      ru: "Арам Сафарян",
    },
    role: {
      hy: "Բիզնեսի զարգացման գլխավոր տնօրեն (CBDO) — Տելեկոմ և IT ոլորտների 20+ տարվա փորձ",
      en: "Chief Business Development Officer (CBDO) — 20+ years of experience in Telecom and IT",
      ru: "Директор по развитию бизнеса (CBDO) — 20+ лет опыта в сфере Телеком и IT",
    },
    initials: "ԱՍ",
    photo: "/images/ChatGPT Image Jul 29, 2026, 12_35_02 PM.png",
    isLeadership: true,
  },

  // 2. ԱՇԽԱՏԱԿԻՑՆԵՐ (STAFF)
  {
    id: 4,
    name: {
      hy: "Նարեկ Աղաբաբյան",
      en: "Narek Aghababyan",
      ru: "Нарек Агабабян",
    },
    role: {
      hy: "Ծրագրերի տնօրեն",
      en: "Project Director",
      ru: "Директор проектов",
    },
    initials: "ՆԱ",
    photo: "/images/Նարեկ Աղաբաբյան.png",
  },
  {
    id: 5,
    name: {
      hy: "Հասմիկ Խաչատրյան",
      en: "Hasmik Khachatryan",
      ru: "Асмик Хачатрян",
    },
    role: {
      hy: "Կորպորատիվ լուծումների հաճախորդների մենեջեր",
      en: "Enterprise Solutions Account Manager",
      ru: "Менеджер по работе с корпоративными клиентами (Enterprise Solutions)",
    },
    initials: "ՀԽ",
    photo: "/images/Հասմիկ Խաչատրյան.png",
  },
  {
    id: 6,
    name: {
      hy: "Անի Ասատրյան",
      en: "Ani Asatryan",
      ru: "Ани Асатрян",
    },
    role: {
      hy: "Գրասենյակային գործառնությունների ղեկավար",
      en: "Office Operations Lead",
      ru: "Руководитель офисных операций",
    },
    initials: "ԱԱ",
    photo: "/images/ani-asatryan.png",
  },
  {
    id: 7,
    name: {
      hy: "Վլադիմիր Մամիկոնյան",
      en: "Vladimir Mamikonyan",
      ru: "Владимир Мамиконян",
    },
    role: {
      hy: "Նախագծերի հաճախորդների մենեջեր",
      en: "Project Account Manager",
      ru: "Аккаунт-менеджер проектов",
    },
    initials: "ՎՄ",
    photo: "/images/vladimir-mamikonyan.png",
  },
];