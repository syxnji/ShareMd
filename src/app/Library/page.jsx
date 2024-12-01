'use client'
import { useEffect, useState } from 'react';
import Link from "next/link";
// api
import { getNotes } from 'pages/api/groupInNotes';
import { getNotesInGroup } from 'pages/api/selectGroup';
// component
import { Menu } from "@/components/Menu/page.jsx";
import { GroupHeadline } from "@/components/GroupHeadline/page.jsx";
import { MainBtn } from "@/components/UI/MainBtn/page.jsx"
import { ImgBtn } from '@/components/UI/ImgBtn/page';
import { NotesInGroup } from '@/components/NotesInGroup/page';
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

    // MARK:選択されたグループ内ノート
    const [notesInGroup, setNotesInGroup] = useState([]);
    const [group, setGroup] = useState(null);
    const handleGroupClick = async (groupId) => {
        try {
            const { notes, group } = await getNotesInGroup(groupId);
            setNotesInGroup(notes);
            setGroup(group);
        } catch (error) {
            console.log('Failed to fetch notes:', error);
        }
    };
      
    // MARK:切替え グリッド/リスト
    const [isGridView, setIsGridView] = useState(true);
    const [isNotesClass, setIsNotesClass] = useState(true);
    const toggleView = () => {
      setIsGridView(!isGridView);
      setIsNotesClass(!isNotesClass);
    };

    // MARK:ヘッドライン指定
    const headLeft = (
        <>
        {/* MARK:検索 */}
        <div className={styles.search}>
            <form action="">
                <input placeholder="Note name ..." type="search" name="" id="" />
                <ImgBtn img={<BsSearch/>} />
            </form>
        </div>
        </>
    )
    const headRight = (
        <>
        <div className={styles.layouts}>
            <ImgBtn img={isGridView ? <BsList/> : <BsGrid3X3/>} click={toggleView}/>
        </div>
        <div className={styles.addNote}>
            <MainBtn img={<BsFileEarmarkPlus/>} text="New Note"/>
        </div>
        </>
    )
    const recently_headLeft = (
        <p className={styles.groupName}>最近の更新</p>
    )
    const select_headLeft = (
        <>
        {group && (
            <>
            <p className={styles.groupName}>{group.name}</p>
            <Link href={`/Permission/${group.id}`}>
                <ImgBtn img={<BsPeople />} />
            </Link>
            </>
        )}
        </>
    )

    return(
        <main className={styles.main}>

        {/* MARK:メニュー */}
        <Menu onGroupClick={handleGroupClick} />

        <div className={styles.content}>
            {/* MARK:ヘッドライン */}
            <GroupHeadline headLeft={headLeft} headRight={headRight} />

            {/* MARK:選択したグループ内のノート */}
            <NotesInGroup 
                notes={notesInGroup} 
                isNotesClass={isNotesClass} 
                head={select_headLeft} 
            />
                    
            {/* MARK:最近更新されたノート */}
            <NotesInGroup 
                notes={notes} 
                isNotesClass={isNotesClass} 
                head={recently_headLeft} 
            />
        </div>
        </main>
    )
}