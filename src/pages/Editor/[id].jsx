'use client'
import { useState, useEffect} from 'react'
import { useRouter } from "next/router"
// component
import { SidebarInNotes } from "@/components/SidebarInNotes/index";
import { Markdown } from "@/components/Markdown";
import { ImgBtn } from '@/components/UI/ImgBtn/index.jsx';
import { GroupHeadline } from '@/components/GroupHeadline';
import { ToastContainer, toast } from 'react-toastify';
// style
import styles from "./editor.module.css"
import 'react-toastify/dist/ReactToastify.css';
// icon
import { IoLogoMarkdown, IoSaveOutline } from "react-icons/io5";
import { BsFullscreen, BsFullscreenExit } from "react-icons/bs";
import { MdArrowBackIos } from "react-icons/md";
import { CiTextAlignLeft } from "react-icons/ci";

export const getServerSideProps = async ({ params: { id } }) => ({
    props: { id },
});
export default function MarkdownEditor({ id }) {

    const router = useRouter();

    const [noteTitle, setNoteTitle] = useState('');
    const [noteContent, setNoteContent] = useState('');
    const [noteUpdatedAt, setNoteUpdatedAt] = useState('');
    
    // noteを取得
    useEffect(() => {
        const fetchNote = async () => {
            try {
                const noteResponse = await fetch(`/api/db?table=note&id=${id}`);
                const noteData = await noteResponse.json();
                setNoteTitle(noteData.results[0].title);
                setNoteContent(noteData.results[0].content);
                setNoteUpdatedAt(noteData.results[0].updated_at);
            } catch (error) {
                console.error('エラー(fetchNote):', error);
            }
        };
        fetchNote();
    }, [id]);

    // change
    const handleChange = (e) => {
        setNoteContent(e.target.value);
    }
    const handleChangeTitle = (e) => {
        setNoteTitle(e.target.value);
    }

    // save
    const handleSave = (e) => {
        e.preventDefault();

        const fetchNoteUpd = async () => {
            try {
                const encodedContent = encodeURIComponent(noteContent);
                const encodedTitle = encodeURIComponent(noteTitle);
                const updResponse = await fetch(`/api/db?table=updateNote&id=${id}&title=${encodedTitle}&content=${encodedContent}`);
                toast.success('保存しました');
                if (!updResponse.ok) {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                toast.error('保存に失敗しました');
            }
        };
        fetchNoteUpd();
    }

    // back
    const handleBack = (e) => {
        e.preventDefault();
        router.push('/Library');
    }

    // toggle viewer
    const [view, setView] = useState(false)
    const toggleViewer = (e) => {
        e.preventDefault();
        setView(!view)
    }

    // toggle screen
    const [screen, setScreen] = useState(false)
    const toggleScreen = (e) => {
        e.preventDefault();
        setScreen(!screen)
    }

    // head
    const headLeft = (
        <>
        <button className={styles.backBtn} onClick={handleBack}>
            <MdArrowBackIos />
        </button>
        <input 
            name='title'
            className={styles.title} 
            value={noteTitle}
            onChange={handleChangeTitle}
        />
        </>
    );
    const headRight =(
        <div className={styles.rights}>
            <div className={styles.screenBtn}>
                <ImgBtn img={screen ? <BsFullscreenExit /> : <BsFullscreen />} click={toggleScreen}/>
            </div>
            <div className={styles.viewBtn}>
                <ImgBtn img={view ? <IoLogoMarkdown /> : <CiTextAlignLeft />} click={toggleViewer}/>
            </div>
            <div className={styles.saveBtn}>
                <ImgBtn img={<IoSaveOutline/>} click={handleSave} color="main"/>
            </div>
        </div>
    )

    return (
        <>
        {screen ? (
            <main className={styles.full}>
                <ToastContainer />
                <div className={styles.content}>
                    <Markdown content={noteContent} change={handleChange} view={view}/>
                </div>
                <div className={styles.menu}>
                    <div className={styles.saveBtn}>
                        <ImgBtn img={<IoSaveOutline/>} click={handleSave} color="main"/>
                    </div>
                    <div className={styles.screenBtn}>
                        <ImgBtn img={screen ? <BsFullscreenExit /> : <BsFullscreen />} click={toggleScreen}/>
                    </div>
                    <div className={styles.viewBtn}>
                        <ImgBtn img={view ? <IoLogoMarkdown /> : <CiTextAlignLeft />} click={toggleViewer}/>
                    </div>
                </div>
            </main>
        ) : (
            <main className={styles.main}>
                <ToastContainer />
                <SidebarInNotes selectNoteId={id} />

                <div className={styles.content}> 
                    <form>
                        <GroupHeadline headLeft={headLeft} headRight={headRight}/>

                        <Markdown id={id} content={noteContent} change={handleChange} view={view}/>
                        <div className={styles.update}>
                            <p className={styles.last}>
                                Last update:
                            </p>
                            <p className={styles.date}>
                                {noteUpdatedAt ? new Date(noteUpdatedAt).toLocaleString() : 'N/A'}
                            </p>
                        </div>
                    </form>
                </div>
            </main>
        )}
        </>
    )
}