"use client";
import { useEffect, useState, useCallback } from "react";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
// modals
import { NewNoteModal } from "@/components/Modals/NewNote";
import { JoinedGroupsModal } from "@/components/Modals/joinedGroups";
import { MemberManagement } from "@/components/Modals/MemberManagement";
import { ProjectManagement } from "@/components/Modals/ProjectManagement";
import { PermissionManagement } from "@/components/Modals/PermissionManagement";
import { NewGroup } from "@/components/Modals/NewGroup";
import { SearchGroups } from "@/components/Modals/SearchGroups";
// menu
import { LibraryMenu } from "@/components/Menus/LibraryMenu";
// component
import { NotesInGroup } from "@/components/NotesInGroup";
import { ModalWindow } from "@/components/UI/ModalWindow";
import { RequestToast } from "@/components/RequestToast";
// icon
import { BsFileEarmarkPlus, BsGrid3X3, BsX, BsBuildings, BsArrowRepeat, BsFolder } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa6";
import { MdClose, MdFormatListBulleted, MdLogout, MdMenu, MdOutlineWifiFind } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { RiNotification2Line } from "react-icons/ri";
import { PiEmpty } from "react-icons/pi";
// style
import styles from "./library.module.css";
import "react-toastify/dist/ReactToastify.css";

