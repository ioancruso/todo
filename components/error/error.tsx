import styles from "./error.module.scss";

function ErrorWarning() {
	return (
		<div className={styles.errorModal}>
			An error has occurred. Please try again later...
		</div>
	);
}

export { ErrorWarning };
