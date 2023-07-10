import styles from "./JustButton.module.scss";

function JustButton({ text, link, type, color }) {
  if (type === "submit") {
    return (
      <button
        type="submit"
        className={styles.button}
        style={color ? { backgroundColor: color } : {}}
      >
        {text}
      </button>
    );
  } else {
    return (
      <a
        href={link}
        className={styles.button}
        style={color ? { backgroundColor: color } : {}}
      >
        {text}
      </a>
    );
  }
}

export { JustButton };