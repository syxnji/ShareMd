import styles from "./libraryMenu.module.css";
import { BsBuildings } from "react-icons/bs";
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
                <p>グループを構築</p>
            </button>
            <div className={styles.groups}>
                {Array.isArray(allGroups) && allGroups.map((group) => (
                    <div className={styles.groupBox} key={group.id}>
                        <button className={styles.group} onClick={() => setSelectedGroup({id: group.id, name: group.name})}>
                            {group.name}
                        </button>
                        {checkPermission.some(permission => permission.group_id === group.id && permission.permission_id === 1) && (
                            <button className={styles.settingBtn} onClick={() => {toggleModalSetting(); setSelectedGroup({id: group.id, name: group.name});}}><MdAdminPanelSettings /></button>
                        )}
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