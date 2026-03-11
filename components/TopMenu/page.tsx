import st from "./top-menu.module.scss";
import "@/app/styles/globals.scss";
import Image from "next/image";

export default function TopMenu() {
  return (
    <header className={st.topMenu}>
      <div className="container">
        <div className={st.topMenu__wrapp}>
          <div className={st.topMenu__logoWrapp}>
            <Image
              src="/fox.jpg"
              height={40}
              width={40}
              alt={"main logo"}
              className={st.topMenu__logoImg}
            ></Image>
            <div className={st.topMenu__logoName}>dZENcode</div>
          </div>
          <div>time</div>
        </div>
      </div>
    </header>
  );
}
