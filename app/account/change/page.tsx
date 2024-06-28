import { redirect } from "next/navigation";

import { ChangeForm } from "./changeForm";
import { getLoggedUser } from "@/utilities/auth/auth";

import type { Metadata } from "next";

import styles from "./page.module.scss";

const title = "Change Password";

export const metadata: Metadata = {
	title: title,
};

export default async function Change() {
	const UserInfo = await getLoggedUser();

	if (!UserInfo) {
		redirect("/");
	}

	return (
		<main className={styles.changePage}>
			<h2>Change Password</h2>
			<ChangeForm />
		</main>
	);
}
