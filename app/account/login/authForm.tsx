"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Modal } from "@/components/modal/modal";
import { Button } from "@/components/button/button";

import { Login } from "@/utilities/auth/auth";

import styles from "./page.module.scss";

function AuthForm() {
	const [formState, setFormState] = useState({
		email: "",
		password: "",
	});
	const [message, setMessage] = useState<string | null>(null);
	const [submissionError, setSubmissionError] = useState<boolean>(false);
	const router = useRouter();

	async function handleSubmit(event: React.FormEvent) {
		event.preventDefault();
		const formData = new FormData(event.currentTarget as HTMLFormElement);
		const { error } = await Login(formData);

		if (error) {
			if (error.message === "Invalid login credentials") {
				setMessage("The email address and/or password is incorrect.");
			} else {
				setMessage("An error occurred. Please try again.");
			}

			setFormState((prevState) => ({
				...prevState,
				password: "",
			}));
			setSubmissionError(true);
		} else {
			router.push("/todos");
			router.refresh();
		}
	}

	function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = event.target;
		setFormState((prevState) => ({
			...prevState,
			[name]: value,
		}));
		setMessage(null);
		setSubmissionError(false);
	}

	return (
		<>
			<form className={styles.loginForm} onSubmit={handleSubmit}>
				<label htmlFor="email-id">Email Address</label>
				<input
					name="email"
					type="email"
					placeholder="Enter your email address"
					value={formState.email}
					onChange={handleInputChange}
					required
				/>

				<label htmlFor="password-id">Password</label>
				<input
					name="password"
					type="password"
					placeholder="Enter your account password"
					value={formState.password}
					onChange={handleInputChange}
					required
				/>

				<div className={styles.loginPassword}>
					<Button text="Login" type="submit" />
					<Link className={styles.forgotPassword} href="/account/forgot">
						Forgot your password?
					</Link>
				</div>
			</form>

			{message ? (
				<Modal message={message} error={submissionError} />
			) : (
				<div className={styles.empty} />
			)}
		</>
	);
}

export { AuthForm };
