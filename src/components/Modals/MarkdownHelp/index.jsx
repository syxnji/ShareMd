import { HelpModal } from '../HelpModal';
import styles from './markdownHelp.module.css';
import { toast } from 'react-toastify';

export function MarkdownHelp(){
    // MARK:コピー
    const copy = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('コピーしました');
    }
    return(
        <HelpModal>
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
        </HelpModal>
    )
}