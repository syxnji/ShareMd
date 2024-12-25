'use client'
import { useEffect, useState } from 'react';
// component
import { Menu } from '@/components/Menu';
import { GroupHeadline } from "@/components/GroupHeadline";
import { NotesInGroup } from '@/components/NotesInGroup';
import { MainBtn } from "@/components/UI/MainBtn"
import { ImgBtn } from '@/components/UI/ImgBtn';
// import { Permission } from '@/components/Permission';
import { ModalWindow } from '@/components/ModalWindow';
// icon
import { BsList, BsPeople, BsFileEarmarkPlus, BsGrid3X3, BsGear, BsX, BsPlus } from "react-icons/bs";
import { RiBook2Line } from "react-icons/ri";
// style
import styles from "./library.module.css";

export default function Library() {

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
    
    // MARK:設定
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
        <>
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
        </>
    )

    // MARK:選択したグリープのノート
    const [selectedGroupId, setSelectedGroupId] = useState(null);

    const [selectedGroupNotes, setSelectedGroupNotes] = useState([]);

    // 選択したグループのノートを取得
    const fetchNotes = async () => {
        if (selectedGroupId) {
            const response = await fetch(`/api/db?table=selectedGroup&groupId=${selectedGroupId}`);
            const notes = await response.json();
            setSelectedGroupNotes(notes);
        }
    };

    // 選択したグループが変わったらノートを取得
    useEffect(() => {
        fetchNotes();
    }, [selectedGroupId]);

    // MARK: メンバー
    const [groupInMember, setGroupInMember] = useState([]);
    
    // メンバーリストを更新する関数
    const fetchGroupInMember = async () => {
        if (selectedGroupId) {
            const response = await fetch(`/api/db?table=groupInMember&groupId=${selectedGroupId}`);
            const members = await response.json();
            setGroupInMember(members.results);
        }
    };

    // 初期ロード時とグループ選択時に実行
    useEffect(() => {
        fetchGroupInMember();
    }, [selectedGroupId]);

    // MARK:グループのロール
    const [groupRole, setGroupRole] = useState([]);
    useEffect(() => {
        fetchGroupRole();
    }, [selectedGroupId]);

    const fetchGroupRole = async () => {
        const response = await fetch(`/api/db?table=groupRole&groupId=${selectedGroupId}`);
        const roles = await response.json();
        setGroupRole(roles.results);
    };

    // MARK:ロール変更
    const handleChangeRole = async (e, userId) => {
        const newRoleId = parseInt(e.target.value, 10);
        console.log(selectedGroupId,userId,newRoleId);
        const response = await fetch(`/api/db?table=changeRole&groupId=${selectedGroupId}&userId=${userId}&roleId=${newRoleId}`);
        const result = await response.json();
        // メンバーリストを再取得
        await fetchGroupInMember();
        await fetchGroupRole();
    }

    // MARK:メンバー削除
    const handleDeleteMember = async (e, userId) => {
        e.preventDefault();
        const response = await fetch(`/api/db?table=deleteMember&groupId=${selectedGroupId}&userId=${userId}`);
        const result = await response.json();
        // メンバーリストを再取得
        await fetchGroupInMember();
    }

    // MARK:ユーザー検索
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

    // MARK:メンバー追加
    const handleAddMember = async (e, user) => {
        e.preventDefault();
        const newMemberId = user.id;
        const response = await fetch(`/api/db?table=addMember&groupId=${selectedGroupId}&userId=${newMemberId}`);
        const result = await response.json();
        setSearchUser('');
        // メンバーリストを再取得
        await fetchGroupInMember();
    }

    // MARK:project削除
    const handleDeleteProject = async (projectId) => {
        const response = await fetch(`/api/db?table=deleteProject&projectId=${projectId}`);
        const result = await response.json();
        // メンバーリストを再取得
        await fetchNotes();
    }

    // MARK:役職権限
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

    // MARK:権限
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

    // MARK:切替え グリッド/リスト
    const [isGridView, setIsGridView] = useState(true);
    const [isNotesClass, setIsNotesClass] = useState(true);
    const toggleView = () => {
      setIsGridView(!isGridView);
      setIsNotesClass(!isNotesClass);
    };

    // MARK:切替え ノート/権限
    const [displayNotes, setDisplayNotes] = useState(true);
    const toggleGroupContent = () => {
        setDisplayNotes(!displayNotes);
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
                {/* <ImgBtn img={<BsSearch/>} type="submit" /> */}
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
            <MainBtn img={<BsFileEarmarkPlus/>} click={handleNewNote} text="New Note"/>
        </div>
        </>
    )
    // MARK:ヘッドライン 左 最近更新
    const recently_headLeft = (
        <>
        {/* 最近更新 */}
        <p className={styles.groupName}>検索結果</p>
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
                <div className={styles.memberContent}>
                    <div className={styles.addMember}>
                        <input 
                         type="text"
                         placeholder="ユーザー名を入力"
                         className={styles.searchMember}
                         onChange={handleSearchUser}
                         value={searchUser}
                        />
                        {/* メンバー候補 */}
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
                        {groupInMember.map((member) => (
                            <div className={styles.member} key={member.id}>
                                <p>{member.username}</p>
                                <select
                                 className={styles.roleSelect}
                                 onChange={(e) => handleChangeRole(e, member.id)}
                                 value={member.role_id}
                                >
                                    {groupRole.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                                <button className={styles.deleteBtn} onClick={(e) => handleDeleteMember(e, member.id)}>
                                    <BsX/>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ) : null}
            {modalProject ? (
                <div className={styles.projectContent}>
                    {selectedGroupNotes.map((project) => (
                        <div className={styles.project} key={project.id}>
                            <p>{project.title}</p>
                            <button className={styles.deleteBtn} onClick={() => handleDeleteProject(project.id)}><BsX/></button>
                        </div>
                    ))}
                </div>
            ) : null}
            {modalPermit ? (
                <div className={styles.permitContent}>
                    <div className={styles.addRole}>
                        <input type="text" placeholder="役職名" className={styles.roleName} onChange={(e) => handleChangeNewRoleName(e)} value={newRoleName}/>
                        <select className={styles.roleSelect} onChange={(e) => handleChangeNewPermit(e)}>
                            {permission.map((permit) => (
                                <option key={permit.id} value={permit.id}>{permit.name}</option>
                            ))}
                        </select>
                        <button className={styles.addBtn} onClick={(e) => handleAddRole(e)}><BsPlus/></button>
                    </div>
                    <div className={styles.roleList}>
                        {roleToPermit.length > 0 ? (
                            roleToPermit.map((role) => (
                                <div className={styles.role} key={role.id}>
                                    <input 
                                     type="text" 
                                     placeholder="役職名" 
                                     className={styles.roleName}
                                     defaultValue={role.name} 
                                 onChange={(e) => handleChangeRoleName(e, role.id)}
                                />
                                <select className={styles.roleSelect} onChange={(e) => handleChangePermit(e, role.id)} value={role.permission_id}>
                                    {permission.map((permit) => (
                                        <option key={permit.id} value={permit.id}>{permit.name}</option>
                                    ))}
                                </select>
                                <button className={styles.deleteBtn} onClick={(e) => handleDeleteRole(e, role.id)}><BsX/></button>
                            </div>
                        ))
                        ) : (
                            <p>役職がありません</p>
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    );

    // MARK:ヘッドライン 左 選択グループ
    const select_headLeft = (
        <>
        {/* 選択されたグループ */}
        {selectedGroupNotes.length > 0 && (
            <>
            <p className={styles.groupName}>
                {selectedGroupNotes[0].groupName}
            </p>
            <ImgBtn img={ displayNotes ? <BsPeople/> : <RiBook2Line/> } click={toggleGroupContent} />
            <ImgBtn img={<BsGear/>} click={toggleModalSetting} />
            </>
        )}
        </>
    )

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

            {/* MARK:ヘッドライン(グループ名、権限/ノートボタン) */}
            {selectedGroupNotes.length > 0 && (
                <GroupHeadline headLeft={select_headLeft} />
            )}

            {/* MARK:権限 */}
            {/* {selectedGroupNotes.length > 0 && (
                <Permission display={displayNotes} id={selectedGroupNotes[0].groupId} />
            )} */}

            {/* MARK:ノート */}
            <div className={ displayNotes ? styles.content : styles.hideContent }>

                {/* MARK:選択したグループ内のノート */}
                <NotesInGroup 
                 notes={selectedGroupNotes} 
                 isNotesClass={isNotesClass}
                />
                        
                {/* MARK:最近更新されたノート */}
                <GroupHeadline headLeft={recently_headLeft} />
                <NotesInGroup 
                 notes={filteredNotes} 
                 isNotesClass={isNotesClass}
                />
                
            </div>
            
        </div>

        </main>
    )
}