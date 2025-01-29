// style
import styles from "./mainbtn.module.css";

export function MainBtn({ text, img, click }) {
  return (
    <button className={styles.mainBtn} onClick={click}>
      {img}
      {text}
    </button>
  );
}
