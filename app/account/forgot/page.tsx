import { redirect } from "next/navigation";

import { ForgotForm } from "./forgotForm";
import { getLoggedUser } from "@/utilities/auth/auth";

import type { UserInfo } from "@/utilities/types";
import type { Metadata } from "next";

import styles from "./page.module.scss";

const title = "Password Reset";

export const metadata: Metadata = {
	title: title,
};

export default async function Reset() {
	const UserInfo: UserInfo = await getLoggedUser();

	if (UserInfo) {
		redirect("/");
	}

	return (
		<main className={styles.resetPage}>
			<h1>Password Reset</h1>
			<ForgotForm />
		</main>
	);
}
