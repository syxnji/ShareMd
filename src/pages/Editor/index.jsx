'use client'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
// component
import { Menu } from "@/components/Menu/index.jsx";
import { MainBtn } from '@/components/UI/MainBtn/index.jsx';
import { ImgBtn } from '@/components/UI/ImgBtn/index.jsx';
import { GroupHeadline } from '@/components/GroupHeadline';
// style
import styles from "./editor.module.css"
// icon
import { IoSaveOutline } from "react-icons/io5";
import { BsFullscreen } from "react-icons/bs";

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
  
// MARK:GroupHeadline
// left
const headLeft = (
    <p className={styles.title}>
        Note Title
    </p>
)
// right
const headRight =(
    <div className={styles.saveBtn}>
        <MainBtn img={<IoSaveOutline/>} text="Save"/>
    </div>
)

  return (
    <main className={styles.main}>
        <Menu />

        {/* head */}
        <div className={styles.content}> 
            <GroupHeadline headLeft={headLeft} headRight={headRight}/>

            <div className={styles.mdContent}>
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
            </div>
        </div>
    </main>
  )
}