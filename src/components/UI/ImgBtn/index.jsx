import styles from "./imgbtn.module.css";

export function ImgBtn({ img, click, type, color }) {
  return (
    // <button className={styles.ImgBtn} onClick={click} type={type}>
    <button
      className={color === "main" ? styles.mainColor : styles.ImgBtn}
      onClick={click}
      type={type}
    >
      {img}
    </button>
  );
}
