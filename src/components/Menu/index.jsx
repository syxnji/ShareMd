'use client'
import { useEffect, useState } from "react";
// component
import { ToastContainer, toast } from 'react-toastify';
// icon
import { BsArrowBarLeft, BsBuildings, BsX } from "react-icons/bs";
// style
import styles from "./menu.module.css";
import 'react-toastify/dist/ReactToastify.css';
import { MdAdminPanelSettings } from "react-icons/md";

export const Menu = ({ setSelectedGroupId, userInfo, allGroups = [], fetchGroup, toggleModalSetting, checkPermission }) => {

    // MARK:グループ選択
    const groupClick = (id) => {
        setSelectedGroupId(id);
    }

    // MARK:メニュー表示/非表示
    const [isMenu, setIsMenu] = useState(true);
    const toggleMenu = () => {
        setIsMenu(!isMenu);
    };

    // MARK:グループ追加モーダル
    const [modalCreate, setModalCreate] = useState(false);
    const toggleModalCreate = () => {
        setModalCreate(!modalCreate);
    };

    // MARK:グループ名
    const [createName, setCreateName] = useState("");
    const handleGroupName = (e) => {
        setCreateName(e.target.value);
    }

    // MARK:メンバー検索
    const [createMember, setCreateMember] = useState("");
    const handleCreateMember = (e) => {
        setCreateMember(e.target.value);
    }

    // MARK:メンバー候補
    const [createMemberSuggest, setCreateMemberSuggest] = useState([]);
    useEffect(() => {
        const fetchMemberSuggest = async () => {
            if (createMember.length > 0) {  
                const response = await fetch(`/api/db?table=suggestUsers&name=${createMember}`);
                const suggestUsers = await response.json();
                setCreateMemberSuggest(suggestUsers.results);
            } else {
                setCreateMemberSuggest([]);
            }
        };
        fetchMemberSuggest();
    }, [createMember]);

    // MARK:メンバー追加
    const [memberList, setMemberList] = useState([]);
    if (userInfo?.id && memberList.length === 0) {
        setMemberList([{id: userInfo.id, username: userInfo.username}]);
    }
    const handleAddMember = (e, user) => {
        e.preventDefault();
        const newMember = {
            id: user.id,
            username: user.username
        };
        if (memberList.some(member => member.id === newMember.id)) {
            toast.error('既に追加されています');
            setCreateMember("");
            return;
        }
        setMemberList([...memberList, newMember]);
        setCreateMember("");
    }

    // MARK:メンバー削除
    const handleDeleteMember = (e, memberToDelete) => {
        e.preventDefault();
        if (memberToDelete.id === userInfo.id) {
            toast.error('自分は削除できません');
        } else {
            setMemberList(memberList.filter((m) => m.id !== memberToDelete.id));
        }
    }

    // MARK:グループ作成
    const handleCreateGroup = async (e) => {
        e.preventDefault();
        const memberIds = memberList.map((member) => member.id);
        await fetch(`/api/db?table=insertGroup&name=${createName}&userId=${userInfo.id}&memberIds=${memberIds}`);
        toggleModalCreate();
        setCreateName("");
        setMemberList([]);
        fetchGroup();
        toast.success('グループを作成しました');
    }

    // MARK:コンポーネント ━━━
    return(
        <>

        {/* MARK:グループ作成モーダル */}
        {modalCreate ? (
            <form className={styles.modalNewGroupWindow} onSubmit={handleCreateGroup}>
                <button className={styles.modalNewGroupClose} onClick={toggleModalCreate}><BsX/></button>
                <div className={styles.modalNewGroupContents}>
                    <div className={styles.newGroupTitle}>
                        <label className={styles.newGroupLabel}>グループ名</label>
                        <input type="text" placeholder="例：チームα" className={styles.newGroupInput} onChange={handleGroupName} value={createName} required/>
                    </div>
                    <div className={styles.newGroupMembers}>
                        <label className={styles.newGroupLabel}>メンバー</label>
                        <input type="text" placeholder="ユーザー名で検索" className={styles.newGroupInput} onChange={handleCreateMember} value={createMember}/>
                        {createMemberSuggest.length > 0 && (
                            <div className={styles.newGroupSuggest}>
                                <div className={styles.suggestMemberBox}>
                                    {createMemberSuggest.map((user) => (
                                        <button className={styles.suggestMember} key={user.id} onClick={(e) => handleAddMember(e, user)}>{user.username}</button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={styles.newGroupMemberListBox}>
                        <p className={styles.newGroupLabel}>メンバーリスト</p>
                        <div className={styles.newGroupMemberList}>
                            {memberList.map((member) => (
                                <div className={styles.member} key={member.id}>
                                    <p>{member.username}</p>
                                    <button className={styles.memberDelete} onClick={(e) => handleDeleteMember(e, member)}><BsX/></button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button className={styles.newGroupBtn} type="submit">構築</button>
                </div>
            </form>
        ) : null}

        {/* MARK:メニュー */}
        <div className={isMenu ? styles.open : styles.close }>
            <button className={styles.resizeBtn} onClick={toggleMenu}>
                <BsArrowBarLeft/>
            </button>
            <div className={styles.innerMenu}>
                {isMenu ? (
                    <>
                    <div className={styles.addGroup}>
                        <button 
                        className={styles.addGroupBtn}
                        onClick={toggleModalCreate}
                        >
                        <BsBuildings/> グループ構築
                        </button>
                    </div>
                    <div className={styles.groups}>
                        {Array.isArray(allGroups) && allGroups.map((group) => (
                            <div className={styles.groupBox} key={group.id}>
                                <button className={styles.group} onClick={() => groupClick(group.id)}>
                                    {group.name}
                                </button>
                                {checkPermission.some(permission => permission.group_id === group.id && permission.permission_id === 1) && (
                                    <button className={styles.settingBtn} onClick={(e) => {toggleModalSetting(); setSelectedGroupId(group.id);}}><MdAdminPanelSettings /></button>
                                )}
                            </div>
                        ))}
                    </div>
                    </>
                ) : null}
            </div>
        </div>
        </>
    )
}