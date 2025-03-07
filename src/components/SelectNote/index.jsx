import { FiCalendar } from "react-icons/fi";
import { FiTag } from "react-icons/fi";
import styles from "./selectNote.module.css";
import Link from "next/link";

// タグごとに一貫した色を生成する関数
const getTagColor = (tag) => {
  // タグの文字列からハッシュ値を生成
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // 色相を決定（0-360）
  const hue = Math.abs(hash % 360);
  
  // 彩度と明度は固定（パステル調）
  return {
    background: `hsl(${hue}, 85%, 95%)`,
    color: `hsl(${hue}, 70%, 40%)`,
    borderColor: `hsl(${hue}, 70%, 90%)`
  };
};

export function Notes({ id, className, title, preview, last, tags = [] }) {
  return (
    // <Link href={"/Editor"} className={className}>
    // <Link href={{ pathname: "/Editor/", query: { id } }} className={className}>
    <Link href={`/Editor/${id}`} className={className}>
      <div className={styles.note}>
        <div className={styles.title}>
          <p>{title}</p>
        </div>
        {className.includes("grid") ? (
          <div className={styles.preview}>
            <p>{preview}</p>
          </div>
        ) : null}
        {tags && tags.length > 0 && (
          <div className={styles.tags}>
            {tags.map((tag, index) => {
              const tagStyle = getTagColor(tag);
              return (
                <span 
                  key={index} 
                  className={styles.tag}
                  style={tagStyle}
                >
                  <FiTag className={styles.tagIcon} />
                  {tag}
                </span>
              );
            })}
          </div>
        )}
        <div className={styles.history}>
          <FiCalendar className={styles.historyIcon} />
          <p>{last}</p>
        </div>
      </div>
    </Link>
  );
}
