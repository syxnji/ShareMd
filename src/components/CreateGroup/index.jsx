'use client'
import { useState, useEffect } from "react";
import { BsX } from "react-icons/bs";
import styles from "./createGroup.module.css";

export function CreateGroup({ isOpen, onClose, fetchGroup }) {
    // グループ名
    const [createName, setCreateName] = useState("");
    const handleCreateName = (e) => {
        setCreateName(e.target.value);
    }

    // メンバー
    const [createMember, setCreateMember] = useState("");
    const handleCreateMember = (e) => {
        setCreateMember(e.target.value);
    }

    // メンバー候補
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

    // メンバー追加
    const [memberList, setMemberList] = useState([]);
    const handleAddMember = (e, user) => {
        e.preventDefault();
        const newMember = {
            id: user.id,
            username: user.username
        };
        setMemberList([...memberList, newMember]);
        setCreateMember("");
    }

    // メンバー削除
    const handleDeleteMember = (memberToDelete) => {
        setMemberList(memberList.filter((m) => m.id !== memberToDelete.id));
    }

    // グループ作成
    const handleCreateGroup = async (e) => {
        e.preventDefault();
        const memberIds = memberList.map((member) => member.id);
        const response = await fetch(`/api/db?table=insertGroup&name=${createName}&memberIds=${memberIds}`);
        const result = await response.json();
        onClose();
        fetchGroup();
    }

    if (!isOpen) return null;

    return (
        <form onSubmit={handleCreateGroup}>
            <div className={styles.modalCreateWindow}>
                <p className={styles.modalCreateTitle}>構築</p>
                <div className={styles.modalCreateInputBox}>
                    <input 
                        type="text" 
                        placeholder="グループ名" 
                        className={styles.modalCreateInput} 
                        onChange={handleCreateName} 
                        required
                    />
                    <div className={styles.modalCreateMemberBox}>
                        <input 
                            type="text" 
                            placeholder="メンバー" 
                            className={styles.searchMember} 
                            onChange={handleCreateMember}
                            value={createMember}
                        />

                        {createMemberSuggest.length > 0 && (
                            <div className={styles.suggestMemberBox}>
                                {createMemberSuggest.map((user) => (
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

                        <div className={styles.memberList}>
                            {memberList.map((member) => (
                                <div className={styles.member} key={member.id}>
                                    <p>{member.username}</p>
                                    <button 
                                        className={styles.memberDelete} 
                                        onClick={() => handleDeleteMember(member)}
                                    >
                                        <BsX/>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className={styles.modalCreateBtnBox}>
                    <button 
                        className={styles.modalCreateBtnCancel} 
                        onClick={onClose}
                        type="button"
                    >
                        キャンセル
                    </button>
                    <button 
                        type="submit" 
                        className={styles.modalCreateBtn}
                    >
                        追加
                    </button>
                </div>
            </div>
        </form>
    );
}
