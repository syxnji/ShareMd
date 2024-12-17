import { useEffect, useState } from "react";
import { GroupHeadline } from "../GroupHeadline";
import styles from "./sidebarInNotes.module.css";
export function SidebarInNotes({selectNoteId}){
    
    const [group, setGroup] = useState()
    const [notes, setNotes] = useState({})

    useEffect(() => {
        const fetchGroupAndNotes = async () => {
            try {
                // グループ名を取得
                const groupResponse = await fetch(`/api/db?table=group&id=${selectNoteId}`);
                const groupData = await groupResponse.json();
                const fetchedGroup = groupData.results;
                setGroup(fetchedGroup);
                if (fetchedGroup[0]) {
                    setGroup(fetchedGroup[0]);
                }
            } catch (error) {
                console.error('エラー(fetchGroupAndNotes):', error);
            }
        };
    
        fetchGroupAndNotes();
    }, [selectNoteId]);
    
    // groupが更新された後の処理
    useEffect(() => {
        if (group && group.id) {
            const fetchNotes = async () => {
                try {
                    const notesResponse = await fetch(`/api/db?table=notes&id=${group.id}`);
                    const notesData = await notesResponse.json();
                    setNotes(notesData.results);
                } catch (error) {
                    console.error('エラー(fetchNotes):', error);
                }
            };
            fetchNotes();
        }
    }, [selectNoteId, group]);
    
    // GroupHeadline
    const headLeft = (
        group ? (
            <p className={styles.groupName}>{group.name}</p>
        ):(
            <p>不明</p>
        )
    )

    return(
        <>
        <div className={styles.sidebar}>
            <GroupHeadline headLeft={headLeft}/>
            <div className={styles.notes}>
                <div className={styles.note}>
                    {Array.isArray(notes) && notes.length > 0 ? (
                        notes.map(note => (
                            <p 
                             key={note.id} 
                             className={selectNoteId === String(note.id) ? styles.active : ''}
                            >{note.title}</p>
                        ))
                        ) : (
                            <p>ノートがありません</p>
                        )
                    }
                </div>
            </div>
        </div>
        </>
    )
}