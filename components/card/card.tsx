"use client";

import { useState, useEffect } from "react";

import { CheckedSvg } from "@/svgs/card/checked";
import { UncheckedSvg } from "@/svgs/card/unchecked";

import { DeleteSvg } from "@/svgs/card/delete";
import { EditSvg } from "@/svgs/card/edit";
import { DoneSvg } from "@/svgs/card/done";

import { NotFinishedSvg } from "@/svgs/card/notFinished";
import { Finished } from "@/svgs/card/finished";

import {
	changeColor,
	deleteTodos,
	editTodo,
	markAsDone,
	markAsUndone,
} from "@/utilities/fetch/todosInteractions";

import { revalidateTodos } from "@/utilities/revalidate";

import { UserInfo, todo } from "@/utilities/types";

import styles from "./card.module.scss";

// Define ColorOption interface
interface ColorOption {
	backgroundColor: string;
	color: string;
	borderColor: string;
}

interface CardProps {
	todoData: todo;
	UserInfo: UserInfo;
	handleSelect: (todoId: string) => void;
	isSelected: boolean;
}

const colorOptions: ColorOption[] = [
	{
		backgroundColor: "var(--third-color)",
		color: "var(--text-color)",
		borderColor: "var(--text-color)",
	},
	{
		backgroundColor: "var(--color1)",
		color: "var(--text-color1)",
		borderColor: "var(--text-color1)",
	},
	{
		backgroundColor: "var(--color2)",
		color: "var(--text-color2)",
		borderColor: "var(--text-color2)",
	},
	{
		backgroundColor: "var(--color3)",
		color: "var(--text-color3)",
		borderColor: "var(--text-color3)",
	},
	{
		backgroundColor: "var(--color4)",
		color: "var(--text-color4)",
		borderColor: "var(--text-color4)",
	},
	{
		backgroundColor: "var(--color5)",
		color: "var(--text-color5)",
		borderColor: "var(--text-color5)",
	},
];

