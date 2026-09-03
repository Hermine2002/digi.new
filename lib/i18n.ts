import translations from "@/data/dictionary.json";

type Language = "hy" | "en" | "ru";

export function useTranslation(lang: Language = "en") {
  const t = (key: string, fallback?: string): string => {
    const keys = key.split(".");
    let result: any = translations;

    for (const k of keys) {
      if (result && typeof result === "object") {
        result = result[k];
      } else {
        return fallback || key;
      }
    }

    if (typeof result === "object" && result[lang]) {
      return result[lang];
    }
    return typeof result === "string" ? result : (fallback || key);
  };

  return { t, lang };
}