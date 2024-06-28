import { cookies } from "next/headers";

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
	const cookieStore = cookies();

	let response = NextResponse.next({
		request: {
			headers: request.headers,
		},
	});

	const supabase = createServerClient(
		process.env.SUPABASE_URL!,
		process.env.SUPABASE_SERVICE!,
		{
			cookies: {
				get(name: string) {
					return request.cookies.get(name)?.value;
				},
				set(name: string, value: string, options: CookieOptions) {
					request.cookies.set({
						name,
						value,
						...options,
					});
					response = NextResponse.next({
						request: {
							headers: request.headers,
						},
					});
					response.cookies.set({
						name,
						value,
						...options,
					});
				},
				remove(name: string, options: CookieOptions) {
					request.cookies.set({
						name,
						value: "",
						...options,
					});
					response = NextResponse.next({
						request: {
							headers: request.headers,
						},
					});
					response.cookies.set({
						name,
						value: "",
						...options,
					});
				},
			},
		}
	);

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
		console.error("Error retrieving session token:", error);
	}

	if (session == null) {
		return null;
	}

	await supabase.auth.getUser();

	return response;
}
