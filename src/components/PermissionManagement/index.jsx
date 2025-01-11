import { BsPlus, BsX } from "react-icons/bs";
import styles from "./permissionManagement.module.css";
export const PermissionManagement = ({
   newRoleName,
   handleChangeNewRoleName,
   permission,
   handleChangeNewPermit,
   handleAddRole,
   roleToPermit,
   handleChangeRoleName,
   handleChangePermit,
   handleDeleteRole
}) => {
   return (
        <div className={styles.permitContent}>
           <div className={styles.addRole}>
               <input 
                   type="text" 
                   placeholder="役職名" 
                   className={styles.roleName} 
                   onChange={(e) => handleChangeNewRoleName(e)} 
                   value={newRoleName}
               />
               <select 
                   className={styles.roleSelect} 
                   onChange={(e) => handleChangeNewPermit(e)}
               >
                   {permission.map((permit) => (
                       <option key={permit.id} value={permit.id}>
                           {permit.name}
                       </option>
                   ))}
               </select>
               <button 
                   className={styles.addBtn} 
                   onClick={(e) => handleAddRole(e)}
               >
                   <BsPlus/>
               </button>
           </div>
           <div className={styles.roleList}>
               {roleToPermit.length > 0 ? (
                   roleToPermit.map((role) => (
                       <div className={styles.role} key={role.id}>
                           <input 
                               type="text" 
                               placeholder="役職名" 
                               className={styles.roleName}
                               defaultValue={role.name} 
                               onChange={(e) => handleChangeRoleName(e, role.id)}
                               disabled={role.id === 1 || role.id === 2}
                           />
                           <select 
                               className={styles.roleSelect} 
                               onChange={(e) => handleChangePermit(e, role.id)} 
                               value={role.permission_id}
                               disabled={role.id === 1 || role.id === 2}
                           >
                               {permission.map((permit) => (
                                   <option key={permit.id} value={permit.id}>
                                       {permit.name}
                                   </option>
                               ))}
                           </select>
                           <button 
                               className={styles.deleteBtn} 
                               onClick={(e) => handleDeleteRole(e, role.id)}
                               disabled={role.id === 1 || role.id === 2}
                           >
                               <BsX/>
                           </button>
                       </div>
                   ))
               ) : (
                   <p>役職がありません</p>
               )}
           </div>
        </div>
   );
};