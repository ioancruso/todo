"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { createClientAuth } from "../supabase/supabase_auth";
import { createClientService } from "../supabase/supabase";

import type { UserInfo } from "../types";

export async function getLoggedUser() {
	const cookieStore = cookies();
	const supabase = createClientAuth();

	let session = null;
	try {
		// Get all cookies from the cookie store
		const cookies = cookieStore.getAll();

		// Iterate through the cookies and find the one with a name containing "auth-token"
		for (const cookie of cookies) {
			if (cookie.name.includes("auth-token")) {
				session = cookie.value;
				break; // Stop iterating once we find the first matching cookie
			}
		}
	} catch (error) {
		// Handle any errors that occur during the retrieval process
		console.error("Error retrieving session token: ", error);
	}

	if (session == null) {
		return null;
	}

	const {
		data: { user },
	} = await supabase.auth.getUser();

	let UserInfo: UserInfo = null;

	if (user) {
		UserInfo = {
			id: user.id,
		};
	}

	return UserInfo;
}

export async function Login(formData: FormData) {
	const email = String(formData.get("email"));
	const password = String(formData.get("password"));
	const supabase = createClientAuth();

	const { error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (error) {
		return { error: { message: error.message } };
	}
	return { error: null };
}

export async function Register(formData: FormData) {
	const email = String(formData.get("email"));
	const password = String(formData.get("password"));

	const supabaseServer = createClientService();

	// Check if the same email is used
	const { data: emailIsUsed, error: emailError } = await supabaseServer
		.from("users_view")
		.select()
		.eq("email", email)
		.single();

	if (emailIsUsed) {
		return { error: { message: "Email is already used" } };
	}

	const supabase = createClientAuth();
	const URL = headers().get("origin");

	const { error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			emailRedirectTo: URL!,
		},
	});

	if (error) {
		console.log(error);
		return { error: { message: error.message } };
	}
	return { error: null };
}
export async function Reset(formData: FormData) {
	const URL = headers().get("origin");

	const supabase = createClientAuth();

	const email = String(formData.get("email"));

	try {
		await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: URL!,
		});
	} catch (error) {
		return { error: error as Error };
	}
	return { error: null };
}
export async function Change(formData: FormData) {
	const supabase = createClientAuth();

	const password = String(formData.get("password"));

	try {
		await supabase.auth.updateUser({
			password: password,
		});
	} catch (error) {
		return { error: error as Error };
	}
	return { error: null };
}

export async function signOut() {
	const supabase = createClientAuth();

	await supabase.auth.signOut();

	redirect("/");
}
