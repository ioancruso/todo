import styles from "./modal.module.scss";

type ModalProps = {
	message: string | null;
	error: boolean;
};

function Modal({ message, error }: ModalProps) {
	return (
		<div className={`${styles.modal} ${error ? styles.fail : styles.succes}`}>
			{message}
		</div>
	);
}

export { Modal };
