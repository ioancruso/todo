import styles from "./Modal.module.scss";

function Modal({message, status}) {
    return <>
        <div className={`${styles.popup} ${ status === 'succes' ? styles.succes : styles.fail}`}>
            <p>{message}</p>
        </div>
    </>
} 
    
export { Modal }
