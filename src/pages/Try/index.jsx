"use client"
import { useState, useEffect, useCallback } from "react";
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import Cookies from "js-cookie";
// components
import { Markdown } from "@/components/Markdown";
import { ToastContainer, toast } from 'react-toastify';
// style
import styles from "./try.module.css";
// icon
import { IoLogoMarkdown, IoSaveOutline } from "react-icons/io5";
import { MdArrowBack, MdClose, MdHelpOutline, MdMenu } from "react-icons/md";
import { CiTextAlignLeft } from "react-icons/ci";
import { HiDownload } from "react-icons/hi";
import { EditorMenu } from '@/components/Menus/EditorMenu';
import { MarkdownHelp } from '@/components/Modals/MarkdownHelp';

export default function TryCreateNote() {
    // MARK: ノートのタイトルを取得
    const searchParams = useSearchParams();
    const title = searchParams.get('title');

    // MARK: ルーティング
    const router = useRouter();
    
    // MARK: ビューアー表示
    const [view, setView] = useState(false);
    const toggleViewer = (e) => {
        e.preventDefault();
        setView(!view);
    }

    // MARK: ノートのタイトルを取得
    const [noteTitle, setNoteTitle] = useState(title || '');
    const handleChangeTitle = (e) => {
        setNoteTitle(e.target.value);
    }
    
    // MARK: ノートの内容を取得
    const [noteContent, setNoteContent] = useState('');
    const handleChange = (e) => {
        setNoteContent(e.target.value);
    }

    // MARK: ノートの保存
    const handleSave = useCallback(async (e) => {
        if (e) {  // イベントオブジェクトが存在する場合のみpreventDefault
            e.preventDefault();
        }

        // ログインしているか確認
        if (Cookies.get('id')) {
            // ユーザーIDを取得
            const currentUserId = parseInt(Cookies.get('id'));
            // プライベートグループを取得
            const response = await fetch(`/api/db?table=privateGroup&userId=${currentUserId}`);
            const privateGroup = await response.json();
            const privateGroupId = privateGroup.results[0].id;
            // ノートの内容をエンコード
            const encodedContent = encodeURIComponent(noteContent);
            const encodedTitle = encodeURIComponent(noteTitle);
            // ノートの作成
            const insertResponse = await fetch(`/api/db?table=insertNote&title=${encodedTitle}&content=${encodedContent}&groupId=${privateGroupId}&userId=${currentUserId}`);
            const insertResult = await insertResponse.json();
            // ノートの作成が成功したか確認
            if (insertResult.results) {
                toast.success('保存しました');
                router.push('/Library');
            } else {
                toast.error('保存に失敗しました');
                return;
            }
        } else {
            // ログインしていない場合
            toast.error('ログインしてからこのタブへ戻ってください');
            window.open('/Auth', '_blank');
        }
    }, [noteContent, noteTitle, router]);

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

    // MARK:ヘルプモーダル
    const [help, setHelp] = useState(false);
    const toggleHelp = (e) => {
        e.preventDefault();
        setHelp(!help);
    }

    // MARK: トライ - データ
    const id = 0;

    const permission = 1;

    const menuContentGroup = [
        {
            id: 1,
            name: 'グループ',
        }
    ]
    const menuContentNote = [
        {
            id: 0,
            title: 'ノート',
            group_id: 1,
        }
    ]

    const noteUpdatedAt = null;

    const [menuState, setMenuState] = useState(false);

    const toggleMenuState = (e) => {
        e.preventDefault();
        setMenuState(!menuState);
    };

    const handleBack = (e) => {
        e.preventDefault();
        router.back();
    };

    const handleExport = (e) => {
        e.preventDefault();
        const blob = new Blob([noteContent], { type: 'text/markdown' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${noteTitle || 'untitled'}.md`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

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
                            <button className={styles.editorMenuBtn} onClick={toggleMenuState}>
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
                                    {noteUpdatedAt ? new Date(noteUpdatedAt).toLocaleString() : '最終更新日時を表示します'}
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