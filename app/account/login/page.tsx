import { redirect } from "next/navigation";

import { Button } from "@/components/button/button";
import { AuthForm } from "./authForm";
import { getLoggedUser } from "@/utilities/auth/auth";

import type { Metadata } from "next";

import styles from "./page.module.scss";

export const metadata: Metadata = {
	title: "Login",
};

export default async function Autentificare() {
	const UserInfo = await getLoggedUser();

	if (UserInfo) {
		redirect("/");
	}

	return (
		<main className={styles.loginPage}>
			<h1>Login</h1>
			<AuthForm />
			<div className={styles.orSeparator}>sau</div>
			<div className={styles.register}>
				<h2>Nu ai incă un cont?</h2>
				<Button text="Înregistrează-te" href="/account/register" />
			</div>
		</main>
	);
}
