'use client'
import { useEffect, useState } from "react";
import { getGroups } from "pages/api/myGroups";
// component
import { ImgBtn } from "@/components/UI/ImgBtn/page";
import { GroupHeadline } from "@/components/GroupHeadline/page";
// icon
import { BsArrowBarLeft } from "react-icons/bs";
import { BsArrowBarRight } from "react-icons/bs";
// style
import styles from "./menu.module.css";

export function Menu() {

    // DBから取得
    const [groups, setGroups] = useState([]);
    useEffect(() => {
        async function loadGroups() {
            const fetchedGroups = await getGroups();
            setGroups(fetchedGroups);
        }
        loadGroups();
    }, []);

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
                <div className={styles.categories}>
                    {groups.map((group) => (
                        <div className={styles.category} key={group.id}>
                            {/* <p>{group.group}</p> */}
                            <p>{group.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}