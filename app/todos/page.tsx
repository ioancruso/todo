import { redirect } from "next/navigation";
import { unstable_cache } from "next/cache";

import { createClientService } from "@/utilities/supabase/supabase";

import { TodoList } from "./todoList";
import { getLoggedUser } from "@/utilities/auth/auth";

import { todo } from "@/utilities/types";

import styles from "./page.module.scss";

export default async function Home() {
	const UserInfo = await getLoggedUser();
	const supabase = createClientService();

	if (!UserInfo) {
		redirect("/");
	}

	async function getTodos(userid: string): Promise<todo[]> {
		let { data: todos, error } = await supabase
			.from("todos")
			.select("*")
			.eq("userid", userid)
			.order("id", { ascending: false });

		if (error || !todos) {
			console.log(error);
			throw error;
		}

		return todos;
	}

	const getCachedTodos = unstable_cache(
		async (userid) => await getTodos(userid),
		[`todos-${UserInfo.id}`],
		{ tags: [`todos-${UserInfo.id}`] }
	);

	const todos: todo[] = await getCachedTodos(UserInfo.id!);

	return (
		<>
			<div className={styles.container}>
				<h1>Your Todos</h1>
				<TodoList todosData={todos} UserInfo={UserInfo} />
			</div>
		</>
	);
}
