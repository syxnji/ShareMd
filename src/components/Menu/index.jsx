'use client'
import { useEffect, useState } from "react";
// component
import { ImgBtn } from "@/components/UI/ImgBtn";
import { GroupHeadline } from "@/components/GroupHeadline";
// icon
import { BsArrowBarLeft } from "react-icons/bs";
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

    // GroupHeadline
    const headLeft = (
        <p className={styles.booksTitle}>Books</p>
    )
    const headRight =(
        <ImgBtn click={toggleMenu} img={isMenu ? <BsArrowBarLeft/> : <BsArrowBarRight/>}/>
    )

    return(
        <div className={isMenu ? styles.open : styles.close }>
            <div className={styles.innerMenu}>
                <GroupHeadline headLeft={headLeft} headRight={headRight}/>
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
    )
}