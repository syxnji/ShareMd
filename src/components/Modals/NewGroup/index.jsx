import { ModalWindow } from "@/components/UI/ModalWindow";
import styles from "./newGroup.module.css";
import { BsX, BsSearch, BsPeople, BsPersonPlus, BsCheck2 } from "react-icons/bs";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

export function NewGroup({
  toggleModalCreateGroup,
  customToastOptions,
  refresh,
  userInfo,
  userId,
}) {
  // MARK: createName
  const [createName, setCreateName] = useState("");
  const handleChangeCreateName = (e) => {
    setCreateName(e.target.value);
  };

  // MARK: searchCreateMember
  const [searchCreateGroupMember, setSearchCreateGroupMember] = useState("");
  const searchInputRef = useRef(null);
  const handleSearchCreateGroupMember = (e) => {
    setSearchCreateGroupMember(e.target.value);
  };
  useEffect(() => {
    fetchCreateGroupMember();
  }, [searchCreateGroupMember]);

  // MARK: MemberSuggest ← searchCreateGroupMember
  const [createGroupMemberSuggest, setCreateGroupMemberSuggest] = useState([]);
  const fetchCreateGroupMember = async () => {
    if (searchCreateGroupMember.length > 0) {
      const response = await fetch(
        `/api/db?table=suggestUsers&name=${searchCreateGroupMember}`,
      );
      const suggestUsers = await response.json();
      setCreateGroupMemberSuggest(suggestUsers.results);
    } else {
      setCreateGroupMemberSuggest([]);
    }
  };
  // MARK: MemberList
  const [createGroupMemberList, setCreateGroupMemberList] = useState([]);
  if (userInfo && createGroupMemberList.length === 0) {
    setCreateGroupMemberList([
      { id: userInfo.id, username: userInfo.username },
    ]);
  }
  // MARK: addCreateGroupMember
  const handleAddCreateGroupMember = (e, user) => {
    e.preventDefault();
    const newMember = {
      id: user.id,
      username: user.username,
    };
    if (createGroupMemberList.some((member) => member.id === newMember.id)) {
      toast.error("既に追加されています", customToastOptions);
      setSearchCreateGroupMember("");
      return;
    }
    setCreateGroupMemberList([...createGroupMemberList, newMember]);
    setSearchCreateGroupMember("");
    
    // 追加後にフォーカスを検索フィールドに戻す
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // MARK: deleteCreateGroupMember
  const handleDeleteCreateGroupMember = (e, memberToDelete) => {
    e.preventDefault();
    if (memberToDelete.id === userInfo.id) {
      toast.error("自分は削除できません", customToastOptions);
    } else {
      setCreateGroupMemberList(
        createGroupMemberList.filter((m) => m.id !== memberToDelete.id),
      );
    }
  };

  // MARK: memberIds
  const [memberIds, setMemberIds] = useState([]);
  useEffect(() => {
    setMemberIds(createGroupMemberList.map((member) => member.id));
  }, [createGroupMemberList]);

  // MARK: createGroup
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    
    if (createName.trim() === "") {
      toast.error("グループ名を入力してください", customToastOptions);
      return;
    }
    
    if (createGroupMemberList.length < 2) {
      toast.error("少なくとも2人のメンバーが必要です", customToastOptions);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await fetch(
        `/api/post?`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            table: "createGroup",
            name: createName,
            userId: userId,
            memberIds: memberIds,
          }),
        },
      );
      
      toggleModalCreateGroup();
      setCreateName("");
      setCreateGroupMemberList([]);
      refresh();
      toast.success("グループを作成しました", customToastOptions);
    } catch (error) {
      toast.error("エラーが発生しました。もう一度お試しください", customToastOptions);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalWindow className={styles.newGroupModal}>
      {/* ヘッダー */}
      <div className={styles.modalHeader}>
        <h2 className={styles.modalTitle}>新しいグループを作成</h2>
        <button
          className={styles.modalNewGroupClose}
          onClick={toggleModalCreateGroup}
          type="button"
          aria-label="閉じる"
        >
          <BsX />
        </button>
      </div>

      {/* コンテンツ */}
      <div className={styles.modalNewGroupContents}>
        <form className={styles.modalNewGroupForm} onSubmit={handleCreateGroup}>
          <div className={styles.scrollableContent}>
            {/* グループ名 */}
            <div className={styles.newGroupTitle}>
              <label className={styles.newGroupLabel} htmlFor="groupName">
                グループ名
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id="groupName"
                  type="text"
                  placeholder="例：チームα"
                  className={styles.newGroupInput}
                  onChange={handleChangeCreateName}
                  value={createName}
                  required
                />
                {createName && (
                  <span className={styles.inputIcon}>
                    <BsCheck2 />
                  </span>
                )}
              </div>
            </div>

            {/* メンバー検索 */}
            <div className={styles.newGroupMembers}>
              <label className={styles.newGroupLabel} htmlFor="memberSearch">
                メンバーを追加
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id="memberSearch"
                  type="text"
                  placeholder="ユーザー名で検索"
                  className={styles.newGroupInput}
                  onChange={handleSearchCreateGroupMember}
                  value={searchCreateGroupMember}
                  ref={searchInputRef}
                />
                <span className={styles.inputIcon}>
                  <BsSearch />
                </span>
              </div>

              {createGroupMemberSuggest.length > 0 && (
                // メンバー候補
                <div className={styles.newGroupSuggest}>
                  <div className={styles.suggestMemberBox}>
                    {createGroupMemberSuggest.map((user) => (
                      <button
                        className={styles.suggestMember}
                        key={user.id}
                        onClick={(e) => handleAddCreateGroupMember(e, user)}
                        type="button"
                      >
                        <span className={styles.suggestMemberIcon}>
                          <BsPersonPlus />
                        </span>
                        {user.username}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* メンバーリスト */}
            <div className={styles.newGroupMemberListBox}>
              <div className={styles.memberListHeader}>
                <p className={styles.newGroupLabel}>
                  <BsPeople /> メンバーリスト ({createGroupMemberList.length})
                </p>
              </div>
              <div className={styles.newGroupMemberList}>
                {createGroupMemberList.length > 0 ? (
                  createGroupMemberList.map((member, index) => (
                    <div 
                      className={`${styles.member} ${member.id === userInfo.id ? styles.currentUser : ''}`} 
                      key={`${member.id}-${index}`}
                    >
                      <p>{member.username} {member.id === userInfo.id && <span className={styles.youBadge}>あなた</span>}</p>
                      <button
                        className={styles.memberDelete}
                        onClick={(e) => handleDeleteCreateGroupMember(e, member)}
                        type="button"
                        aria-label="メンバーを削除"
                        disabled={member.id === userInfo.id}
                      >
                        <BsX />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyMemberList}>
                    <p>メンバーがいません</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* グループ作成ボタン - スクロール領域の外に配置 */}
          <div className={styles.formActions}>
            <button 
              className={`${styles.newGroupBtn} ${isSubmitting ? styles.submitting : ''}`} 
              type="submit"
              disabled={isSubmitting || createName.trim() === "" || createGroupMemberList.length < 2}
            >
              {isSubmitting ? "処理中..." : "グループを作成"}
            </button>
          </div>
        </form>
      </div>
    </ModalWindow>
  );
}
