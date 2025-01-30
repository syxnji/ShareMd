import { useState } from "react";
import { ModalWindow } from "@/components/UI/ModalWindow";
import { BsX } from "react-icons/bs";
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

  // MARK: importNote ← file
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".md")) {
      alert(".mdファイルのみインポート可能です");
      e.target.value = "";
      return;
    }
    // ファイル名をタイトルとして設定（.mdを除く）
    const fileName = file.name.replace(".md", "");
    setNewNoteTitle(fileName);
    // ファイルの内容を読み込む
    const reader = new FileReader();
    reader.onload = (e) => {
      setNewNoteContent(e.target.result);
    };
    reader.readAsText(file);
  };

  // MARK: newNoteCreate ← newNoteGroup, newNoteTitle, newNoteContent❓
  const handleCreateNote = async (e) => {
    e.preventDefault();
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
      refresh();
      toast.success("ノートを作成しました", customToastOptions);
      window.location.assign(`/Editor/${result.noteId}`);
      return;
    } else {
      toast.error(result.message || "ノートの作成に失敗しました");
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
        <button className={styles.newNoteClose} onClick={toggleModalNewNote}>
          <BsX />
        </button>
        <div className={styles.newNoteContents}>
          <div className={styles.newNoteGroup}>
            <label htmlFor="newNoteGroup" className={styles.newNoteLabel}>
              保存先グループ
            </label>
            {/* グループ選択 */}
            <select
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
              ノートタイトル
            </label>
            {/* ノートタイトル */}

            <input
              className={styles.newNoteInput}
              type="text"
              placeholder="ToDo List"
              onChange={handleChangeNewNoteTitle}
              value={newNoteTitle}
              required
            />
          </div>
          <div className={styles.import}>
            <label htmlFor="newNoteImport" className={styles.newNoteLabel}>
              インポート(任意.md)
            </label>
            <input
              className={styles.newNoteInput}
              type="file"
              accept=".md"
              onChange={handleImport}
              id="newNoteImport"
            />
          </div>
          <button className={styles.newNoteSubmit} type="submit">
            作成
          </button>
        </div>
      </form>
    </ModalWindow>
  );
}
