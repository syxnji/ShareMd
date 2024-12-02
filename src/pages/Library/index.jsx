'use client'
import { useEffect, useState } from 'react';
// component
import { Menu } from '@/components/Menu';
import { GroupHeadline } from "@/components/GroupHeadline";
import { NotesInGroup } from '@/components/NotesInGroup';
import { MainBtn } from "@/components/UI/MainBtn"
import { ImgBtn } from '@/components/UI/ImgBtn';
import { Permission } from '@/components/Permission';
// icon
import { BsSearch, BsList, BsPeople, BsFileEarmarkPlus, BsGrid3X3 } from "react-icons/bs";
import { RiBook2Line } from "react-icons/ri";
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

    // MARK:切替え ノート/権限
    const [displayNotes, setDisplayNotes] = useState(true);
    const toggleGroupContent = () => {
        setDisplayNotes(!displayNotes);
    };

    // MARK:ヘッドライン指定
    const headLeft = (
        <>
        {/* 検索 */}
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
        {/* レイアウト */}
        <div className={styles.layouts}>
            <ImgBtn img={isGridView ? <BsList/> : <BsGrid3X3/>} click={toggleView}/>
        </div>
        {/* 新規ノート */}
        <div className={styles.addNote}>
            <MainBtn img={<BsFileEarmarkPlus/>} text="New Note"/>
        </div>
        </>
    )
    const recently_headLeft = (
        <>
        {/* 最近更新 */}
        <p className={styles.groupName}>最近の更新</p>
        </>
    )
    const select_headLeft = (
        <>
        {/* 選択されたグループ */}
        {selectedGroupNotes.length > 0 && (
            <>
            <p className={styles.groupName}>{selectedGroupNotes[0].groupName}</p>
            {/* <button className={styles.permissionBtn} onClick={toggleGroupContent}> */}
                <ImgBtn img={ displayNotes ? <BsPeople/> : <RiBook2Line/> } click={toggleGroupContent} />
            {/* </button> */}
            </>
        )}
        </>
    )

    return(
        <main className={styles.main}>

        {/* MARK:メニュー */}
        <Menu setSelectedGroupId={setSelectedGroupId} />

        <div className={styles.contents}>
            {/* MARK:ヘッドライン(検索、レイアウト、新規ノート) */}
            <GroupHeadline headLeft={headLeft} headRight={headRight} />

            {/* MARK:ヘッドライン(グループ名、権限/ノートボタン) */}
            {selectedGroupNotes.length > 0 && (
                <GroupHeadline headLeft={select_headLeft} />
            )}

            {/* MARK:権限 */}
            {selectedGroupNotes.length > 0 && (
                <Permission display={displayNotes} id={selectedGroupNotes[0].groupId} />
            )}

            {/* MARK:ノート */}
            <div className={ displayNotes ? styles.content : styles.hideContent }>

                {/* MARK:選択したグループ内のノート */}
                <NotesInGroup 
                 notes={selectedGroupNotes} 
                 isNotesClass={isNotesClass}
                />
                        
                {/* MARK:最近更新されたノート */}
                <GroupHeadline headLeft={recently_headLeft} />
                <NotesInGroup 
                 notes={allNotes} 
                 isNotesClass={isNotesClass}
                />
                
            </div>
            
        </div>

        </main>
    )
}