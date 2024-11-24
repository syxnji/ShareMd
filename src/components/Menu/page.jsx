'use client'
import { useState } from "react";
// component
import { ImgBtn } from "@/components/UI/ImgBtn/page";
// icon
import { BsArrowBarLeft } from "react-icons/bs";
import { BsArrowBarRight } from "react-icons/bs";
// style
import styles from "./menu.module.css";

export function Menu() {
    // TODO:仮データ
    const groups = [
        { id: 1, group: 'Marketing Team' },
        { id: 2, group: 'Development Team' },
        { id: 3, group: 'Design Group' },
        { id: 4, group: 'Human Resources' },
        { id: 5, group: 'Sales Division' },
        { id: 6, group: 'Customer Support' },
        { id: 7, group: 'Research and Innovation' },
        { id: 8, group: 'Product Management' },
        { id: 9, group: 'Finance and Accounting' },
        { id: 10, group: 'Logistics and Supply Chain' }
    ];

    const [isMenu, setIsMenu] = useState(true);
    const toggleMenu = () => {
        setIsMenu(!isMenu);
    };

    return(
        // <div className={styles.outerMenu} >
        <div className={isMenu ? styles.open : styles.close }>
            <div className={styles.innerMenu}>
                <div className={styles.head}>
                    <p>Books</p>
                    <ImgBtn click={toggleMenu} img={isMenu ? <BsArrowBarLeft/> : <BsArrowBarRight/>}/>
                </div>
                {/* groupsを繰り返し表示 */}
                <div className={styles.categories}>
                    {groups.map((group) => (
                        <div className={styles.category} key={group.id}>
                            <p>{group.group}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}