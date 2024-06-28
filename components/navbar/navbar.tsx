"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { signOut } from "@/utilities/auth/auth";

import type { UserInfo } from "@/utilities/types";

import { MenuSvg } from "@/svgs/menu";

import styles from "./navbar.module.scss";

type NavbarProps = {
	UserInfo: UserInfo;
};

function Navbar({ UserInfo }: NavbarProps) {
	const [showNav, setShowNav] = useState<boolean>(false);

	const router = useRouter();

	async function handleSignOut() {
		try {
			await signOut();

			router.push("/");
			router.refresh();
		} catch (error) {
			console.error("Error signing out:", error);
		}
	}

	async function show() {
		setShowNav(!showNav);
	}

	useEffect(() => {
		const handleResize = () => {
			setShowNav(false);
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	useEffect(() => {
		const preventScroll = (e: Event) => e.preventDefault();

		if (showNav) {
			window.addEventListener("touchmove", preventScroll, {
				passive: false,
			});
			window.addEventListener("wheel", preventScroll, { passive: false });
		} else {
			window.removeEventListener("touchmove", preventScroll);
			window.removeEventListener("wheel", preventScroll);
		}

		return () => {
			window.removeEventListener("touchmove", preventScroll);
			window.removeEventListener("wheel", preventScroll);
		};
	}, [showNav]);

	return (
		<div className={styles.wrapper}>
			<motion.div
				className={styles.mobile}
				initial={{ x: "100%" }}
				animate={{ x: showNav ? "0%" : "100%" }}
				transition={{
					duration: 0.3,
					ease: "easeInOut",
				}}
			>
				<div className={styles.closeNav}>
					<button onClick={show}>X</button>
				</div>
				<nav>
					<ul>
						<li>
							<Link onClick={show} href="/">
								home
							</Link>
						</li>
						{!UserInfo && (
							<>
								<li>
									<Link onClick={show} href="/account/login">
										Login
									</Link>
								</li>
								<li>
									<Link onClick={show} href="/account/register">
										Register
									</Link>
								</li>
							</>
						)}
						{UserInfo && (
							<>
								<li>
									<Link onClick={show} href="/todos">
										my todos
									</Link>
								</li>
								<li>
									<Link onClick={show} href="/account/change">
										Change password
									</Link>
								</li>
								<li>
									<form action={handleSignOut} onClick={show}>
										<button type="submit">logout</button>
									</form>
								</li>
							</>
						)}
					</ul>
				</nav>
			</motion.div>
			<motion.div
				className={styles.menu}
				onClick={show}
				animate={{ rotate: showNav ? 90 : 0 }}
				transition={{ delay: showNav ? 0 : 0.2 }}
			>
				<MenuSvg fill="var(--text-color)" />
			</motion.div>
			<nav className={styles.desktop}>
				<ul>
					<li>
						<Link href="/">home</Link>
					</li>
					{!UserInfo && (
						<>
							<li>
								<Link href="/account/login">Login</Link>
							</li>
							<li>
								<Link href="/account/register">Register</Link>
							</li>
						</>
					)}
					{UserInfo && (
						<>
							<li>
								<Link href="/todos">my todos</Link>
							</li>
							<li>
								<Link onClick={show} href="/account/change">
									Change password
								</Link>
							</li>
							<li>
								<form action={handleSignOut}>
									<button type="submit">logout</button>
								</form>
							</li>
						</>
					)}
				</ul>
			</nav>
		</div>
	);
}
export { Navbar };
