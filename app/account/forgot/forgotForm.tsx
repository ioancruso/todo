"use client";

import { useState, ChangeEvent, FormEvent } from "react";

import { Modal } from "@/components/modal/modal";
import { Button } from "@/components/button/button";

import { Reset } from "@/utilities/auth/auth";

import styles from "./page.module.scss";

const EMAIL_MIN_LENGTH = 5;
const EMAIL_MAX_LENGTH = 60;

interface FormValues {
	email: string;
}

function validateField(
	name: keyof FormValues,
	value: string,
	submit?: boolean
): string {
	const length = value.length;
	const limits = {
		email: { min: EMAIL_MIN_LENGTH, max: EMAIL_MAX_LENGTH },
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

	if (
		submit &&
		value !== "" &&
		name === "email" &&
		!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
	) {
		return "Invalid email address.";
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

function ForgotForm() {
	const [message, setMessage] = useState<string | null>(null);
	const [submissionError, setSubmissionError] = useState<boolean>(false);

	const [formValues, setFormValues] = useState<FormValues>({
		email: "",
	});

	const [validationErrors, setValidationErrors] = useState<FormValues>({
		email: "",
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
		};

		setValidationErrors(newValidationErrors);

		// Check if there are any errors
		if (Object.values(newValidationErrors).some((error) => error !== "")) {
			return;
		}

		const formData = new FormData(event.currentTarget as HTMLFormElement);
		const { error } = await Reset(formData);

		if (error) {
			setMessage("An error occurred. Please try again.");
			setSubmissionError(true);
		} else {
			setMessage(
				"If there is an account associated with this email, you will receive a link to reset your password."
			);
			setSubmissionError(false);
			setFormValues({
				email: "",
			});
			setValidationErrors({
				email: "",
			});
		}
	}

	return (
		<>
			<form className={styles.resetForm} onSubmit={handleSubmit}>
				<TextInput
					label="Email Address"
					name="email"
					type="email"
					placeholder="Enter your email address"
					value={formValues.email}
					validationError={validationErrors.email}
					onChange={handleInputChange}
				/>
				<Button
					text="Reset"
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

export { ForgotForm };
