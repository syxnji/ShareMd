'use client'
import { useState } from 'react';
import Link from "next/link";
// component
import { Menu } from "../../components/Menu/page.jsx";
import { Notes } from "../../components/SelectNote/page.jsx";
import { GroupHeadline } from "../../components/GroupHeadline/page.jsx";
// icon
import { BsGrid3X3 } from "react-icons/bs";
import { BsFileEarmarkPlus } from "react-icons/bs";
import { BsSearch } from "react-icons/bs";
import { BsList } from "react-icons/bs";
import { LuListChecks } from "react-icons/lu";
// style
import styles from "./library.module.css";
import styleNotes from "@/components/SelectNote/selectNote.module.css"

export default function Library() {
    // grid toggle
    const [isGridView, setIsGridView] = useState(true);
    const [isNotesClass, setIsNotesClass] = useState(true);
  
    const toggleView = () => {
      setIsGridView(!isGridView);
      setIsNotesClass(!isNotesClass);
    };

    // GroupHeadline
    const headLeft = (
        <div className={styles.auth}>
            <button>
                <Link href={"/Permission"}>
                    <LuListChecks size={25} color="#333" />
                </Link>
            </button>
        </div>
    )
    const headRight =(
        <div className={styles.right}>
            <div className={styles.layouts}>
                {/* toggleView */}
                <button onClick={toggleView}>
                    {isGridView ? <BsList/> : <BsGrid3X3/>}

                </button>
            </div>
            <div className={styles.addNote}>
                <button><BsFileEarmarkPlus /> <span>New Note</span></button>
            </div>
        </div>
    )

    return(
        <>
            <main className={styles.main}>

                <Menu />

                <div className={styles.content}>
                    {/* headline */}
                    <GroupHeadline headLeft={headLeft} headRight={headRight} />

                    {/* search */}
                    <div className={styles.search}>
                        <form action="">
                            <input placeholder="Note name ..." type="search" name="" id="" />
                            <button type="submit"><BsSearch /></button>
                        </form>
                    </div>

                    {/* notes */}
                    <div className={isNotesClass ? styles.grid : styles.list}>
                        <Notes className={isNotesClass ? styleNotes.grid : styleNotes.list} />
                        <Notes className={isNotesClass ? styleNotes.grid : styleNotes.list} />
                        <Notes className={isNotesClass ? styleNotes.grid : styleNotes.list} />
                        <Notes className={isNotesClass ? styleNotes.grid : styleNotes.list} />
                        <Notes className={isNotesClass ? styleNotes.grid : styleNotes.list} />
                    </div>
                </div>
            </main>
        </>
    )
}