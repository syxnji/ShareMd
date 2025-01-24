'use client'
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
// modals
import { NewNoteModal } from '@/components/Modals/NewNote';
import { JoinedGroupsModal } from '@/components/Modals/joinedGroups';
import { MemberManagement } from '@/components/Modals/MemberManagement';
import { ProjectManagement } from '@/components/Modals/ProjectManagement';
import { PermissionManagement } from '@/components/Modals/PermissionManagement';
import { NewGroup } from '@/components/Modals/NewGroup';
// menu
import { LibraryMenu } from '@/components/Menus/LibraryMenu';
// ui
import { ImgBtn } from '@/components/UI/ImgBtn';
import { Menu } from '@/components/UI/Menu';
import { GroupHeadline } from "@/components/GroupHeadline";
// component
import { NotesInGroup } from '@/components/NotesInGroup';
// icon
import { BsList, BsFileEarmarkPlus, BsGrid3X3, BsX, BsBuildings, BsArrowRepeat} from "react-icons/bs";
import { FaRegUser } from 'react-icons/fa6';
// style
import styles from "./library.module.css";
import { MdLogout, MdOutlineWifiFind } from 'react-icons/md';
import 'react-toastify/dist/ReactToastify.css';

export default function Library() {

    
    // MARK:Cookies.id → userId
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

    // MARK: userId → notifications
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

    // MARK: Toast Settings
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

    // MARK: refresh
    const refresh = () => {
        toast.dismiss();
        fetchNotifications();
        fetchGroup();
        fetchNotes();
    }

    // MARK: userId → allNotes
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
    
    
    // MARK: accountView
    const [accountView, setAccountView] = useState(false);
    const toggleAccountView = () => {
        setAccountView(!accountView);
    }
    
    // MARK: modalJoinedGroups
    const [modalJoinedGroups, setModalJoinedGroups] = useState(false);
    const toggleModalJoinedGroups = () => {
        setModalJoinedGroups(!modalJoinedGroups);
        setModalSetting(false);
    }
    
    // MARK: userId → userInfo
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
        Cookies.remove('id', { path: '/' });
        window.location.assign('/Auth');
    }
    
    // MARK: searchValue
    const [searchValue, setSearchValue] = useState('');
    const handleSearch = (e) => {
        e.preventDefault();
        setSearchValue(e.target.value);
    }
    // MARK: filteredNotes
    const filteredNotes = Array.isArray(allNotes) 
        ? allNotes.filter(note =>
            note.title.toLowerCase().includes(searchValue.toLowerCase())
          )
        : [];
    
    // MARK: modalSetting
    const [modalSetting, setModalSetting] = useState(false);
    const toggleModalSetting = () => {
        setModalSetting(!modalSetting);
        setModalJoinedGroups(false);
    }
    // modalMember
    const [modalMember, setModalMember] = useState(true);
    const toggleModalMember = () => {
        setModalMember(true);
        setModalProject(false);
        setModalPermit(false);
    }
    // modalProject
    const [modalProject, setModalProject] = useState(false);
    const toggleModalProject = () => {
        setModalProject(true);
        setModalMember(false);
        setModalPermit(false);
    }
    // modalPermit
    const [modalPermit, setModalPermit] = useState(false);
    const toggleModalPermit = () => {
        setModalPermit(true);
        setModalMember(false);
        setModalProject(false);
    }
    
    // MARK: userId → allGroups
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
            setAllGroups([]);
        }
    };

    // MARK: leaveGroup
    const handleLeaveGroup = async (groupId) => {
        await fetch(`/api/db?table=leaveGroup&groupId=${groupId}&userId=${userId}`);
        fetchGroup();
        toast.success('グループを退会しました', defaultToastOptions);
    }

    // MARK: checkPermission
    const [checkPermission, setCheckPermission] = useState([]);
    useEffect(() => {
        fetchCheckPermission();
    }, [allGroups]);
    const fetchCheckPermission = async () => {
        const response = await fetch(`/api/db?table=checkPermission&userId=${userId}`);
        const permissions = await response.json();
        setCheckPermission(permissions.results);
    };

    // MARK: modalNewNote
    const [modalNewNote, setModalNewNote] = useState(false);
    const toggleModalNewNote = () => {
        setModalNewNote(!modalNewNote);
    }

    // MARK: newNoteGroup
    const [newNoteGroup, setNewNoteGroup] = useState('');
    const handleChangeNewNoteGroup = (e) => {
        setNewNoteGroup(e.target.value);
    }

    // MARK: newNoteTitle
    const [newNoteTitle, setNewNoteTitle] = useState('');
    const handleChangeNewNoteTitle = (e) => {
        setNewNoteTitle(e.target.value);
    }

    // MARK: newNoteContent
    const [newNoteContent, setNewNoteContent] = useState('');

    // MARK: importNote
    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!file.name.endsWith('.md')) {
            alert('.mdファイルのみインポート可能です');
            e.target.value = '';
            return;
        }
        // ファイル名をタイトルとして設定（.mdを除く）
        const fileName = file.name.replace('.md', '');
        setNewNoteTitle(fileName);
        // ファイルの内容を読み込む
        const reader = new FileReader();
        reader.onload = (e) => {
            setNewNoteContent(e.target.result);
        };
        reader.readAsText(file);
    }

    // MARK: newNoteCreate
    const handleCreateNote = async (e) => {
        e.preventDefault();
        try {
            const noteData = {
                groupId: newNoteGroup,
                title: newNoteTitle,
                content: newNoteContent,
                userId
            };
            const { data, success, message } = await fetch('/api/post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(noteData)
            }).then(res => res.json());

            if (success) {
                window.location.assign(`/Editor/${data.id}`);
                toast.success('ノートを作成しました');
                setNewNoteTitle('');
                setNewNoteContent('');
                fetchNotifications();
                return;
            }
            toast.error(message);
        } catch {
            toast.error('ノートの作成に失敗しました');
        }
    }

    // MARK:selectedGroup
    const [selectedGroup, setSelectedGroup] = useState({id: null, name: null});

    // MARK:selectedGroup → selectedGroupNotes
    const [selectedGroupNotes, setSelectedGroupNotes] = useState([]);
    const fetchNotes = async () => {
        if (selectedGroup.id) {
            const response = await fetch(`/api/db?table=selectedGroupNotes&groupId=${selectedGroup.id}`);
            const notes = await response.json();
            setSelectedGroupNotes(notes.results || []);
        }
    };

    // MARK: selectedGroup → groupInMember
    const [groupInMember, setGroupInMember] = useState([]);
    const fetchGroupInMember = async () => {
        if (selectedGroup.id) {
            const response = await fetch(`/api/db?table=groupInMember&groupId=${selectedGroup.id}`);
            const members = await response.json();
            setGroupInMember(members.results);
        }
    };

    // MARK:selectedGroup → groupRole
    const [groupRole, setGroupRole] = useState([]);
    const fetchGroupRole = async () => {
        const response = await fetch(`/api/db?table=groupRole&groupId=${selectedGroup.id}`);
        const roles = await response.json();
        setGroupRole(roles.results);
    };

    // MARK:selectedGroup → roleToPermit
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

    // MARK: handleChangeRole
    const handleChangeRole = async (e, userId) => {
        const newRoleId = parseInt(e.target.value, 10);
        await fetch(`/api/db?table=changeRole&groupId=${selectedGroup.id}&userId=${userId}&roleId=${newRoleId}`);
        // メンバーリストを再取得
        await fetchGroupInMember();
        await fetchGroupRole();
        toast.success('役職を更新しました', defaultToastOptions);
    }

    // MARK: deleteMember
    const handleDeleteMember = async (e, userId) => {
        e.preventDefault();
        await fetch(`/api/db?table=deleteMember&groupId=${selectedGroup.id}&userId=${userId}`);
        // メンバーリストを再取得
        await fetchGroupInMember();
        toast.success('メンバーを削除しました', defaultToastOptions);
    }
    
    // MARK: searchUser
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

    // MARK: addMember
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

    // MARK: deleteProject
    const handleDeleteProject = async (projectId) => {
        await fetch(`/api/db?table=deleteNote&id=${projectId}`);
        // メンバーリストを再取得
        await fetchNotes();
        toast.success('ノートを削除しました', defaultToastOptions);
    }

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

    // MARK: changeRoleName
    const handleChangeRoleName = async (e, roleId) => {
        await fetch(`/api/db?table=updateRoleName&roleId=${roleId}&roleName=${e.target.value}`);
    }

    // MARK: changePermit
    const handleChangePermit = async (e, roleId) => {
        const newPermitId = parseInt(e.target.value, 10);
        await fetch(`/api/db?table=updateRoleToPermit&roleId=${roleId}&permitId=${newPermitId}`);
        await fetchRoleToPermit();
        toast.success('権限を更新しました', defaultToastOptions);
    }

    // MARK: deleteRole
    const handleDeleteRole = async (e, roleId) => {
        e.preventDefault();
        await fetch(`/api/db?table=deleteRole&roleId=${roleId}`);
        // 役職権限を再取得
        await fetchRoleToPermit();
        toast.success('役職を削除しました', defaultToastOptions);
    }

    // MARK: addRole
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

    // MARK: newRoleName
    const [newRoleName, setNewRoleName] = useState('');
    const handleChangeNewRoleName = async (e) => {
        setNewRoleName(e.target.value);
    }

    // MARK: newPermitId
    const [newPermitId, setNewPermitId] = useState(1);
    const handleChangeNewPermit = async (e) => {
        setNewPermitId(e.target.value);
    }

    // MARK: isGridView
    const [isGridView, setIsGridView] = useState(true);
    const [isNotesClass, setIsNotesClass] = useState(true);
    const toggleView = () => {
      setIsGridView(!isGridView);
      setIsNotesClass(!isNotesClass);[]
    };

    // MARK: modalSearchGroup
    const [modalSearchGroup, setModalSearchGroup] = useState(false);
    const toggleModalSearchGroup = () => {
        setModalSearchGroup(!modalSearchGroup);
    }

    // MARK: searchGroup
    const [searchGroup, setSearchGroup] = useState('');
    const handleSearchGroup = (e) => {
        setSearchGroup(e.target.value);
    }

    // MARK: searchGroupResult
    const [searchGroupResult, setSearchGroupResult] = useState([]);
    useEffect(() => {
        fetchSearchGroup();
    }, [searchGroup]);
    const fetchSearchGroup = async () => {
        const response = await fetch(`/api/db?table=searchGroup&name=${searchGroup}`);
        const groups = await response.json();
        setSearchGroupResult(groups.results);
    }

    // MARK: requestGroup
    const handleRequestGroup = async (e, groupId, createdBy) => {
        e.preventDefault();
        await fetch(`/api/db?table=requestGroup&groupId=${groupId}&fromUserId=${userId}&toUserId=${createdBy}`);
        toast.success('グループ参加リクエストを送信しました', defaultToastOptions);
    }

    // MARK: acceptRequest
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

    // MARK: rejectRequest
    const handleReject = async (notificationId) => {
        await fetch(`/api/db?table=rejectRequest&notificationId=${notificationId}`);
        fetchNotifications();
        toast.success('拒否しました', defaultToastOptions);
    };

    // MARK: Reqest Toast
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

    // MARK: modal CreateGroup
    const [modalCreateGroup, setModalCreateGroup] = useState(false);
    const toggleModalCreateGroup = () => {
        setModalCreateGroup(!modalCreateGroup);
    }

    // MARK: createName
    const [createName, setCreateName] = useState('');
    const handleChangeCreateName = (e) => {
        setCreateName(e.target.value);
    }

    // MARK: searchCreateMember
    const [searchCreateGroupMember, setSearchCreateGroupMember] = useState('');
    const handleSearchCreateGroupMember = (e) => {
        setSearchCreateGroupMember(e.target.value);
    }
    useEffect(() => {
        fetchCreateGroupMember();
    }, [searchCreateGroupMember]);

    // MARK: createGroup MemberSuggest
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
    // MARK: createGroup MemberList
    const [createGroupMemberList, setCreateGroupMemberList] = useState([]);
    if (userInfo && createGroupMemberList.length === 0) {
        setCreateGroupMemberList([{id: userInfo.id, username: userInfo.username}]);
    }
    // MARK: addCreateGroupMember
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

    // MARK: deleteCreateGroupMember
    const handleDeleteCreateGroupMember = (e, memberToDelete) => {
        e.preventDefault();
        if (memberToDelete.id === userInfo.id) {
            toast.error('自分は削除できません');
        } else {
            setCreateGroupMemberList(createGroupMemberList.filter((m) => m.id !== memberToDelete.id));
        }
    }

    // MARK: memberIds
    const [memberIds, setMemberIds] = useState([]);
    useEffect(() => {
        setMemberIds(createGroupMemberList.map((member) => member.id));
    }, [createGroupMemberList]);

    // MARK: createGroup
    const handleCreateGroup = async (e) => {
        e.preventDefault();
        await fetch(`/api/db?table=createGroup&name=${createName}&userId=${userId}&memberIds=${memberIds}`);
        toggleModalCreateGroup();
        setCreateName("");
        setCreateGroupMemberList([]);
        toast.success('グループを作成しました', defaultToastOptions);
    }
    // MARK: menuContents
    const menuContents = (
        <>
        {/* グループ追加 */}
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
        {/* グループ */}
        <LibraryMenu
            toggleModalCreateGroup={toggleModalCreateGroup}
            allGroups={allGroups}
            setSelectedGroup={setSelectedGroup}
            checkPermission={checkPermission}
            toggleModalSetting={toggleModalSetting}
        />
        </>
    )

    // MARK:headLine
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
        
    // MARK: settingWindow
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

    // MARK: main
    return(
        <main className={styles.main}>
            
        {/* MARK: Toast */}
        <ToastContainer />

        {/* MARK: modalNewNote*/}
        {modalNewNote ? (
            <NewNoteModal 
                allGroups={allGroups}
                toggleModalNewNote={toggleModalNewNote}
                handleCreateNote={handleCreateNote}
                handleChangeNewNoteGroup={handleChangeNewNoteGroup}
                handleChangeNewNoteTitle={handleChangeNewNoteTitle}
                newNoteTitle={newNoteTitle}
                handleImport={handleImport}
                setNoteContent={setNewNoteContent}
            />
        ) : null}

        {/* MARK: modalSetting */}
        {modalSetting ? modalSettingWindow : null}

        {/* MARK: accountView */}
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

        {/* MARK: modalJOinedGroups */}
        {modalJoinedGroups ? (
            <JoinedGroupsModal
                allGroups={allGroups}
                toggleModalJoinedGroups={toggleModalJoinedGroups}
                checkPermission={checkPermission}
                handleLeaveGroup={handleLeaveGroup}
                toggleModalSetting={toggleModalSetting}
                setSelectedGroup={setSelectedGroup}
                setModalJoinedGroups={setModalJoinedGroups}
            />
        ) : null}

        {/* MARK: modalSearchGroup */}
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

        {/* MARK: menu */}
        <Menu menuContents={menuContents}/>

        <div className={styles.contents}>
            {/* MARK: headLine */}
            <GroupHeadline headLeft={headLeft} headRight={headRight} />

            <div className={styles.content}>
                {/* MARK:selectedGroup → selectedGroupNotes */}
                {selectedGroup.id !== null && (
                    <>
                    <div className={styles.notesTitles}>
                        <p className={styles.notesTitle}>{selectedGroup.name}</p>
                    </div>
                    <NotesInGroup 
                        notes={selectedGroupNotes || []}
                        isNotesClass={isNotesClass}
                        toggleModalNewNote={toggleModalNewNote}
                    />
                    </>
                )}
                        
                {/* MARK: SearchResult → filteredNotes */}
                <div className={styles.notesTitles}>
                    <p className={styles.notesTitle}>検索結果「{searchValue}」</p>
                </div>
                {/* ! empty */}
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