import { GroupHeadline } from "../GroupHeadline";
import styles from "./sidebarInNotes.module.css";
export function SidebarInNotes(){
    
    // GroupHeadline
    const headLeft = (
        <p className={styles.groupName}>GroupName</p>
    )

    return(
        <>
        <div className={styles.sidebar}>
            <GroupHeadline headLeft={headLeft}/>
            <div className={styles.notes}>
                <div className={styles.note}>
                    <p className={styles.active}>
                        This is Note name
                    </p>
                    <p>
                        This is Note name
                    </p>
                </div>
            </div>
        </div>
        </>
    )
}