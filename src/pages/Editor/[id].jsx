'use client'
import { useState, useEffect } from 'react'
import { useRouter, userouter } from "next/router"
import ReactMarkdown from 'react-markdown'
// component
import { SidebarInNotes } from "@/components/SidebarInNotes/index";
import { Menu } from "@/components/Menu/index.jsx";
import { Markdown } from "@/components/Markdown";
import { MainBtn } from '@/components/UI/MainBtn/index.jsx';
import { ImgBtn } from '@/components/UI/ImgBtn/index.jsx';
import { GroupHeadline } from '@/components/GroupHeadline';
// style
import styles from "./editor.module.css"
// icon
import { IoLogoMarkdown, IoSaveOutline } from "react-icons/io5";
import { BsFullscreen } from "react-icons/bs";
import { MdArrowBackIos } from "react-icons/md";

// const MarkdownComponents = {
//   h1: ({ children }) => <h1 style={{ fontSize: '2em', fontWeight: 'bold', marginBottom: '0.5em' }}>{children}</h1>,
//   h2: ({ children }) => <h2 style={{ fontSize: '1.5em', fontWeight: 'bold', marginBottom: '0.5em' }}>{children}</h2>,
//   p: ({ children }) => <p style={{ marginBottom: '1em' }}>{children}</p>,
//   ul: ({ children }) => <ul style={{ listStyleType: 'disc', paddingLeft: '2em', marginBottom: '1em' }}>{children}</ul>,
//   ol: ({ children }) => <ol style={{ listStyleType: 'decimal', paddingLeft: '2em', marginBottom: '1em' }}>{children}</ol>,
//   li: ({ children }) => <li style={{ marginBottom: '0.5em' }}>{children}</li>,
//   a: ({ href, children }) => <a href={href} style={{ color: '#3b82f6', textDecoration: 'underline' }}>{children}</a>,
// }
export const getServerSideProps = async ({ params: { id } }) => ({
    props: { id },
});
export default function MarkdownEditor({ id }) {
    // const [markdown, setMarkdown] = useState('# Hello, Markdown!\n\nThis is a live preview.')
    
    //   const [showEditor, setShowEditor] = useState(true)
    //   const [showViewer, setShowViewer] = useState(true)
    
    //   const toggleEditor = () => {
    //     if (showEditor && !showViewer) {
    //         return
    //     }
    //     setShowEditor(!showEditor)
    //   }
    
    //   const toggleViewer = () => {
    //     if (!showEditor && showViewer) {
    //         return
    //     }
    //     setShowViewer(!showViewer)
    //   }
    
    //   const toggleScreen = () => {
    //     console.log('toggle')
    //   }

    const [note, setNote] = useState()
    
    // groupが更新された後の処理
    useEffect(() => {
        const fetchNote = async () => {
            try {
                const noteResponse = await fetch(`/api/db?table=note&id=${id}`);
                const noteData = await noteResponse.json();
                setNote(noteData.results[0]);
            } catch (error) {
                console.error('エラー(fetchNote):', error);
            }
        };
        fetchNote();
    }, [id]);
    
    // change
    const handleChange = (e) => {
        const { name, value } = e.target
        setNote(prev => ({ ...prev, [name]: value }))
    }

    // save
    const handleSave = (e) => {
        // リロードを防ぐ
        e.preventDefault();

        // update
        const fetchNoteUpd = async () => {
            try {
                const encodedContent = encodeURIComponent(note.content);
                const encodedTitle = encodeURIComponent(note.title);
                const updResponse = await fetch(`/api/db?table=updateNote&id=${id}&title=${encodedTitle}&content=${encodedContent}`);
                
                if (!updResponse.ok) {
                    throw new Error('Network response was not ok');
                }
                
            } catch (error) {
                console.error('エラー(fetchNoteUpd):', error);
            }
        };
        fetchNoteUpd();
    }

    // left
    const headLeft = (
        <>
        <button className={styles.backBtn}>
            <MdArrowBackIos />
        </button>
        <input 
            name='title'
            className={styles.title} 
            value={note?.title} 
            onChange={handleChange}
        />
        </>
    );

    // right
    const headRight =(
        <div className={styles.rights}>
            <div className={styles.screenBtn}>
                <ImgBtn img={<BsFullscreen />}/>
            </div>
            <div className={styles.viewBtn}>
                <ImgBtn img={<IoLogoMarkdown />}/>
            </div>
            <div className={styles.saveBtn}>
                <MainBtn img={<IoSaveOutline/>} text="Save" click={handleSave}/>
            </div>
        </div>
    )

    return (
        <main className={styles.main}>
            <SidebarInNotes selectNoteId={id} />

            {/* head */}
            <div className={styles.content}> 
                <form>
                    <GroupHeadline headLeft={headLeft} headRight={headRight}/>

                    <Markdown id={id} content={note?.content} change={handleChange} />
                    <div className={styles.update}>
                        <p className={styles.last}>
                            Last update:
                        </p>
                        <p className={styles.date}>
                            {note?.updated_at ? new Date(note.updated_at).toLocaleString() : 'N/A'}
                        </p>
                    </div>
                </form>
                {/* <div className={styles.mdContent}>
                    <div className={styles.mdHeads}>
                        <button className={showEditor ? styles.showEditorButton : styles.hideEditorButton}
                        onClick={toggleEditor}>
                            Editor
                        </button>
                        <button className={showViewer ? styles.showViewerButton : styles.hideViewerButton}
                        onClick={toggleViewer}>
                            Viewer
                        </button>
                    </div>
                    <div className={styles.areas}>
                        <div className={showEditor ? styles.showEditorArea : styles.hideEditorArea}>
                            <textarea
                                value={markdown}
                                onChange={(e) => setMarkdown(e.target.value)}
                                className={styles.showInputArea}
                            />
                            <div className={styles.screen}>
                                <ImgBtn img={<BsFullscreen />} />
                            </div>
                        </div>
                        <div className={showViewer ? styles.showViewerArea : styles.hideViewerArea}>
                            <div className={styles.showPreviewArea}>
                                <ReactMarkdown components={MarkdownComponents}>
                                    {markdown}
                                </ReactMarkdown>
                            </div>
                            <div className={styles.screen}>
                                <ImgBtn img={<BsFullscreen />} />
                            </div>
                        </div>
                    </div>

                </div>
                <div className={styles.bottom}>
                    <div className={styles.saveBtn}>
                        <MainBtn img={<IoSaveOutline/>} text="Save"/>
                    </div>
                </div> */}
            </div>
        </main>
    )
}