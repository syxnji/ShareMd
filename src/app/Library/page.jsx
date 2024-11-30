'use client'
import { useEffect, useState } from 'react';
import Link from "next/link";
// api
import { getNotes } from 'pages/api/groupInNotes';
// component
import { Menu } from "@/components/Menu/page.jsx";
import { Notes } from "@/components/SelectNote/page.jsx";
import { GroupHeadline } from "@/components/GroupHeadline/page.jsx";
import { MainBtn } from "@/components/UI/MainBtn/page.jsx"
import { ImgBtn } from '@/components/UI/ImgBtn/page';
import styleNotes from "@/components/SelectNote/selectNote.module.css"
// icon
import { BsGrid3X3 } from "react-icons/bs";
import { BsFileEarmarkPlus } from "react-icons/bs";
import { BsSearch } from "react-icons/bs";
import { BsList } from "react-icons/bs";
import { BsPeople } from "react-icons/bs";
// style
import styles from "./library.module.css";

export default function Library() {

    // MARK:DBから取得
    const [notes, setNotes] = useState([]);
    useEffect(() => {
        async function loadNotes() {
            const fetchedNotes = await getNotes();
            setNotes(fetchedNotes);
        }
        loadNotes();
    },[]);
      
    // MARK:ToggleGrid/List
    const [isGridView, setIsGridView] = useState(true);
    const [isNotesClass, setIsNotesClass] = useState(true);
    const toggleView = () => {
      setIsGridView(!isGridView);
      setIsNotesClass(!isNotesClass);
    };

    // MARK:GroupHeadline
    // left
    const headLeft = (
        <>
        <p className={styles.groupName}>Marketing Team</p>
        <Link href={"/Permission"}>
            <ImgBtn img={<BsPeople />} />
        </Link>
        </>
    )
    // right
    const headRight = (
        <>
        <div className={styles.layouts}>
            {/* MARK:toggleView */}
            <ImgBtn img={isGridView ? <BsList/> : <BsGrid3X3/>} click={toggleView}/>
        </div>
        <div className={styles.addNote}>
            <MainBtn img={<BsFileEarmarkPlus/>} text="New Note"/>
        </div>
        </>
    )
    // group_left
    const group_headLeft = (
        <p className={styles.groupName}>Recently Updated</p>
    )

    return(
        <main className={styles.main}>

            <Menu />

            <div className={styles.content}>
                {/* MARK:headline */}
                <GroupHeadline headLeft={headLeft} headRight={headRight} />

                {/* MARK:search */}
                <div className={styles.search}>
                    <form action="">
                        <input placeholder="Note name ..." type="search" name="" id="" />
                        <ImgBtn img={<BsSearch/>} />
                    </form>
                </div>

                {/* MARK:notes */}
                <GroupHeadline headLeft={group_headLeft} />
                {/* isNotesClassによってclassNameの切り替え */}
                <div className={isNotesClass ? styles.grid : styles.list}>
                    {/* isNotesClassによってclassNameの切り替え */}
                    {notes.map((note) => (
                        <Notes
                            className={isNotesClass ? styleNotes.grid : styleNotes.list}
                            key={note.id}
                            title={note.title}
                            preview={note.content}
                            last={note.updated_at.toLocaleString()}
                        />
                    ))}
                </div>
            </div>
        </main>
    )
}