import { ModalWindow } from "@/components/UI/ModalWindow";
import styles from "./joinedGroups.module.css";
import { BsFolder, BsX } from "react-icons/bs";
import { MdAdminPanelSettings } from "react-icons/md";
import { IoFolderOpenOutline, IoFolderOpenSharp } from "react-icons/io5";

export function JoinedGroupsModal({
  allGroups,
  toggleModalJoinedGroups,
  checkPermission,
  handleLeaveGroup,
  toggleModalSetting,
  setSelectedGroup,
  setModalJoinedGroups,
}) {
  return (
    <ModalWindow>
      <button
        className={styles.joinedGroupsClose}
        onClick={toggleModalJoinedGroups}
      >
        <BsX />
      </button>
      <div className={styles.joinedGroupsContent}>
        {/* 参加しているグループ */}
        <label className={styles.joinedGroupsLabel}>参加しているグループ</label>
        <div className={styles.GroupsList}>
          {allGroups.map((group) => (
            <div className={styles.group} key={group.id}>
              {/* グループアイコン */}
              <div className={styles.groupIcon}>
                {checkPermission.some(
                  (permission) =>
                    permission.group_id === group.id &&
                    permission.permission_id === 1,
                ) ? (
                  <div
                    className={styles.groupIconBtn}
                    onClick={(e) => {
                      toggleModalSetting();
                      setSelectedGroup({ id: group.id, name: group.name });
                      setModalJoinedGroups(false);
                    }}
                  >
                    <IoFolderOpenSharp />
                  </div>
                ) : (
                  <div className={styles.groupIcon}>
                    <IoFolderOpenOutline />
                  </div>
                )}
              </div>

              {/* グループ名 */}
              <p className={styles.modalGroupName}>{group.name}</p>

              {/* グループ削除 */}
              <button
                className={styles.deleteBtn}
                onClick={(e) => {
                  handleLeaveGroup(group.id);
                }}
                disabled={group.name === "プライベート"}
              >
                <BsX />
              </button>
            </div>
          ))}
        </div>
      </div>
    </ModalWindow>
  );
}
