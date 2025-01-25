'use client'
import { useEffect, useState } from "react";
// style
import styles from './menu.module.css';
// icon
import { BsArrowBarLeft, BsArrowBarRight} from "react-icons/bs";

export function Menu({menuContents, menuState}) {
    // MARK: メニューの表示/非表示
    // const [menuState, setMenuState] = useState(false);
    // const toggleMenuState = () => {
    //     setMenuState(!menuState);
    // }
    return(
        <div className={styles.menu + (menuState ? ' ' + styles.menuOpen : ' ' + styles.menuClose)}>
            {menuState ? (
            <div className={styles.contents}>
                {menuContents}
            </div>
            ) :
            null
            }
        </div>
    )
}