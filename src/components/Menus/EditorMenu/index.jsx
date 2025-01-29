"use client";
import { useState } from "react";
import { Menu } from "@/components/UI/Menu";
import { BsFileEarmark, BsFolder, BsPlus } from "react-icons/bs";
import styles from "./editorMenu.module.css";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import React from "react";

export function EditorMenu({ menuState, menuContentGroup, menuContentNote }) {
  const [openGroups, setOpenGroups] = useState({});

  const toggleGroup = (groupId) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const handleNoteClick = (noteId) => {
    window.location.href = `/Editor/${noteId}`;
  };

  return (
    <Menu menuState={menuState}>
      {menuContentGroup !== null ? (
        <div className={styles.menuContents}>
          {/* メニューのヘッダー */}
          <div className={styles.menuHeader}>
            <p className={styles.menuTitle}>Documents</p>
            <button className={styles.newDocBtn}>
              <BsPlus />
            </button>
          </div>

          {/* メニューのコンテンツ */}
          <div className={styles.menuBody}>
            {/* グループ */}
            <div className={styles.groups}>
              {Array.isArray(menuContentGroup) &&
                menuContentGroup.map((group) => (
                  <React.Fragment key={group.id}>
                    <div
                      className={styles.group}
                      onClick={() => toggleGroup(group.id)}
                    >
                      <div className={styles.groupIcon}>
                        <BsFolder />
                      </div>

                      <p className={styles.groupTitle}>{group.name}</p>

                      {openGroups[group.id] ? (
                        <MdKeyboardArrowUp />
                      ) : (
                        <MdKeyboardArrowDown />
                      )}
                    </div>

                    {openGroups[group.id]
                      ? menuContentNote
                          .filter((note) => note.group_id === group.id)
                          .map((note) => (
                            <div
                              className={styles.note}
                              key={note.id}
                              onClick={() => handleNoteClick(note.id)}
                            >
                              <div className={styles.noteIcon}>
                                <BsFileEarmark />
                              </div>
                              <p className={styles.noteTitle}>{note.title}</p>
                            </div>
                          ))
                      : null}
                  </React.Fragment>
                ))}
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.menuContents}>
          <div className={styles.try}>
            <p className={styles.tryText}>
              ログインしてグループへ参加またはグループを作成してください
            </p>
          </div>
        </div>
      )}
    </Menu>
  );
}