export default function Library() {
  // MARK: Toast Settings
  const customToastOptions = {
    position: "top-right",
    autoClose: 2000,
    closeOnClick: true,
    draggable: true,
  };

  // MARK: refresh
  const refresh = async () => {
    toast.loading("更新中...", customToastOptions);
    fetchNotifications();
    fetchGroup();
    fetchNotes();
    fetchCheckPermission();
    // fetchGroupInMember();
    // fetchGroupRole();
    fetchRoleToPermit();

    // 1秒後にトーストを消す
    setTimeout(() => {
      toast.dismiss();
    }, 1000);
  };

  // MARK:userId ← Cookies.id
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    const getUserId = async () => {
      const id = Cookies.get("id");
      if (!id) {
        window.location.assign("/Auth");
      } else {
        setUserId(id);
        refresh();
      }
    };
    getUserId();
  }, [userId]);

  // MARK: userInfo ← userId
  const [userInfo, setUserInfo] = useState({});
  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(`/api/db?table=userInfo&userId=${userId}`);
      const result = await response.json();
      setUserInfo(result.results[0]);
    };
    fetchUser();
  }, [userId]);

  // MARK: logout
  const handleLogout = () => {
    Cookies.remove("id", { path: "/" });
    window.location.assign("/Auth");
  };

  // MARK: notifications ← userId
  const [notifications, setNotifications] = useState([]);
  const fetchNotifications = useCallback(async () => {
    const notice = await fetch(`/api/db?table=notifications&userId=${userId}`);
    const noticeResult = await notice.json();
    setNotifications(noticeResult.results);
  }, [userId]);

  // MARK: modalNotification
  const [modalNotification, setModalNotification] = useState(false);
  const toggleModalNotification = () => {
    setModalNotification(!modalNotification);
  };

  // MARK:selectedGroup
  const [selectedGroup, setSelectedGroup] = useState({ id: null, name: null });

  // MARK: selectedGroup → useEffect
  useEffect(() => {
    fetchNotes();
    // fetchGroupInMember();
    // fetchGroupRole();
    fetchRoleToPermit();
  }, [selectedGroup]);

  // MARK:selectedGroupNotes ← selectedGroup
  const [selectedGroupNotes, setSelectedGroupNotes] = useState([]);

  // MARK: searchValue
  const [searchValue, setSearchValue] = useState("");

  // MARK: filteredNotes
  const filteredNotes =
    selectedGroupNotes?.filter((note) => {
      return note.title.includes(searchValue);
    }) || [];

  // MARK: handlers
  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  // MARK: fetchNotes
  const fetchNotes = async () => {
    if (selectedGroup.id) {
      const response = await fetch(
        `/api/db?table=selectedGroupNotes&groupId=${selectedGroup.id}`,
      );
      const notes = await response.json();
      setSelectedGroupNotes(notes.results || []);
    }
  };

  // MARK: accountView
  const [accountView, setAccountView] = useState(false);
  const toggleAccountView = () => {
    setAccountView(!accountView);
  };

  // MARK: modalJoinedGroups
  const [modalJoinedGroups, setModalJoinedGroups] = useState(false);
  const toggleModalJoinedGroups = () => {
    setModalJoinedGroups(!modalJoinedGroups);
    setModalSetting(false);
  };

  // MARK: modalSetting
  const [modalSetting, setModalSetting] = useState(false);
  const toggleModalSetting = () => {
    setModalSetting(!modalSetting);
    setModalJoinedGroups(false);
  };
  // modalMember
  const [modalMember, setModalMember] = useState(true);
  const toggleModalMember = () => {
    setModalMember(true);
    setModalProject(false);
    setModalPermit(false);
  };
  // modalProject
  const [modalProject, setModalProject] = useState(false);
  const toggleModalProject = () => {
    setModalProject(true);
    setModalMember(false);
    setModalPermit(false);
  };
  // modalPermit
  const [modalPermit, setModalPermit] = useState(false);
  const toggleModalPermit = () => {
    setModalPermit(true);
    setModalMember(false);
    setModalProject(false);
  };

  // MARK: allGroups ← userId
  const [allGroups, setAllGroups] = useState([]);
  const fetchGroup = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/db?table=joinedGroups&userId=${userId}`,
      );
      const result = await response.json();
      setAllGroups(result.results || []);
    } catch (error) {
      setAllGroups([]);
    }
  }, [userId]);

  // MARK: checkPermission ← userId
  const [checkPermission, setCheckPermission] = useState([]);
  const fetchCheckPermission = useCallback(async () => {
    const response = await fetch(
      `/api/db?table=checkPermission&userId=${userId}`,
    );
    const permissions = await response.json();
    setCheckPermission(permissions.results);
  }, [userId]);

  // MARK: modalNewNote
  const [modalNewNote, setModalNewNote] = useState(false);
  const toggleModalNewNote = () => {
    setModalNewNote(!modalNewNote);
  };

  // MARK:selectedGroup → roleToPermit❓
  const [roleToPermit, setRoleToPermit] = useState([]);
  const fetchRoleToPermit = async () => {
    const response = await fetch(
      `/api/db?table=roleToPermit&groupId=${selectedGroup.id}`,
    );
    const roles = await response.json();
    setRoleToPermit(roles.results);
  };

  // MARK: deleteProject ← projectId❓
  const handleDeleteProject = async (projectId) => {
    await fetch(`/api/patch`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        table: "deleteNote",
        id: projectId,
      }),
    });
    refresh();
    toast.success("ノートを削除しました", customToastOptions);
  };

  // MARK: permission❓
  const [permission, setPermission] = useState([]);
  useEffect(() => {
    const fetchPermission = async () => {
      const response = await fetch(`/api/db?table=permission`);
      const permissions = await response.json();
      setPermission(permissions.results || []);
    };
    fetchPermission();
  }, []);

  // MARK: changeRoleName ← roleId❓
  const handleChangeRoleName = async (e, roleId) => {
    await fetch(`/api/patch`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        table: "updateRoleName",
        roleId: roleId,
        roleName: e.target.value,
      }),
    });
    refresh();
    toast.success("役職名を更新しました", customToastOptions);
  };

  // MARK: changePermit ← newPermitId❓
  const handleChangePermit = async (e, roleId) => {
    const newPermitId = parseInt(e.target.value, 10);
    await fetch(
      `/api/patch`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          table: "updateRoleToPermit",
          roleId: roleId,
          permitId: newPermitId,
        }),
      },
    );
    refresh();
    toast.success("権限を更新しました", customToastOptions);
  };

  // MARK: deleteRole❓
  const handleDeleteRole = async (e, roleId) => {
    e.preventDefault();
    await fetch(`/api/patch`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        table: "deleteRole",
        roleId: roleId,
      }),
    });
    refresh();
    toast.success("役職を削除しました", customToastOptions);
  };

  // MARK: addRole ← newRoleName, newPermitId❓
  const handleAddRole = async (e) => {
    if (newRoleName.length > 0) {
      e.preventDefault();
      await fetch(`/api/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          table: "addRole",
          roleName: newRoleName,
          groupId: selectedGroup.id,
          permissionId: newPermitId,
        }),
      });
      setNewRoleName("");
      setNewPermitId(1);
      refresh();
      toast.success("役職を追加しました", customToastOptions);
    }
  };

  // MARK: newRoleName❓
  const [newRoleName, setNewRoleName] = useState("");
  const handleChangeNewRoleName = async (e) => {
    setNewRoleName(e.target.value);
  };

  // MARK: newPermitId❓
  const [newPermitId, setNewPermitId] = useState(1);
  const handleChangeNewPermit = async (e) => {
    setNewPermitId(e.target.value);
  };

  // MARK: isGridView
  const [isGridView, setIsGridView] = useState(true);
  const [isNotesClass, setIsNotesClass] = useState(true);
  const toggleView = () => {
    setIsGridView(!isGridView);
    setIsNotesClass(!isNotesClass);
    [];
  };

  // MARK: modalSearchGroup
  const [modalSearchGroup, setModalSearchGroup] = useState(false);
  const toggleModalSearchGroup = () => {
    setModalSearchGroup(!modalSearchGroup);
  };

  // MARK: searchGroup❓
  const [searchGroup, setSearchGroup] = useState("");
  const handleSearchGroup = (e) => {
    setSearchGroup(e.target.value);
  };

  // MARK: searchGroupResult❓
  const [searchGroupResult, setSearchGroupResult] = useState([]);
  useEffect(() => {
    fetchSearchGroup();
  }, [searchGroup]);
  const fetchSearchGroup = async () => {
    const response = await fetch(
      `/api/db?table=searchGroup&name=${searchGroup}`,
    );
    const groups = await response.json();
    setSearchGroupResult(groups.results);
  };

  // MARK: requestGroup ← groupId, createdBy❓
  const handleRequestGroup = async (e, groupId, createdBy) => {
    e.preventDefault();
    await fetch(
      `/api/post`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          table: "requestGroup",
          groupId: groupId,
          fromUserId: userId,
          toUserId: createdBy,
        }),
      },
    );
    refresh();
    toast.success("グループ参加リクエストを送信しました", customToastOptions);
  };

  // MARK: modalCreateGroup
  const [modalCreateGroup, setModalCreateGroup] = useState(false);
  const toggleModalCreateGroup = () => {
    setModalCreateGroup(!modalCreateGroup);
  };

  // MARK: createName❓
  const [createName, setCreateName] = useState("");
  const handleChangeCreateName = (e) => {
    setCreateName(e.target.value);
  };

  // MARK: searchCreateMember❓
  const [searchCreateGroupMember, setSearchCreateGroupMember] = useState("");
  const handleSearchCreateGroupMember = (e) => {
    setSearchCreateGroupMember(e.target.value);
  };
  useEffect(() => {
    fetchCreateGroupMember();
  }, [searchCreateGroupMember]);

  // MARK: MemberSuggest ← searchCreateGroupMember❓
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
  // MARK: MemberList❓
  const [createGroupMemberList, setCreateGroupMemberList] = useState([]);
  if (userInfo && createGroupMemberList.length === 0) {
    setCreateGroupMemberList([
      { id: userInfo.id, username: userInfo.username },
    ]);
  }
  // MARK: addCreateGroupMember❓
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

  // MARK: deleteCreateGroupMember❓
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

  // MARK: memberIds❓
  const [memberIds, setMemberIds] = useState([]);
  useEffect(() => {
    setMemberIds(createGroupMemberList.map((member) => member.id));
  }, [createGroupMemberList]);

  // MARK: createGroup❓
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

  // MARK: menuState
  const [menuState, setMenuState] = useState(true);
  const toggleMenuState = () => {
    setMenuState(!menuState);
  };

  // MARK: settingWindow
  const modalSettingWindow = (
    <ModalWindow>
      <div className={styles.modalSettingWindow}>
        {/* 閉じる */}
        <div className={styles.modalSettingClose} onClick={toggleModalSetting}>
          <BsX />
        </div>

        {/* 設定切り替え */}
        <div className={styles.toggleSettingContent}>
          {["構成員", "製作", "権限"].map((type) => {
            const isActive = {
              構成員: modalMember,
              製作: modalProject,
              権限: modalPermit,
            }[type];

            const toggleFn = {
              構成員: toggleModalMember,
              製作: toggleModalProject,
              権限: toggleModalPermit,
            }[type];

            return (
              <button
                key={type}
                className={isActive ? styles.trueBtn : styles.falseBtn}
                onClick={toggleFn}
              >
                {type}
              </button>
            );
          })}
        </div>

        {/* 設定内容 */}
        {modalMember ? (
          <MemberManagement
            // searchUser={searchUser}
            // handleSearchUser={handleSearchUser}
            // memberSuggest={memberSuggest}
            // handleAddMember={handleAddMember}
            // groupInMember={groupInMember}
            // groupRole={groupRole}
            // handleChangeRole={handleChangeRole}
            selectedGroup={selectedGroup}
            userId={userId}
            refresh={refresh}
            customToastOptions={customToastOptions}
            // handleDeleteMember={handleDeleteMember}
          />
        ) : null}
        {modalProject ? (
          <ProjectManagement
            selectedGroupNotes={selectedGroupNotes}
            handleDeleteProject={handleDeleteProject}
          />
        ) : null}
        {modalPermit ? (
          <PermissionManagement
            newRoleName={newRoleName}
            handleChangeNewRoleName={handleChangeNewRoleName}
            permission={permission}
            handleChangeNewPermit={handleChangeNewPermit}
            handleAddRole={handleAddRole}
            roleToPermit={roleToPermit}
            handleChangeRoleName={handleChangeRoleName}
            handleChangePermit={handleChangePermit}
            handleDeleteRole={handleDeleteRole}
          />
        ) : null}
      </div>
    </ModalWindow>
  );

  // MARK: MAIN
  return (
    <main className={styles.main}>
      <ToastContainer />

      {/* MARK: NOTIFICATIONS */}
      {modalNotification ? (
        <div className={styles.toastContainer}>
          <div className={styles.toastHeader}>
            <p className={styles.toastHeaderTitle}>通知</p>
          </div>
          <div className={styles.toastBody}>
            {/* 通知一覧 */}
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <RequestToast
                  key={notification.id}
                  notification={notification}
                  userId={userId}
                  refresh={refresh}
                />
              ))
            ) : (
              <p className={styles.toastBodyEmpty}>
                <PiEmpty />
                通知はありません
              </p>
            )}
          </div>
        </div>
      ) : null}

      {/* MARK: === MODALS === */}

      {/* modalNewNote*/}
      {modalNewNote ? (
        <NewNoteModal
          userId={userId}
          allGroups={allGroups}
          toggleModalNewNote={toggleModalNewNote}
          customToastOptions={customToastOptions}
          refresh={refresh}
        />
      ) : null}

      {/* modalSetting */}
      {modalSetting ? modalSettingWindow : null}

      {/* accountView */}
      {accountView ? (
        <div className={styles.accountWindow}>
          <div className={styles.accountContent}>
            <FaRegUser />
            <div className={styles.accountInfo}>
              {/* ユーザー名 */}
              <p className={styles.accountName}>{userInfo.username}</p>
              {/* メールアドレス */}
              <p className={styles.accountEmail}>{userInfo.email}</p>
            </div>
          </div>
          <div className={styles.groupBtnContainer}>
            {/* グループモーダル切替 */}
            <button
              className={styles.groupsBtn}
              onClick={toggleModalJoinedGroups}
            >
              <BsBuildings />
            </button>
          </div>
          <div className={styles.logoutBtnContainer}>
            {/* ログアウト */}
            <button className={styles.logoutBtn} onClick={handleLogout}>
              <MdLogout />
            </button>
          </div>
        </div>
      ) : null}

      {/* modalJoinedGroups */}
      {modalJoinedGroups ? (
        <JoinedGroupsModal
          allGroups={allGroups}
          toggleModalJoinedGroups={toggleModalJoinedGroups}
          checkPermission={checkPermission}
          toggleModalSetting={toggleModalSetting}
          setSelectedGroup={setSelectedGroup}
          setModalJoinedGroups={setModalJoinedGroups}
          customToastOptions={customToastOptions}
          userId={userId}
          refresh={refresh}
        />
      ) : null}

      {/* modalSearchGroup */}
      {modalSearchGroup ? (
        <SearchGroups
          toggleModalSearchGroup={toggleModalSearchGroup}
          handleSearchGroup={handleSearchGroup}
          searchGroup={searchGroup}
          searchGroupResult={searchGroupResult}
          handleRequestGroup={handleRequestGroup}
        />
      ) : null}

      {/* MARK: === HEADER === */}
      <header className={styles.header}>
        <div className={styles.headerMenu}>
          {/* メニューボタン */}
          <button className={styles.menuBtn} onClick={toggleMenuState}>
            {menuState ? <MdClose /> : <MdMenu />}
          </button>
        </div>

        <p className={styles.headerServiceName}>ShareMd</p>

        <div className={styles.headerSearch}>
          <div className={styles.searchIcon}>
            <IoSearch />
          </div>
          {/* 検索フォーム */}
          <form className={styles.searchForm}>
            <input
              placeholder="Search Notes"
              type="text"
              onChange={handleSearch}
            />
          </form>
        </div>

        {/* ヘッダーボタン */}
        <div className={styles.headerButtons}>
          {/* 通知 */}
          <button
            className={styles.headerBtn}
            onClick={toggleModalNotification}
          >
            {modalNotification ? (
              <MdClose />
            ) : (
              <>
                {/* 通知 有無 */}
                {notifications.length > 0 ? (
                  <div className={styles.dot}></div>
                ) : null}
                <RiNotification2Line />
              </>
            )}
          </button>

          {/* アカウント */}
          <button className={styles.headerBtn} onClick={toggleAccountView}>
            {accountView ? <MdClose /> : <FaRegUser />}
          </button>
        </div>
      </header>

      {/* MARK: === MENU === */}
      {modalCreateGroup ? (
        <NewGroup
          toggleModalCreateGroup={toggleModalCreateGroup}
          createName={createName}
          handleChangeCreateName={handleChangeCreateName}
          createGroupMemberSuggest={createGroupMemberSuggest}
          handleSearchCreateGroupMember={handleSearchCreateGroupMember}
          handleAddCreateGroupMember={handleAddCreateGroupMember}
          handleDeleteCreateGroupMember={handleDeleteCreateGroupMember}
          handleCreateGroup={handleCreateGroup}
          searchCreateGroupMember={searchCreateGroupMember}
          createGroupMemberList={createGroupMemberList}
        />
      ) : null}

      <LibraryMenu
        userId={userId}
        toggleModalCreateGroup={toggleModalCreateGroup}
        allGroups={allGroups}
        setSelectedGroup={setSelectedGroup}
        checkPermission={checkPermission}
        toggleModalSetting={toggleModalSetting}
        menuState={menuState}
      />

      {/* MARK: === CONTENTS === */}
      <div className={styles.contents}>
        {/* MARK: === HEADER === */}
        <div className={styles.contentsHeader}>
          {/* グループ名 */}
          <p className={styles.selectGroupName}>
            {selectedGroup.id ? selectedGroup.name : "グループ"}
          </p>

          {/* ボタン */}
          <div className={styles.contentsHeaderBtns}>
            {/* レイアウト */}
            <div className={styles.layouts}>
              <div
                className={isGridView ? styles.inactive : styles.active}
                onClick={toggleView}
              >
                <MdFormatListBulleted />
              </div>
              <div
                className={isGridView ? styles.active : styles.inactive}
                onClick={toggleView}
              >
                <BsGrid3X3 />
              </div>
            </div>

            {/* 新規ノート */}
            <div className={styles.newNoteBtn} onClick={toggleModalNewNote}>
              <BsFileEarmarkPlus />
              <p className={styles.newNote}>新規ノート</p>
            </div>
          </div>
        </div>

        {/* MARK: === BODY === */}
        {selectedGroup.id ? (
          <>
            {/* 全ノート ← selectGroup */}
            <div className={styles.contentsBody}>
              <NotesInGroup
                selectedGroup={selectedGroup}
                notes={filteredNotes || []}
                isNotesClass={isNotesClass}
                toggleModalNewNote={toggleModalNewNote}
              />
            </div>
          </>
        ) : (
          <div className={styles.notSelectGroupContents}>
            {/* 所属グループ */}
            {allGroups.map((group) => (
              <button
                className={styles.notSelectGroupBtn}
                key={group.id}
                onClick={() => {
                  setSelectedGroup(group);
                }}
              >
                <div className={styles.notSelectGroupBtnIcon}>
                  <BsFolder />
                </div>
                <p className={styles.notSelectGroupName}>{group.name}</p>
              </button>
            ))}
          </div>
        )}

        {/* MARK: === FOOTER === */}
        <div className={styles.contentsFooter}>
          <div className={styles.groupSearch}>
            {/* グループ検索 */}
            <button
              className={styles.groupSearchBtn}
              onClick={toggleModalSearchGroup}
            >
              <MdOutlineWifiFind />
              <p>グループ検索</p>
            </button>
          </div>
          <div className={styles.reload}>
            {/* 更新 */}
            <button className={styles.reloadBtn} onClick={refresh}>
              <BsArrowRepeat />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
