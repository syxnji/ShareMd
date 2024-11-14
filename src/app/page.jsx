'use client'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

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
        <main>
          <div> 
            <div className='mdContent'>
              <div className='mdInput'>
                <h2>Editor</h2>
                <textarea
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  className='mdInputArea'
                />
              </div>
              <div className='mdPreview'>
                <h2>Preview</h2>
                <div className='mdPreviewArea'>
                  <ReactMarkdown components={MarkdownComponents}>{markdown}</ReactMarkdown>
                </div>
              </div>
            </div>
            <button
              onClick={() => {/* ここに保存ロジックを追加 */}}
              className='saveBtn'
            >
              Save Markdown
            </button>
          </div>
        </main>
      </>
  )
}