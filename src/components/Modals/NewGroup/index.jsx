import { ModalWindow } from "@/components/UI/ModalWindow";
import styles from "./newGroup.module.css";
import { BsX } from "react-icons/bs";
import { useState, useEffect } from "react";
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
  const handleCreateGroup = async (e) => {
    e.preventDefault();
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
  };

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
