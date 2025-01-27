'use client'
import { useState } from 'react';
import styles from "./markdown.module.css"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm';
import Image from 'next/image'


export function Markdown({ content, change, view, permission }) {
    const placeholder = "マークダウン記法で記述できます。\n例:\n# 見出し1\n## 見出し2\n**太字**\n*斜体*\n詳しくはHelpをご覧ください。";

    // MARK:マークダウンコンポーネント
    const MarkdownComponents = {
        h1: ({ children }) => (
            <h1 style={{ fontSize: '2em', fontWeight: 'bold', color: '#333', marginBottom: '1.5em' }}>
                {children}
            </h1>
        ),
        h2: ({ children }) => (
            <h2 style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#444', marginBottom: '1.25em' }}>
                {children}
            </h2>
        ),
        p: ({ children }) => (
            <p style={{ marginBottom: '1.5em', color: '#555', lineHeight: '1.6' }}>
                {children}
            </p>
        ),
        ul: ({ children }) => (
            <ul style={{ listStyleType: 'disc', paddingLeft: '2em', marginBottom: '1.5em', color: '#555' }}>
                {children}
            </ul>
        ),
        ol: ({ children }) => (
            <ol style={{ listStyleType: 'decimal', paddingLeft: '2em', marginBottom: '1.5em', color: '#555' }}>
                {children}
            </ol>
        ),
        li: ({ children }) => (
            <li style={{ marginBottom: '0.75em', color: '#555' }}>
                {children}
            </li>
        ),
        a: ({ href, children }) => (
            <a href={href} style={{ color: '#1d4ed8', textDecoration: 'underline' }}>
                {children}
            </a>
        ),
        blockquote: ({ children }) => (
            <blockquote
                style={{
                    borderLeft: '4px solid #1d4ed8',
                    paddingLeft: '1em',
                    color: '#333',
                    fontStyle: 'italic',
                    backgroundColor: '#e8f1ff',
                    borderRadius: '4px',
                    margin: '1.5em 0',
                    lineHeight: '1.6',
                }}
            >
                {children}
            </blockquote>
        ),
        code: ({ inline, className, children }) => {
            const match = /language-(\w+)/.exec(className || '');
            return !inline ? (
                <pre
                    style={{
                        background: '#e5e7eb',
                        padding: '1.25em',
                        borderRadius: '4px',
                        overflowX: 'auto',
                        color: '#1e293b',
                        fontFamily: 'monospace',
                        marginBottom: '1.5em',
                    }}
                >
                    <code>{children}</code>
                </pre>
            ) : (
                <code
                    style={{
                        background: '#e5e7eb',
                        padding: '0.2em 0.4em',
                        borderRadius: '3px',
                        color: '#1e293b',
                        fontFamily: 'monospace',
                    }}
                >
                    {children}
                </code>
            );
        },
        // img: ({ src, alt }) => (
        //     <Image 
        //         src={src}
        //         alt={alt}
        //         width={500}
        //         height={300}
        //     />
        // ),
        table: ({ children }) => (
            <table
                style={{
                    width: 'auto',
                    maxWidth: '100%',
                    borderCollapse: 'collapse',
                    marginBottom: '1.5em',
                    background: '#fff',
                    border: '1px solid #ddd',
                }}
            >
                {children}
            </table>
        ),
        thead: ({ children }) => (
            <thead
                style={{
                    background: '#f3f4f6',
                    fontWeight: 'bold',
                    color: '#1e293b',
                    borderBottom: '2px solid #ddd',
                }}
            >
                {children}
            </thead>
        ),
        tbody: ({ children }) => <tbody>{children}</tbody>,
        tr: ({ children }) => (
            <tr style={{ borderBottom: '1px solid #ddd', backgroundColor: '#f9fafb' }}>{children}</tr>
        ),
        th: ({ children }) => (
            <th style={{ textAlign: 'left', padding: '0.75em', borderBottom: '1px solid #ddd', color: '#1e293b' }}>
                {children}
            </th>
        ),
        td: ({ children }) => (
            <td style={{ padding: '0.75em', borderBottom: '1px solid #ddd', color: '#333' }}>
                {children}
            </td>
        ),
        hr: () => (
            <hr
                style={{
                    border: 'none',
                    borderTop: '1px solid #ddd',
                    marginBottom: '1.5em', // 追加：下部の余白
                }}
            />
        ),
        span: ({ children }) => (
            <span style={{ color: '#333' }}>
                {children}
            </span>
        ),
        strong: ({ children }) => (
            <strong style={{ fontWeight: 'bold', color: '#000' }}>
                {children}
            </strong>
        ),
    };

    return(
        <>
        <div className={styles.markdownContent}>

            {view ? (
                <div className={styles.noteViewer}>
                    <ReactMarkdown components={MarkdownComponents} remarkPlugins={[remarkGfm]}>
                        {content}
                    </ReactMarkdown>
                </div>
            ) : (
                <div className={styles.noteInput}>
                    <textarea
                    name='content'
                    placeholder={placeholder}
                    value={content}
                    onChange={change}
                    disabled={permission === 3}
                    />
                </div>
            )}
        </div>
        </>
    )
}