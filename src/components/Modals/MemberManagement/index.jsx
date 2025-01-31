import { BsX } from "react-icons/bs";
import styles from "./memberManagement.module.css";
import { RiAdminLine, RiUser3Line } from "react-icons/ri";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

export const MemberManagement = ({
  selectedGroup,
  userId,
  refresh,
  customToastOptions,
}) => {

  // MARK: selectedGroup → useEffect
  useEffect(() => {
    fetchGroupInMember();
    fetchGroupRole();
  }, [selectedGroup]);

  // MARK: searchUser
  const [searchUser, setSearchUser] = useState("");
  const handleSearchUser = (e) => {
    setSearchUser(e.target.value);
  };

  // MARK: searchUser → memberSuggest
  const [memberSuggest, setMemberSuggest] = useState([]);
  useEffect(() => {
    const fetchMemberSuggest = async () => {
      if (searchUser.length > 0) {
        const response = await fetch(
          `/api/db?table=suggestUsers&name=${searchUser}`,
        );
        const suggestUsers = await response.json();
        setMemberSuggest(suggestUsers.results);
      } else {
        setMemberSuggest([]);
      }
    };
    fetchMemberSuggest();
  }, [searchUser]);

  // MARK: addMember ← user
  const handleAddMember = async (e, user) => {
    e.preventDefault();
    const newMemberId = user.id;
    await fetch(
      `/api/post`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          table: "inviteGroup",
          groupId: selectedGroup.id,
          inviteUserId: newMemberId,
          userId: userId,
        }),
      },
    );
    setSearchUser("");
    refresh();
    fetchGroupInMember();
    toast.success("メンバーを招待しました", customToastOptions);
  };

  // MARK:selectedGroup → groupInMember
  const [groupInMember, setGroupInMember] = useState([]);
  const fetchGroupInMember = async () => {
    if (selectedGroup.id) {
      const response = await fetch(
        `/api/db?table=groupInMember&groupId=${selectedGroup.id}`,
      );
      const members = await response.json();
      setGroupInMember(members.results);
    }
  };

  // MARK:groupRole ← selectedGroup
  const [groupRole, setGroupRole] = useState([]);
  const fetchGroupRole = async () => {
    const response = await fetch(
      `/api/db?table=groupRole&groupId=${selectedGroup.id}`,
    );
    const roles = await response.json();
    setGroupRole(roles.results);
  };

  // MARK: handleChangeRole ← userId, newRoleId
  const handleChangeRole = async (e, userId) => {
    const newRoleId = parseInt(e.target.value, 10);
    await fetch(
      `/api/patch`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          table: "changeRole",
          groupId: selectedGroup.id,
          userId: userId,
          roleId: newRoleId,
        }),
      },
    );
    refresh();
    fetchGroupRole();
    toast.success("役職を更新しました", customToastOptions);
  };

  // MARK: deleteMember ← userId
  const handleDeleteMember = async (e, userId) => {
    e.preventDefault();
    await fetch(
      `/api/patch`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          table: "deleteMember",
          groupId: selectedGroup.id,
          userId: userId,
        }),
      },
    );
    refresh();
    fetchGroupInMember();
    toast.success("メンバーを削除しました", customToastOptions);
  };

  return (
    <div className={styles.memberContent}>
      <div className={styles.addMember}>
        <input
          type="text"
          placeholder="ユーザー名を入力"
          className={styles.searchMember}
          onChange={handleSearchUser}
          value={searchUser}
        />

        {memberSuggest.length > 0 && (
          <div className={styles.suggestMemberBox}>
            {memberSuggest.map((user) => (
              <button
                className={styles.suggestMember}
                key={user.id}
                onClick={(e) => handleAddMember(e, user)}
              >
                {user.username}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className={styles.memberList}>
        {groupInMember?.map((member) => (
          <div className={styles.member} key={member.id}>
            <div className={styles.userIcon}>
              {member.role_id === 1 ? <RiAdminLine /> : <RiUser3Line />}
            </div>
            <p>{member.username}</p>
            <select
              className={styles.roleSelect}
              onChange={(e) => handleChangeRole(e, member.id)}
              value={member.role_id}
              disabled={member.role_id === 1}
            >
              {groupRole?.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            <button
              className={styles.deleteBtn}
              onClick={(e) => handleDeleteMember(e, member.id)}
              disabled={member.role_id === 1}
            >
              <BsX />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
