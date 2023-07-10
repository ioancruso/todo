import { useState, useEffect } from "react";

import { useSessionContext } from '@supabase/auth-helpers-react';
import { supabase } from "@/utilities/supabase";

import MenuSvg from "@/svgs/menu"

import styles from "./navbar.module.scss"


export default function Navbar() {

    const [showNav, setShowNav] = useState(false);
    const { isLoading, session, error } = useSessionContext();

    const show = () => {
        setShowNav(!showNav);
    }

    useEffect(() => {
        const handleResize = () => {
            setShowNav(false);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if(showNav === true){
            document.body.style.overflow = 'hidden';
        }else{
            document.body.style.overflow = 'unset';
        }
    }, [showNav]);

    function signOut() {
        supabase.auth.signOut()
        setShowNav(false);
    }
    

    return <>
        <div className={styles.wrapper}>
            <div className={`${styles.navbar} ${showNav ? `${styles.show}` : ""}`}>
                <div className={styles.closeNav}><button onClick={show}>X</button></div>
                <nav>
                    {!isLoading && 
                    <ul>
                        <li><a href="/">home</a></li>
                        {session && <li><a href="/todos">my todos</a></li>}
                        {!session && <li><a href="/account/login">Login</a></li>}
                        {!session && <li><a href="/account/register">Registration</a></li>}
                        {session && <li><a onClick={signOut}>logout</a></li>}
                    </ul>
                    }
                </nav>
            </div>
            <div className={styles.menu} onClick={show}>
                <MenuSvg/>
            </div>
        </div>
    </>
}