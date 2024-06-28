export type theme = "light" | "dark";

export type UserInfo = {
	id?: string | null;
} | null;

export type todo = {
	id: string;
	description: string;
	solved: boolean;
	userid: string;
	color: number;
};
