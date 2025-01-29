import { ModalWindow } from "@/components/UI/ModalWindow";
import styles from "./newGroup.module.css";
import { BsX } from "react-icons/bs";

export function NewGroup({
  toggleModalCreateGroup,
  createName,
  handleChangeCreateName,
  createGroupMemberSuggest,
  searchCreateGroupMember,
  handleSearchCreateGroupMember,
  handleAddCreateGroupMember,
  handleDeleteCreateGroupMember,
  createGroupMemberList,
  handleCreateGroup,
}) {
  return (
    <ModalWindow>
      {/* 閉じるボタン */}
      <button
        className={styles.modalNewGroupClose}
        onClick={toggleModalCreateGroup}
        type="button"
      >
        <BsX />
      </button>

      {/* コンテンツ */}
      <div className={styles.modalNewGroupContents}>
        <form className={styles.modalNewGroupForm} onSubmit={handleCreateGroup}>
          {/* グループ名 */}
          <div className={styles.newGroupTitle}>
            <label className={styles.newGroupLabel}>グループ名</label>
            <input
              type="text"
              placeholder="例：チームα"
              className={styles.newGroupInput}
              onChange={handleChangeCreateName}
              value={createName}
              required
            />
          </div>

          {/* メンバー検索 */}
          <div className={styles.newGroupMembers}>
            <label className={styles.newGroupLabel}>メンバー</label>
            <input
              type="text"
              placeholder="ユーザー名で検索"
              className={styles.newGroupInput}
              onChange={handleSearchCreateGroupMember}
              value={searchCreateGroupMember}
            />

            {createGroupMemberSuggest.length > 0 && (
              // メンバー候補
              <div className={styles.newGroupSuggest}>
                <div className={styles.suggestMemberBox}>
                  {createGroupMemberSuggest.map((user) => (
                    <button
                      className={styles.suggestMember}
                      key={user.id}
                      onClick={(e) => handleAddCreateGroupMember(e, user)}
                    >
                      {user.username}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* メンバーリスト */}
          <div className={styles.newGroupMemberListBox}>
            <p className={styles.newGroupLabel}>メンバーリスト</p>
            <div className={styles.newGroupMemberList}>
              {createGroupMemberList.map((member, index) => (
                <div className={styles.member} key={`${member.id}-${index}`}>
                  <p>{member.username}</p>
                  <button
                    className={styles.memberDelete}
                    onClick={(e) => handleDeleteCreateGroupMember(e, member)}
                  >
                    <BsX />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* グループ作成 */}
          <button className={styles.newGroupBtn} type="submit">
            構築
          </button>
        </form>
      </div>
    </ModalWindow>
  );
}
