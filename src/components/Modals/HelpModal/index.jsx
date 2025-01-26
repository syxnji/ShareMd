import styles from './helpModal.module.css';

export function HelpModal({ children }){
    return(
        <div className={styles.helpModal}>
            {children}
        </div>
    )
}