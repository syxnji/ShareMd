'use client'
import { useEffect, useState } from "react";
// style
import styles from './menu.module.css';
// icon
import { BsArrowBarLeft, BsArrowBarRight} from "react-icons/bs";

export function NewMenu({menuContents}) {
    // MARK: メニューの表示/非表示
    const [menuState, setMenuState] = useState(true);
    const toggleMenuState = () => {
        setMenuState(!menuState);
    }
    return(
        <div className={styles.menu + (menuState ? ' ' + styles.menuOpen : ' ' + styles.menuClose)}>
            {menuState ? (
                <>
                <div className={styles.contents}>
                    {menuContents}
                </div>
                <button onClick={toggleMenuState} className={styles.menuBtn}><BsArrowBarLeft/></button>
                </>
            ) : (
                <button onClick={toggleMenuState} className={styles.menuBtn}><BsArrowBarRight/></button>
            )}
        </div>
    )
}