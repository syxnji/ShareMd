import { useState } from "react";
import { ModalWindow } from "@/components/UI/ModalWindow";
import { BsX, BsFileEarmarkPlus, BsFolder, BsFileText, BsUpload, BsCheck2Circle } from "react-icons/bs";
import styles from "./newNote.module.css";
import { toast } from "react-toastify";

export function NewNoteModal({
  userId,
  allGroups,
  toggleModalNewNote,
  customToastOptions,
  refresh,
}) {
  // MARK: newNoteGroup
  const [newNoteGroup, setNewNoteGroup] = useState("");
  const handleChangeNewNoteGroup = (e) => {
    setNewNoteGroup(e.target.value);
  };

  // MARK: newNoteTitle ← file
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const handleChangeNewNoteTitle = (e) => {
    setNewNoteTitle(e.target.value);
  };

  // MARK: newNoteContent ← file
  const [newNoteContent, setNewNoteContent] = useState("");
  
  // ファイル名表示用
  const [fileName, setFileName] = useState("");

  // MARK: importNote ← file
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".md")) {
      toast.error(".mdファイルのみインポート可能です", customToastOptions);
      e.target.value = "";
      return;
    }
    // ファイル名をタイトルとして設定（.mdを除く）
    const fileNameWithoutExt = file.name.replace(".md", "");
    setFileName(file.name);
    setNewNoteTitle(fileNameWithoutExt);
    // ファイルの内容を読み込む
    const reader = new FileReader();
    reader.onload = (e) => {
      setNewNoteContent(e.target.result);
      toast.info("ファイルを読み込みました", customToastOptions);
    };
    reader.readAsText(file);
  };

  // MARK: newNoteCreate ← newNoteGroup, newNoteTitle, newNoteContent❓
  const handleCreateNote = async (e) => {
    e.preventDefault();
    
    if (!newNoteGroup) {
      toast.warning("保存先グループを選択してください", customToastOptions);
      return;
    }
    
    if (!newNoteTitle.trim()) {
      toast.warning("ノートタイトルを入力してください", customToastOptions);
      return;
    }
    
    // 作成中の表示
    toast.info("ノートを作成中...", customToastOptions);
    
    const response = await fetch(`/api/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        table: "createNote",
        groupId: newNoteGroup,
        title: newNoteTitle,
        content: newNoteContent,
        userId: userId,
      }),
    });
    const result = await response.json();
    if (result.success) {
      setNewNoteTitle("");
      setNewNoteContent("");
      setFileName("");
      refresh();
      toast.success("ノートを作成しました", customToastOptions);
      window.location.assign(`/Editor/${result.noteId}`);
      return;
    } else {
      toast.error(result.message || "ノートの作成に失敗しました", customToastOptions);
    }
  };

  return (
    <ModalWindow>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateNote(e);
        }}
      >
        {/* 閉じる */}
        <button 
          type="button"
          className={styles.newNoteClose} 
          onClick={toggleModalNewNote}
          aria-label="閉じる"
        >
          <BsX />
        </button>
        
        <div className={styles.newNoteContents}>
          <h2 className={styles.sectionTitle}>
            <BsFileEarmarkPlus style={{ marginRight: "8px" }} />
            新規ノート作成
          </h2>
          
          <div className={styles.newNoteGroup}>
            <label htmlFor="newNoteGroup" className={styles.newNoteLabel}>
              <BsFolder style={{ marginRight: "5px", verticalAlign: "middle" }} />
              保存先グループ
            </label>
            {/* グループ選択 */}
            <select
              id="newNoteGroup"
              className={styles.newNoteGroupSelect}
              required
              onChange={handleChangeNewNoteGroup}
              defaultValue=""
            >
              <option value="" disabled>
                選択してください
              </option>
              {allGroups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className={styles.newNoteTitle}>
            <label htmlFor="newNoteName" className={styles.newNoteLabel}>
              <BsFileText style={{ marginRight: "5px", verticalAlign: "middle" }} />
              ノートタイトル
            </label>
            {/* ノートタイトル */}
            <input
              id="newNoteName"
              className={styles.newNoteInput}
              type="text"
              placeholder="例: ToDo List"
              onChange={handleChangeNewNoteTitle}
              value={newNoteTitle}
              required
            />
          </div>
          
          <div className={styles.import}>
            <label htmlFor="newNoteImport" className={styles.newNoteLabel}>
              <BsUpload style={{ marginRight: "5px", verticalAlign: "middle" }} />
              インポート (任意 .md)
            </label>
            <div style={{ position: "relative" }}>
              <input
                className={styles.newNoteInput}
                type="file"
                accept=".md"
                onChange={handleImport}
                id="newNoteImport"
              />
              {fileName && (
                <div style={{ marginTop: "5px", fontSize: "0.85rem", color: "#4a6cf7" }}>
                  <BsCheck2Circle style={{ marginRight: "5px", verticalAlign: "middle" }} />
                  {fileName}
                </div>
              )}
            </div>
          </div>
          
          <button className={styles.newNoteSubmit} type="submit">
            ノートを作成
          </button>
        </div>
      </form>
    </ModalWindow>
  );
}
