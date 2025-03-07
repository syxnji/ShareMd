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
import { BsFileEarmarkPlus, BsGrid3X3, BsX, BsBuildings, BsArrowRepeat, BsFolder, BsFileText, BsPeople, BsClock } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa6";
import { MdClose, MdFormatListBulleted, MdLogout, MdMenu, MdOutlineWifiFind, MdEdit, MdAddCircleOutline, MdSettings, MdHelpOutline } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { RiNotification2Line } from "react-icons/ri";
import { PiEmpty } from "react-icons/pi";
// style
import styles from "./library.module.css";
import "react-toastify/dist/ReactToastify.css";

// タグのリスト
const AVAILABLE_TAGS = [
  "仕事", "プライベート", "アイデア", "重要", "緊急", 
  "会議", "プロジェクト", "タスク", "メモ", "学習"
];

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
    fetchRoleToPermit();

    // 1秒後にトーストを消す
    setTimeout(() => {
      toast.dismiss();
    }, 1000);
  };

  // MARK: permission
  const [permission, setPermission] = useState([]);
  useEffect(() => {
    const fetchPermission = async () => {
      const response = await fetch(`/api/db?table=permission`);
      const permissions = await response.json();
      setPermission(permissions.results || []);
    };
    fetchPermission();
  }, []);

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
    // 初回レンダリング時は実行しない
    if (selectedGroup.id === null) return;

    // モーダルをすべて閉じる
    setModalNotification(false);
    setModalJoinedGroups(false);
    setModalSetting(false);
    setModalNewNote(false);
    setModalSearchGroup(false);
    setModalCreateGroup(false);
    setAccountView(false);

    // 既存の処理を維持
    fetchNotes();
    fetchRoleToPermit();
  }, [selectedGroup.id]); // selectedGroup.idの変更時のみ実行

  // MARK:selectedGroupNotes ← selectedGroup
  // projectManagement
  const [selectedGroupNotes, setSelectedGroupNotes] = useState([]);

  // MARK: fetchNotes
  const fetchNotes = async () => {
    if (selectedGroup.id) {
      const response = await fetch(
        `/api/db?table=selectedGroupNotes&groupId=${selectedGroup.id}`,
      );
      const notes = await response.json();
      
      // ノートにランダムにタグを付与
      const notesWithTags = (notes.results || []).map(note => {
        // すでにタグがある場合はそのまま使用
        if (note.tags) {
          return note;
        }
        
        // ランダムにタグを2〜3個選択
        const tagCount = Math.floor(Math.random() * 2) + 2; // 2〜3個
        const shuffledTags = [...AVAILABLE_TAGS].sort(() => 0.5 - Math.random());
        const selectedTags = shuffledTags.slice(0, tagCount);
        
        return {
          ...note,
          tags: JSON.stringify(selectedTags)
        };
      });
      
      setSelectedGroupNotes(notesWithTags || []);
    }
  };

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

  // MARK: modalCreateGroup
  const [modalCreateGroup, setModalCreateGroup] = useState(false);
  const toggleModalCreateGroup = () => {
    setModalCreateGroup(!modalCreateGroup);
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
            selectedGroup={selectedGroup}
            userId={userId}
            refresh={refresh}
            customToastOptions={customToastOptions}
          />
        ) : null}
        {modalProject ? (
          <ProjectManagement
            selectedGroupNotes={selectedGroupNotes}
            customToastOptions={customToastOptions}
            refresh={refresh}
          />
        ) : null}
        {modalPermit ? (
          <PermissionManagement
            customToastOptions={customToastOptions}
            refresh={refresh}
            selectedGroup={selectedGroup}
            permission={permission}
            roleToPermit={roleToPermit}
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
            <button 
              className={styles.toastCloseBtn} 
              onClick={toggleModalNotification}
              title="閉じる"
            >
              <MdClose />
            </button>
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
                <PiEmpty size={18} />
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
          {/* ヘッダー部分 */}
          <div className={styles.accountHeader}>
            <div className={styles.accountAvatar}>
              <FaRegUser size={40} />
            </div>
            <div className={styles.accountInfo}>
              <p className={styles.accountName}>{userInfo.username || "ユーザー名"}</p>
              <p className={styles.accountEmail}>{userInfo.email || "email@example.com"}</p>
              <div className={styles.accountBadge}>プレミアムユーザー</div>
            </div>
          </div>
          
          {/* 統計情報 */}
          <div className={styles.accountStats}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>42</span>
              <span className={styles.statLabel}>ノート</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>7</span>
              <span className={styles.statLabel}>グループ</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>128</span>
              <span className={styles.statLabel}>貢献</span>
            </div>
          </div>
          
          {/* アクティビティ */}
          <div className={styles.accountActivity}>
            <h3 className={styles.sectionTitle}>最近のアクティビティ</h3>
            <div className={styles.activityItem}>
              <div className={styles.activityIcon}><MdEdit /></div>
              <div className={styles.activityInfo}>
                <p className={styles.activityText}>「プロジェクト計画」を編集しました</p>
                <p className={styles.activityTime}>2時間前</p>
              </div>
            </div>
            <div className={styles.activityItem}>
              <div className={styles.activityIcon}><MdAddCircleOutline /></div>
              <div className={styles.activityInfo}>
                <p className={styles.activityText}>「マーケティング」グループに参加しました</p>
                <p className={styles.activityTime}>昨日</p>
              </div>
            </div>
          </div>
          
          {/* アクションボタン */}
          <div className={styles.accountActions}>
            <button className={styles.actionButton} onClick={toggleModalJoinedGroups}>
              <BsBuildings />
              <span>グループ管理</span>
            </button>
            <button className={styles.actionButton} onClick={toggleModalSetting}>
              <MdSettings />
              <span>設定</span>
            </button>
            <button className={styles.actionButton} onClick={() => {}}>
              <MdHelpOutline />
              <span>ヘルプ</span>
            </button>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              <MdLogout />
              <span>ログアウト</span>
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
          userId={userId}
          customToastOptions={customToastOptions}
          refresh={refresh}
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

        {/* <p className={styles.headerServiceName}>ShareMd</p> */}
        <img src="/ShareMd.svg" alt="ShareMd" className={styles.headerServiceName} />

        <div className={styles.headerSearch}>
          <div className={styles.searchContainer}>
            <div className={styles.searchBox}>
              <IoSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search notes..."
                className={styles.searchInput}
                value={searchValue}
                onChange={handleSearch}
              />
              {searchValue && (
                <button
                  className={styles.clearButton}
                  onClick={() => setSearchValue("")}
                >
                  <BsX />
                </button>
              )}
            </div>
            <div className={styles.viewToggle}>
              {isGridView ? (
                <MdFormatListBulleted
                  className={styles.viewIcon}
                  onClick={toggleView}
                />
              ) : (
                <BsGrid3X3 className={styles.viewIcon} onClick={toggleView} />
              )}
            </div>
          </div>
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
          customToastOptions={customToastOptions}
          refresh={refresh}
          userInfo={userInfo}
          userId={userId}
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
            {allGroups.length > 0 ? (
              allGroups.map((group) => (
                <button
                  className={styles.notSelectGroupBtn}
                  key={group.id}
                  onClick={() => {
                    setSelectedGroup(group);
                  }}
                  aria-label={`${group.name}グループを選択`}
                >
                  <div className={styles.groupCardHeader}>
                    <div className={styles.notSelectGroupBtnIcon}>
                      <BsFolder />
                    </div>
                    <div className={styles.groupCardBadge}>
                      {checkPermission.some(
                        (permission) =>
                          permission.group_id === group.id &&
                          permission.permission_id === 1
                      ) ? (
                        <span className={styles.adminBadge}>管理者</span>
                      ) : (
                        <span className={styles.memberBadge}>メンバー</span>
                      )}
                    </div>
                  </div>
                  
                  <div className={styles.groupCardBody}>
                    <p className={styles.notSelectGroupName}>{group.name}</p>
                    
                    <div className={styles.groupCardStats}>
                      <div className={styles.groupCardStat}>
                        <BsFileText className={styles.statIcon} />
                        <span className={styles.statValue}>
                          {selectedGroupNotes.filter(note => note.group_id === group.id).length || 0}
                        </span>
                        <span className={styles.statLabel}>ノート</span>
                      </div>
                      
                      <div className={styles.groupCardStat}>
                        <BsPeople className={styles.statIcon} />
                        <span className={styles.statValue}>
                          {Math.floor(Math.random() * 5) + 1}
                        </span>
                        <span className={styles.statLabel}>メンバー</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.groupCardFooter}>
                    <div className={styles.lastUpdated}>
                      <BsClock className={styles.timeIcon} />
                      <span>
                        {new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </span>
                    </div>
                    <div className={styles.groupCardActions}>
                      <span className={styles.viewGroupText}>グループを開く</span>
                      <span className={styles.viewGroupArrow}>→</span>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className={styles.emptyGroupsMessage}>
                <div className={styles.emptyGroupsIcon}>
                  <BsFolder />
                </div>
                <h3>グループがありません</h3>
                <p>新しいグループを作成するか、グループに参加してください</p>
                <button 
                  className={styles.createGroupBtn}
                  onClick={toggleModalCreateGroup}
                >
                  グループを作成
                </button>
              </div>
            )}
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
