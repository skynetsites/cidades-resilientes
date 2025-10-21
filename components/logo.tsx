import { Moon, Sun, Menu, X, Building2, Leaf } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function Logo() {
  const { t } = useLanguage();
  return (
    <div className="flex items-center space-x-3">
      <div className="relative">
        <Building2 className="h-10 md:w-12 w-10 md:h-12 text-emerald-500" />
        <Leaf className="h-4 w-4 text-emerald-400 absolute -top-1 -right-2" />
      </div>
      <span className="flex flex-col leading-none text-base md:text-xl font-bold text-foreground gap-0">
        <span>{t("cidades")}</span>
        <span className="pb-1 text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
          {t("resilientes")}
        </span>
      </span>
    </div>
  );
}
