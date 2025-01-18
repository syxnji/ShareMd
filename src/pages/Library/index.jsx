'use client'
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
// component
import { Menu } from '@/components/Menu';
import { NewMenu } from '@/components/newMenu';
import { GroupHeadline } from "@/components/GroupHeadline";
import { NotesInGroup } from '@/components/NotesInGroup';
import { ImgBtn } from '@/components/UI/ImgBtn';
import { MemberManagement } from '@/components/MemberManagement';
import { ProjectManagement } from '@/components/ProjectManagement';
import { PermissionManagement } from '@/components/PermissionManagement';
// icon
import { BsList, BsFileEarmarkPlus, BsGrid3X3, BsX, BsBuildings, BsArrowRepeat} from "react-icons/bs";
import { FaRegUser } from 'react-icons/fa6';
// style
import styles from "./library.module.css";
import { MdAdminPanelSettings, MdLogout, MdOutlineWifiFind } from 'react-icons/md';
import 'react-toastify/dist/ReactToastify.css';

export default function Library() {

    
    // MARK:セッションToアカウント
    const [userId, setUserId] = useState(null);
    useEffect(() => {
        const getUserId = async () => {
            const id = Cookies.get('id');
            if (!id) {
                window.location.assign('/Auth');
            }
            setUserId(id);
            fetchNotifications();
        };
        getUserId();
    }, [userId]);

    // MARK:通知
    const [notifications, setNotifications] = useState([]);
    useEffect(() => {
        if (userId) {
            fetchNotifications();
        }
    }, [userId]);
    const fetchNotifications = async () => {
        const notice = await fetch(`/api/db?table=notifications&userId=${userId}`);
        const noticeResult = await notice.json();
        toast.dismiss();
        setNotifications(noticeResult.results);
    };
    // MARK:通知設定
    const customToastOptions = {
        position: "bottom-right",
        autoClose: false,
        closeOnClick: false,
        draggable: false,   
        closeButton: false,
    }
    const defaultToastOptions = {
        position: "top-right",
        autoClose: 2000,
        closeOnClick: true,
        draggable: true,
    }

    // MARK:リロード
    const refresh = () => {
        toast.dismiss();
        fetchNotifications();
        fetchGroup();
        fetchNotes();
    }

    // MARK:アカウントToノート
    const [allNotes, setAllNotes] = useState([]);
    useEffect(() => {
        if (userId) {
            const fetchNotes = async () => {
                try {
                    const response = await fetch(`/api/db?table=allNotes&userId=${userId}`);
                    const data = await response.json();
                    setAllNotes(data.results || []);
                } catch (error) {
                    console.error('Failed to fetch notes:', error);
                    setAllNotes([]);
                }
            };
            fetchNotes();
        }
    }, [userId]);
    
    
    // MARK:切替 - アカウント
    const [accountView, setAccountView] = useState(false);
    const toggleAccountView = () => {
        setAccountView(!accountView);
    }
    
    // MARK:切替 - グループ
    const [modalJoinedGroups, setModalJoinedGroups] = useState(false);
    const toggleModalJoinedGroups = () => {
        setModalJoinedGroups(!modalJoinedGroups);
        setModalSetting(false);
    }
    
    // MARK:表示 - アカウント
    const [userInfo, setUserInfo] = useState({});
    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch(`/api/db?table=userInfo&userId=${userId}`);
            const result = await response.json();
            setUserInfo(result.results[0]);
        };  
        fetchUser();
    }, [userId]);

    // MARK:ログアウト
    const handleLogout = () => {
        Cookies.remove('id', { path: '/' });
        window.location.assign('/Auth');
    }
    
    // MARK: タイトルToノート
    const [searchValue, setSearchValue] = useState('');
    const handleSearch = (e) => {
        e.preventDefault();
        setSearchValue(e.target.value);
    }
    const filteredNotes = Array.isArray(allNotes) 
        ? allNotes.filter(note =>
            note.title.toLowerCase().includes(searchValue.toLowerCase())
          )
        : [];
    
    // MARK:切替 - 設定
    const [modalSetting, setModalSetting] = useState(false);
    const toggleModalSetting = () => {
        setModalSetting(!modalSetting);
        setModalJoinedGroups(false);
    }

    // MARK:切替 - 設定 - 構成員
    const [modalMember, setModalMember] = useState(true);
    const toggleModalMember = () => {
        setModalMember(true);
        setModalProject(false);
        setModalPermit(false);
    }
    
    // MARK:切替 - 設定 - 製作
    const [modalProject, setModalProject] = useState(false);
    const toggleModalProject = () => {
        setModalProject(true);
        setModalMember(false);
        setModalPermit(false);
    }
    
    // MARK:切替 - 設定 - 権限
    const [modalPermit, setModalPermit] = useState(false);
    const toggleModalPermit = () => {
        setModalPermit(true);
        setModalMember(false);
        setModalProject(false);
    }
    
    // MARK:アカウントToグループ
    const [allGroups, setAllGroups] = useState([]);
    useEffect(() => {
        if (userId) {
            fetchGroup();
        }
    }, [userId]);
    const fetchGroup = async () => {
        try {
            const response = await fetch(`/api/db?table=joinedGroups&userId=${userId}`);
            const data = await response.json();
            setAllGroups(data.results || []);
        } catch (error) {
            console.error('Failed to fetch groups:', error);
            setAllGroups([]);
        }
    };

    // MARK: グループ退会
    const handleLeaveGroup = async (groupId) => {
        await fetch(`/api/db?table=leaveGroup&groupId=${groupId}&userId=${userId}`);
        fetchGroup();
        toast.success('グループを退会しました', defaultToastOptions);
    }

    // MARK: 権限チェック
    const [checkPermission, setCheckPermission] = useState([]);
    useEffect(() => {
        fetchCheckPermission();
    }, [allGroups]);
    const fetchCheckPermission = async () => {
        const response = await fetch(`/api/db?table=checkPermission&userId=${userId}`);
        const permissions = await response.json();
        setCheckPermission(permissions.results);
    };

    // MARK: 切替 - 新規ノート
    const [modalNewNote, setModalNewNote] = useState(false);
    const toggleModalNewNote = () => {
        setModalNewNote(!modalNewNote);
    }

    // MARK: 新規ノート - グループ選択
    const [newNoteGroup, setNewNoteGroup] = useState(null);
    const handleChangeNewNoteGroup = (e) => {
        setNewNoteGroup(e.target.value);
    }

    // MARK: 新規ノート - タイトル
    const [newNoteTitle, setNewNoteTitle] = useState('');
    const handleChangeNewNoteTitle = (e) => {
        setNewNoteTitle(e.target.value);
    }

    // MARK:新規ノート作成
    const handleCreateNote = async (e) => {
        e.preventDefault();
        const response = await fetch(`/api/db?table=newNote&groupId=${newNoteGroup}&noteName=${newNoteTitle}&userId=${userId}`);
        const result = await response.json();
        window.location.assign(`/Editor/${result.results.insertId}`);
    }

    // MARK:selectedGroup
    // const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState({id: null, name: null});

    // MARK:selectedGroup → ノート
    const [selectedGroupNotes, setSelectedGroupNotes] = useState([]);
    const fetchNotes = async () => {
        if (selectedGroup.id) {
            // const groupResponse = await fetch(`/api/db?table=selectedGroup&groupId=${selectedGroupId}`);
            // const groupData = await groupResponse.json();
            // setSelectedGroup(groupData.results[0]);

            const response = await fetch(`/api/db?table=selectedGroupNotes&groupId=${selectedGroup.id}`);
            const notes = await response.json();
            setSelectedGroupNotes(notes.results || []);
        }
    };

    // MARK: selectedGroup → メンバー
    const [groupInMember, setGroupInMember] = useState([]);
    const fetchGroupInMember = async () => {
        if (selectedGroup.id) {
            const response = await fetch(`/api/db?table=groupInMember&groupId=${selectedGroup.id}`);
            const members = await response.json();
            setGroupInMember(members.results);
        }
    };

    // MARK:selectedGroup → ロール
    const [groupRole, setGroupRole] = useState([]);
    const fetchGroupRole = async () => {
        const response = await fetch(`/api/db?table=groupRole&groupId=${selectedGroup.id}`);
        const roles = await response.json();
        setGroupRole(roles.results);
    };

    // MARK:selectedGroup → ロール - 権限
    const [roleToPermit, setRoleToPermit] = useState([]);
    const fetchRoleToPermit = async () => {
        const response = await fetch(`/api/db?table=roleToPermit&groupId=${selectedGroup.id}`);
        const roles = await response.json();
        setRoleToPermit(roles.results);
    };

    // MARK: selectedGroup useEffect
    useEffect(() => {
        fetchNotes();
        fetchGroupInMember();
        fetchGroupRole();
        fetchRoleToPermit();
    }, [selectedGroup]);

    // MARK: ロール変更
    const handleChangeRole = async (e, userId) => {
        const newRoleId = parseInt(e.target.value, 10);
        await fetch(`/api/db?table=changeRole&groupId=${selectedGroup.id}&userId=${userId}&roleId=${newRoleId}`);
        // メンバーリストを再取得
        await fetchGroupInMember();
        await fetchGroupRole();
        toast.success('役職を更新しました', defaultToastOptions);
    }

    // MARK: メンバー削除
    const handleDeleteMember = async (e, userId) => {
        e.preventDefault();
        await fetch(`/api/db?table=deleteMember&groupId=${selectedGroup.id}&userId=${userId}`);
        // メンバーリストを再取得
        await fetchGroupInMember();
        toast.success('メンバーを削除しました', defaultToastOptions);
    }
    
    // MARK:ユーザー検索
    const [searchUser, setSearchUser] = useState('');
    const handleSearchUser = (e) => {
        setSearchUser(e.target.value);
    }
    const [memberSuggest, setMemberSuggest] = useState([]);
    useEffect(() => {
        const fetchMemberSuggest = async () => {
            if (searchUser.length > 0) {  
                const response = await fetch(`/api/db?table=suggestUsers&name=${searchUser}`);
                const suggestUsers = await response.json();
                setMemberSuggest(suggestUsers.results);
            } else {
                setMemberSuggest([]);
            }
        };
        fetchMemberSuggest();
    }, [searchUser]);

    // MARK:メンバー追加
    const handleAddMember = async (e, user) => {
        e.preventDefault();
        const newMemberId = user.id;
        // await fetch(`/api/db?table=addMember&groupId=${selectedGroupId}&userId=${newMemberId}`);
        await fetch(`/api/db?table=inviteGroup&groupId=${selectedGroup.id}&inviteUserId=${newMemberId}&userId=${userId}`);
        setSearchUser('');
        // メンバーリストを再取得
        await fetchGroupInMember();
        toast.success('メンバーを招待しました', defaultToastOptions);
    }

    // MARK:製作管理
    const handleDeleteProject = async (projectId) => {
        await fetch(`/api/db?table=deleteNote&id=${projectId}`);
        // メンバーリストを再取得
        await fetchNotes();
        toast.success('ノートを削除しました', defaultToastOptions);
    }

    // MARK:権限を取得
    const [permission, setPermission] = useState([]);
    useEffect(() => {
        const fetchPermission = async () => {
            const response = await fetch(`/api/db?table=permission`);
            const permissions = await response.json();
            setPermission(permissions.results || []);
        };
        fetchPermission();
    }, []);

    // MARK:役職名変更
    const handleChangeRoleName = async (e, roleId) => {
        await fetch(`/api/db?table=updateRoleName&roleId=${roleId}&roleName=${e.target.value}`);
    }

    // MARK:役職権限変更
    const handleChangePermit = async (e, roleId) => {
        const newPermitId = parseInt(e.target.value, 10);
        await fetch(`/api/db?table=updateRoleToPermit&roleId=${roleId}&permitId=${newPermitId}`);
        await fetchRoleToPermit();
        toast.success('権限を更新しました', defaultToastOptions);
    }

    // MARK:役職削除
    const handleDeleteRole = async (e, roleId) => {
        e.preventDefault();
        await fetch(`/api/db?table=deleteRole&roleId=${roleId}`);
        // 役職権限を再取得
        await fetchRoleToPermit();
        toast.success('役職を削除しました', defaultToastOptions);
    }

    // MARK:役職追加
    const handleAddRole = async (e) => {
        if (newRoleName.length > 0) {
            e.preventDefault();
            await fetch(`/api/db?table=insertRole&roleName=${newRoleName}&groupId=${selectedGroup.id}&permissionId=${newPermitId}`);
            fetchRoleToPermit();
            setNewRoleName('');
            setNewPermitId(1);
            toast.success('役職を追加しました', defaultToastOptions);
        }
    }

    // MARK:役職名変更
    const [newRoleName, setNewRoleName] = useState('');
    const handleChangeNewRoleName = async (e) => {
        setNewRoleName(e.target.value);
    }
    
    // MARK:役職権限変更
    const [newPermitId, setNewPermitId] = useState(1);
    const handleChangeNewPermit = async (e) => {
        setNewPermitId(e.target.value);
    }

    // MARK:切替え グリッド/リスト
    const [isGridView, setIsGridView] = useState(true);
    const [isNotesClass, setIsNotesClass] = useState(true);
    const toggleView = () => {
      setIsGridView(!isGridView);
      setIsNotesClass(!isNotesClass);[]
    };

    // MARK:切替 - 検索グループ
    const [modalSearchGroup, setModalSearchGroup] = useState(false);
    const toggleModalSearchGroup = () => {
        setModalSearchGroup(!modalSearchGroup);
    }

    // MARK: グループ名から検索
    const [searchGroup, setSearchGroup] = useState('');
    const handleSearchGroup = (e) => {
        setSearchGroup(e.target.value);
    }

    // MARK: 検索結果
    const [searchGroupResult, setSearchGroupResult] = useState([]);
    useEffect(() => {
        fetchSearchGroup();
    }, [searchGroup]);
    const fetchSearchGroup = async () => {
        const response = await fetch(`/api/db?table=searchGroup&name=${searchGroup}`);
        const groups = await response.json();
        setSearchGroupResult(groups.results);
    }

    // MARK: グループ参加リクエスト
    const handleRequestGroup = async (e, groupId, createdBy) => {
        e.preventDefault();
        await fetch(`/api/db?table=requestGroup&groupId=${groupId}&fromUserId=${userId}&toUserId=${createdBy}`);
        toast.success('グループ参加リクエストを送信しました', defaultToastOptions);
    }

    // MARK: リクエストの承認&招待
    const handleAccept = async (notificationId, groupId, inviteUserId, typeId) => {
        await fetch(`/api/db?table=acceptRequest&notificationId=${notificationId}`);
        if (typeId === 1) {
            await fetch(`/api/db?table=inviteGroup&groupId=${groupId}&inviteUserId=${inviteUserId}&userId=${userId}`);
            toast.success('リクエストを承認しました', defaultToastOptions);
        } else if (typeId === 2) {
            await fetch(`/api/db?table=joinGroup&groupId=${groupId}&inviteUserId=${inviteUserId}`);
            toast.success('グループに参加しました', defaultToastOptions);
        }
        fetchNotifications();
    };

    // MARK: リクエストの拒否
    const handleReject = async (notificationId) => {
        await fetch(`/api/db?table=rejectRequest&notificationId=${notificationId}`);
        fetchNotifications();
        toast.success('拒否しました', defaultToastOptions);
    };
    useEffect(() => {
        if (notifications && notifications.length > 0) {
            notifications.forEach((notification) => {
                toast(
                    ({ closeToast }) => (
                        <div className={styles.message}>
                            {notification.type_id === 1 ? (
                                <>
                                    <div className={styles.messageContent}>
                                        <p><span className={styles.noticeUserName}>{notification.username}さん</span>から<span className={styles.noticeGroupName}>「{notification.name}」</span>への<span className={styles.noticeTypeRequest}>参加リクエスト</span>があります</p>
                                        <button className={styles.acceptBtn} onClick={() => {handleAccept(notification.id, notification.group_id, notification.sender_id, notification.type_id); closeToast();}}>承認</button>
                                    </div>
                                    <button className={styles.rejectBtn} onClick={() => {handleReject(notification.id); closeToast();}}><BsX size={30}/></button>
                                </>
                            ) : null}
                            {notification.type_id === 2 ? (
                                <>
                                    <div className={styles.messageContent}>
                                        <p><span className={styles.noticeUserName}>{notification.username}さん</span>から<span className={styles.noticeGroupName}>「{notification.name}」</span>への<span className={styles.noticeTypeInvite}>招待</span>があります</p>
                                        <button className={styles.acceptBtn} onClick={() => {handleAccept(notification.id, notification.group_id, notification.user_id, notification.type_id); closeToast();}}>承認</button>
                                    </div>
                                    <button className={styles.rejectBtn} onClick={() => {handleReject(notification.id); closeToast();}}><BsX size={30}/></button>
                                </>
                            ) : null}
                        </div>
                    ),
                    customToastOptions
                );
            });
        }
    }, [notifications]);

    // MARK: グループ構築 ━━━━━━
    const [modalCreateGroup, setModalCreateGroup] = useState(false);
    const toggleModalCreateGroup = () => {
        setModalCreateGroup(!modalCreateGroup);
    }

    // MARK: グループ名
    const [createName, setCreateName] = useState('');
    const handleChangeCreateName = (e) => {
        setCreateName(e.target.value);
    }

    // MARK: メンバー検索
    const [searchCreateGroupMember, setSearchCreateGroupMember] = useState('');
    const handleSearchCreateGroupMember = (e) => {
        setSearchCreateGroupMember(e.target.value);
    }
    useEffect(() => {
        fetchCreateGroupMember();
    }, [searchCreateGroupMember]);

    // MARK: メンバー候補
    const [createGroupMemberSuggest, setCreateGroupMemberSuggest] = useState([]);
    const fetchCreateGroupMember = async () => {
        if (searchCreateGroupMember.length > 0) {  
            const response = await fetch(`/api/db?table=suggestUsers&name=${searchCreateGroupMember}`);
            const suggestUsers = await response.json();
            setCreateGroupMemberSuggest(suggestUsers.results);
        } else {
            setCreateGroupMemberSuggest([]);
        }
    }
    // MARK:メンバーリスト
    const [createGroupMemberList, setCreateGroupMemberList] = useState([]);
    if (userInfo && createGroupMemberList.length === 0) {
        setCreateGroupMemberList([{id: userInfo.id, username: userInfo.username}]);
    }
    // MARK:メンバー追加
    const handleAddCreateGroupMember = (e, user) => {
        e.preventDefault();
        const newMember = {
            id: user.id,
            username: user.username
        };
        if (createGroupMemberList.some(member => member.id === newMember.id)) {
            toast.error('既に追加されています');
            setSearchCreateGroupMember("");
            return;
        }
        setCreateGroupMemberList([...createGroupMemberList, newMember]);
        setSearchCreateGroupMember("");
    }

    // MARK:メンバー削除
    const handleDeleteCreateGroupMember = (e, memberToDelete) => {
        e.preventDefault();
        if (memberToDelete.id === userInfo.id) {
            toast.error('自分は削除できません');
        } else {
            setCreateGroupMemberList(createGroupMemberList.filter((m) => m.id !== memberToDelete.id));
        }
    }

    // MARK: メンバーIDs
    const [memberIds, setMemberIds] = useState([]);
    useEffect(() => {
        setMemberIds(createGroupMemberList.map((member) => member.id));
    }, [createGroupMemberList]);

    // MARK: グループ作成
    const handleCreateGroup = async (e) => {
        e.preventDefault();
        await fetch(`/api/db?table=createGroup&name=${createName}&userId=${userId}&memberIds=${memberIds}`);
        toggleModalCreateGroup();
        setCreateName("");
        setCreateGroupMemberList([]);
        toast.success('グループを作成しました', defaultToastOptions);
    }
    // MARK: グループ作成モーダル
    const LibraryMenu = (
        <>
        {modalCreateGroup ? (
            <form className={styles.modalNewGroupWindow} onSubmit={handleCreateGroup}>
                <button className={styles.modalNewGroupClose} onClick={toggleModalCreateGroup} type='button'><BsX/></button>
                <div className={styles.modalNewGroupContents}>
                    {/* グループ名 */}
                    <div className={styles.newGroupTitle}>
                        <label className={styles.newGroupLabel}>グループ名</label>
                        <input type="text" placeholder="例：チームα" className={styles.newGroupInput} onChange={handleChangeCreateName} value={createName} required/>
                    </div>
                    {/* メンバー検索 */}
                    <div className={styles.newGroupMembers}>
                        <label className={styles.newGroupLabel}>メンバー</label>
                        <input type="text" placeholder="ユーザー名で検索" className={styles.newGroupInput} onChange={handleSearchCreateGroupMember} value={searchCreateGroupMember}/>
                        {createGroupMemberSuggest.length > 0 && (
                            // メンバー候補
                            <div className={styles.newGroupSuggest}>
                                <div className={styles.suggestMemberBox}>
                                    {createGroupMemberSuggest.map((user) => (
                                        <button className={styles.suggestMember} key={user.id} onClick={(e) => handleAddCreateGroupMember(e, user)}>{user.username}</button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    {/* メンバーリスト */}
                    <div className={styles.newGroupMemberListBox}>
                        <p className={styles.newGroupLabel}>メンバーリスト</p>
                        <div className={styles.newGroupMemberList}>
                            {createGroupMemberList.map((member) => (
                                <div className={styles.member} key={member.id}>
                                    <p>{member.username}</p>
                                    <button className={styles.memberDelete} onClick={(e) => handleDeleteCreateGroupMember(e, member)}><BsX/></button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button className={styles.newGroupBtn} type="submit">構築</button>
                </div>
            </form>
        ) : null}

        <button className={styles.addGroupBtn} onClick={toggleModalCreateGroup}>
            <BsBuildings/>
            <p>グループを構築</p>
        </button>
        <div className={styles.groups}>
            {Array.isArray(allGroups) && allGroups.map((group) => (
                <div className={styles.groupBox} key={group.id}>
                    <button className={styles.group} onClick={() => setSelectedGroup({id: group.id, name: group.name})}>
                        {group.name}
                    </button>
                    {checkPermission.some(permission => permission.group_id === group.id && permission.permission_id === 1) && (
                        <button className={styles.settingBtn} onClick={(e) => {toggleModalSetting(); setSelectedGroup({id: group.id, name: group.name});}}><MdAdminPanelSettings /></button>
                    )}
                </div>
            ))}
        </div>
        {allGroups.length === 1 && (
            <div className={styles.empty} onClick={toggleModalCreate}>
                <p className={styles.emptyMain}>グループを<br/>構築してみましょう</p>
            </div>
        )}
        </>
    )

    // MARK:ヘッドライン
    const headLeft = (
        <>
        {/* 検索 */}
        <div className={styles.search}>
            <form>
                <input 
                 placeholder="Note name ..." 
                 type="search"
                 onChange={handleSearch}
                />
            </form>
        </div>
        </>
    )
    const headRight = (
        <>
            {/* リロード */}
            <div className={styles.reload}>
                <ImgBtn img={<BsArrowRepeat/>} click={refresh}/>
            </div>
            {/* 検索グループ */}
            <div className={styles.searchGroup}>
                <ImgBtn img={<MdOutlineWifiFind />} click={toggleModalSearchGroup}/>
            </div>
            {/* レイアウト */}
            <div className={styles.layouts}>
                <ImgBtn img={isGridView ? <BsList/> : <BsGrid3X3/>} click={toggleView}/>
            </div>
            {/* 新規ノート */}
            <div className={styles.addNote}>
                {/* <MainBtn img={<BsFileEarmarkPlus/>} click={handleNewNote} text="New Note"/> */}
                <ImgBtn img={<BsFileEarmarkPlus/>} click={toggleModalNewNote} color="main"/>
            </div>
        </>
    )
    
    // MARK:設定コンポーネント
    const modalSettingWindow = (
        <div className={styles.modalSettingWindow}>
            {/* 閉じる */}
            <div className={styles.modalSettingClose} onClick={toggleModalSetting}>
                <BsX/>
            </div>

            {/* 設定切り替え */}
            <div className={styles.toggleSettingContent}>
                {['構成員', '製作', '権限'].map(type => {
                    const isActive = {
                        '構成員': modalMember,
                        '製作': modalProject,
                        '権限': modalPermit
                    }[type];
                    
                    const toggleFn = {
                        '構成員': toggleModalMember,
                        '製作': toggleModalProject,
                        '権限': toggleModalPermit
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
                   searchUser={searchUser}
                   handleSearchUser={handleSearchUser}
                   memberSuggest={memberSuggest}
                   handleAddMember={handleAddMember}
                   groupInMember={groupInMember}
                   groupRole={groupRole}
                   handleChangeRole={handleChangeRole}
                   handleDeleteMember={handleDeleteMember}
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
    );

    // MARK:メイン ━━━━━━━
    return(
        <main className={styles.main}>
            
        {/* MARK:トースト */}
        <ToastContainer />

        {/* MARK:新規ノート */}
        {modalNewNote ? (
            <form className={styles.modalNewNoteWindow} onSubmit={handleCreateNote}>
                {/* 閉じる */}
                <button className={styles.newNoteClose} onClick={toggleModalNewNote}><BsX/></button>
                <div className={styles.newNoteContents}>
                    <div className={styles.newNoteGroup}>
                        <label htmlFor="newNoteGroup" className={styles.newNoteLabel}>保存先グループ</label>
                        {/* グループ選択 */}
                        <select className={styles.newNoteGroupSelect} required onChange={handleChangeNewNoteGroup} defaultValue="">
                            <option value="" disabled>選択してください</option>
                            {allGroups.map((group) => (
                                <option key={group.id} value={group.id}>{group.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.newNoteTitle}>
                        <label htmlFor="newNoteName" className={styles.newNoteLabel}>ノートタイトル</label>
                        {/* ノートタイトル */}
                        <input className={styles.newNoteInput} type="text" placeholder='ToDo List' onChange={handleChangeNewNoteTitle} value={newNoteTitle} required/>
                    </div>
                    <button className={styles.newNoteSubmit} type="submit">作成</button>
                </div>
            </form>
        ) : null}

        {/* MARK:設定 */}
        {modalSetting ? modalSettingWindow : null}

        {/* MARK:アカウント */}
        {/* アカウントモーダル切替 */}
        <button className={styles.account} onClick={toggleAccountView}>
            {accountView ?  <BsX/> : <FaRegUser/>}
        </button>
        {accountView ? (
            <div className={styles.accountWindow}>
                <div className={styles.accountContent}>
                    <FaRegUser/>
                    <div className={styles.accountInfo}>
                        <p className={styles.accountName}>{userInfo.username}</p>
                        <p className={styles.accountEmail}>{userInfo.email}</p>
                    </div>
                </div>
                <div className={styles.groupBtnContainer}>
                    {/* グループモーダル切替 */}
                    <button className={styles.groupsBtn} onClick={toggleModalJoinedGroups}><BsBuildings/></button>
                </div>
                <div className={styles.logoutBtnContainer}>
                    {/* ログアウト */}
                    <button className={styles.logoutBtn} onClick={handleLogout}><MdLogout /></button>
                </div>
            </div>
        ) : null}

        {/* MARK:グループモーダル */}
        {modalJoinedGroups ? (
            <div className={styles.joinedGroupsWindow}>
                {/* 閉じる */}
                <button className={styles.joinedGroupsClose} onClick={toggleModalJoinedGroups}><BsX/></button>
                <div className={styles.joinedGroupsContent}>
                    <div className={styles.GroupsList}>
                        {allGroups.map((group) => (
                            <div className={styles.group} key={group.id}>
                                <p className={styles.modalGroupName}>{group.name}</p>
                                {/* 設定モーダル切替 / グループ選択 / 別モーダル閉じる */}
                                {checkPermission.some(permission => permission.group_id === group.id && permission.permission_id === 1) && (
                                    <button className={styles.settingBtn} onClick={(e) => {toggleModalSetting(); setSelectedGroupId(group.id); setModalJoinedGroups(false);}}><MdAdminPanelSettings /></button>
                                )}
                                <button className={styles.deleteBtn} onClick={(e) => {handleLeaveGroup(group.id);}} disabled={group.name === 'プライベート'}><BsX/></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        ) : null}

        {/* MARK:検索グループ */}
        {modalSearchGroup ? (
            <div className={styles.searchGroupWindow}>
                <button className={styles.searchGroupClose} onClick={toggleModalSearchGroup}><BsX/></button>
                <div className={styles.searchGroupContent}>
                    <input className={styles.searchGroupInput} type="text" placeholder="グループ名で検索" onChange={handleSearchGroup} value={searchGroup}/>
                    <div className={styles.searchGroupList}>
                        {searchGroupResult.length > 0 ? (
                            searchGroupResult.map((group) => (
                                <div className={styles.group} key={group.id}>
                                    <p>{group.name}</p>
                                    <button className={styles.requestBtn} onClick={(e) => {handleRequestGroup(e, group.id, group.created_by);}}>参加リクエスト</button>
                                </div>
                            ))
                        ) : (
                            <div className={styles.group}>
                                <p>グループが見つかりません</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        ) : null}

        {/* MARK:メニュー */}
        {/* <Menu 
            setSelectedGroupId={setSelectedGroupId} 
            userInfo={userInfo} 
            allGroups={allGroups || []} 
            fetchGroup={fetchGroup} 
            toggleModalSetting={toggleModalSetting} 
            checkPermission={checkPermission}
            setSelectedGroup={setSelectedGroup}
        /> */}
        <NewMenu
            menuContents={LibraryMenu}
        />

        <div className={styles.contents}>
            {/* MARK:ヘッドライン */}
            <GroupHeadline headLeft={headLeft} headRight={headRight} />

            <div className={styles.content}>
                {/* MARK:グループToノート */}
                {selectedGroup.id !== null && (
                    <>
                    <div className={styles.notesTitles}>
                        <p className={styles.notesTitle}>{selectedGroup.name}</p>
                        {/* {checkPermission.some(permission => 
                            permission.group_id === selectedGroupId && 
                            permission.permission_id === 1
                        ) && (
                            <button className={styles.settingBtn} onClick={toggleModalSetting}>
                                <MdAdminPanelSettings />
                            </button>
                        )} */}
                    </div>
                    <NotesInGroup 
                        notes={selectedGroupNotes || []}
                        isNotesClass={isNotesClass}
                        toggleModalNewNote={toggleModalNewNote}
                    />
                    </>
                )}
                        
                {/* MARK:検索結果 */}
                <div className={styles.notesTitles}>
                    <p className={styles.notesTitle}>検索結果「{searchValue}」</p>
                </div>
                {filteredNotes.length > 0 ? (
                    <NotesInGroup 
                     notes={filteredNotes} 
                     isNotesClass={isNotesClass}
                    />
                ) : (
                    <div className={styles.empty} onClick={toggleModalNewNote}>
                        <p className={styles.emptyMain}>ノートが見つかりません</p>
                        <p className={styles.emptySub}>ここをクリックしてノートを作成</p>
                    </div>
                )}

            </div>
            
        </div>

        </main>
    )
}