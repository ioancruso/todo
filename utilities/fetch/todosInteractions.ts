"use server";

import { revalidateTodos } from "../revalidate";
import { createClientService } from "../supabase/supabase";

import type { UserInfo } from "../types";

const supabase = createClientService();

export async function addTodo(formData: FormData, UserInfo: UserInfo) {
	const todo = String(formData.get("todo"));

	const { error } = await supabase.from("todos").insert([
		{
			description: todo,
			userid: UserInfo!.id!,
			color: 0,
			solved: false,
		},
	]);

	if (error) {
		console.log(error);
		return { error: { message: error.message } };
	}

	revalidateTodos(UserInfo!.id!);

	return { error: null };
}

export async function editTodo(
	todo_id: string,
	UserInfo: UserInfo,
	newTodo: string
) {
	let { error } = await supabase
		.from("todos")
		.update({ description: newTodo })
		.eq("id", todo_id);

	if (error) {
		console.log(error);
		return { error: { message: error.message } };
	} else {
		revalidateTodos(UserInfo!.id!);
	}

	return { error: null };
}

export async function deleteTodos(ids: string[], UserInfo: UserInfo) {
	const { error } = await supabase.from("todos").delete().in("id", ids);

	if (error) {
		console.log(error);
		return { error: { message: error.message } };
	}

	revalidateTodos(UserInfo!.id!);

	return { error: null };
}

export async function markAsDone(ids: string[], UserInfo: UserInfo) {
	const { error } = await supabase
		.from("todos")
		.update({ solved: true })
		.in("id", ids);

	if (error) {
		console.log(error);
		return { error: { message: error.message } };
	}

	revalidateTodos(UserInfo!.id!);

	return { error: null };
}

export async function markAsUndone(ids: string[], UserInfo: UserInfo) {
	const { data, error } = await supabase
		.from("todos")
		.update({ solved: false })
		.in("id", ids);

	if (error) {
		console.log(error);
		return { error: { message: error.message } };
	}

	revalidateTodos(UserInfo!.id!);

	return { error: null };
}

export async function changeColor(
	color: number,
	id: string,
	UserInfo: UserInfo
) {
	const { error } = await supabase
		.from("todos")
		.update({ color: color })
		.eq("id", id);

	if (error) {
		console.log(error);
		return { error: { message: error.message } };
	} else {
		revalidateTodos(UserInfo!.id!);
	}

	return { error: null };
}
