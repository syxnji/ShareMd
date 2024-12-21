'use client'
import { useEffect, useState } from 'react';
// component
import { Menu } from '@/components/Menu';
import { GroupHeadline } from "@/components/GroupHeadline";
import { NotesInGroup } from '@/components/NotesInGroup';
import { MainBtn } from "@/components/UI/MainBtn"
import { ImgBtn } from '@/components/UI/ImgBtn';
import { Permission } from '@/components/Permission';
import { ModalWindow } from '@/components/ModalWindow';
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

    const [searchValue, setSearchValue] = useState('');
    const [modalState, setModalState] = useState({ open: false });
    const [valueSelect, setValueSelect] = useState(1)
    const [inputValue, setInputValue] = useState('')

   
    // MARK:検索
    const handleSearch = (e) => {
        e.preventDefault();
        setSearchValue(e.target.value);
    }
    const filteredNotes = allNotes.filter(note =>
      note.title.toLowerCase().includes(searchValue.toLowerCase())
    );

    // MARK:新規ノート
    const handleNewNote =() => {
        setModalState({ open: true })
    }
    const [allGroups, setAllGroups] = useState([]);
    useEffect(() => {
        const fetchGroup = async () => {
            const response = await fetch(`/api/db?table=joinedGroups`);
            const allGroups = await response.json();
            setAllGroups(allGroups);
        };
        fetchGroup();
    }, []);

    // MARK:グループ選択
    const handleChangeOption = (event) => {
        setValueSelect(event.target.value);
    }

    // MARK:インサート新規ノート
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`/api/db?table=newNote&groupId=${valueSelect}&noteName=${inputValue}`);
        const result = await response.json();
        window.location.assign(`/Editor/${result.results.insertId}`);
    }

    // MARK:フォーム
    const formContent = (
        <>
        <div className={styles.inputs}>
            <div className={styles.newNoteGroup}>
                <select required onChange={handleChangeOption}>
                    {allGroups.map((group) => (
                        <option key={group.id} value={group.id}>{group.name}</option>
                    ))}
                </select>
            </div>
            <div className={styles.newNoteName}>
                <input 
                 type="text" 
                 placeholder='ノート名' 
                 onChange={(e) => setInputValue(e.target.value)} 
                 required 
                />
            </div>
        </div>
        </>
    )


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

    // MARK:ヘッドライン 左
    const headLeft = (
        <>
        {/* 検索 */}
        <div className={styles.search}>
            <form>
                <input 
                 placeholder="Note name ..." 
                 type="search"
                 onChange={handleSearch}
                />
                {/* <ImgBtn img={<BsSearch/>} type="submit" /> */}
            </form>
        </div>
        </>
    )

    // MARK:ヘッドライン 右
    const headRight = (
        <>
        {/* レイアウト */}
        <div className={styles.layouts}>
            <ImgBtn img={isGridView ? <BsList/> : <BsGrid3X3/>} click={toggleView}/>
        </div>
        {/* 新規ノート */}
        <div className={styles.addNote}>
            <MainBtn img={<BsFileEarmarkPlus/>} click={handleNewNote} text="New Note"/>
        </div>
        </>
    )
    // MARK:ヘッドライン 左 最近更新
    const recently_headLeft = (
        <>
        {/* 最近更新 */}
        <p className={styles.groupName}>検索結果</p>
        </>
    )

    // MARK:ヘッドライン 左 選択グループ
    const select_headLeft = (
        <>
        {/* 選択されたグループ */}
        {selectedGroupNotes.length > 0 && (
            <>
            <p className={styles.groupName}>
                {selectedGroupNotes[0].groupName}
            </p>
            <ImgBtn img={ displayNotes ? <BsPeople/> : <RiBook2Line/> } click={toggleGroupContent} />
            </>
        )}
        </>
    )

    return(
        <main className={styles.main}>
            
        {modalState.open && (
            <form className={styles.formContent} onSubmit={handleSubmit}>
                <ModalWindow 
                    msg={'+ New Note'}
                    content={formContent}
                    No={() => setModalState({ open: false})}
                    Yes={(e) => handleSubmit(e)}
                    type={'submit'}
                />
            </form>
        )}

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
                 notes={filteredNotes} 
                 isNotesClass={isNotesClass}
                />
                
            </div>
            
        </div>

        </main>
    )
}