"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/button/button";
import { Modal } from "@/components/modal/modal";

import { Register, getLoggedUser } from "@/utilities/auth/auth";

import styles from "./page.module.scss";

const EMAIL_MIN_LENGTH = 5;
const EMAIL_MAX_LENGTH = 60;
const PASSWORD_MIN_LENGTH = 6;
const PASSWORD_MAX_LENGTH = 20;

interface FormValues {
	email: string;
	password: string;
}

function validateField(
	name: keyof FormValues,
	value: string,
	submit?: boolean
): string {
	const length = value.length;
	const limits = {
		email: { min: EMAIL_MIN_LENGTH, max: EMAIL_MAX_LENGTH },
		password: { min: PASSWORD_MIN_LENGTH, max: PASSWORD_MAX_LENGTH },
	};

	if (submit && (!value || value === "")) {
		return "This field is required.";
	}

	if (length < limits[name].min) {
		return `Length must be between ${limits[name].min} and ${limits[name].max} characters.`;
	}

	if (length > limits[name].max) {
		return `Length must be between ${limits[name].min} and ${limits[name].max} characters.`;
	}

	return "";
}

function TextInput({
	label,
	name,
	placeholder,
	type,
	value,
	validationError,
	onChange,
}: {
	label: string;
	name: keyof FormValues;
	placeholder: string;
	type: string;
	value: string;
	validationError: string;
	onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
	return (
		<>
			<label htmlFor={name}>{label}</label>
			<input
				id={name}
				name={name}
				type={type}
				placeholder={placeholder}
				autoComplete="off"
				value={value}
				className={!validationError ? "" : styles.invalid}
				onChange={onChange}
			/>
			<div className={styles.errorContainer}>
				{validationError && (
					<div className={styles.errorMessage}>{validationError}</div>
				)}
			</div>
		</>
	);
}

function RegForm() {
	const [message, setMessage] = useState<string | null>(null);
	const [submissionError, setSubmissionError] = useState<boolean>(false);

	const [formValues, setFormValues] = useState<FormValues>({
		email: "",
		password: "",
	});

	const [validationErrors, setValidationErrors] = useState<FormValues>({
		email: "",
		password: "",
	});

	function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
		const { name, value } = event.target;

		const validationError = validateField(name as keyof FormValues, value);

		setFormValues((prevValues) => ({
			...prevValues,
			[name]: value,
		}));

		setValidationErrors((prevErrors) => ({
			...prevErrors,
			[name]: validationError,
		}));
	}

	async function handleSubmit(event: FormEvent) {
		event.preventDefault();

		// Revalidate all fields
		const newValidationErrors: FormValues = {
			email: validateField("email", formValues.email, true),
			password: validateField("password", formValues.password, true),
		};

		setValidationErrors(newValidationErrors);

		// Check if there are any errors
		if (Object.values(newValidationErrors).some((error) => error !== "")) {
			return;
		}

		const formData = new FormData(event.currentTarget as HTMLFormElement);
		const { error } = await Register(formData);

		if (error) {
			setSubmissionError(true);
			if (error.message === "User already registered") {
				setMessage("This email is already registered.");
			} else {
				setMessage("An error occurred. Please try again.");
			}
		} else {
			setMessage("Your account has been successfully created.");
			setSubmissionError(false);
			setFormValues({
				email: "",
				password: "",
			});
			setValidationErrors({
				email: "",
				password: "",
			});
		}
	}

	return (
		<>
			<form
				onSubmit={handleSubmit}
				className={styles.registerForm}
				autoComplete="off"
			>
				<TextInput
					label="Email"
					name="email"
					type="email"
					placeholder="Enter your email address"
					value={formValues.email}
					validationError={validationErrors.email}
					onChange={handleInputChange}
				/>
				<TextInput
					label="Password"
					name="password"
					type="password"
					placeholder="Enter your password"
					value={formValues.password}
					validationError={validationErrors.password}
					onChange={handleInputChange}
				/>

				<Button
					text="Create Account"
					type="submit"
					disabled={Object.values(validationErrors).some(
						(error) => error !== ""
					)}
				/>
			</form>

			{message ? (
				<Modal message={message} error={submissionError} />
			) : (
				<div className={styles.empty} />
			)}
		</>
	);
}

export { RegForm };
