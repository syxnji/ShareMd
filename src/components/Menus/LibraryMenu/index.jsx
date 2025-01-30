import { Menu } from "@/components/UI/Menu";
import styles from "./libraryMenu.module.css";
import { BsBuildings } from "react-icons/bs";
import { IoFolderOpenOutline, IoFolderOpenSharp } from "react-icons/io5";

export function LibraryMenu({
  userId,
  toggleModalCreateGroup,
  allGroups,
  setSelectedGroup,
  checkPermission,
  toggleModalSetting,
  menuState,
}) {

  userId = parseInt(userId);

  return (
    <Menu menuState={menuState}>
      <div className={styles.menuContents}>
        {/* グループ追加 */}
        <button className={styles.addGroupBtn} onClick={toggleModalCreateGroup}>
          <BsBuildings />
          <p className={styles.addGroup}>グループを構築</p>
        </button>

        {/* グループ一覧 */}
        <div className={styles.groups}>
          <p className={styles.groupsTitle}>YOUR GROUPS</p>
          {Array.isArray(allGroups) &&
            allGroups.map((group) => (
              <div className={styles.groupBox} key={group.id}>
                <button
                  className={styles.group}
                  onClick={() =>
                    setSelectedGroup({ id: group.id, name: group.name })
                  }
                >
                  {checkPermission.some(
                    (permission) =>
                      group.created_by === userId ||
                      permission.group_id === group.id &&
                      permission.permission_id === 1,
                  ) ? (
                    <div
                      className={styles.groupIconBtn}
                      onClick={() => {
                        toggleModalSetting();
                        setSelectedGroup({ id: group.id, name: group.name });
                      }}
                    >
                      <IoFolderOpenSharp />
                    </div>
                  ) : (
                    <div className={styles.groupIcon}>
                      <IoFolderOpenOutline />
                    </div>
                  )}
                  <p className={styles.groupName}>{group.name}</p>
                </button>
              </div>
            ))}
        </div>
      </div>
    </Menu>
  );
}
