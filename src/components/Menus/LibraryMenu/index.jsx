import styles from "./libraryMenu.module.css";
import { BsBuildings } from "react-icons/bs";
import { IoFolderOpenOutline, IoFolderOpenSharp } from "react-icons/io5";
import { MdAdminPanelSettings } from "react-icons/md";

export function LibraryMenu({
    toggleModalCreateGroup,
    allGroups,
    setSelectedGroup,
    checkPermission,
    toggleModalSetting
}){
    return(
        <div className={styles.menuContents}>
            <button className={styles.addGroupBtn} onClick={toggleModalCreateGroup}>
                <BsBuildings/>
                <p className={styles.addGroup}>グループを構築</p>
            </button>
            <div className={styles.groups}>
                <p className={styles.groupsTitle}>YOUR GROUPS</p>
                {Array.isArray(allGroups) && allGroups.map((group) => (
                    <div className={styles.groupBox} key={group.id}>
                        <button className={styles.group} onClick={() => setSelectedGroup({id: group.id, name: group.name})}>
                            {checkPermission.some(permission => permission.group_id === group.id && permission.permission_id === 1) ? (
                                <div className={styles.groupIconBtn} onClick={() => {toggleModalSetting(); setSelectedGroup({id: group.id, name: group.name});}}>
                                    <IoFolderOpenSharp />
                                </div>
                            ):(
                                <div className={styles.groupIcon}>
                                    <IoFolderOpenOutline/>
                                </div>
                            )}
                            <p className={styles.groupName}>{group.name}</p>
                        </button>
                    </div>
                ))}
            </div>
            {allGroups.length === 1 && (
                <div className={styles.empty} onClick={toggleModalCreateGroup}>
                    <p className={styles.emptyMain}>グループを<br/>構築してみましょう</p>
                </div>
            )}
        </div>
    )
}