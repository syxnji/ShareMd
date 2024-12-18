import { useEffect, useState } from 'react'
import styles from "./markdown.module.css"
import ReactMarkdown from 'react-markdown'

export function Markdown({ content, change }) {

    const [localContent, setLocalContent] = useState(content || "");
    useEffect(() => {
        setLocalContent(content || ""); // content が変更された場合に更新
    }, [content]);

    // const MarkdownComponents = {
    //     h1: ({ children }) => <h1 style={{ fontSize: '2em', fontWeight: 'bold', marginBottom: '0.5em' }}>{children}</h1>,
    //     h2: ({ children }) => <h2 style={{ fontSize: '1.5em', fontWeight: 'bold', marginBottom: '0.5em' }}>{children}</h2>,
    //     p: ({ children }) => <p style={{ marginBottom: '1em' }}>{children}</p>,
    //     ul: ({ children }) => <ul style={{ listStyleType: 'disc', paddingLeft: '2em', marginBottom: '1em' }}>{children}</ul>,
    //     ol: ({ children }) => <ol style={{ listStyleType: 'decimal', paddingLeft: '2em', marginBottom: '1em' }}>{children}</ol>,
    //     li: ({ children }) => <li style={{ marginBottom: '0.5em' }}>{children}</li>,
    //     a: ({ href, children }) => <a href={href} style={{ color: '#3b82f6', textDecoration: 'underline' }}>{children}</a>,
    // }

    return(
        <>
        <div className={styles.markdownContent}>
            <div className={styles.noteInput}>
                <textarea
                 name='content'
                 placeholder="Types here..."
                 value={localContent}
                 onChange={change}
                />
            </div>

        </div>
        </>
    )
}