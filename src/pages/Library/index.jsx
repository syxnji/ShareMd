'use client'
import { useEffect, useState } from 'react';
// component
import { Menu } from '@/components/Menu';
import { GroupHeadline } from "@/components/GroupHeadline";
import { NotesInGroup } from '@/components/NotesInGroup';
import { MainBtn } from "@/components/UI/MainBtn"
import { ImgBtn } from '@/components/UI/ImgBtn';
import { MemberManagement } from '@/components/MemberManagement';
import { ProjectManagement } from '@/components/ProjectManagement';
import { PermissionManagement } from '@/components/PermissionManagement';
import { ModalWindow } from '@/components/ModalWindow';
// icon
import { BsList, BsFileEarmarkPlus, BsGrid3X3, BsGear, BsX} from "react-icons/bs";
// style
import styles from "./library.module.css";

export default function Library() {
    // ログインしているユーザーのID
    const userId = sessionStorage.getItem('id');
    // MARK:全てのノート
    const [allNotes, setAllNotes] = useState([]);
    useEffect(() => {
        const fetchNotes = async () => {
            const response = await fetch(`/api/db?table=allNotes`);
            const allNotes = await response.json();
            setAllNotes(allNotes);
        };
        fetchNotes();
    }, []);

    const [modalState, setModalState] = useState({ open: false });
    const [inputValue, setInputValue] = useState('')
    
    // MARK:検索
    const [searchValue, setSearchValue] = useState('');
    const handleSearch = (e) => {
        e.preventDefault();
        setSearchValue(e.target.value);
    }
    const filteredNotes = allNotes.filter(note =>
        note.title.toLowerCase().includes(searchValue.toLowerCase())
    );
    
    // MARK:管理
    const [modalSetting, setModalSetting] = useState(false);
    const toggleModalSetting = () => {
        setModalSetting(!modalSetting);
    }
    const [modalMember, setModalMember] = useState(true);
    const toggleModalMember = () => {
        setModalMember(true);
        setModalProject(false);
        setModalPermit(false);
    }
    const [modalProject, setModalProject] = useState(false);
    const toggleModalProject = () => {
        setModalProject(true);
        setModalMember(false);
        setModalPermit(false);
    }
    const [modalPermit, setModalPermit] = useState(false);
    const toggleModalPermit = () => {
        setModalPermit(true);
        setModalMember(false);
        setModalProject(false);
    }
    
    // MARK:新規ノート
    const handleNewNote =() => {
        setModalState({ open: true })
    }
    const [allGroups, setAllGroups] = useState([]);
    useEffect(() => {
        const fetchGroup = async () => {
            const response = await fetch(`/api/db?table=joinedGroups`);
            const allGroups = await response.json();
            setAllGroups(allGroups);
        };
        fetchGroup();
    }, []);
    
    // MARK:グループ選択
    const [valueSelect, setValueSelect] = useState(1)
    const handleChangeOption = (event) => {
        setValueSelect(event.target.value);
    }

    // MARK:インサート新規ノート
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`/api/db?table=newNote&groupId=${valueSelect}&noteName=${inputValue}`);
        const result = await response.json();
        window.location.assign(`/Editor/${result.results.insertId}`);
    }

    // MARK:フォーム
    const formContent = (
        <div className={styles.inputs}>
            <div className={styles.newNoteGroup}>
                <select required onChange={handleChangeOption}>
                    {allGroups.map((group) => (
                        <option key={group.id} value={group.id}>{group.name}</option>
                    ))}
                </select>
            </div>
            <div className={styles.newNoteName}>
                <input 
                 type="text" 
                 placeholder='ノート名' 
                 onChange={(e) => setInputValue(e.target.value)} 
                 required 
                />
            </div>
        </div>
    )

    // MARK:グループ < ノート
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [selectedGroupNotes, setSelectedGroupNotes] = useState([]);
    const fetchNotes = async () => {
        if (selectedGroupId) {
            const response = await fetch(`/api/db?table=selectedGroup&groupId=${selectedGroupId}`);
            const notes = await response.json();
            setSelectedGroupNotes(notes);
        }
    };
    useEffect(() => {
        fetchNotes();
    }, [selectedGroupId]);

    // MARK: グループ < メンバー
    const [groupInMember, setGroupInMember] = useState([]);
    const fetchGroupInMember = async () => {
        if (selectedGroupId) {
            const response = await fetch(`/api/db?table=groupInMember&groupId=${selectedGroupId}`);
            const members = await response.json();
            setGroupInMember(members.results);
        }
    };
    useEffect(() => {
        fetchGroupInMember();
    }, [selectedGroupId]);

    // グループ管理モーダル ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    // MARK:ロール管理
    const [groupRole, setGroupRole] = useState([]);
    useEffect(() => {
        fetchGroupRole();
    }, [selectedGroupId]);
    const fetchGroupRole = async () => {
        const response = await fetch(`/api/db?table=groupRole&groupId=${selectedGroupId}`);
        const roles = await response.json();
        setGroupRole(roles.results);
    };
    // ロール変更
    const handleChangeRole = async (e, userId) => {
        const newRoleId = parseInt(e.target.value, 10);
        console.log(selectedGroupId,userId,newRoleId);
        const response = await fetch(`/api/db?table=changeRole&groupId=${selectedGroupId}&userId=${userId}&roleId=${newRoleId}`);
        const result = await response.json();
        // メンバーリストを再取得
        await fetchGroupInMember();
        await fetchGroupRole();
    }
    // メンバー削除
    const handleDeleteMember = async (e, userId) => {
        e.preventDefault();
        const response = await fetch(`/api/db?table=deleteMember&groupId=${selectedGroupId}&userId=${userId}`);
        const result = await response.json();
        // メンバーリストを再取得
        await fetchGroupInMember();
    }
    // ユーザー検索
    const [searchUser, setSearchUser] = useState('');
    const handleSearchUser = (e) => {
        setSearchUser(e.target.value);
    }
    // メンバー候補
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
    // メンバー追加
    const handleAddMember = async (e, user) => {
        e.preventDefault();
        const newMemberId = user.id;
        const response = await fetch(`/api/db?table=addMember&groupId=${selectedGroupId}&userId=${newMemberId}`);
        const result = await response.json();
        setSearchUser('');
        // メンバーリストを再取得
        await fetchGroupInMember();
    }

    // MARK:製作管理
    const handleDeleteProject = async (projectId) => {
        const response = await fetch(`/api/db?table=deleteProject&projectId=${projectId}`);
        const result = await response.json();
        // メンバーリストを再取得
        await fetchNotes();
    }

    // MARK:役職権限管理
    const [roleToPermit, setRoleToPermit] = useState([]);
    useEffect(() => {
        fetchRoleToPermit();
    }, [selectedGroupId]);
    // 役職権限を取得
    const fetchRoleToPermit = async () => {
        const response = await fetch(`/api/db?table=roleToPermit&groupId=${selectedGroupId}`);
        const roles = await response.json();
        setRoleToPermit(roles.results);
    };
    // 権限を取得
    const [permission, setPermission] = useState([]);
    useEffect(() => {
        const fetchPermission = async () => {
            const response = await fetch(`/api/db?table=permission`);
            const permissions = await response.json();
            setPermission(permissions);
        };
        fetchPermission();
    }, []);
    // 役職名変更
    const handleChangeRoleName = async (e, roleId) => {
        const response = await fetch(`/api/db?table=updateRoleName&roleId=${roleId}&roleName=${e.target.value}`);
        const result = await response.json();
    }
    // 役職権限変更
    const handleChangePermit = async (e, roleId) => {
        const newPermitId = parseInt(e.target.value, 10);
        const response = await fetch(`/api/db?table=updateRoleToPermit&roleId=${roleId}&permitId=${newPermitId}`);
        const result = await response.json();
        await fetchRoleToPermit();
    }
    // 役職削除
    const handleDeleteRole = async (e, roleId) => {
        e.preventDefault();
        const response = await fetch(`/api/db?table=deleteRole&roleId=${roleId}`);
        const result = await response.json();
        // 役職権限を再取得
        await fetchRoleToPermit();
    }
    // 役職追加
    const handleAddRole = async (e) => {
        if (newRoleName.length > 0) {
            e.preventDefault();
            const response = await fetch(`/api/db?table=insertRole&roleName=${newRoleName}&groupId=${selectedGroupId}&permissionId=${newPermitId}`);
            const result = await response.json();
            fetchRoleToPermit();
            setNewRoleName('');
            setNewPermitId(1);
        }
    }
    // 役職名変更
    const [newRoleName, setNewRoleName] = useState('');
    const handleChangeNewRoleName = async (e) => {
        setNewRoleName(e.target.value);
    }
    // 役職権限変更
    const [newPermitId, setNewPermitId] = useState(1);
    const handleChangeNewPermit = async (e) => {
        setNewPermitId(e.target.value);
    }
    // グループ管理モーダル ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

    // MARK:切替え グリッド/リスト
    const [isGridView, setIsGridView] = useState(true);
    const [isNotesClass, setIsNotesClass] = useState(true);
    const toggleView = () => {
      setIsGridView(!isGridView);
      setIsNotesClass(!isNotesClass);
    };

    // MARK:ヘッドライン 左
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
    // MARK:ヘッドライン 右
    const headRight = (
        <>
        {/* レイアウト */}
        <div className={styles.layouts}>
            <ImgBtn img={isGridView ? <BsList/> : <BsGrid3X3/>} click={toggleView}/>
        </div>
        {/* 新規ノート */}
        <div className={styles.addNote}>
            {/* <MainBtn img={<BsFileEarmarkPlus/>} click={handleNewNote} text="New Note"/> */}
            <ImgBtn img={<BsFileEarmarkPlus/>} click={handleNewNote} color="main"/>
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

    return(
        <main className={styles.main}>
            
        {modalState.open && (
            <form className={styles.formContent} onSubmit={handleSubmit}>
                <ModalWindow 
                    msg={'+ New Note'}
                    content={formContent}
                    No={() => setModalState({ open: false})}
                    Yes={(e) => handleSubmit(e)}
                    type={'submit'}
                />
            </form>
        )}

        {/* MARK:設定 */}
        {modalSetting ? modalSettingWindow : null}

        {/* MARK:メニュー */}
        <Menu setSelectedGroupId={setSelectedGroupId} />

        <div className={styles.contents}>
            {/* MARK:ヘッドライン(検索、レイアウト、新規ノート) */}
            <GroupHeadline headLeft={headLeft} headRight={headRight} />

            {/* MARK:ノート */}
            <div className={styles.content}>

                {/* MARK:ヘッドライン(グループ名、権限/ノートボタン) */}
                {selectedGroupNotes.length > 0 && (
                    <div className={styles.notesTitles}>
                        <p className={styles.notesTitle}>{selectedGroupNotes[0].groupName}</p>
                        <button className={styles.settingBtn} onClick={toggleModalSetting}><BsGear/></button>
                    </div>
                )}
                {/* MARK:選択したグループ内のノート */}
                <NotesInGroup 
                 notes={selectedGroupNotes} 
                 isNotesClass={isNotesClass}
                />
                        
                {/* MARK:最近更新されたノート */}
                <div className={styles.notesTitles}>
                    <p className={styles.notesTitle}>検索結果「{searchValue}」</p>
                </div>
                <NotesInGroup 
                 notes={filteredNotes} 
                 isNotesClass={isNotesClass}
                />
                
            </div>
            
        </div>

        </main>
    )
}