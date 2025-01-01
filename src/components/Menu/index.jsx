'use client'
import { useEffect, useState } from "react";
// component
import { ImgBtn } from "@/components/UI/ImgBtn";
import { GroupHeadline } from "@/components/GroupHeadline";
import { CreateGroup } from "@/components/CreateGroup";
// icon
import { BsArrowBarLeft, BsBuildings, BsX } from "react-icons/bs";
import { BsArrowBarRight } from "react-icons/bs";
// style
import styles from "./menu.module.css";

export function Menu({ setSelectedGroupId, userId }) {

    // グループ表示
    const [allGroups, setAllGroups] = useState([]);
    const fetchGroup = async () => {
        const response = await fetch(`/api/db?table=joinedGroups&userId=${userId}`);
        const allGroups = await response.json();
        setAllGroups(allGroups);
    };
    useEffect(() => {
      fetchGroup();
    }, [userId]);

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

    return(
        <>
        <CreateGroup
            fetchGroup={fetchGroup}
            isOpen={modalCreate}
            onClose={toggleModalCreate}
        />
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
                        {allGroups.map((group) => (
                            <button className={styles.group} key={group.id} onClick={() => groupClick(group.id)}>
                                {group.name}
                            </button>
                            ))}
                    </div>
                    </>
                ) : null}
            </div>
        </div>
        </>
    )
}