'use client'

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import Switch from "react-switch";

import Darkmode from "@/svgs/dark"
import Lightmode from "@/svgs/light";

import styles from "./theme.module.scss"

function ThemeSwitcher() {
    
    const { resolvedTheme, setTheme } = useTheme();
    const [ mounted, setMounted ] = useState(false);

    useEffect(() => {
        const prefersDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (resolvedTheme === "system" && typeof window !== "undefined") {
            setTheme(prefersDarkTheme ? "dark" : "light");
        }
    }, [resolvedTheme, setTheme]);

    const toggle = () => {
        setTheme(resolvedTheme === "light" ? "dark" : "light");
    };

    useEffect(() => {
        setMounted(true) 
    }, [])
    
    if (!mounted) {
        return null
    }

    return <>  

        <div className={styles.wrapper}>
                <Switch 
                    onChange={toggle} 
                    checked={resolvedTheme === 'light'} 
                    offColor="#000" 
                    onColor="#fff" 
                    offHandleColor="#fff" 
                    onHandleColor="#000" 
                    uncheckedHandleIcon={<Darkmode/>}
                    checkedHandleIcon={<Lightmode/>}
                    uncheckedIcon={null} 
                    checkedIcon={null} 
                    className={styles.switcher}
                />
        </div>
    </>
}

export { ThemeSwitcher }