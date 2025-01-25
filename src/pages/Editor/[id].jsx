'use client'
import { useState, useEffect} from 'react'
import Cookies from 'js-cookie';
// component
import { SidebarInNotes } from "@/components/SidebarInNotes";
import { Markdown } from "@/components/Markdown";
import { ImgBtn } from '@/components/UI/ImgBtn/index.jsx';
import { ToastContainer, toast } from 'react-toastify';
import { Menu } from '@/components/UI/Menu';
// style
import styles from "./editor.module.css"
import 'react-toastify/dist/ReactToastify.css';
// icon
import { IoLogoMarkdown, IoSaveOutline } from "react-icons/io5";
import { BsFullscreen, BsFullscreenExit } from "react-icons/bs";
import { MdArrowBack, MdArrowBackIos, MdClose, MdHelpOutline, MdMenu } from "react-icons/md";
import { CiTextAlignLeft } from "react-icons/ci";
import { HiDownload } from "react-icons/hi";
import { EditorMenu } from '@/components/Menus/EditorMenu';

export const getServerSideProps = async ({ params: { id } }) => ({
    props: { id },
});
export default function MarkdownEditor({ id }) {
    
    // MARK: ユーザー情報
    const [groupId, setGroupId] = useState('');
    const [userId, setUserId] = useState(null);
    useEffect(() => {
        const getUserId = async () => {
            const id = Cookies.get('id');
            setUserId(id);
        };
        getUserId();
    }, []);
    // MARK: グループに所属しているか確認
    const [permission, setPermission] = useState(null);
    useEffect(() => {
        const fetchCheck = async () => {
            if (groupId) {
                const response = await fetch(`/api/db?table=checkUser&userId=${userId}&groupId=${groupId}`);
                const result = await response.json();
                if (!result.results || result.results.length === 0) {
                    window.location.assign('/404');
                } else {
                    const roleId = await result.results[0].role_id;

                    const permissionResponse = await fetch(`/api/db?table=roleToPermission&roleId=${roleId}`);
                    const permissionResult = await permissionResponse.json();
                    setPermission(permissionResult.results[0].permission_id);
                }
            }
        };
        fetchCheck();
    }, [groupId]);
    
    const [menuContentGroup, setMenuContentGroup] = useState(null);
    const [menuContentNote, setMenuContentNote] = useState(null);
    const fetchMenuContent = async () => {
        const resMenuGroup = await fetch(`/api/db?table=editorMenuGroup&userId=${userId}`);
        const retMenuGroup = await resMenuGroup.json();
        setMenuContentGroup(retMenuGroup.results);

        const resMenuNote = await fetch(`/api/db?table=editorMenuNote&userId=${userId}`);
        const retMenuNote = await resMenuNote.json();
        setMenuContentNote(retMenuNote.results);
    }
    useEffect(() => {
        fetchMenuContent();
    }, [userId]);

    // MARK: ノート情報
    const [noteTitle, setNoteTitle] = useState('');
    const [noteContent, setNoteContent] = useState('');
    const [noteUpdatedAt, setNoteUpdatedAt] = useState('');
    
    // MARK: noteを取得
    useEffect(() => {
        const fetchNote = async () => {
            try {
                const noteResponse = await fetch(`/api/db?table=note&id=${id}`);
                const noteData = await noteResponse.json();
                setNoteTitle(noteData.results[0].title);
                setNoteContent(noteData.results[0].content);
                setNoteUpdatedAt(noteData.results[0].updated_at);
                setGroupId(noteData.results[0].group_id);
            } catch (error) {
                console.error('エラー(fetchNote):', error);
            }
        };
        fetchNote();
    }, [id]);

    // MARK: ノートの変更
    const handleChange = (e) => {
        setNoteContent(e.target.value);
    }
    const handleChangeTitle = (e) => {
        setNoteTitle(e.target.value);
    }
    
    // MARK: ノートの保存
    const handleSave = async (e) => {
        if (e) e.preventDefault();
        
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

    // MARK: ノートのエクスポート
    const handleExport = (e) => {
        e.preventDefault();
        const blob = new Blob([noteContent], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${noteTitle || 'untitled'}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('エクスポートしました');
    }

    // MARK: ノートの戻る
    const handleBack = (e) => {
        e.preventDefault();
        // router.push('/Library');
        window.location.assign('/Library');
    }

    // MARK: ノートの表示形式
    const [view, setView] = useState(false)
    const toggleViewer = (e) => {
        e.preventDefault();
        setView(!view)
    }

    // MARK: ノートの表示形式
    const [screen, setScreen] = useState(false)
    const toggleScreen = (e) => {
        e.preventDefault();
        setScreen(!screen)
    }

    // const menuContents = (
    //     <SidebarInNotes selectNoteId={id} />
    // )

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                handleSave();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleSave]);

    // MARK: メニューの表示
    const [menuState, setMenuState] = useState(true);
    const toggleMenuState = (e) => {
        e.preventDefault();
        setMenuState(!menuState);
    }

    // MARK: MAIN ━━━━━━━━━
    return (
        <>
        {/* MARK: フルスクリーン */}
        {screen ? (
            <main className={styles.full}>
                <ToastContainer />
                <div className={styles.fullContent}>
                    <Markdown content={noteContent} change={handleChange} view={view}/>
                </div>
                <div className={styles.menu}>
                    <div className={styles.saveBtn}>
                        <ImgBtn img={<IoSaveOutline/>} click={handleSave} color="main"/>
                    </div>
                    <div className={styles.exportBtn}>
                        <ImgBtn img={<HiDownload/>} click={handleExport} color="main"/>
                    </div>
                    <div className={styles.screenBtn}>
                        <ImgBtn img={screen ? <BsFullscreenExit /> : <BsFullscreen />} click={toggleScreen}/>
                    </div>
                    <div className={view ? styles.md : styles.edit}>
                        <ImgBtn img={view ? <IoLogoMarkdown /> : <CiTextAlignLeft />} click={toggleViewer}/>
                    </div>
                </div>
            </main>
        ) : (
            <main className={styles.main}>
                {/* MARK: Toast */}
                <ToastContainer />

                {/* MARK: Menu */}
                {/* <Menu menuContents={menuContents}/> */}
                <EditorMenu menuState={menuState} menuContentGroup={menuContentGroup} menuContentNote={menuContentNote}/>

                {/* MARK: Content */}
                <div className={styles.content}> 
                    <form>
                        <div className={styles.head}>
                            {/* <button className={styles.backBtn} onClick={handleBack}>
                                <MdArrowBackIos />
                            </button>
                            <input 
                                name='title'
                                className={styles.title} 
                                value={noteTitle}
                                onChange={handleChangeTitle}
                                placeholder='Click to edit title...'
                            />
                            <div className={styles.btns}>
                                <div className={styles.screenBtn}>
                                    <ImgBtn img={screen ? <BsFullscreenExit /> : <BsFullscreen />} click={toggleScreen}/>
                                </div>
                                <div className={view ? styles.md : styles.edit}>
                                    <ImgBtn img={view ? <IoLogoMarkdown /> : <CiTextAlignLeft />} click={toggleViewer}/>
                                </div>
                                <div className={styles.exportBtn}>
                                    <ImgBtn img={<HiDownload/>} click={handleExport} color="main"/>
                                </div>
                                <div className={styles.saveBtn}>
                                    <ImgBtn img={<IoSaveOutline/>} click={handleSave} color="main"/>
                                </div>
                            </div> */}
                            {/* メニューの表示/非表示 */}   
                            <button className={styles.editorMenuBtn} onClick={(e) => toggleMenuState(e)}>
                                {menuState ? <MdClose/> : <MdMenu/>} 
                            </button>

                            {/* ノートの戻る */}
                            <button className={styles.backBtn} onClick={handleBack}>
                                <MdArrowBack />
                            </button>

                            {/* ノートのタイトル */}
                            <div className={styles.title}>
                                <label htmlFor='title' className={styles.titleLabel}>
                                    Title
                                </label>
                            <input 
                                name='title'
                                className={styles.titleInput} 
                                value={noteTitle}
                                onChange={handleChangeTitle}
                                placeholder='Click to edit title...'
                                />
                            </div>

                            {/* ボタン */}
                            <div className={styles.btns}>
                                <div className={styles.update}>
                                    <p className={styles.updateTitle}>
                                        Last update:
                                    </p>
                                    <p className={styles.date}>
                                        {noteUpdatedAt ? new Date(noteUpdatedAt).toLocaleString() : 'N/A'}
                                    </p>
                                </div>
                                <button className={styles.viewBtn}>
                                    {view ? <IoLogoMarkdown /> : <CiTextAlignLeft />}
                                </button>
                                <button className={styles.exportBtn}>
                                    <HiDownload/>
                                </button>
                                <button className={styles.saveBtn}>
                                    <IoSaveOutline/>
                                </button>
                                <button className={styles.helpBtn}>
                                    <MdHelpOutline />
                                </button>
                            </div>
                        </div>

                        {/* <Markdown id={id} content={noteContent} change={handleChange} view={view} permission={permission}/>
                        <div className={styles.update}>
                            <p className={styles.last}>
                                Last update:
                            </p>
                            <p className={styles.date}>
                                {noteUpdatedAt ? new Date(noteUpdatedAt).toLocaleString() : 'N/A'}
                            </p>
                        </div> */}
                    </form>
                </div>
            </main>
        )}
        </>
    )
}