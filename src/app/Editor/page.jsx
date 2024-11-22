'use client'
import { Menu } from "../../components/Menu/page.jsx";
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import styles from "./editor.module.css"
import { IoSaveOutline } from "react-icons/io5";
// 表示/非表示
import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";
// 拡大/縮小
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

  return (
      // React.Fragment
      <>
        <main className={styles.main}>
            <Menu />
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
                    <div className={styles.innerContent}>
                        <div className={styles.mdInput}>
                            <div className={styles.mdHead}>
                                <BsFullscreen />
                                <p className={styles.mdTitle}>Editor</p>
                                <FiEyeOff />
                            </div>
                            <textarea
                            value={markdown}
                            onChange={(e) => setMarkdown(e.target.value)}
                            className={styles.mdInputArea}
                            />
                        </div>
                    </div>
                    <div className={styles.innerContent}>
                        <div className={styles.mdPreview}>
                            <div className={styles.mdHead}>
                                <BsFullscreen />
                                <p className={styles.mdTitle}>Preview</p>
                                <FiEyeOff />
                            </div>
                            <div className={styles.mdPreviewArea}>
                            <ReactMarkdown components={MarkdownComponents}>{markdown}</ReactMarkdown>
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
      </>
  )
}