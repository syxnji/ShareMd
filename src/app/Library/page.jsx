'use client'
import { useEffect, useState } from 'react';
import Link from "next/link";
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

    // DBから取得
    const [notes, setNotes] = useState([]);
    useEffect(() => {
        async function loadNotes() {
            const fetchedNotes = await getNotes();
            setNotes(fetchedNotes);
        }
        loadNotes();
    },[]);

    // TODO:仮データ
    // const notes = [
    //     { id: 1, title: 'Meeting Notes', preview: 'Discussed project milestones.\nAssigned tasks to team.', last: '2 hours' },
    //     { id: 2, title: 'App Improvements', preview: 'Quick ideas for app improvement.\nAdd dark mode.', last: '15 minutes' },
    //     { id: 3, title: 'Shopping List', preview: '1. Milk\n2. Bread\n3. Butter', last: '3 years' },
    //     { id: 4, title: 'Travel Plans', preview: 'Plan trip to Kyoto.\nVisit Arashiyama and Kinkakuji.', last: '300 seconds' },
    //     { id: 5, title: 'Project Draft', preview: null, last: '5 days' }, // previewがnull
    //     { id: 6, title: 'Birthday Ideas', preview: 'Surprise party at a cafe.\nOrder cake.', last: undefined },
    //     { id: 7, title: 'Workout Routine', preview: '1. Morning jog\n2. Weightlifting', last: '1 week' },
    //     { id: 8, title: 123, preview: 'Draft blog post.\nTopic: Productivity tips.', last: '45 minutes' },
    //     { id: 9, title: 'Recipe Notes', preview: '1. Tomato soup recipe.\n2. Add basil for flavor.', last: '' },
    //     { id: 10, title: 'Code Snippets', preview: 'function add(a, b) {\n  return a + b;\n}', last: '7 months' }
    // ];
      
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
    const headRight =(
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