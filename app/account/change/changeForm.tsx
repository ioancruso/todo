"use client";

import { useState, ChangeEvent, FormEvent } from "react";

import { Modal } from "@/components/modal/modal";
import { Button } from "@/components/button/button";

import { Change } from "@/utilities/auth/auth";

import styles from "./page.module.scss";

const PASSWORD_MIN_LENGTH = 6;
const PASSWORD_MAX_LENGTH = 20;

interface FormValues {
	password: string;
}

function validateField(
	name: keyof FormValues,
	value: string,
	submit?: boolean
): string {
	const length = value.length;
	const limits = {
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

function ChangeForm() {
	const [message, setMessage] = useState<string | null>(null);
	const [submissionError, setSubmissionError] = useState<boolean>(false);

	const [formValues, setFormValues] = useState<FormValues>({
		password: "",
	});

	const [validationErrors, setValidationErrors] = useState<FormValues>({
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
			password: validateField("password", formValues.password, true),
		};

		setValidationErrors(newValidationErrors);

		// Check if there are any errors
		if (Object.values(newValidationErrors).some((error) => error !== "")) {
			return;
		}

		const formData = new FormData(event.currentTarget as HTMLFormElement);
		const { error } = await Change(formData);

		if (error) {
			setMessage("An error occurred. Please try again.");
			setSubmissionError(true);
		} else {
			setMessage("Password has been successfully changed.");
			setSubmissionError(false);
			setFormValues({
				password: "",
			});
			setValidationErrors({
				password: "",
			});
		}
	}

	return (
		<>
			<form className={styles.changeForm} onSubmit={handleSubmit}>
				<TextInput
					label="New Password"
					name="password"
					type="password"
					placeholder="Enter your new account password"
					value={formValues.password}
					validationError={validationErrors.password}
					onChange={handleInputChange}
				/>
				<Button
					text="Change"
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

export { ChangeForm };
