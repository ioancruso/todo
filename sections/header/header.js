import ThemeSwitcher from "./theme/theme";

import Logo from "../../svgs/logo";
import Navbar from "./navbar/navbar";

import styles from "./header.module.scss";

export default function Header() {
    return (
        <>
            <div className={styles.header}>
                <a className={styles.logo} href="/">
                    <Logo />
                </a>
                <ThemeSwitcher />
                <Navbar />
            </div>
        </>
    );
}
