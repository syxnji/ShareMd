// component
import { GroupHeadline } from "../GroupHeadline/page"
import { Notes } from "../SelectNote/page"
// style
import styles from "./notesInGroup.module.css"
import styleNotes from "@/components/SelectNote/selectNote.module.css"

export function NotesInGroup({ notes, isNotesClass, head }) {
    return (
        <>
        {/* グリープの選択時と未選択時で表示を切り替え */}
        {notes.length === 0 ? null : (
            <>
            {/* headLine */}
            <GroupHeadline headLeft={head} />

            {/* notes */}
            <div className={isNotesClass ? styles.grid : styles.list}>
                {notes.map((note) => (
                    <Notes
                        className={isNotesClass ? styleNotes.grid : styleNotes.list}
                        key={note.id}
                        title={note.title}
                        preview={note.content}
                        last={new Date(note.updated_at).toLocaleString()}
                    />
                ))}
            </div>
            </>
        )}
        </>
    );
}