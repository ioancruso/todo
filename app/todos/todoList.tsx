"use client";

import { useRouter } from "next/navigation";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Card } from "@/components/card/card";
import { ErrorWarning } from "@/components/error/error";
import {
	addTodo,
	deleteTodos,
	markAsDone,
	markAsUndone,
} from "@/utilities/fetch/todosInteractions";
import { revalidateTodos } from "@/utilities/revalidate";
import type { UserInfo, todo } from "@/utilities/types";
import styles from "./page.module.scss";

type todoListProps = {
	todosData: todo[];
	UserInfo: UserInfo;
};

function TodoList({ todosData, UserInfo }: todoListProps) {
	const [inputTodo, setInputTodo] = useState("");
	const [errorMessage, setErrorMessage] = useState<boolean>(false);
	const [selectedTodos, setSelectedTodos] = useState<string[]>([]);
	const [todos, setTodos] = useState<todo[]>(todosData);

	const router = useRouter();

	useEffect(() => {
		setTodos(todosData);
	}, [todosData]);

	useEffect(() => {
		if (errorMessage) {
			const timer = setTimeout(() => setErrorMessage(false), 3000);
			return () => clearTimeout(timer);
		}
	}, [errorMessage]);

	function handleChange(event: ChangeEvent<HTMLInputElement>) {
		setInputTodo(event.target.value);
	}

	async function handleSubmit(event: FormEvent) {
		event.preventDefault();
		const formData = new FormData(event.currentTarget as HTMLFormElement);
		const { error } = await addTodo(formData, UserInfo);

		if (error) {
			setErrorMessage(true);
		} else {
			revalidateTodos(UserInfo!.id!);
			router.refresh();
			setInputTodo("");
		}
	}

	async function handleDelete() {
		const updatedTodos = todos.filter(
			(todo) => !selectedTodos.includes(todo.id)
		);
		setTodos(updatedTodos); // Optimistically update

		const { error } = await deleteTodos(selectedTodos, UserInfo);

		if (error) {
			setErrorMessage(true);
			setTodos(todos); // Rollback
		} else {
			revalidateTodos(UserInfo!.id!);
			setSelectedTodos([]);
		}
	}

	async function handleMarkAsDone() {
		const updatedTodos = todos.map((todo) =>
			selectedTodos.includes(todo.id) ? { ...todo, solved: true } : todo
		);
		setTodos(updatedTodos); // Optimistically update

		const { error } = await markAsDone(selectedTodos, UserInfo);

		if (error) {
			setErrorMessage(true);
			setTodos(todos); // Rollback
		} else {
			revalidateTodos(UserInfo!.id!);
			setSelectedTodos([]);
		}
	}

	async function handleMarkAsUndone() {
		const updatedTodos = todos.map((todo) =>
			selectedTodos.includes(todo.id) ? { ...todo, solved: false } : todo
		);
		setTodos(updatedTodos); // Optimistically update

		const { error } = await markAsUndone(selectedTodos, UserInfo);

		if (error) {
			setErrorMessage(true);
			setTodos(todos); // Rollback
		} else {
			revalidateTodos(UserInfo!.id!);
			setSelectedTodos([]);
		}
	}

	function handleSelect(todoId: string) {
		setSelectedTodos((prevSelected) =>
			prevSelected.includes(todoId)
				? prevSelected.filter((id) => id !== todoId)
				: [...prevSelected, todoId]
		);
	}

	function handleSelectAll() {
		setSelectedTodos(
			todos.length === selectedTodos.length
				? []
				: todos.map((todo) => todo.id)
		);
	}

	function getMajorityStatus() {
		const solvedCount = selectedTodos.filter(
			(id) => todos.find((todo) => todo.id === id)?.solved
		).length;
		const unsolvedCount = selectedTodos.length - solvedCount;

		if (solvedCount > unsolvedCount) return "solved";
		if (unsolvedCount > solvedCount) return "unsolved";
		return "equal";
	}

	const majorityStatus = getMajorityStatus();

	return (
		<>
			<form onSubmit={handleSubmit} className={styles.addForm}>
				<input
					name="todo"
					placeholder="type here..."
					minLength={4}
					maxLength={110}
					required
					value={inputTodo}
					onChange={handleChange}
					className={styles.content}
				/>
				<button type="submit">Add</button>
			</form>

			{errorMessage && <ErrorWarning />}
			{todos.length > 0 ? (
				<>
					<div className={styles.control}>
						<button onClick={handleSelectAll}>
							{todos.length === selectedTodos.length
								? "Deselect all"
								: "Select all"}
						</button>
						<div className={styles.options}>
							<button
								title="Delete selected todos"
								onClick={handleDelete}
								disabled={selectedTodos.length === 0}
							>
								Delete
							</button>
							<button
								title="Mark selected todos as not finished"
								onClick={
									majorityStatus === "solved"
										? handleMarkAsUndone
										: handleMarkAsDone
								}
								disabled={selectedTodos.length === 0}
							>
								{majorityStatus === "solved" ||
								majorityStatus === "equal"
									? "Pending"
									: "Done"}
							</button>
						</div>
					</div>
					<div className={styles.todos}>
						{todos.map((todo) => (
							<Card
								key={todo.id}
								todoData={todo}
								UserInfo={UserInfo}
								handleSelect={handleSelect}
								isSelected={selectedTodos.includes(todo.id)}
							/>
						))}
					</div>
				</>
			) : (
				<div className={styles.none}>None yet</div>
			)}
		</>
	);
}

export { TodoList };
