"use server";

import { revalidateTag } from "next/cache";

export async function revalidateTodos(userid: string) {
	revalidateTag(`todos-${userid}`);
}
