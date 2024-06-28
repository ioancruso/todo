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
			<div className={styles.orSeparator}>or</div>
			<div className={styles.register}>
				<h2>You don't have an account yet?</h2>
				<Button text="Register" href="/account/register" />
			</div>
		</main>
	);
}
