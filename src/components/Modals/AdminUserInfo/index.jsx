import { ModalWindow } from "@/components/UI/ModalWindow";
import styles from "./adminUserInfo.module.css";
import { BsX } from "react-icons/bs";

export function AdminUserInfo({ userInfo, toggleModalAdminUserInfo }){
    if (!userInfo || !Array.isArray(userInfo) || userInfo.length === 0) {
        return null;
    }

    return(
        <ModalWindow>
            <button className={styles.adminUserInfoClose} onClick={toggleModalAdminUserInfo}><BsX/></button>
            <div className={styles.adminUserInfo}>
                <p className={styles.userName}>{userInfo[0].userName}</p>
                <ul className={styles.userGroups}>
                    {userInfo.map((group) => (
                        <li key={group.groupId} className={styles.userGroup}>
                            <p className={styles.groupName}>{group.groupName}</p>
                            <p className={styles.roleName}>{group.roleName}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </ModalWindow>
    )
}