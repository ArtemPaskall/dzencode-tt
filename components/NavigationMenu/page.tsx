import { Link } from "@/i18n/navigation";
import st from "./navigationMenu.module.scss";

export default function NavigationMenu() {
  return (
    <div className={st.navMenu}>
      <Link href={"/products"}>Products</Link>
      <Link href={"/orders"}>Orders</Link>
      <div></div>
    </div>
  );
}
