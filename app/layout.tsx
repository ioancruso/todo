import { cookies } from "next/headers";

import { Header } from "../sections/header/header";
import { Footer } from "../sections/footer/footer";

import type { Metadata, Viewport } from "next";

import "./layout.scss";
import { theme } from "@/utilities/types";

export async function generateViewport(): Promise<Viewport> {
	const cookieStore = cookies();
	const cookie = cookieStore.get("theme");
	let theme: string = "dark";

	if (cookie) {
		theme = cookie.value;
	}
	return {
		themeColor: theme === "dark" ? "black" : "white",
	};
}

export const metadata: Metadata = {
	title: {
		template: "%s | To do",
		default: "Home",
	},
	robots: {
		index: false,
		follow: false,
		nocache: false,
		googleBot: {
			index: false,
			follow: false,
		},
	},
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const cookieStore = cookies();
	const cookie = cookieStore.get("theme");
	let theme: string = "dark";

	if (cookie) {
		theme = cookie.value;
	}
	return (
		<html lang="ro" data-theme={theme}>
			<body>
				<Header theme={theme as theme} />
				{children}
				<Footer />
			</body>
			{/*<GoogleAnalytics gaId="G-HJW2CLNZ5E" />*/}
		</html>
	);
}
