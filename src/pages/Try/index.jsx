"use client"
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import Cookies from "js-cookie";
// components
import { Markdown } from "@/components/Markdown";
import { ImgBtn } from '@/components/UI/ImgBtn/index.jsx';
import { ToastContainer, toast } from 'react-toastify';
// style
import styles from "./try.module.css";
// icon
import { IoLogoMarkdown, IoSaveOutline } from "react-icons/io5";
import { BsFullscreen, BsFullscreenExit } from "react-icons/bs";
import { CiTextAlignLeft } from "react-icons/ci";

export default function TryCreateNote() {
    // MARK: ノートのタイトルを取得
    const searchParams = useSearchParams();
    const title = searchParams.get('title');

    // MARK: ルーティング
    const router = useRouter();

    // MARK: 全画面表示
    const [screen, setScreen] = useState(false);
    const toggleScreen = () => {
        setScreen(!screen);
    }
    
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
    const handleSave = async (e) => {
        e.preventDefault();

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
            const insertResponse = await fetch(`
                /api/db?table=insertNote&title=${encodedTitle}&content=${encodedContent}&groupId=${privateGroupId}&userId=${currentUserId}
            `);
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
    }


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

                <div className={styles.content}> 
                    <form>
                        <div className={styles.head}>
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
                                <div className={styles.viewBtn}>
                                    <ImgBtn img={view ? <IoLogoMarkdown /> : <CiTextAlignLeft />} click={toggleViewer}/>
                                </div>
                                <div className={styles.saveBtn}>
                                    <ImgBtn img={<IoSaveOutline/>} click={handleSave} color="main"/>
                                </div>
                            </div>
                        </div>
                        <Markdown content={noteContent} change={handleChange} view={view}/>
                    </form>
                </div>
            </main>
        )}
        </>
    )
}