import {useSessionContext} from "@supabase/auth-helpers-react";
import {supabase} from "@/utilities/supabase";

import {useState, useEffect} from "react";

import {motion} from "framer-motion";

import MenuSvg from "@/svgs/menu";

import styles from "./navbar.module.scss";

export default function Navbar() {
    const [showNav, setShowNav] = useState(false);
    const [windowWidth, setWindowWidth] = useState(0);
    const {isLoading, session, error} = useSessionContext();

    const show = () => {
        setShowNav(!showNav);
    };

    useEffect(() => {
        setWindowWidth(window.innerWidth);
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            setShowNav(false);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        const preventScroll = (e) => e.preventDefault();

        if (showNav) {
            window.addEventListener("touchmove", preventScroll, {
                passive: false,
            });
            window.addEventListener("wheel", preventScroll, {passive: false});
        } else {
            window.removeEventListener("touchmove", preventScroll);
            window.removeEventListener("wheel", preventScroll);
        }

        return () => {
            window.removeEventListener("touchmove", preventScroll);
            window.removeEventListener("wheel", preventScroll);
        };
    }, [showNav]);

    function signOut() {
        supabase.auth.signOut();
        setShowNav(false);
    }

    return (
        <div className={styles.wrapper}>
            {windowWidth < 1000 ? (
                <>
                    <motion.div
                        className={`${styles.mobile} ${
                            showNav ? styles.show : ""
                        }`}
                        initial={{x: "100%"}}
                        animate={{x: showNav ? "0%" : "100%"}}
                        transition={{
                            duration: 0.3,
                            ease: "easeInOut",
                        }}
                    >
                        <div className={styles.closeNav}>
                            <button onClick={show}>X</button>
                        </div>
                        <nav>
                            {!isLoading && (
                                <ul>
                                    <li>
                                        <a href="/">home</a>
                                    </li>
                                    {session && (
                                        <li>
                                            <a href="/todos">my todos</a>
                                        </li>
                                    )}
                                    {!session && (
                                        <li>
                                            <a href="/account/login">Login</a>
                                        </li>
                                    )}
                                    {!session && (
                                        <li>
                                            <a href="/account/register">
                                                Registration
                                            </a>
                                        </li>
                                    )}
                                    {session && (
                                        <li>
                                            <a onClick={signOut}>logout</a>
                                        </li>
                                    )}
                                </ul>
                            )}
                        </nav>
                    </motion.div>
                    <motion.div
                        className={styles.menu}
                        onClick={show}
                        animate={{rotate: showNav ? 90 : 0}}
                        transition={{delay: showNav ? 0 : 0.2}}
                    >
                        <MenuSvg />
                    </motion.div>
                </>
            ) : (
                <nav className={styles.desktop}>
                    <ul>
                        <li>
                            <a href="/">home</a>
                        </li>
                        {session && (
                            <li>
                                <a href="/todos">my todos</a>
                            </li>
                        )}
                        {!session && (
                            <li>
                                <a href="/account/login">Login</a>
                            </li>
                        )}
                        {!session && (
                            <li>
                                <a href="/account/register">Registration</a>
                            </li>
                        )}
                        {session && (
                            <li>
                                <a onClick={signOut}>logout</a>
                            </li>
                        )}
                    </ul>
                </nav>
            )}
        </div>
    );
}
