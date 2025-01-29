// component
import { Notes } from "../SelectNote";
// style
import styles from "./notesInGroup.module.css";
import styleNotes from "@/components/SelectNote/selectNote.module.css";

export function NotesInGroup({
  selectedGroup,
  notes,
  isNotesClass,
  toggleModalNewNote,
}) {
  return (
    <>
      {/* グリープの選択時と未選択時で表示を切り替え */}
      {selectedGroup.id && notes.length === 0 ? (
        <div
          className={styles.empty}
          onClick={() => {
            toggleModalNewNote();
          }}
        >
          <p className={styles.emptyMain}>ノートがありません</p>
          <p className={styles.emptySub}>ここをクリックでノートを作成</p>
        </div>
      ) : (
        <>
          {/* notes */}
          <div className={styles.notesTitles}>
            <p className={styles.notesTitle}>GROUP IN NOTES</p>
          </div>
          <div className={isNotesClass ? styles.grid : styles.list}>
            {/* ノート */}
            {notes.map((note) => (
              <Notes
                className={isNotesClass ? styleNotes.grid : styleNotes.list}
                key={note.id}
                id={note.id}
                title={note.title}
                preview={note.content?.split("\n").slice(0, 3).join("\n") || ""}
                last={new Date(note.updated_at).toLocaleString()}
              />
            ))}

            {/* ノートを追加 */}
            <div
              className={styles.empty}
              onClick={() => {
                toggleModalNewNote();
              }}
            >
              <p className={styles.emptyMain}>ノートを追加</p>
              <p className={styles.emptySub}>ここをクリックでノートを作成</p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
