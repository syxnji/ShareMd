import { BsX } from "react-icons/bs";
import styles from "./memberManagement.module.css";
import { RiAdminLine, RiUser3Line } from "react-icons/ri";
export const MemberManagement = ({
   searchUser,
   handleSearchUser,
   memberSuggest,
   handleAddMember,
   groupInMember,
   groupRole,
   handleChangeRole,
   handleDeleteMember
}) => {
   return (
       <div className={styles.memberContent}>
           <div className={styles.addMember}>
               <input 
                   type="text"
                   placeholder="ユーザー名を入力"
                   className={styles.searchMember}
                   onChange={handleSearchUser}
                   value={searchUser}
               />
               {memberSuggest.length > 0 && (
                   <div className={styles.suggestMemberBox}>
                       {memberSuggest.map((user) => (
                           <button
                               className={styles.suggestMember}
                               key={user.id} 
                               onClick={(e) => handleAddMember(e, user)}
                           >
                               {user.username}
                           </button>
                       ))}
                   </div>
               )}
           </div>
           <div className={styles.memberList}>
               {groupInMember?.map((member) => (
                   <div className={styles.member} key={member.id}>
                        <div className={styles.userIcon}>
                            {member.role_id === 1 ? <RiAdminLine/> : <RiUser3Line/>}
                        </div>
                       <p>{member.username}</p>
                       <select
                           className={styles.roleSelect}
                           onChange={(e) => handleChangeRole(e, member.id)}
                           value={member.role_id}
                           disabled={member.role_id === 1}
                       >
                           {groupRole?.map((role) => (
                               <option key={role.id} value={role.id}>
                                   {role.name}
                               </option>
                           ))}
                       </select>
                       <button className={styles.deleteBtn} onClick={(e) => handleDeleteMember(e, member.id)} disabled={member.role_id === 1}>
                           <BsX/>
                       </button>
                   </div>
               ))}
           </div>
        </div>
   );
};