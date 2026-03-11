import { Montserrat } from "next/font/google";
import { getTranslations } from "next-intl/server";
import st from "./styles/not-found.module.scss";
import { Link } from "@/i18n/navigation";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-montserrat",
});

export async function generateMetadata() {
  const t = await getTranslations("NotFoundPage");
  return {
    title: t("title"),
  };
}

export default async function NotFound() {
  const t = await getTranslations("NotFoundPage");

  return (
    <div className={montserrat.className + " " + st.notFound}>
      <h1 className={st.notFound__title}>{t("title")}</h1>
      <p className={st.notFound__description}>{t("description")}</p>
      <Link href={`/`}>
        <button type="button" className={st["notFound__button"]}>
          {t("goHome")}
        </button>
      </Link>
    </div>
  );
}
