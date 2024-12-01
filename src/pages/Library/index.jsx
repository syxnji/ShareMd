'use client'
import { useEffect, useState } from 'react';
import Link from "next/link";
// component
import { Menu } from '@/components/Menu';
import { GroupHeadline } from "@/components/GroupHeadline";
import { NotesInGroup } from '@/components/NotesInGroup';
import { MainBtn } from "@/components/UI/MainBtn"
import { ImgBtn } from '@/components/UI/ImgBtn';
// icon
import { BsGrid3X3 } from "react-icons/bs";
import { BsFileEarmarkPlus } from "react-icons/bs";
import { BsSearch } from "react-icons/bs";
import { BsList } from "react-icons/bs";
import { BsPeople } from "react-icons/bs";
// style
import styles from "./library.module.css";

export default function Library() {

    // MARK:全てのノート
    const [allNotes, setAllNotes] = useState([]);
    useEffect(() => {
        const fetchNotes = async () => {
            const response = await fetch(`/api/db?table=allNotes`);
            const allNotes = await response.json();
            setAllNotes(allNotes);
        };
        fetchNotes();
    }, []);

    // MARK:選択したグリープのノート
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [selectedGroupNotes, setSelectedGroupNotes] = useState([]);
    useEffect(() => {
        const fetchNotes = async () => {
            if (selectedGroupId) {
                const response = await fetch(`/api/db?table=selectedGroup&groupId=${selectedGroupId}`);
                const notes = await response.json();
                setSelectedGroupNotes(notes);
            }
        };
        fetchNotes();
    }, [selectedGroupId]);
      
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
        {selectedGroupNotes.length > 0 && (
            <>
            <p className={styles.groupName}>{selectedGroupNotes[0].groupName}</p>
            <Link href={`/Permission/atode`}>
                <ImgBtn img={<BsPeople />} />
            </Link>
            </>
        )}
        </>
    )

    return(
        <main className={styles.main}>

        {/* MARK:メニュー */}
        <Menu setSelectedGroupId={setSelectedGroupId} />

        <div className={styles.content}>
            {/* MARK:ヘッドライン */}
            <GroupHeadline headLeft={headLeft} headRight={headRight} />

            {/* MARK:選択したグループ内のノート */}
            <NotesInGroup 
                notes={selectedGroupNotes} 
                isNotesClass={isNotesClass} 
                head={select_headLeft} 
            />
                    
            {/* MARK:最近更新されたノート */}
            <NotesInGroup 
                notes={allNotes} 
                isNotesClass={isNotesClass} 
                head={recently_headLeft} 
            />
        </div>
        </main>
    )
}