import { redirect } from "next/navigation";

import { RegForm } from "./regForm";
import { getLoggedUser } from "@/utilities/auth/auth";
import { Button } from "@/components/button/button";

import type { Metadata } from "next";

import styles from "./page.module.scss";

const title = "Register";

export const metadata: Metadata = {
	title: title,
};

export default async function Register() {
	const UserInfo = await getLoggedUser();

	if (UserInfo) {
		redirect("/");
	}

	return (
		<main className={styles.registerPage}>
			<h1>Register</h1>
			<RegForm />
			<div className={styles.orSeparator}>or</div>
			<div className={styles.login}>
				<h2>Do you already have an account?</h2>
				<Button text="Autentifică-te" href="/autentificare" />
			</div>
		</main>
	);
}
