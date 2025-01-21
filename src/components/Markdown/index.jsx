'use client'
import { useState } from 'react';
import styles from "./markdown.module.css"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm';
import { MdOutlineHelpOutline } from "react-icons/md";
import { toast } from 'react-toastify';


export function Markdown({ content, change, view, permission }) {

    // MARK:ヘルプモーダル
    const [help, setHelp] = useState(false);

    // MARK:コピー
    const copy = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('コピーしました');
    }

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
        img: ({ src, alt }) => (
            <img
                src={src}
                alt={alt}
                style={{
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: '8px',
                    margin: '1.5em 0',
                    border: '1px solid #ddd',
                }}
            />
        ),
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
            <button className={styles.helpBtn} onClick={(e) => {
                e.preventDefault();
                setHelp(!help);
            }}>
                <MdOutlineHelpOutline />
            </button>
            {help && (
                <div className={styles.helpModal}>
                    <p className={styles.helpTitle}>マークダウン記述方法</p>
                    <div className={styles.helpContent}>
                        <div className={styles.helpText}>
                            {/* 基本的な書式 */}
                            <div className={styles.helpSection}>
                                <h4>基本的な書式</h4>
                                <ul>
                                    <li onClick={() => copy('**太字**')}>
                                        <span className={styles.helpCode}>**</span>
                                        <span className={styles.helpExample}>太字</span>
                                        <span className={styles.helpCode}>**</span>
                                    </li>
                                    <li onClick={() => copy('*斜体*')}>
                                        <span className={styles.helpCode}>*</span>
                                        <span className={styles.helpExample}>斜体</span>
                                        <span className={styles.helpCode}>*</span>
                                    </li>
                                    <li onClick={() => copy('~~取り消し線~~')}>
                                        <span className={styles.helpCode}>~~</span>
                                        <span className={styles.helpExample}>取り消し線</span>
                                        <span className={styles.helpCode}>~~</span>
                                    </li>
                                </ul>
                            </div>

                            {/* 見出し */}
                            <div className={styles.helpSection}>
                                <h4>見出し</h4>
                                <ul>
                                    <li onClick={() => copy('# 見出し1')}>
                                        <span className={styles.helpCode}># </span>
                                        <span className={styles.helpExample}>見出し1</span>
                                    </li>
                                    <li onClick={() => copy('## 見出し2')}>
                                        <span className={styles.helpCode}>## </span>
                                        <span className={styles.helpExample}>見出し2</span>
                                    </li>
                                    <li onClick={() => copy('### 見出し3')}>
                                        <span className={styles.helpCode}>### </span>
                                        <span className={styles.helpExample}>見出し3</span>
                                    </li>
                                </ul>
                            </div>

                            {/* リスト */}
                            <div className={styles.helpSection}>
                                <h4>リスト</h4>
                                <ul>
                                    <li onClick={() => copy('- 箇条書き')}>
                                        <span className={styles.helpCode}>- </span>
                                        <span className={styles.helpExample}>箇条書き</span>
                                    </li>
                                    <li onClick={() => copy('1. 番号付き箇条書き')}>
                                        <span className={styles.helpCode}>1. </span>
                                        <span className={styles.helpExample}>番号付き箇条書き</span>
                                    </li>
                                    <li onClick={() => copy('- [ ] チェックボックス')}>
                                        <span className={styles.helpCode}>- [ ] </span>
                                        <span className={styles.helpExample}>チェックボックス</span>
                                    </li>
                                </ul>
                            </div>

                            {/* テーブル */}
                            <div className={styles.helpSection}>
                                <h4>テーブル</h4>
                                <ul>
                                    <li onClick={() => copy('| ヘッダー1 | ヘッダー2 |\n|---|---|\n| セル1 | セル2 |')} className={styles.helpTable}>
                                        <div>
                                            <span className={styles.helpCode}>|</span>
                                            <span className={styles.helpExample}>ヘッダー1</span>
                                            <span className={styles.helpCode}>|</span>
                                            <span className={styles.helpExample}>ヘッダー2</span>
                                            <span className={styles.helpCode}>|</span>
                                        </div>
                                        <div>
                                            <span className={styles.helpCode}>|</span>
                                            <span className={styles.helpExample}>---</span>
                                            <span className={styles.helpCode}>|</span>
                                            <span className={styles.helpExample}>---</span>
                                            <span className={styles.helpCode}>|</span>
                                        </div>
                                        <div>
                                            <span className={styles.helpCode}>|</span>
                                            <span className={styles.helpExample}>セル1</span>
                                            <span className={styles.helpCode}>|</span>
                                            <span className={styles.helpExample}>セル2</span>
                                            <span className={styles.helpCode}>|</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            {/* その他の要素 */}
                            <div className={styles.helpSection}>
                                <h4>その他</h4>
                                <ul>
                                    <li onClick={() => copy('`コード`')}>
                                        <span className={styles.helpCode}>`</span>
                                        <span className={styles.helpExample}>コード</span>
                                        <span className={styles.helpCode}>`</span>
                                    </li>
                                    <li onClick={() => copy('```\nコード1行目\nコード2行目\nコード3行目\n```')} className={styles.helpCodeBlock}>
                                        <span className={styles.helpCode}>```</span>
                                        <span className={styles.helpExample}>コード1行目</span>
                                        <span className={styles.helpExample}>コード2行目</span>
                                        <span className={styles.helpExample}>コード3行目</span>
                                        <span className={styles.helpCode}>```</span>
                                    </li>
                                    <li onClick={() => copy('> 引用')}>
                                        <span className={styles.helpCode}>&gt; </span>
                                        <span className={styles.helpExample}>引用</span>
                                    </li>
                                    <li onClick={() => copy('---')}>
                                        <span className={styles.helpCode}>---</span>
                                        <span className={styles.helpExample}>水平線</span>
                                    </li>
                                    <li onClick={() => copy('[リンクテキスト](URL)')}>
                                        <span className={styles.helpCode}>[</span>
                                        <span className={styles.helpExample}>リンクテキスト</span>
                                        <span className={styles.helpCode}>](</span>
                                        <span className={styles.helpExample}>URL</span>
                                        <span className={styles.helpCode}>)</span>
                                    </li>
                                    <li onClick={() => copy('![代替テキスト](画像URL)')}>
                                        <span className={styles.helpCode}>![</span>
                                        <span className={styles.helpExample}>代替テキスト</span>
                                        <span className={styles.helpCode}>](</span>
                                        <span className={styles.helpExample}>画像URL</span>
                                        <span className={styles.helpCode}>)</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                    placeholder="Types here..."
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