'use client'
import { useState, useEffect, useCallback } from 'react'
import Cookies from 'js-cookie';
// component
import { Markdown } from "@/components/Markdown";
import { ToastContainer, toast } from 'react-toastify';
// style
import styles from "./editor.module.css"
import 'react-toastify/dist/ReactToastify.css';
// icon
import { IoLogoMarkdown, IoSaveOutline } from "react-icons/io5";
import { MdArrowBack, MdClose, MdHelpOutline, MdMenu } from "react-icons/md";
import { CiTextAlignLeft } from "react-icons/ci";
import { HiDownload } from "react-icons/hi";
import { EditorMenu } from '@/components/Menus/EditorMenu';
import { MarkdownHelp } from '@/components/Modals/MarkdownHelp';

export const getServerSideProps = async ({ params: { id } }) => ({
    props: { id },
});
export default function MarkdownEditor({ id }) {

    // MARK: Toast Settings
    const customToastOptions = {
        position: "top-right",
        autoClose: 2000,
        closeOnClick: true,
        draggable: true,
    }
    
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
    }, [groupId, userId]);
    
    // MARK: メニュー
    const [menuContentGroup, setMenuContentGroup] = useState(null);
    const [menuContentNote, setMenuContentNote] = useState(null);
    const fetchMenuContent = useCallback(async () => {
        const resMenuGroup = await fetch(`/api/db?table=editorMenuGroup&userId=${userId}`);
        const retMenuGroup = await resMenuGroup.json();
        setMenuContentGroup(retMenuGroup.results);

        const resMenuNote = await fetch(`/api/db?table=editorMenuNote&userId=${userId}`);
        const retMenuNote = await resMenuNote.json();
        setMenuContentNote(retMenuNote.results);
    }, [userId]);
    useEffect(() => {
        fetchMenuContent();
    }, [fetchMenuContent]);

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
    const handleSave = useCallback(async (e) => {
        if (e) e.preventDefault();
        
        const fetchNoteUpd = async () => {
            try {
                const encodedContent = encodeURIComponent(noteContent);
                const encodedTitle = encodeURIComponent(noteTitle);
                const updResponse = await fetch(`/api/db?table=updateNote&id=${id}&title=${encodedTitle}&content=${encodedContent}`);
                toast.success('保存しました', customToastOptions);
                if (!updResponse.ok) {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                toast.error('保存に失敗しました', customToastOptions);
            }
        };
        fetchNoteUpd();
    }, [noteContent, noteTitle, id]);

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
        toast.success('エクスポートしました', customToastOptions);
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

    // MARK: ショートカットキー
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

    // MARK:ヘルプモーダル
    const [help, setHelp] = useState(false);
    const toggleHelp = (e) => {
        e.preventDefault();
        setHelp(!help);
    }

    // MARK: MAIN ━━━━━━━━━
    return (
        <main className={styles.main}>
            {/* MARK: Toast */}
            <ToastContainer />

            {/* MARK: Menu */}
            <EditorMenu menuState={menuState} menuContentGroup={menuContentGroup} menuContentNote={menuContentNote}/>

            {/* MARK: Content */}
            <div className={styles.content}> 
                <form>
                    <div className={styles.head}>
                        {/* メニューの表示/非表示 */}
                        <div className={styles.btnContents}>
                            <label htmlFor='editorMenuBtn' className={styles.label}>
                                {menuState ? 'Close' : 'Menu'}
                            </label>
                            <button className={styles.editorMenuBtn} onClick={(e) => toggleMenuState(e)}>
                                {menuState ? <MdClose/> : <MdMenu/>} 
                            </button>
                        </div>

                        {/* ノートの戻る */}
                        <div className={styles.btnContents}>
                            <label htmlFor='backBtn' className={styles.label}>
                                Back
                            </label>
                            <button className={styles.backBtn} onClick={handleBack}>
                                <MdArrowBack />
                            </button>
                        </div>

                        {/* ノートのタイトル */}
                        <div className={styles.title}>
                            <label htmlFor='title' className={styles.label}>
                                Title
                            </label>
                            <input 
                            name='title'
                            className={styles.titleInput} 
                            value={noteTitle}
                            onChange={handleChangeTitle}
                            placeholder='タイトルを入力してください'
                            />
                        </div>

                        {/* ボタン */}
                        <div className={styles.btns}>
                            <div className={styles.btnContents}>
                                <label htmlFor='update' className={styles.label}>
                                    Last update
                                </label>
                                <p className={styles.date}>
                                    {noteUpdatedAt ? new Date(noteUpdatedAt).toLocaleString() : 'N/A'}
                                </p>
                            </div>
                            <div className={styles.btnContents}>    
                                <label htmlFor='viewBtn' className={styles.label}>
                                    View
                                </label>
                                <button className={view ? styles.md : styles.edit} onClick={toggleViewer}>
                                    {view ? <IoLogoMarkdown /> : <CiTextAlignLeft />}
                                </button>
                            </div>
                            <div className={styles.btnContents}>
                                <label htmlFor='exportBtn' className={styles.label}>
                                    Export
                                </label>
                                <button className={styles.exportBtn} onClick={handleExport}>
                                    <HiDownload/>
                                </button>
                            </div>
                            <div className={styles.btnContents}>
                                <label htmlFor='saveBtn' className={styles.label}>
                                    Save
                                </label>
                                <button className={styles.saveBtn} onClick={handleSave}>
                                    <IoSaveOutline/>
                                    </button>
                            </div>
                            <div className={styles.btnContents}>
                                <label htmlFor='helpBtn' className={styles.label}>
                                    Help
                                </label>
                                <button className={styles.helpBtn} onClick={toggleHelp}>
                                    <MdHelpOutline />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={styles.body}>
                    {help && (
                        <MarkdownHelp/>
                    )}
                        <Markdown id={id} content={noteContent} change={handleChange} view={view} permission={permission}/>
                    </div>
                </form>
            </div>
        </main>
    )
}