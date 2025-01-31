import { BsX } from "react-icons/bs";
import styles from "./projectManagement.module.css";
import { MdOutlineInsertDriveFile } from "react-icons/md";
import { toast } from "react-toastify";

export const ProjectManagement = ({
  selectedGroupNotes,
  // handleDeleteProject,
  refresh,
  customToastOptions,

}) => {

  // MARK: deleteProject ← projectId❓
  const handleDeleteProject = async (projectId) => {
    await fetch(`/api/patch`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        table: "deleteNote",
        id: projectId,
      }),
    });
    refresh();
    toast.success("ノートを削除しました", customToastOptions);
  };

  return (
    <div className={styles.projectContent}>
      {selectedGroupNotes.map((project) => (
        <div className={styles.project} key={project.id}>
          <div className={styles.projectIcon}>
            <MdOutlineInsertDriveFile />
          </div>
          <p>{project.title}</p>
          <button
            className={styles.deleteBtn}
            onClick={() => handleDeleteProject(project.id)}
          >
            <BsX />
          </button>
        </div>
      ))}
    </div>
  );
};
