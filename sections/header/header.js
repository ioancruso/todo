import Logo from "../../svgs/logo"
import Navbar from "./navbar/navbar"
import { ThemeSwitcher } from "./theme/theme"

import styles from "./header.module.scss"

export default function Header() {
    return <>
        <div className={styles.header}>
            <Logo className={styles.logo}/>
            <ThemeSwitcher/>
            <Navbar/> 
        </div>
    </>
}
