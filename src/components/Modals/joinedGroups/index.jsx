import { ModalWindow } from "@/components/UI/ModalWindow";
import styles from "./joinedGroups.module.css";
import { BsX } from "react-icons/bs";
import { MdAdminPanelSettings } from "react-icons/md";


export function JoinedGroupsModal({ allGroups, toggleModalJoinedGroups, checkPermission, handleLeaveGroup, toggleModalSetting, setSelectedGroup, setModalJoinedGroups }){
    return(
        <ModalWindow>
            <button className={styles.joinedGroupsClose} onClick={toggleModalJoinedGroups}><BsX/></button>
            <div className={styles.joinedGroupsContent}>
                <div className={styles.GroupsList}>
                    {allGroups.map((group) => (
                        <div className={styles.group} key={group.id}>
                            <p className={styles.modalGroupName}>{group.name}</p>
                            {/* 設定モーダル切替 / グループ選択 / 別モーダル閉じる */}
                            {checkPermission.some(permission => permission.group_id === group.id && permission.permission_id === 1) && (
                                <button className={styles.settingBtn} onClick={(e) => {toggleModalSetting(); setSelectedGroup({id: group.id, name: group.name}); setModalJoinedGroups(false);}}><MdAdminPanelSettings /></button>
                            )}
                            <button className={styles.deleteBtn} onClick={(e) => {handleLeaveGroup(group.id);}} disabled={group.name === 'プライベート'}><BsX/></button>
                        </div>
                    ))}
                </div>
            </div>
        </ModalWindow>
    )
}