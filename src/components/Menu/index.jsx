'use client'
import { useEffect, useState } from "react";
// component
import { ImgBtn } from "@/components/UI/ImgBtn";
import { GroupHeadline } from "@/components/GroupHeadline";
// icon
import { BsArrowBarLeft, BsX } from "react-icons/bs";
import { BsArrowBarRight } from "react-icons/bs";
// style
import styles from "./menu.module.css";

export function Menu({ setSelectedGroupId }) {

    // グループ表示
    const [allGroups, setAllGroups] = useState([]);
    useEffect(() => {
        const fetchGroup = async () => {
            const response = await fetch(`/api/db?table=joinedGroups`);
            const allGroups = await response.json();
            setAllGroups(allGroups);
        };
      fetchGroup();
    }, []);

    // グループクリック
    const groupClick = (id) => {
        setSelectedGroupId(id);
    }

    // 表示/非表示
    const [isMenu, setIsMenu] = useState(true);
    const toggleMenu = () => {
        setIsMenu(!isMenu);
    };

    // グループ追加モーダル
    const [modalCreate, setModalCreate] = useState(false);
    const toggleModalCreate = () => {
        setModalCreate(!modalCreate);
    };

    // グループ名
    const [createName, setCreateName] = useState("");
    const handleCreateName = (e) => {
        setCreateName(e.target.value);
    }

    // メンバー
    const [createMember, setCreateMember] = useState([]);
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
        console.log(result);
        toggleModalCreate();
    }


    // GroupHeadline
    const headLeft = (
        <p className={styles.booksTitle}>Books</p>
    )
    const headRight =(
        <ImgBtn click={toggleMenu} img={isMenu ? <BsArrowBarLeft/> : <BsArrowBarRight/>}/>
    )

    const modalCreateWindow = (
        <form onSubmit={handleCreateGroup}>
            <div className={styles.modalCreateWindow}>
                <p className={styles.modalCreateTitle}>構築</p>
                <div className={styles.modalCreateInputBox}>

                    <input type="text" placeholder="グループ名" className={styles.modalCreateInput} onChange={handleCreateName} required/>
                    <div className={styles.modalCreateMemberBox}>
                        <input type="text" placeholder="メンバー" className={styles.searchMember} onChange={handleCreateMember}/>

                        {/* メンバー候補 */}
                        {createMemberSuggest.length > 0 ? (
                            <div className={styles.suggestMemberBox}>
                                {createMemberSuggest.map((user) => (
                                    <button className={styles.suggestMember} key={user.id} onClick={(e) => handleAddMember(e, user)}>{user.username}</button>
                                ))}
                            </div>
                        ) : null}

                        {/* メンバーリスト */}
                        <div className={styles.memberList}>
                            {memberList.map((member) => (
                                <div className={styles.member} key={member.id}>
                                    <p>{member.username}</p>
                                    <button className={styles.memberDelete} onClick={() => handleDeleteMember(member)}><BsX/></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className={styles.modalCreateBtnBox}>
                    <button className={styles.modalCreateBtnCancel} onClick={toggleModalCreate}>キャンセル</button>
                    <button type="submit" className={styles.modalCreateBtn} onClick={handleCreateGroup}>追加</button>
                </div>
            </div>
        </form>
    )

    return(
        <>
        {modalCreate ? modalCreateWindow : null}
        <div className={isMenu ? styles.open : styles.close }>
            <div className={styles.innerMenu}>
                <GroupHeadline headLeft={headLeft} headRight={headRight}/>
                <div className={styles.addGroup}>
                    <button 
                     className={styles.addGroupBtn}
                     onClick={toggleModalCreate}
                    >
                        構築
                    </button>
                </div>
                {/* groupsを繰り返し表示 */}
                <div className={styles.groups}>
                    {allGroups.map((group) => (
                        <button className={styles.group} key={group.id} onClick={() => groupClick(group.id)}>
                            {group.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
        </>
    )
}