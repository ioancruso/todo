import { getLoggedUser } from "@/utilities/auth/auth";
import { Button } from "@/components/button/button";

import type { Metadata } from "next/types";

import styles from "./page.module.scss";

export const metadata: Metadata = {
	title: "Home | To do",
};

export default async function Home() {
	const UserInfo = await getLoggedUser();

	return (
		<div className={styles.container}>
			<div className={styles.homepage}>
				<h1>Maximize efficiency with our to-do checklist.</h1>
				<h2>
					Plan, manage, and track all your projects on our customizable
					software.
				</h2>
				<Button
					text="Get started"
					href={UserInfo ? "/todos" : "/account/register"}
				/>
			</div>
		</div>
	);
}
