'use client'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Menu } from "../../components/Menu/page.jsx";
// style
import styles from "./editor.module.css"
// icon
import { IoSaveOutline } from "react-icons/io5";
import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";
import { BsFullscreen } from "react-icons/bs";
import { BsFullscreenExit } from "react-icons/bs";

const MarkdownComponents = {
  h1: ({ children }) => <h1 style={{ fontSize: '2em', fontWeight: 'bold', marginBottom: '0.5em' }}>{children}</h1>,
  h2: ({ children }) => <h2 style={{ fontSize: '1.5em', fontWeight: 'bold', marginBottom: '0.5em' }}>{children}</h2>,
  p: ({ children }) => <p style={{ marginBottom: '1em' }}>{children}</p>,
  ul: ({ children }) => <ul style={{ listStyleType: 'disc', paddingLeft: '2em', marginBottom: '1em' }}>{children}</ul>,
  ol: ({ children }) => <ol style={{ listStyleType: 'decimal', paddingLeft: '2em', marginBottom: '1em' }}>{children}</ol>,
  li: ({ children }) => <li style={{ marginBottom: '0.5em' }}>{children}</li>,
  a: ({ href, children }) => <a href={href} style={{ color: '#3b82f6', textDecoration: 'underline' }}>{children}</a>,
}

export default function MarkdownEditor() {
  const [markdown, setMarkdown] = useState('# Hello, Markdown!\n\nThis is a live preview.')

  const [showEditor, setShowEditor] = useState(true)
  const [showViewer, setShowViewer] = useState(true)

  const toggleEditor = () => {
    if (showEditor && !showViewer) {
        return
    }
    setShowEditor(!showEditor)
  }

  const toggleViewer = () => {
    if (!showEditor && showViewer) {
        return
    }
    setShowViewer(!showViewer)
  }

  const toggleScreen = () => {
    console.log('toggle')
  }

  return (
    <main className={styles.main}>
        <Menu />

        {/* head */}
        <div className={styles.content}> 
            <div className={styles.head}>
                <p className={styles.title}>
                    Note Title
                </p>
                <button
                onClick={() => {/* ここに保存ロジックを追加 */}}
                className={styles.saveBtn}
                >
                <IoSaveOutline size={17} />
                <span>Save</span>
                </button>
            </div>

            <div className={styles.mdContent}>
                {/* editor */}
                {/* showEditor toggle */}
                <div className={showEditor ? styles.showEditor : styles.hideEditor}>
                    <div className={styles.mdInput}>
                        <div className={styles.mdHead}>
                            <button
                                onClick={toggleScreen}
                                className={styles.toggleScreenButton}>
                                {showViewer ? <BsFullscreen/> : <BsFullscreenExit/> }
                            </button>
                            <p className={styles.mdTitle}>Editor</p>
                            <button
                                onClick={toggleEditor}
                                className={styles.toggleShowButton}>
                                {showEditor ? <FiEye/> : <FiEyeOff/>}
                            </button>
                        </div>
                        <textarea
                            value={markdown}
                            onChange={(e) => setMarkdown(e.target.value)}
                            className={styles.mdInputArea}
                        />
                    </div>
                </div>

                {/* viewer */}
                {/* showViewer toggle */}
                <div className={showViewer ? styles.showViewer : styles.hideViewer}>
                    <div className={styles.mdPreview}>
                        <div className={styles.mdHead}>
                            <button
                                onClick={toggleScreen}
                                className={styles.toggleScreenButton}>
                                {showViewer ? <BsFullscreen/> : <BsFullscreenExit/> }
                            </button>
                            <p className={styles.mdTitle}>Preview</p>
                            <button
                                onClick={toggleViewer}
                                className={styles.toggleShowButton}>
                                {showViewer ? <FiEye/> : <FiEyeOff/>}
                            </button>
                        </div>
                        <div className={styles.mdPreviewArea}>
                            <ReactMarkdown components={MarkdownComponents}>
                                {markdown}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>

            </div>
            <button
                onClick={() => {/* ここに保存ロジックを追加 */}}
                className={styles.saveBtn}
            >
                <IoSaveOutline size={17} className={styles.svg}/>
                <span>Save</span>
            </button>
        </div>
    </main>
  )
}