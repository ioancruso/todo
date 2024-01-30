import styles from "./card.module.scss";

import { supabase } from "@/utilities/supabase";

import { useState, useId, useEffect } from "react";
import Select from "react-select";

import Checked from "@/svgs/card/checked";
import Unchecked from "@/svgs/card/unchecked";

import Delete from "@/svgs/card/delete";
import Edit from "@/svgs/card/edit";
import Done from "@/svgs/card/done";

import NotFinished from "@/svgs/card/notFinished";
import Finished from "@/svgs/card/finished";

function Card({ data, onDelete, onSelect, selected, isDone }) {
	const colorOptions = [
		{ value: "var(--third-color)", textColor: "var(--text-color)" },
		{ value: "var(--color1)", textColor: "var(--textcolor1)" },
		{ value: "var(--color2)", textColor: "var(--textcolor2)" },
		{ value: "var(--color3)", textColor: "var(--textcolor3)" },
		{ value: "var(--color4)", textColor: "var(--textcolor4)" },
		{ value: "var(--color5)", textColor: "var(--textcolor5)" },
	];

	const [isChecked, setIsChecked] = useState(false);
	const [color, setColor] = useState(colorOptions[data.color].value);
	const [textColor, setTextColor] = useState(
		colorOptions[data.color].textColor
	);
	const [isEditing, setIsEditing] = useState(false);
	const [editText, setEditText] = useState(data.description);
	const [isFinished, setIsFinished] = useState(false);

	function toggleCheck() {
		setIsChecked(!isChecked);
		onSelect(data.id, isChecked);
	}

	useEffect(() => {
		setIsChecked(selected);
	}, [selected]);

	useEffect(() => {
		setIsFinished(isDone);
	}, [isDone]);

	async function handleColorChange(selectedOption) {
		const selectedColorIndex = colorOptions.findIndex(
			(option) => option.value === selectedOption.value
		);

		if (selectedColorIndex !== -1) {
			const newColor = selectedColorIndex.toString();
			setColor(colorOptions[selectedColorIndex].value);
			setTextColor(colorOptions[selectedColorIndex].textColor);

			let { error } = await supabase
				.from("todos")
				.update({ color: newColor })
				.eq("id", data.id);

			if (error) {
				console.error(error);
			}
		}
	}

	async function handleDelete() {
		await onDelete(data.id);
	}

	function toggleEdit() {
		setIsEditing(!isEditing);
	}

	async function handleEdit() {
		let { error } = await supabase
			.from("todos")
			.update({ description: editText })
			.eq("id", data.id);

		if (error) {
			console.error(error);
		}
	}

	function toggleFinished() {
		setIsFinished(!isFinished);
		handleFinished();
	}

	async function handleFinished() {
		let { error } = await supabase
			.from("todos")
			.update({ solved: isFinished })
			.eq("id", data.id);

		if (error) {
			console.error(error);
		}
	}

	return (
		<div
			className={styles.card}
			style={{ backgroundColor: color, color: textColor }}
		>
			{isChecked ? (
				<>
					<button
						title="Deselect"
						onClick={toggleCheck}
						className={styles.checkbox}
					>
						<Checked width={30} height={30} color={textColor} />
					</button>
				</>
			) : (
				<>
					<button
						title="Select"
						onClick={toggleCheck}
						className={styles.checkbox}
					>
						<Unchecked width={30} height={30} color={textColor} />
					</button>
				</>
			)}
			{isEditing ? (
				<textarea
					value={editText}
					onChange={(e) => setEditText(e.target.value)}
					minLength={4}
					maxLength={240}
					className={styles.description}
					style={{
						backgroundColor: `rgba(0, 0, 0, 0.2)`,
						color: `rgba(255, 255, 255, 1.4)`,
						border: `1px solid ${textColor}`,
					}}
				/>
			) : (
				<div
					className={styles.description}
					style={{
						textDecoration: isFinished ? "line-through" : "none",
					}}
				>
					{editText}
				</div>
			)}
			<Select
				className={styles.select}
				value={{ label: "Color" }}
				name="Color"
				options={colorOptions}
				onChange={handleColorChange}
				instanceId={useId()}
				styles={{
					control: (base, state) => ({
						...base,
						borderWidth: "0.14rem",
						borderRadius: state.menuIsOpen
							? "0 0 0.5rem 0.5rem"
							: "0.5rem",
						borderColor: textColor,
						boxShadow: null,
						backgroundColor: color,
						cursor: "pointer",
						caretColor: "transparent",
						backgroundColor: state.isFocused ? color : `brightness(120%)`,
						transition: "background-color 300ms linear, color 1s linear",
						"&:hover": {
							filter: "brightness(120%)",
							borderColor: `${textColor}`,
						},
					}),
					option: (styles, { data }) => {
						return {
							...styles,
							backgroundColor: data.value,
							color: "black",
							minHeight: "1.5rem",
						};
					},
					menu: (provided, state) => ({
						...provided,
						marginTop: 0,
						marginBottom: 0,
						borderRadius: state.menuIsOpen
							? "0 0 0.75rem 0.75rem"
							: "0.75rem 0.75rem 0 0",
						boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
						border: `2px solid ${textColor}`,
						borderBlockEnd: 0,
						top: "auto",
						bottom: "100%",
					}),
					singleValue: (base) => ({
						...base,
						fontWeight: "bold",
						color: textColor,
					}),
					menuList: (provided, state) => ({
						...provided,
						padding: 0,
						borderRadius: state.menuIsOpen
							? "0 0 0.5rem 0.5rem"
							: "0.5rem 0.5rem 0 0",
					}),
					dropdownIndicator: (provided) => ({
						...provided,
						color: textColor,
						"&:hover": {
							color: textColor,
						},
					}),
					indicatorSeparator: (provided) => ({
						...provided,
						backgroundColor: "transparent",
					}),
				}}
			/>
			<div className={styles.options}>
				<button title="Delete this todo" onClick={handleDelete}>
					<Delete width={40} height={40} color={textColor} />
				</button>
				{isFinished ? (
					<>
						<a title="Mark as not finished" onClick={toggleFinished}>
							<NotFinished width={40} height={40} color={textColor} />
						</a>
					</>
				) : (
					<>
						<a title="Mark as finished" onClick={toggleFinished}>
							<Finished width={40} height={40} color={textColor} />
						</a>
					</>
				)}
				{isEditing ? (
					<>
						<button
							title="Save"
							onClick={() => {
								handleEdit();
								toggleEdit();
							}}
						>
							<Done width={42} height={42} color={textColor} />
						</button>
					</>
				) : (
					<>
						<button title="Edit" onClick={toggleEdit}>
							<Edit width={42} height={42} color={textColor} />
						</button>
					</>
				)}
			</div>
		</div>
	);
}

export { Card };
