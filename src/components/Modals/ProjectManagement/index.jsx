import { BsX } from "react-icons/bs";
import styles from "./projectManagement.module.css";
export const ProjectManagement = ({
   selectedGroupNotes,
   handleDeleteProject
}) => {
   return (
       <div className={styles.projectContent}>
           {selectedGroupNotes.map((project) => (
               <div className={styles.project} key={project.id}>
                   <p>{project.title}</p>
                   <button 
                       className={styles.deleteBtn} 
                       onClick={() => handleDeleteProject(project.id)}
                   >
                       <BsX/>
                   </button>
               </div>
           ))}
       </div>
    );
};