function Card({ todoData, UserInfo, handleSelect, isSelected }: CardProps) {
	const [todo, setTodo] = useState(todoData);
	const [errorMessage, setErrorMessage] = useState<boolean>(false);

	const [colorIndex, setColorIndex] = useState(todo.color);
	const [isEditing, setIsEditing] = useState(false);
	const [editText, setEditText] = useState(todo.description);
	const [isDone, setIsDone] = useState(todo.solved);

	const [menuIsOpen, setMenuIsOpen] = useState(false);

	useEffect(() => {
		setTodo(todoData);
		setColorIndex(todoData.color);
		setEditText(todoData.description);
		setIsDone(todoData.solved);
	}, [todoData]);

	useEffect(() => {
		if (errorMessage) {
			const timer = setTimeout(() => {
				setErrorMessage(false);
			}, 3000);
			return () => clearTimeout(timer); // Cleanup the timer if the component unmounts or error changes
		}
	}, [errorMessage]);

	async function handleColorChange(index: number) {
		setMenuIsOpen(false); // Close the menu immediately after selection

		// Optimistically update the state
		setColorIndex(index);

		const { error } = await changeColor(index, todo.id, UserInfo);

		if (error) {
			setErrorMessage(true);
			// Revert the state if there's an error
			setColorIndex(todo.color);
		} else {
			// Confirm the new color index in todo state
			setTodo((prevTodo) => ({
				...prevTodo,
				color: index,
			}));
		}
	}

	async function handleDelete() {
		const { error } = await deleteTodos([todo.id], UserInfo);

		if (error) {
			setErrorMessage(true);
		} else {
			revalidateTodos(UserInfo!.id!); // Revalidate todos after deletion
		}
	}

	function toggleEdit() {
		setIsEditing(!isEditing); // Toggle editing mode
	}

	async function handleEdit() {
		const previousText = todo.description;
		setTodo((prevTodo) => ({
			...prevTodo,
			description: editText,
		}));

		const { error } = await editTodo(todo.id, UserInfo, editText);

		if (error) {
			setErrorMessage(true);
			// Revert the state if there's an error
			setTodo((prevTodo) => ({
				...prevTodo,
				description: previousText,
			}));
		} else {
			revalidateTodos(UserInfo!.id!); // Revalidate todos after editing
		}
	}

	function toggleFinished() {
		// Toggle finished state and call appropriate handler based on the new state
		if (isDone) {
			handleUnFinished();
		} else {
			handleFinished();
		}
		setIsDone(!isDone); // Toggle finished state
	}

	async function handleFinished() {
		const { error } = await markAsDone([todo.id], UserInfo);

		if (error) {
			setErrorMessage(true);
		} else {
			revalidateTodos(UserInfo!.id!); // Revalidate todos after marking as done
		}
	}

	async function handleUnFinished() {
		const { error } = await markAsUndone([todo.id], UserInfo);

		if (error) {
			setErrorMessage(true);
		} else {
			revalidateTodos(UserInfo!.id!); // Revalidate todos after marking as undone
		}
	}

	function toggleCheck() {
		handleSelect(todo.id); // Notify parent component about selection
	}

	const dynamicCardStyles = {
		backgroundColor: colorOptions[colorIndex].backgroundColor,
		color: colorOptions[colorIndex].color,
	};

	const dynamicSvgFillStyles = {
		fill: colorOptions[colorIndex].color,
	};

	const dynamicSvgStrokeStyles = {
		stroke: colorOptions[colorIndex].color,
	};

	return (
		<div className={styles.card} style={dynamicCardStyles}>
			{isSelected ? (
				<button
					title="Deselect"
					onClick={toggleCheck}
					className={styles.checkbox}
				>
					<CheckedSvg
						width={30}
						height={30}
						style={dynamicSvgFillStyles}
					/>
				</button>
			) : (
				<button
					title="Select"
					onClick={toggleCheck}
					className={styles.checkbox}
				>
					<UncheckedSvg
						width={30}
						height={30}
						style={dynamicSvgFillStyles}
					/>
				</button>
			)}
			{isEditing ? (
				<textarea
					value={editText}
					onChange={(e) => setEditText(e.target.value)}
					minLength={4}
					maxLength={240}
					className={`${styles.description} ${styles.editingDescription}`}
				/>
			) : (
				<div
					className={`${styles.description} ${isDone ? styles.done : ""}`}
				>
					{editText}
				</div>
			)}
			<div className={styles.selectWrapper}>
				<button
					className={styles.selectButton}
					style={dynamicCardStyles}
					onClick={() => setMenuIsOpen((prev) => !prev)}
				>
					Color &#9650;
				</button>
				{menuIsOpen && (
					<div
						className={styles.selectMenu}
						style={{ borderColor: colorOptions[colorIndex].borderColor }}
					>
						{colorOptions.map(
							(option, index) =>
								index !== colorIndex && (
									<div
										key={index}
										className={styles.selectOption}
										style={{
											backgroundColor: option.backgroundColor,
											color: option.color,
										}}
										onClick={() => handleColorChange(index)}
									>
										&nbsp;
									</div>
								)
						)}
					</div>
				)}
			</div>
			<div className={styles.options}>
				<button title="Delete this todo" onClick={handleDelete}>
					<DeleteSvg
						width={40}
						height={40}
						className={styles.icon}
						style={dynamicSvgStrokeStyles}
					/>
				</button>
				{isDone ? (
					<a title="Mark as not finished" onClick={toggleFinished}>
						<NotFinishedSvg
							width={40}
							height={40}
							className={styles.icon}
							style={dynamicSvgFillStyles}
						/>
					</a>
				) : (
					<a title="Mark as finished" onClick={toggleFinished}>
						<Finished
							width={40}
							height={40}
							className={styles.icon}
							style={dynamicSvgFillStyles}
						/>
					</a>
				)}
				{isEditing ? (
					<button
						title="Save"
						onClick={() => {
							handleEdit();
							toggleEdit();
						}}
					>
						<DoneSvg
							width={42}
							height={42}
							className={styles.icon}
							style={dynamicSvgStrokeStyles}
						/>
					</button>
				) : (
					<button title="Edit" onClick={toggleEdit}>
						<EditSvg
							width={42}
							height={42}
							className={styles.icon}
							style={dynamicSvgStrokeStyles}
						/>
					</button>
				)}
			</div>
		</div>
	);
}

export { Card };
