import { Suspense } from "react";

import { ThemeSwitcher } from "@/components/themeswitcher/ThemeSwitcher";

import { LogoSvg } from "@/svgs/logo";
import { Navbar } from "@/components/navbar/navbar";
import { getLoggedUser } from "@/utilities/auth/auth";

import type { theme, UserInfo } from "@/utilities/types";

import styles from "./header.module.scss";

type HeaderProps = {
	theme: theme;
};

async function Header({ theme }: HeaderProps) {
	const UserInfo: UserInfo = await getLoggedUser();

	return (
		<>
			<div className={styles.header}>
				<a className={styles.logo} href="/">
					<LogoSvg stroke="var(--text-color)" />
				</a>
				<ThemeSwitcher theme={theme as theme} />
				<Suspense fallback={null}>
					<Navbar UserInfo={UserInfo} />
				</Suspense>
			</div>
		</>
	);
}

export { Header };
